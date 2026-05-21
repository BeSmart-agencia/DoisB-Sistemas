import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { stripe } from "@/lib/stripe/client"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: cliente, error } = await supabase!
    .from("clientes")
    .select("*")
    .eq("id", params.id)
    .maybeSingle()

  if (error || !cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  // Buscar faturas no Stripe
  let faturas: object[] = []
  if (cliente.stripe_customer_id) {
    try {
      const invoices = await stripe.invoices.list({
        customer: cliente.stripe_customer_id,
        limit: 12,
      })
      faturas = invoices.data.map((inv) => ({
        id: inv.id,
        valor: (inv.amount_paid ?? 0) / 100,
        status: inv.status,
        data: new Date((inv.created ?? 0) * 1000).toISOString(),
        pdf: inv.invoice_pdf,
        periodo_inicio: inv.period_start ? new Date(inv.period_start * 1000).toISOString() : null,
        periodo_fim: inv.period_end ? new Date(inv.period_end * 1000).toISOString() : null,
      }))
    } catch {
      // Stripe pode falhar — retornar cliente sem faturas
    }
  }

  return NextResponse.json({ cliente, faturas })
}
