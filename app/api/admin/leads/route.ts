import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import type { StatusLead } from "@/types/database"

export async function GET(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { searchParams } = new URL(request.url)
  const limite = Math.min(500, parseInt(searchParams.get("limite") ?? "50"))
  const search = searchParams.get("search") ?? ""
  const status = searchParams.get("status") ?? ""
  const cidade = searchParams.get("cidade") ?? ""
  const segmento = searchParams.get("segmento") ?? ""

  let query = supabase!
    .from("leads")
    .select("*, responsavel:admins(nome)", { count: "exact" })
    .order("criado_em", { ascending: false })
    .limit(limite)

  if (search) query = query.ilike("nome", `%${search}%`)
  if (status) query = query.eq("status", status as StatusLead)
  if (cidade) query = query.ilike("cidade", `%${cidade}%`)
  if (segmento) query = query.ilike("segmento", `%${segmento}%`)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ leads: data ?? [], total: count ?? 0 })
}

export async function POST(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json()
  const { google_place_id, nome, segmento, cidade, estado, endereco, telefone, rating, lat, lng } = body

  if (!nome) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 })

  const { data, error } = await supabase!
    .from("leads")
    .insert({ google_place_id, nome, segmento, cidade, estado, endereco, telefone, rating, lat, lng })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Lead já cadastrado" }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
