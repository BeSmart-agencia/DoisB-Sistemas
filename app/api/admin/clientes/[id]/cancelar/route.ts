import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { stripe } from "@/lib/stripe/client"

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: cliente, error: fetchError } = await supabase!
    .from("clientes")
    .select("stripe_subscription_id, status_pagamento")
    .eq("id", params.id)
    .maybeSingle()

  if (fetchError || !cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  if (!cliente.stripe_subscription_id) {
    return NextResponse.json({ error: "Nenhuma assinatura Stripe encontrada" }, { status: 400 })
  }

  if (cliente.status_pagamento === "cancelado") {
    return NextResponse.json({ error: "Assinatura já está cancelada" }, { status: 409 })
  }

  try {
    // Cancela no fim do período atual para não cortar de imediato
    await stripe.subscriptions.update(cliente.stripe_subscription_id, {
      cancel_at_period_end: true,
    })
  } catch (err) {
    console.error("[cancelar] Erro Stripe:", err)
    return NextResponse.json({ error: "Erro ao cancelar no Stripe" }, { status: 500 })
  }

  // O webhook customer.subscription.deleted cuidará de atualizar o status

  return NextResponse.json({ ok: true, mensagem: "Assinatura será cancelada ao fim do período atual." })
}
