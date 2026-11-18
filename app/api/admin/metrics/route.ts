import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { precoMensalDe } from "@/lib/planos"

export async function GET() {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  // Clientes ativos
  const { count: totalAtivos } = await supabase!
    .from("clientes")
    .select("*", { count: "exact", head: true })
    .eq("status_pagamento", "ativo")

  // MRR calculado por produto + plano (preço correto de cada sistema)
  const { data: planos } = await supabase!
    .from("clientes")
    .select("produto, plano")
    .eq("status_pagamento", "ativo")

  const mrr = (planos ?? []).reduce((sum, c) => sum + precoMensalDe(c.produto, c.plano), 0)

  // Vendas do mês (novos clientes com pagamento confirmado)
  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const { count: vendasMes } = await supabase!
    .from("clientes")
    .select("*", { count: "exact", head: true })
    .neq("status_pagamento", "aguardando")
    .gte("created_at", inicioMes.toISOString())

  // Gráfico: vendas dos últimos 6 meses
  const seisAtras = new Date()
  seisAtras.setMonth(seisAtras.getMonth() - 5)
  seisAtras.setDate(1)
  seisAtras.setHours(0, 0, 0, 0)

  const { data: clientesRecentes } = await supabase!
    .from("clientes")
    .select("data_assinatura")
    .neq("status_pagamento", "aguardando")
    .gte("data_assinatura", seisAtras.toISOString())
    .not("data_assinatura", "is", null)

  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      mes: d.toLocaleString("pt-BR", { month: "short" }),
      ano: d.getFullYear(),
      mesNum: d.getMonth(),
      vendas: 0,
    }
  })

  for (const c of clientesRecentes ?? []) {
    if (!c.data_assinatura) continue
    const d = new Date(c.data_assinatura)
    const entry = meses.find((m) => m.mesNum === d.getMonth() && m.ano === d.getFullYear())
    if (entry) entry.vendas++
  }

  const { count: chamadosAbertos } = await supabase!
    .from("chamados")
    .select("*", { count: "exact", head: true })
    .in("status", ["a_atender", "em_andamento", "aguardando_cliente"])

  // Sob Medida: MRR das mensalidades ativas + desenvolvimento a receber
  const { data: projetos } = await supabase!
    .from("sob_medida_projetos")
    .select("valor_desenvolvimento, valor_recebido, mensalidade_valor, mensalidade_status")

  const sobMedidaMrr = (projetos ?? [])
    .filter((p) => p.mensalidade_status === "ativa")
    .reduce((s, p) => s + Number(p.mensalidade_valor), 0)
  const sobMedidaReceber = (projetos ?? [])
    .reduce((s, p) => s + (Number(p.valor_desenvolvimento) - Number(p.valor_recebido)), 0)

  // Meta do mês (premissas do planner) — novos clientes esperados por produto
  const { data: prem } = await supabase!
    .from("metas_premissas")
    .select("doisb_vendedora, doisb_socios, zweb_vendedora, zweb_socios, sob_medida_mes")
    .eq("id", 1)
    .maybeSingle()
  const metaMes = {
    doisb: prem ? prem.doisb_vendedora + prem.doisb_socios : 0,
    zweb: prem ? prem.zweb_vendedora + prem.zweb_socios : 0,
    sobMedida: prem ? prem.sob_medida_mes : 0,
  }

  // Realizado do mês (contagem automática do que já entrou)
  const contarNovos = async (produto: string) => {
    const { count } = await supabase!
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .eq("produto", produto)
      .neq("status_pagamento", "aguardando")
      .gte("created_at", inicioMes.toISOString())
    return count ?? 0
  }
  const [realDoisb, realZweb] = await Promise.all([contarNovos("doisb-web"), contarNovos("zweb")])
  const { count: realSM } = await supabase!
    .from("sob_medida_projetos")
    .select("*", { count: "exact", head: true })
    .gte("created_at", inicioMes.toISOString())
  const realizadoMes = { doisb: realDoisb, zweb: realZweb, sobMedida: realSM ?? 0 }

  // Ações pendentes: clientes pagos aguardando liberação manual de acesso
  const { data: ativacoesPendentes } = await supabase!
    .from("clientes")
    .select("id, nome_empresa, produto")
    .eq("status_pagamento", "ativo")
    .eq("acesso_liberado", false)
    .order("created_at", { ascending: true })
    .limit(8)

  // PIX vencendo nos próximos 5 dias
  const hojeStr = new Date().toISOString().slice(0, 10)
  const em5 = new Date()
  em5.setDate(em5.getDate() + 5)
  const em5Str = em5.toISOString().slice(0, 10)
  const { data: pixVencendo } = await supabase!
    .from("clientes")
    .select("id, nome_empresa, pix_vencimento")
    .eq("forma_pagamento", "pix")
    .in("status_pagamento", ["ativo", "atrasado"])
    .gte("pix_vencimento", hojeStr)
    .lte("pix_vencimento", em5Str)
    .order("pix_vencimento", { ascending: true })
    .limit(8)

  return NextResponse.json({
    totalAtivos: totalAtivos ?? 0,
    mrr,
    vendasMes: vendasMes ?? 0,
    chamadosAbertos: chamadosAbertos ?? 0,
    sobMedidaMrr,
    sobMedidaReceber,
    mrrTotal: mrr + sobMedidaMrr,
    grafico: meses.map(({ mes, vendas }) => ({ mes, vendas })),
    metaMes,
    realizadoMes,
    ativacoesPendentes: ativacoesPendentes ?? [],
    pixVencendo: pixVencendo ?? [],
  })
}
