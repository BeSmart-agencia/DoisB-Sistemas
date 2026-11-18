"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, DollarSign, ShoppingCart, Headphones, Activity, Repeat, Boxes, Wallet, Target, Rocket, CalendarClock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { PRODUTO_NOME } from "@/lib/planos"

interface MetaRealizado { doisb: number; zweb: number; sobMedida: number }
interface PendenciaAtivacao { id: string; nome_empresa: string; produto: string }
interface PixVenc { id: string; nome_empresa: string; pix_vencimento: string }

interface Metrics {
  totalAtivos: number
  mrr: number
  vendasMes: number
  chamadosAbertos: number
  sobMedidaMrr: number
  sobMedidaReceber: number
  mrrTotal: number
  grafico: { mes: string; vendas: number }[]
  metaMes: MetaRealizado
  realizadoMes: MetaRealizado
  ativacoesPendentes: PendenciaAtivacao[]
  pixVencendo: PixVenc[]
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDiaMes(iso: string) {
  const [, m, d] = iso.split("-")
  return `${d}/${m}`
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<Metrics>({
    queryKey: ["admin", "metrics"],
    queryFn: async () => {
      const r = await fetch("/api/admin/metrics")
      const json = await r.json()
      if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`)
      return json
    },
  })

  const cards = [
    { label: "Clientes ativos", value: data?.totalAtivos ?? 0, format: (v: number) => v.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "MRR total", value: data?.mrrTotal ?? 0, format: formatBRL, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "MRR assinaturas", value: data?.mrr ?? 0, format: formatBRL, icon: Repeat, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "MRR Sob Medida", value: data?.sobMedidaMrr ?? 0, format: formatBRL, icon: Boxes, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Sob Medida a receber", value: data?.sobMedidaReceber ?? 0, format: formatBRL, icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Vendas no mês", value: data?.vendasMes ?? 0, format: (v: number) => v.toString(), icon: ShoppingCart, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Chamados abertos", value: data?.chamadosAbertos ?? 0, format: (v: number) => v.toString(), icon: Headphones, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <div className="space-y-7">
      <div className="admin-panel-strong p-6">
        <span className="section-kicker">
          <Activity className="h-3.5 w-3.5" />
          Operação em tempo real
        </span>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Visão geral do funil, suporte e receita recorrente.</p>
          </div>
          <p className="text-xs font-medium text-slate-400">Atualizado automaticamente pelo painel</p>
        </div>
      </div>

      {/* Precisa da sua atenção */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="admin-panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="h-4 w-4 text-orange-600" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Ativações pendentes</h2>
              {(data?.ativacoesPendentes.length ?? 0) > 0 && (
                <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                  {data?.ativacoesPendentes.length}
                </span>
              )}
            </div>
            {(data?.ativacoesPendentes.length ?? 0) === 0 ? (
              <p className="text-sm text-slate-400">Nada pendente — tudo liberado. ✅</p>
            ) : (
              <ul className="space-y-1">
                {data!.ativacoesPendentes.map((c) => (
                  <li key={c.id}>
                    <Link href={`/admin/clientes/${c.id}`} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
                      <span className="truncate font-medium text-slate-800">{c.nome_empresa}</span>
                      <span className="shrink-0 text-xs font-semibold text-slate-400">{PRODUTO_NOME[c.produto] ?? c.produto}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">PIX vencendo (5 dias)</h2>
              {(data?.pixVencendo.length ?? 0) > 0 && (
                <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                  {data?.pixVencendo.length}
                </span>
              )}
            </div>
            {(data?.pixVencendo.length ?? 0) === 0 ? (
              <p className="text-sm text-slate-400">Nenhum vencimento próximo.</p>
            ) : (
              <ul className="space-y-1">
                {data!.pixVencendo.map((c) => (
                  <li key={c.id}>
                    <Link href={`/admin/clientes/${c.id}`} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
                      <span className="truncate font-medium text-slate-800">{c.nome_empresa}</span>
                      <span className="shrink-0 text-xs font-semibold text-amber-600">vence {formatDiaMes(c.pix_vencimento)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="admin-panel p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-slate-500 font-medium">{card.label}</p>
              <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center ring-1 ring-white`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-black tracking-tight text-slate-950">{card.format(card.value)}</p>
            )}
          </div>
        ))}
      </div>

      {/* Meta do mês */}
      <div className="admin-panel p-6">
        <div className="mb-5 flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-900" />
          <h2 className="text-lg font-bold text-slate-950">Meta do mês</h2>
        </div>
        {isLoading ? (
          <Skeleton className="h-28 w-full" />
        ) : (
          <div className="space-y-4">
            {[
              { label: "DoisB Web", real: data!.realizadoMes.doisb, meta: data!.metaMes.doisb, cor: "bg-emerald-500" },
              { label: "ZWeb", real: data!.realizadoMes.zweb, meta: data!.metaMes.zweb, cor: "bg-sky-500" },
              { label: "Sob medida", real: data!.realizadoMes.sobMedida, meta: data!.metaMes.sobMedida, cor: "bg-violet-500" },
            ].map((m) => {
              const pct = m.meta > 0 ? Math.min(100, Math.round((m.real / m.meta) * 100)) : m.real > 0 ? 100 : 0
              const falta = Math.max(0, m.meta - m.real)
              const batida = m.meta > 0 && m.real >= m.meta
              return (
                <div key={m.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">{m.label}</span>
                    <span className="text-slate-600">
                      <b className="text-slate-900">{m.real}</b> / {m.meta}
                      {batida ? (
                        <span className="font-medium text-emerald-600"> · meta batida 🎉</span>
                      ) : falta > 0 ? (
                        <span className="font-medium text-amber-600"> · faltam {falta}</span>
                      ) : null}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={cn("h-full rounded-full transition-all", batida ? "bg-emerald-500" : m.cor)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            <p className="pt-1 text-xs text-slate-400">
              Metas vêm de{" "}
              <Link href="/admin/metas" className="underline hover:text-blue-700">Metas e Finanças</Link>
              . Realizado = clientes que entraram neste mês.
            </p>
          </div>
        )}
      </div>

      <div className="admin-panel p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-950">Vendas</h2>
          <p className="text-sm text-slate-500">Últimos 6 meses</p>
        </div>
        {isLoading ? (
          <Skeleton className="h-52 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.grafico} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dbeafe", fontSize: 13, boxShadow: "0 12px 30px rgba(15, 23, 42, .08)" }} cursor={{ fill: "#eff6ff" }} />
              <Bar dataKey="vendas" fill="#1472B5" radius={[7, 7, 0, 0]} name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
