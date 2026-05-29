import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import { enviarEmailPixCobranca } from "@/lib/emails"

export const dynamic = "force-dynamic"

const PRECOS: Record<string, number> = {
  essencial: 12990,
  standard: 19990,
  premium: 24990,
}

function formatarData(isoDate: string): string {
  const [year, month, day] = isoDate.split("-")
  return `${day}/${month}/${year}`
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function GET(request: Request) {
  // Vercel Cron verifica o header Authorization com CRON_SECRET
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = todayISO()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

  // Buscar todos os clientes PIX ativos ou atrasados
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nome_responsavel, email, plano, pix_vencimento, pix_charge_id, stripe_customer_id, status_pagamento, acesso_liberado")
    .eq("forma_pagamento", "pix")
    .in("status_pagamento", ["ativo", "atrasado"])
    .not("pix_vencimento", "is", null)

  if (error) {
    console.error("[cron/pix-billing] Erro ao buscar clientes:", error)
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 })
  }

  const resultados = await Promise.allSettled(
    (clientes ?? []).map((cliente) => processarCliente(cliente, today, appUrl, supabase))
  )

  const erros = resultados.filter((r) => r.status === "rejected").length
  const ok = resultados.length - erros

  console.log(`[cron/pix-billing] Processados: ${ok} ok, ${erros} erro(s)`)
  return NextResponse.json({ processados: ok, erros })
}

async function processarCliente(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cliente: any,
  today: string,
  appUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
) {
  const vencimento: string = cliente.pix_vencimento
  const diasRestantes = Math.ceil(
    (new Date(vencimento + "T12:00:00Z").getTime() - new Date(today + "T12:00:00Z").getTime()) / 86400000
  )

  // Suspender após 3 dias de atraso (vencimento + 3 dias)
  if (diasRestantes < -3) {
    if (cliente.acesso_liberado) {
      await supabase
        .from("clientes")
        .update({ acesso_liberado: false, status_pagamento: "atrasado" })
        .eq("id", cliente.id)
      console.log(`[cron/pix-billing] Suspenso: ${cliente.id} (${diasRestantes} dias)`)
    }
    return
  }

  // Gerar nova cobrança 5 dias antes do vencimento (se ainda não foi gerada para este ciclo)
  if (diasRestantes === 5) {
    await gerarCobrancaRenovacao(cliente, vencimento, appUrl, supabase)
    return
  }

  // Enviar lembretes: 3 dias antes, 1 dia antes, no vencimento (dia 0)
  if ([3, 1, 0].includes(diasRestantes) && cliente.pix_charge_id) {
    const linkPagamento = `${appUrl}/pagar/${cliente.id}`
    await enviarEmailPixCobranca(
      cliente.email,
      cliente.nome_responsavel,
      cliente.plano,
      formatarData(vencimento),
      linkPagamento,
      diasRestantes,
    ).catch((err) => console.error(`[cron/pix-billing] E-mail falhou para ${cliente.id}:`, err))
  }
}

async function gerarCobrancaRenovacao(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cliente: any,
  vencimento: string,
  appUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
) {
  const valor = PRECOS[cliente.plano]
  if (!valor) return

  // PIX de renovação expira em 5 dias (mesmo período que o lembrete)
  const expiresAt = Math.floor(Date.now() / 1000) + 5 * 86400

  let paymentIntent
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: valor,
      currency: "brl",
      customer: cliente.stripe_customer_id,
      payment_method_types: ["pix"],
      payment_method_data: { type: "pix" },
      confirm: true,
      payment_method_options: {
        pix: { expires_after_seconds: 5 * 86400 },
      },
      metadata: {
        supabase_cliente_id: cliente.id,
        plano: cliente.plano,
        renovacao: "true",
        vencimento_atual: vencimento,
        expires_at: String(expiresAt),
      },
    })
  } catch (err) {
    console.error(`[cron/pix-billing] Erro ao criar PaymentIntent para ${cliente.id}:`, err)
    return
  }

  await supabase
    .from("clientes")
    .update({ pix_charge_id: paymentIntent.id })
    .eq("id", cliente.id)

  const linkPagamento = `${appUrl}/pagar/${cliente.id}`
  await enviarEmailPixCobranca(
    cliente.email,
    cliente.nome_responsavel,
    cliente.plano,
    formatarData(vencimento),
    linkPagamento,
    5,
  ).catch((err) => console.error(`[cron/pix-billing] E-mail (renovação) falhou para ${cliente.id}:`, err))

  console.log(`[cron/pix-billing] Cobrança gerada para ${cliente.id}, PI: ${paymentIntent.id}`)
}
