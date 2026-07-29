import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { listarComissoes } from "@/lib/comissoes"

function normalizarCodigo(v: unknown): string {
  // NFD separa a letra do acento (é -> e + ´); o filtro final descarta
  // o acento e qualquer caractere fora do conjunto permitido.
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
}

export async function GET() {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: vendedores, error } = await supabase!
    .from("vendedores")
    .select("*")
    .order("ativo", { ascending: false })
    .order("nome", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Comissões unificadas (ZWeb + AgendaB) atribuídas a qualquer vendedor.
  const comissoes = await listarComissoes(supabase!)

  return NextResponse.json({ vendedores: vendedores ?? [], comissoes })
}

export async function POST(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })

  const nome = String(body.nome ?? "").trim()
  if (nome.length < 2) return NextResponse.json({ error: "Informe o nome do vendedor" }, { status: 422 })

  const codigo = normalizarCodigo(body.codigo || nome)
  if (codigo.length < 2) return NextResponse.json({ error: "Código inválido. Use letras/números (ex: joao)" }, { status: 422 })

  const { data, error } = await supabase!
    .from("vendedores")
    .insert({
      nome,
      codigo,
      email: body.email ? String(body.email).trim() : null,
      telefone: body.telefone ? String(body.telefone).trim() : null,
      chave_pix: body.chave_pix ? String(body.chave_pix).trim() : null,
      observacoes: body.observacoes ? String(body.observacoes).trim() : null,
      ativo: body.ativo === false ? false : true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505")
      return NextResponse.json({ error: "Já existe um vendedor com esse código" }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
