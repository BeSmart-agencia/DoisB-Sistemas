import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { requireAdmin } from "@/lib/admin/require-admin"

// POST → gera a assinatura recorrente (Checkout Session) para o cliente
// autorizar o pagamento automático da mensalidade. Retorna a URL de checkout.
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: projeto } = await supabase!
    .from("sob_medida_projetos")
    .select("*")
    .eq("id", params.id)
    .maybeSingle()

  if (!projeto) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
  if (!projeto.mensalidade_valor || projeto.mensalidade_valor <= 0) {
    return NextResponse.json({ error: "Defina o valor da mensalidade antes de gerar a cobrança." }, { status: 422 })
  }
  if (!projeto.cliente_email) {
    return NextResponse.json({ error: "Informe o e-mail do cliente para cobrar a mensalidade." }, { status: 422 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  try {
    // Reaproveita o customer do cliente ZWeb se houver; senão cria/reutiliza
    let customerId = projeto.stripe_customer_id as string | null
    if (!customerId && projeto.cliente_id) {
      const { data: cliente } = await supabase!
        .from("clientes")
        .select("stripe_customer_id")
        .eq("id", projeto.cliente_id)
        .maybeSingle()
      customerId = cliente?.stripe_customer_id ?? null
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: projeto.cliente_email as string,
        name: projeto.cliente_nome as string,
        phone: (projeto.cliente_telefone as string) ?? undefined,
        metadata: { sob_medida_projeto_id: projeto.id },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: `Mensalidade — ${projeto.nome_projeto}` },
            unit_amount: Math.round(Number(projeto.mensalidade_valor) * 100),
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/admin/sob-medida/${projeto.id}?mensalidade=ok`,
      cancel_url: `${appUrl}/admin/sob-medida/${projeto.id}?mensalidade=cancelado`,
      locale: "pt-BR",
      metadata: { sob_medida_projeto_id: projeto.id },
      subscription_data: { metadata: { sob_medida_projeto_id: projeto.id } },
    })

    await supabase!
      .from("sob_medida_projetos")
      .update({
        stripe_customer_id: customerId,
        stripe_checkout_url: session.url,
        mensalidade_status: "pendente",
        mensalidade_inicio: projeto.mensalidade_inicio ?? new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString(),
      })
      .eq("id", projeto.id)

    return NextResponse.json({ ok: true, url: session.url })
  } catch (err) {
    console.error("[sob-medida] Erro ao gerar mensalidade Stripe:", err)
    return NextResponse.json({ error: "Erro ao gerar a cobrança no Stripe." }, { status: 500 })
  }
}

// DELETE → cancela a assinatura recorrente
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: projeto } = await supabase!
    .from("sob_medida_projetos")
    .select("stripe_subscription_id")
    .eq("id", params.id)
    .maybeSingle()

  try {
    if (projeto?.stripe_subscription_id) {
      await stripe.subscriptions.cancel(projeto.stripe_subscription_id as string)
    }
  } catch (err) {
    console.error("[sob-medida] Erro ao cancelar assinatura:", err)
    // segue e marca como cancelada de qualquer forma
  }

  await supabase!
    .from("sob_medida_projetos")
    .update({ mensalidade_status: "cancelada", stripe_checkout_url: null, updated_at: new Date().toISOString() })
    .eq("id", params.id)

  return NextResponse.json({ ok: true })
}
