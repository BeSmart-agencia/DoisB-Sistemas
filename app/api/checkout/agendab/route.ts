import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

// Checkout do AgendaB (assinatura mensal). O provisionamento acontece no
// webhook (checkout.session.completed com metadata.produto === "agendab").
export async function POST() {
  const price = process.env.STRIPE_PRICE_AGENDAB
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!price) {
    console.error("[checkout/agendab] STRIPE_PRICE_AGENDAB não configurado")
    return NextResponse.json({ error: "Configuração ausente" }, { status: 500 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/agendab/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/agendab?erro=cancelado`,
      locale: "pt-BR",
      allow_promotion_codes: true,
      metadata: { produto: "agendab" },
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
