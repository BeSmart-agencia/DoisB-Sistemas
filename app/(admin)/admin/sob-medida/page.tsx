import Link from "next/link"
import { Plus, Repeat, TrendingUp, Wallet } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"
import { SobMedidaList, type ProjetoRow } from "./_components/sob-medida-list"
import { brl } from "./_components/labels"

export const metadata = { title: "Sob Medida | DoisB Admin" }
export const dynamic = "force-dynamic"

export default async function SobMedidaPage() {
  const db = createAdminClient()
  const { data: projetos } = await db
    .from("sob_medida_projetos")
    .select("id, cliente_nome, cliente_id, nome_projeto, status, valor_desenvolvimento, valor_recebido, mensalidade_valor, mensalidade_status")
    .order("created_at", { ascending: false })

  const lista = (projetos ?? []) as ProjetoRow[]
  const mrr = lista.filter((p) => p.mensalidade_status === "ativa").reduce((s, p) => s + Number(p.mensalidade_valor), 0)
  const recebido = lista.reduce((s, p) => s + Number(p.valor_recebido), 0)
  const aReceber = lista.reduce((s, p) => s + (Number(p.valor_desenvolvimento) - Number(p.valor_recebido)), 0)
  const ativos = lista.filter((p) => !["entregue", "cancelado"].includes(p.status)).length

  const cards = [
    { icon: Repeat, label: "MRR mensalidades", valor: brl(mrr), sub: `${lista.filter((p) => p.mensalidade_status === "ativa").length} ativas` },
    { icon: Wallet, label: "Desenvolvimento recebido", valor: brl(recebido), sub: "acumulado" },
    { icon: TrendingUp, label: "A receber", valor: brl(aReceber), sub: "desenvolvimento pendente" },
    { icon: Plus, label: "Projetos em andamento", valor: String(ativos), sub: `${lista.length} no total` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Sob Medida</h1>
          <p className="text-sm text-slate-700 mt-1">
            Projetos de desenvolvimento de sistemas — valor de desenvolvimento, mensalidade recorrente e financeiro.
          </p>
        </div>
        <Link
          href="/admin/sob-medida/novo"
          className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> Novo projeto
        </Link>
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="admin-panel p-5">
            <div className="flex items-center gap-2 text-blue-900">
              <c.icon className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wide">{c.label}</p>
            </div>
            <p className="text-2xl font-black text-slate-950 mt-2">{c.valor}</p>
            <p className="text-xs text-slate-600 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <SobMedidaList projetos={lista} />
    </div>
  )
}
