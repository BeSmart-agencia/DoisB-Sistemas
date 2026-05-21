import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin/require-admin"
import { enviarEmailChamadoResolvido } from "@/lib/emails"
import type { StatusChamado } from "@/types/database"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const [chamadoRes, mensagensRes, adminsRes] = await Promise.all([
    supabase!.from("chamados").select(`
      *,
      cliente:clientes(id, nome_empresa, cnpj, telefone, email, plano, status_pagamento),
      atendente:admins(id, nome)
    `).eq("id", id).maybeSingle(),

    supabase!.from("chamado_mensagens")
      .select("*")
      .eq("chamado_id", id)
      .order("criado_em", { ascending: true }),

    supabase!.from("admins").select("id, nome").eq("ativo", true),
  ])

  if (!chamadoRes.data) return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 })

  // Chamados anteriores do mesmo cliente
  let chamadosAnteriores: unknown[] = []
  const clienteId = (chamadoRes.data as { cliente_id?: string }).cliente_id
  if (clienteId) {
    const { data } = await supabase!
      .from("chamados")
      .select("id, assunto, status, criado_em")
      .eq("cliente_id", clienteId)
      .neq("id", id)
      .order("criado_em", { ascending: false })
      .limit(5)
    chamadosAnteriores = data ?? []
  }

  return NextResponse.json({
    chamado: chamadoRes.data,
    mensagens: mensagensRes.data ?? [],
    admins: adminsRes.data ?? [],
    chamadosAnteriores,
  })
}

const updateSchema = z.object({
  status: z.enum(["a_atender", "em_andamento", "aguardando_cliente", "resolvido", "cancelado"]).optional(),
  prioridade: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
  atendente_id: z.string().uuid().nullable().optional(),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const body = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 })

  const updates: Record<string, unknown> = {
    ...parsed.data,
    atualizado_em: new Date().toISOString(),
  }

  if (parsed.data.status === "resolvido") {
    updates.resolvido_em = new Date().toISOString()
  }

  const { data: chamadoAtualizado, error } = await supabase!
    .from("chamados")
    .update(updates as Parameters<typeof supabase.from>[0] extends string ? never : never)
    .eq("id", id)
    .select("email_retorno, assunto, status")
    .single()

  if (error) return NextResponse.json({ error: "Erro ao atualizar chamado" }, { status: 500 })

  // E-mail de resolução
  if (parsed.data.status === "resolvido" && chamadoAtualizado) {
    const c = chamadoAtualizado as { email_retorno: string; assunto: string; status: StatusChamado }
    enviarEmailChamadoResolvido(c.email_retorno, "Cliente", id, c.assunto).catch(console.error)
  }

  return NextResponse.json({ ok: true })
}
