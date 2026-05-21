import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  enviarEmailPosCadastro,
  enviarEmailInternoNovaVenda,
  enviarEmailPagamentoFalho,
} from "@/lib/emails"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Signature ausente" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("[webhook] Assinatura inválida:", err)
    return NextResponse.json({ error: "Webhook signature inválida" }, { status: 400 })
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
    payload: JSON.parse(body),
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
        await Promise.allSettled([
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
        ])
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
        const novoStatus = (statusMap[sub.status] ?? "atrasado") as import("@/types/database").StatusPagamento

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
