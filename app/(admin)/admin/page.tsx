"use client"

import { useQuery } from "@tanstack/react-query"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, DollarSign, ShoppingCart, Headphones, Target, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Metrics {
  totalAtivos: number
  mrr: number
  vendasMes: number
  chamadosAbertos: number
  leadsNegociacao: number
  grafico: { mes: string; vendas: number }[]
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<Metrics>({
    queryKey: ["admin", "metrics"],
    queryFn: () => fetch("/api/admin/metrics").then((r) => r.json()),
  })

  const cards = [
    { label: "Clientes ativos", value: data?.totalAtivos ?? 0, format: (v: number) => v.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "MRR", value: data?.mrr ?? 0, format: formatBRL, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Vendas no mês", value: data?.vendasMes ?? 0, format: (v: number) => v.toString(), icon: ShoppingCart, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Chamados abertos", value: data?.chamadosAbertos ?? 0, format: (v: number) => v.toString(), icon: Headphones, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Leads em negociação", value: data?.leadsNegociacao ?? 0, format: (v: number) => v.toString(), icon: Target, color: "text-rose-600", bg: "bg-rose-50" },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
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
