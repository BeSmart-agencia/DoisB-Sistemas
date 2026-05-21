import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { slugify, addHeadingIds } from "@/lib/tutoriais"
import type { Database } from "@/types/database"

type TutorialUpdate = Database["public"]["Tables"]["tutoriais"]["Update"]

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data, error } = await supabase!
    .from("tutoriais")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !data) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json()
  const { titulo, slug: slugInput, categoria, resumo, conteudo_html, status, ordem } = body

  const update: TutorialUpdate = {}
  if (titulo !== undefined) { update.titulo = titulo; update.slug = slugInput ?? slugify(titulo) }
  if (slugInput !== undefined) update.slug = slugInput
  if (categoria !== undefined) update.categoria = categoria
  if (resumo !== undefined) update.resumo = resumo
  if (conteudo_html !== undefined) update.conteudo_html = addHeadingIds(conteudo_html)
  if (status !== undefined) update.status = status
  if (ordem !== undefined) update.ordem = ordem

  const { error } = await supabase!.from("tutoriais").update(update).eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  await supabase!.from("tutoriais").delete().eq("id", params.id)
  return NextResponse.json({ ok: true })
}
