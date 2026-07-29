import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"

/**
 * Marca a comissão de uma venda como paga ou não paga ao vendedor.
 * Body: { id: string, tipo: "zweb" | "agendab", paga: boolean }
 * - zweb   → tabela clientes
 * - agendab→ tabela sob_medida_projetos
 */
export async function PATCH(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json().catch(() => null)
  const id = body?.id ?? body?.cliente_id // compat
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 })

  const tabela = body?.tipo === "agendab" ? "sob_medida_projetos" : "clientes"
  const paga = !!body.paga

  const { data, error } = await supabase!
    .from(tabela)
    .update({
      comissao_paga: paga,
      comissao_paga_em: paga ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("id, comissao_paga, comissao_paga_em")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
