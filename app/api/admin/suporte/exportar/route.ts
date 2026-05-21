import { requireAdmin } from "@/lib/admin/require-admin"

export async function GET(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { searchParams } = new URL(request.url)
  const dataInicio = searchParams.get("dataInicio") ?? ""
  const dataFim = searchParams.get("dataFim") ?? ""

  let query = supabase!
    .from("chamados")
    .select(`id, assunto, status, prioridade, cnpj_informado, email_retorno, criado_em, resolvido_em, atualizado_em,
             cliente:clientes(nome_empresa), atendente:admins(nome)`)
    .in("status", ["resolvido", "cancelado"])
    .order("criado_em", { ascending: false })
    .limit(2000)

  if (dataInicio) query = query.gte("criado_em", dataInicio)
  if (dataFim) query = query.lte("criado_em", dataFim + "T23:59:59Z")

  const { data: chamados } = await query

  const STATUS_PT: Record<string, string> = {
    resolvido: "Resolvido", cancelado: "Cancelado",
    a_atender: "A atender", em_andamento: "Em andamento", aguardando_cliente: "Aguardando cliente",
  }
  const PRIO_PT: Record<string, string> = {
    baixa: "Baixa", media: "Média", alta: "Alta", urgente: "Urgente",
  }

  function fmtDate(iso: string | null) {
    return iso ? new Date(iso).toLocaleDateString("pt-BR") : ""
  }
  function esc(v: string) {
    return `"${(v ?? "").replace(/"/g, '""')}"`
  }

  const header = "ID,Cliente,CNPJ,Assunto,Status,Prioridade,Atendente,Data Abertura,Data Resolução"
  const rows = (chamados ?? []).map((c) => {
    const cli = c.cliente as { nome_empresa?: string } | null
    const atd = c.atendente as { nome?: string } | null
    return [
      c.id,
      esc(cli?.nome_empresa ?? ""),
      c.cnpj_informado,
      esc(c.assunto),
      STATUS_PT[c.status] ?? c.status,
      PRIO_PT[c.prioridade] ?? c.prioridade,
      esc(atd?.nome ?? ""),
      fmtDate(c.criado_em),
      fmtDate(c.resolvido_em),
    ].join(",")
  })

  const csv = "﻿" + [header, ...rows].join("\n") // BOM para Excel abrir UTF-8 corretamente

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="chamados-${Date.now()}.csv"`,
    },
  })
}
