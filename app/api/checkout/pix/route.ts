import { NextResponse } from "next/server"
import { z } from "zod"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import { enviarEmailInternoNovaVenda } from "@/lib/emails"

const PRECOS: Record<string, number> = {
  essencial: 12990,
  standard: 19990,
  premium: 24990,
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
  nome_fantasia: z.string().optional(),
  ie: z.string().optional(),
  im: z.string().optional(),
  crt: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", detalhes: parsed.error.flatten() }, { status: 422 })
  }

  const { nome_empresa, cnpj, email, telefone, nome_responsavel, plano,
    nome_fantasia, ie, im, crt, cep, logradouro, numero, complemento, bairro, cidade, estado } = parsed.data
  const cnpjLimpo = cnpj.replace(/\D/g, "")
  const supabase = createAdminClient()

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

  if (existente) {
    await supabase.from("clientes").delete().eq("id", existente.id)
  }

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
      forma_pagamento: "pix",
      nome_fantasia,
      ie,
      im,
      crt,
      cep: cep?.replace(/\D/g, ""),
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    })
    .select("id")
    .single()

  if (erroInsert || !cliente) {
    console.error("[checkout/pix] Erro ao inserir cliente:", erroInsert)
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 })
  }

  let stripeCustomer
  try {
    stripeCustomer = await stripe.customers.create({
      email,
      name: nome_empresa,
      phone: telefone,
      metadata: { supabase_cliente_id: cliente.id, cnpj: cnpjLimpo, nome_responsavel, plano },
    })
  } catch (err) {
    console.error("[checkout/pix] Erro ao criar customer:", err)
    await supabase.from("clientes").delete().eq("id", cliente.id)
    return NextResponse.json({ error: "Erro ao processar pagamento. Tente novamente." }, { status: 500 })
  }

  await supabase
    .from("clientes")
    .update({ stripe_customer_id: stripeCustomer.id })
    .eq("id", cliente.id)

  // PIX expira em 24h
  const expiresAt = Math.floor(Date.now() / 1000) + 86400

  let paymentIntent
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: PRECOS[plano],
      currency: "brl",
      customer: stripeCustomer.id,
      payment_method_types: ["pix"],
      payment_method_data: { type: "pix" },
      confirm: true,
      payment_method_options: {
        pix: { expires_after_seconds: 86400 },
      },
      metadata: {
        supabase_cliente_id: cliente.id,
        plano,
        renovacao: "false",
        expires_at: String(expiresAt),
      },
    })
  } catch (err) {
    console.error("[checkout/pix] Erro ao criar PaymentIntent:", err)
    return NextResponse.json({ error: "Erro ao gerar QR Code PIX. Tente novamente." }, { status: 500 })
  }

  await supabase
    .from("clientes")
    .update({ pix_charge_id: paymentIntent.id })
    .eq("id", cliente.id)

  await enviarEmailInternoNovaVenda({
    nome_empresa,
    cnpj: cnpjLimpo,
    email,
    telefone,
    nome_responsavel,
    plano,
    stripe_customer_id: stripeCustomer.id,
  }).catch((err) => console.error("[checkout/pix] Erro e-mail interno:", err))

  const pix = paymentIntent.next_action?.pix_display_qr_code
  return NextResponse.json({
    intentId: paymentIntent.id,
    clienteId: cliente.id,
    qrImage: pix?.image_url_png ?? null,
    qrCode: pix?.data ?? null,
  })
}
