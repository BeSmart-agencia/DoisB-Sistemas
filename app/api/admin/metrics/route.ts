import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import type { Plano } from "@/types/database"

const PRECO_PLANO: Record<Plano, number> = {
  essencial: 129.9,
  standard: 199.9,
  premium: 249.9,
}

export async function GET() {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  // Clientes ativos
  const { count: totalAtivos } = await supabase!
    .from("clientes")
    .select("*", { count: "exact", head: true })
    .eq("status_pagamento", "ativo")

  // MRR calculado por plano
  const { data: planos } = await supabase!
    .from("clientes")
    .select("plano")
    .eq("status_pagamento", "ativo")

  const mrr = (planos ?? []).reduce((sum, c) => sum + (PRECO_PLANO[c.plano as Plano] ?? 0), 0)

  // Vendas do mês (novos clientes com pagamento confirmado)
  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const { count: vendasMes } = await supabase!
    .from("clientes")
    .select("*", { count: "exact", head: true })
    .neq("status_pagamento", "aguardando")
    .gte("criado_em", inicioMes.toISOString())

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

  return NextResponse.json({
    totalAtivos: totalAtivos ?? 0,
    mrr,
    vendasMes: vendasMes ?? 0,
    chamadosAbertos: chamadosAbertos ?? 0,
    leadsNegociacao: 0,
    grafico: meses.map(({ mes, vendas }) => ({ mes, vendas })),
  })
}
