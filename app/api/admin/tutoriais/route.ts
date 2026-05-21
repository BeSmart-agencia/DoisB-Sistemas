import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { slugify, addHeadingIds } from "@/lib/tutoriais"

export async function GET(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") ?? ""
  const categoria = searchParams.get("categoria") ?? ""
  const status = searchParams.get("status") ?? ""

  let query = supabase!
    .from("tutoriais")
    .select("id, titulo, slug, categoria, resumo, status, ordem, atualizado_em", { count: "exact" })
    .order("ordem", { ascending: true })
    .order("titulo", { ascending: true })

  if (search) query = query.ilike("titulo", `%${search}%`)
  if (categoria) query = query.eq("categoria", categoria)
  if (status) query = query.eq("status", status)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ tutoriais: data ?? [], total: count ?? 0 })
}

export async function POST(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json()
  const { titulo, categoria, resumo, conteudo_html, status, ordem } = body

  if (!titulo || !categoria) {
    return NextResponse.json({ error: "Título e categoria obrigatórios" }, { status: 400 })
  }

  const slug = slugify(titulo)
  const htmlComIds = conteudo_html ? addHeadingIds(conteudo_html) : null

  const { data, error } = await supabase!
    .from("tutoriais")
    .insert({ titulo, slug, categoria, resumo, conteudo_html: htmlComIds, status: status ?? "rascunho", ordem: ordem ?? 0 })
    .select("id, slug")
    .single()

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Já existe um tutorial com este título" }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
