import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import { resolverVendedorId } from "@/lib/vendedores"

// Checkout do AgendaB (assinatura mensal). O provisionamento acontece no
// webhook (checkout.session.completed com metadata.produto === "agendab").
export async function POST(request: Request) {
  const price = process.env.STRIPE_PRICE_AGENDAB
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!price) {
    console.error("[checkout/agendab] STRIPE_PRICE_AGENDAB não configurado")
    return NextResponse.json({ error: "Configuração ausente" }, { status: 500 })
  }

  // Atribuição a vendedor externo (link /?v=). Vai no metadata da sessão;
  // o webhook grava em sob_medida_projetos ao provisionar.
  const body = await request.json().catch(() => null)
  const vendedorId = await resolverVendedorId(createAdminClient(), body?.vendedor_codigo)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/agendab/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/agendab?erro=cancelado`,
      locale: "pt-BR",
      allow_promotion_codes: true,
      metadata: { produto: "agendab", ...(vendedorId && { vendedor_id: vendedorId }) },
      subscription_data: {
        metadata: { produto: "agendab" },
      },
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[checkout/agendab] Erro ao criar sessão:", err)
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento. Tente novamente." },
      { status: 500 }
    )
  }
}
