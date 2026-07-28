import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import type { Database } from "@/types/database"

type VendedorUpdate = Database["public"]["Tables"]["vendedores"]["Update"]

function normalizarCodigo(v: unknown): string {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })

  const update: VendedorUpdate = {}
  if (body.nome !== undefined) {
    const nome = String(body.nome).trim()
    if (nome.length < 2) return NextResponse.json({ error: "Nome inválido" }, { status: 422 })
    update.nome = nome
  }
  if (body.codigo !== undefined) {
    const codigo = normalizarCodigo(body.codigo)
    if (codigo.length < 2) return NextResponse.json({ error: "Código inválido" }, { status: 422 })
    update.codigo = codigo
  }
  if (body.email !== undefined) update.email = body.email ? String(body.email).trim() : null
  if (body.telefone !== undefined) update.telefone = body.telefone ? String(body.telefone).trim() : null
  if (body.chave_pix !== undefined) update.chave_pix = body.chave_pix ? String(body.chave_pix).trim() : null
  if (body.observacoes !== undefined) update.observacoes = body.observacoes ? String(body.observacoes).trim() : null
  if (body.ativo !== undefined) update.ativo = !!body.ativo

  if (Object.keys(update).length === 0)
    return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 })

  const { data, error } = await supabase!
    .from("vendedores")
    .update(update)
    .eq("id", params.id)
    .select()
    .single()

  if (error) {
    if (error.code === "23505")
      return NextResponse.json({ error: "Já existe um vendedor com esse código" }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  // Bloqueia exclusão se houver vendas atribuídas (preserva histórico).
  const { count } = await supabase!
    .from("clientes")
    .select("id", { count: "exact", head: true })
    .eq("vendedor_id", params.id)

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Este vendedor tem vendas atribuídas. Desative-o em vez de excluir." },
      { status: 409 }
    )
  }

  const { error } = await supabase!.from("vendedores").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
