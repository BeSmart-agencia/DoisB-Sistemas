import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import type { StatusLead, Database } from "@/types/database"

type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"]

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: lead } = await supabase!
    .from("leads")
    .select("*, responsavel:admins(id, nome)")
    .eq("id", params.id)
    .single()

  if (!lead) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

  const { data: interacoes } = await supabase!
    .from("lead_interacoes")
    .select("*")
    .eq("lead_id", params.id)
    .order("created_at", { ascending: false })

  const { data: admins } = await supabase!.from("admins").select("id, nome").eq("ativo", true)

  return NextResponse.json({ lead, interacoes: interacoes ?? [], admins: admins ?? [] })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { supabase, admin, response } = await requireAdmin()
  if (response) return response

  const body = await request.json()
  const { status, observacoes, responsavel_id, segmento, cidade, estado, telefone, interacao } = body

  const update: LeadUpdate = {}
  if (status !== undefined) { update.status = status as StatusLead; update.ultima_interacao = new Date().toISOString() }
  if (observacoes !== undefined) update.observacoes = observacoes
  if (responsavel_id !== undefined) update.responsavel_id = responsavel_id
  if (segmento !== undefined) update.segmento = segmento
  if (cidade !== undefined) update.cidade = cidade
  if (estado !== undefined) update.estado = estado
  if (telefone !== undefined) update.telefone = telefone

  if (Object.keys(update).length > 0) {
    const { error } = await supabase!.from("leads").update(update).eq("id", params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (interacao) {
    await supabase!.from("lead_interacoes").insert({
      lead_id: params.id,
      tipo: interacao.tipo as string,
      descricao: interacao.descricao as string,
      admin_id: admin!.id,
      admin_nome: admin!.nome,
    })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  await supabase!.from("leads").delete().eq("id", params.id)
  return NextResponse.json({ ok: true })
}
