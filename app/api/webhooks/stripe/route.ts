import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  enviarEmailPosCadastro,
  enviarEmailInternoNovaVenda,
  enviarEmailPagamentoFalho,
  enviarEmailInternoAtivacaoPendente,
} from "@/lib/emails"

export const dynamic = "force-dynamic"

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T12:00:00Z")
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export async function POST(request: Request) {
  const bodyBuffer = Buffer.from(await request.arrayBuffer())
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Signature ausente" }, { status: 400 })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET não configurado")
    return NextResponse.json({ error: "Configuração ausente" }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, secret)
  } catch (err) {
    console.error("[webhook] Assinatura inválida:", (err as Error).message)
    return NextResponse.json({ error: `Webhook inválido: ${(err as Error).message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Idempotência: ignorar eventos já processados
  const { data: eventExistente } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle()

  if (eventExistente) {
    return NextResponse.json({ received: true, duplicado: true })
  }

  // Registrar evento antes de processar
  await supabase.from("stripe_events").insert({
    id: event.id,
    tipo: event.type,
    payload: JSON.parse(bodyBuffer.toString()),
  })

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        const { data: cliente } = await supabase
          .from("clientes")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .maybeSingle()

        if (!cliente) {
          console.error("[webhook] Cliente não encontrado para customer:", customerId)
          break
        }

        await supabase
          .from("clientes")
          .update({
            status_pagamento: "ativo",
            acesso_liberado: false, // equipe libera manualmente
            stripe_subscription_id: subscriptionId,
            data_assinatura: new Date().toISOString(),
          })
          .eq("id", cliente.id)

        // E-mails em paralelo — falha de e-mail não deve quebrar o webhook
        const emailResults = await Promise.allSettled([
          enviarEmailPosCadastro(cliente.email as string, cliente.nome_responsavel as string, cliente.plano as string),
          enviarEmailInternoNovaVenda({
            nome_empresa: cliente.nome_empresa as string,
            cnpj: cliente.cnpj as string,
            email: cliente.email as string,
            telefone: cliente.telefone as string,
            nome_responsavel: cliente.nome_responsavel as string,
            plano: cliente.plano as string,
            stripe_customer_id: customerId,
          }),
          enviarEmailInternoAtivacaoPendente({
            nome_empresa: cliente.nome_empresa as string,
            nome_responsavel: cliente.nome_responsavel as string,
            email: cliente.email as string,
            telefone: cliente.telefone as string,
            plano: cliente.plano as string,
            forma_pagamento: "Cartão",
          }),
        ])
        emailResults.forEach((r, i) => {
          if (r.status === "rejected") console.error(`[webhook] email[${i}] falhou:`, r.reason)
          else console.log(`[webhook] email[${i}] ok`)
        })
        break
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        const statusMap: Record<string, string> = {
          active: "ativo",
          past_due: "atrasado",
          canceled: "cancelado",
          trialing: "ativo",
          incomplete: "aguardando",
          incomplete_expired: "cancelado",
          unpaid: "atrasado",
          paused: "atrasado",
        }
        // Cancelamento agendado pro fim do período ainda é "active" no Stripe
        const novoStatus = (
          sub.cancel_at_period_end ? "cancelado" : (statusMap[sub.status] ?? "atrasado")
        ) as import("@/types/database").StatusPagamento

        await supabase
          .from("clientes")
          .update({ status_pagamento: novoStatus })
          .eq("stripe_customer_id", customerId)
        break
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        await supabase
          .from("clientes")
          .update({ status_pagamento: "cancelado", acesso_liberado: false })
          .eq("stripe_customer_id", customerId)
        break
      }

      // Boleto compensado (1-3 dias úteis após geração)
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string

        const { data: cliente } = await supabase
          .from("clientes")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .maybeSingle()

        await supabase
          .from("clientes")
          .update({
            status_pagamento: "ativo",
            stripe_subscription_id: session.subscription as string,
            data_assinatura: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)

        if (cliente) {
          await Promise.allSettled([
            enviarEmailPosCadastro(cliente.email, cliente.nome_responsavel, cliente.plano),
            enviarEmailInternoAtivacaoPendente({
              nome_empresa: cliente.nome_empresa,
              nome_responsavel: cliente.nome_responsavel,
              email: cliente.email,
              telefone: cliente.telefone,
              plano: cliente.plano,
              forma_pagamento: "Boleto",
            }),
          ])
        }
        break
      }

      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent
        const clienteId = intent.metadata?.supabase_cliente_id
        const isRenovacao = intent.metadata?.renovacao === "true"

        if (!clienteId) break

        if (isRenovacao) {
          // Renovação: estender vencimento + 30 dias a partir do vencimento atual
          const { data: cliente } = await supabase
            .from("clientes")
            .select("pix_vencimento, email, nome_responsavel, plano, acesso_liberado")
            .eq("id", clienteId)
            .maybeSingle()

          if (!cliente) break

          const base = cliente.pix_vencimento ?? new Date().toISOString().slice(0, 10)
          const novoVencimento = addDays(base, 30)

          await supabase
            .from("clientes")
            .update({
              status_pagamento: "ativo",
              acesso_liberado: true,
              pix_vencimento: novoVencimento,
              data_assinatura: new Date().toISOString(),
            })
            .eq("id", clienteId)

          console.log(`[webhook] PIX renovado: ${clienteId}, novo vencimento: ${novoVencimento}`)
        } else {
          // Novo cliente: marcar pagamento recebido, equipe libera manualmente
          const { data: cliente } = await supabase
            .from("clientes")
            .select("*")
            .eq("id", clienteId)
            .maybeSingle()

          const vencimento = addDays(new Date().toISOString().slice(0, 10), 30)
          await supabase
            .from("clientes")
            .update({
              status_pagamento: "ativo",
              acesso_liberado: false, // equipe libera manualmente
              pix_vencimento: vencimento,
              data_assinatura: new Date().toISOString(),
            })
            .eq("id", clienteId)

          if (cliente) {
            await Promise.allSettled([
              enviarEmailPosCadastro(cliente.email, cliente.nome_responsavel, cliente.plano),
              enviarEmailInternoAtivacaoPendente({
                nome_empresa: cliente.nome_empresa,
                nome_responsavel: cliente.nome_responsavel,
                email: cliente.email,
                telefone: cliente.telefone,
                plano: cliente.plano,
                forma_pagamento: "PIX",
              }),
            ])
          }

          console.log(`[webhook] PIX novo cliente confirmado: ${clienteId}`)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: cliente } = await supabase
          .from("clientes")
          .select("email, nome_responsavel")
          .eq("stripe_customer_id", customerId)
          .maybeSingle()

        await supabase
          .from("clientes")
          .update({ status_pagamento: "atrasado" })
          .eq("stripe_customer_id", customerId)

        if (cliente) {
          await enviarEmailPagamentoFalho(
            cliente.email as string,
            cliente.nome_responsavel as string
          ).catch((err) => console.error("[webhook] Erro ao enviar e-mail pagamento falho:", err))
        }
        break
      }

      default:
        console.log("[webhook] Evento ignorado:", event.type)
    }
  } catch (err) {
    console.error("[webhook] Erro ao processar evento:", event.type, err)
    return NextResponse.json({ error: "Erro interno ao processar evento" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
