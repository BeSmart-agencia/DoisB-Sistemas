import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import type { StatusChamado, PrioridadeChamado } from "@/types/database"

export async function GET(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = 25
  const offset = (page - 1) * limit
  const search = searchParams.get("search") ?? ""
  const status = searchParams.get("status") ?? ""
  const prioridade = searchParams.get("prioridade") ?? ""
  const dataInicio = searchParams.get("dataInicio") ?? ""
  const dataFim = searchParams.get("dataFim") ?? ""
  const historico = searchParams.get("historico") === "true"

  let query = supabase!
    .from("chamados")
    .select(
      `id, assunto, status, prioridade, email_retorno, cnpj_informado, created_at, atualizado_em, resolvido_em,
       cliente:clientes(nome_empresa, plano),
       atendente:admins(nome)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: !historico }) // ativos: mais antigos primeiro; historico: mais recentes primeiro
    .range(offset, offset + limit - 1)

  if (historico) {
    query = query.in("status", ["resolvido", "cancelado"] as StatusChamado[])
  } else {
    query = query.not("status", "in", '("resolvido","cancelado")')
  }

  if (search) {
    query = query.or(`assunto.ilike.%${search}%,cnpj_informado.ilike.%${search}%,email_retorno.ilike.%${search}%`)
  }
  if (status) query = query.eq("status", status as StatusChamado)
  if (prioridade) query = query.eq("prioridade", prioridade as PrioridadeChamado)
  if (dataInicio) query = query.gte("created_at", dataInicio)
  if (dataFim) query = query.lte("created_at", dataFim + "T23:59:59Z")

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: "Erro ao buscar chamados" }, { status: 500 })

  return NextResponse.json({
    chamados: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  })
}
