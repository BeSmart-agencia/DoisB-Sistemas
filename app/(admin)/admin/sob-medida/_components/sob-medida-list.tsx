"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Boxes, Trash2, ExternalLink, RefreshCcw } from "lucide-react"
import { STATUS_PROJETO, STATUS_MENSALIDADE, brl } from "./labels"

export interface ProjetoRow {
  id: string
  cliente_nome: string
  cliente_id: string | null
  nome_projeto: string
  status: string
  valor_desenvolvimento: number
  valor_recebido: number
  mensalidade_valor: number
  mensalidade_status: string
}

export function SobMedidaList({ projetos }: { projetos: ProjetoRow[] }) {
  const router = useRouter()
  const [excluindo, setExcluindo] = useState<string | null>(null)

  async function excluir(p: ProjetoRow, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(`Excluir o projeto "${p.nome_projeto}"? Essa ação não tem volta.`)) return
    setExcluindo(p.id)
    try {
      const res = await fetch(`/api/admin/sob-medida/${p.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Projeto excluído.")
      router.refresh()
    } catch {
      toast.error("Erro ao excluir.")
    } finally {
      setExcluindo(null)
    }
  }

  if (projetos.length === 0) {
    return (
      <div className="admin-panel p-14 text-center">
        <Boxes className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700">
          Nenhum projeto sob medida ainda. Clique em “Novo projeto” para cadastrar o primeiro.
        </p>
      </div>
    )
  }

  return (
    <div className="admin-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Projeto</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Cliente</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Status</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-900 text-right">Desenvolvimento</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-900 text-right">Mensalidade</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-900 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projetos.map((p) => {
              const st = STATUS_PROJETO[p.status] ?? STATUS_PROJETO.proposta
              const mst = STATUS_MENSALIDADE[p.mensalidade_status] ?? STATUS_MENSALIDADE.inativa
              const aReceber = Number(p.valor_desenvolvimento) - Number(p.valor_recebido)
              return (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/admin/sob-medida/${p.id}`)}
                  className="hover:bg-slate-50/70 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{p.nome_projeto}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-800 flex items-center gap-1.5">
                      {p.cliente_nome}
                      {p.cliente_id && <span title="Cliente ZWeb"><RefreshCcw className="h-3 w-3 text-blue-500" /></span>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", st.badge)}>{st.label}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-semibold text-slate-900">{brl(p.valor_desenvolvimento)}</p>
                    {aReceber > 0 && <p className="text-xs text-amber-700">a receber {brl(aReceber)}</p>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {Number(p.mensalidade_valor) > 0 ? (
                      <>
                        <p className="font-semibold text-slate-900">{brl(p.mensalidade_valor)}</p>
                        <span className={cn("inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold mt-0.5", mst.badge)}>{mst.label}</span>
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/sob-medida/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Abrir
                      </Link>
                      <button
                        onClick={(e) => excluir(p, e)}
                        disabled={excluindo === p.id}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
