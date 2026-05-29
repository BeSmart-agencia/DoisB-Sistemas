import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const intentId = searchParams.get("intent_id")

  if (!intentId) {
    return NextResponse.json({ error: "intent_id obrigatório" }, { status: 400 })
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(intentId)
    return NextResponse.json({ status: intent.status })
  } catch (err) {
    console.error("[pix/status]", err)
    return NextResponse.json({ error: "Erro ao consultar pagamento" }, { status: 500 })
  }
}
