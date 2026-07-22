import Link from "next/link"
import { Goal } from "lucide-react"
import { FinanceiroCalc } from "./_components/financeiro-calc"

export const metadata = { title: "Financeiro | DoisB Admin" }

export default function FinanceiroPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Financeiro — Projeção Ano 1</h1>
          <p className="text-sm text-slate-700 mt-1">
            Mês a mês: o que precisamos vender, custo, lucro, pró-labore de cada sócio, bônus da Jucele e caixa.
          </p>
        </div>
        <Link
          href="/admin/metas"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Goal className="h-4 w-4" /> Metas do Ano 1
        </Link>
      </div>

      <FinanceiroCalc />
    </div>
  )
}
