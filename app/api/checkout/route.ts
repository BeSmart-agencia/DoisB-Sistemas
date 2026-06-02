import { NextResponse } from "next/server"
import { z } from "zod"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"

const PRICE_IDS: Record<string, string> = {
  essencial: process.env.STRIPE_PRICE_ESSENCIAL!,
  standard: process.env.STRIPE_PRICE_STANDARD!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
}

const PROMO_GDOOR = {
  inicio: new Date("2026-06-02T03:00:00Z"), // 00h BRT
  fim: new Date("2026-06-09T20:00:00Z"),    // 17h BRT
  cupons: {
    essencial: "GDOOR_JUN26_ESSENCIAL",
    standard:  "GDOOR_JUN26_STANDARD",
    premium:   "GDOOR_JUN26_PREMIUM",
  } as Record<string, string>,
}

function promoAtiva(): boolean {
  const agora = new Date()
  return agora >= PROMO_GDOOR.inicio && agora <= PROMO_GDOOR.fim
}

function validarCNPJ(cnpj: string): boolean {
  const n = cnpj.replace(/\D/g, "")
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const calc = (size: number) => {
    let soma = 0
    let peso = size - 7
    for (let i = size; i >= 1; i--) {
      soma += parseInt(n[size - i]) * peso--
      if (peso < 2) peso = 9
    }
    const r = soma % 11
    return r < 2 ? 0 : 11 - r
  }
  return calc(12) === parseInt(n[12]) && calc(13) === parseInt(n[13])
}

const schema = z.object({
  nome_empresa: z.string().min(2),
  cnpj: z.string().min(14).refine(validarCNPJ, "CNPJ inválido"),
  email: z.string().email(),
  telefone: z.string().min(10),
  nome_responsavel: z.string().min(2),
  plano: z.enum(["essencial", "standard", "premium"]),
  forma_pagamento: z.enum(["cartao", "boleto"]).default("cartao"),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", detalhes: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { nome_empresa, cnpj, email, telefone, nome_responsavel, plano, forma_pagamento } = parsed.data
  const cnpjLimpo = cnpj.replace(/\D/g, "")
  const supabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  // Verificar se CNPJ já existe com assinatura ativa
  const { data: existente } = await supabase
    .from("clientes")
    .select("id, status_pagamento")
    .eq("cnpj", cnpjLimpo)
    .maybeSingle()

  if (existente && ["ativo", "atrasado"].includes(existente.status_pagamento as string)) {
    return NextResponse.json(
      { error: "Já existe uma conta ativa com este CNPJ. Entre em contato pelo WhatsApp." },
      { status: 409 }
    )
  }

  // Se existia um registro abandonado, remove pra recriar limpo
  if (existente) {
    await supabase.from("clientes").delete().eq("id", existente.id)
  }

  // Criar registro no Supabase
  const { data: cliente, error: erroInsert } = await supabase
    .from("clientes")
    .insert({
      nome_empresa,
      cnpj: cnpjLimpo,
      email,
      telefone,
      nome_responsavel,
      plano,
      status_pagamento: "aguardando",
      acesso_liberado: false,
      forma_pagamento,
    })
    .select("id")
    .single()

  if (erroInsert || !cliente) {
    console.error("[checkout] Erro ao inserir cliente:", erroInsert)
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 })
  }

  // Criar Stripe Customer
  let stripeCustomer
  try {
    stripeCustomer = await stripe.customers.create({
      email,
      name: nome_empresa,
      phone: telefone,
      metadata: {
        supabase_cliente_id: cliente.id,
        cnpj: cnpjLimpo,
        nome_responsavel,
        plano,
      },
    })
  } catch (err) {
    console.error("[checkout] Erro ao criar Stripe customer:", err)
    await supabase.from("clientes").delete().eq("id", cliente.id)
    return NextResponse.json({ error: "Erro ao processar pagamento. Tente novamente." }, { status: 500 })
  }

  // Salvar stripe_customer_id no Supabase
  await supabase
    .from("clientes")
    .update({ stripe_customer_id: stripeCustomer.id })
    .eq("id", cliente.id)

  // Criar Stripe Checkout Session
  const aplicarPromo = forma_pagamento === "cartao" && promoAtiva()
  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomer.id,
      line_items: [{ price: PRICE_IDS[plano], quantity: 1 }],
      ...(forma_pagamento === "boleto" && { payment_method_types: ["boleto"] }),
      success_url: `${appUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cadastro?plano=${plano}&erro=cancelado`,
      locale: "pt-BR",
      ...(aplicarPromo
        ? { discounts: [{ coupon: PROMO_GDOOR.cupons[plano] }] }
        : { allow_promotion_codes: true }),
      subscription_data: {
        metadata: {
          supabase_cliente_id: cliente.id,
          plano,
        },
      },
    })
  } catch (err) {
    console.error("[checkout] Erro ao criar Stripe session:", err)
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento. Tente novamente." }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
