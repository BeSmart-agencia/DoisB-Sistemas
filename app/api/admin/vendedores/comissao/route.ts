import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"

/**
 * Marca a comissão de uma venda (cliente) como paga ou não paga ao vendedor.
 * Body: { cliente_id: string, paga: boolean }
 */
export async function PATCH(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json().catch(() => null)
  if (!body?.cliente_id) return NextResponse.json({ error: "cliente_id obrigatório" }, { status: 400 })

  const paga = !!body.paga

  const { data, error } = await supabase!
    .from("clientes")
    .update({
      comissao_paga: paga,
      comissao_paga_em: paga ? new Date().toISOString() : null,
    })
    .eq("id", body.cliente_id)
    .select("id, comissao_paga, comissao_paga_em")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
