"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Check, ListChecks, ChevronDown, CheckCircle2 } from "lucide-react"

export interface MetaRow {
  id: string
  mes: string // 'YYYY-MM-DD' (primeiro dia do mês)
  responsavel: "laisa" | "abel" | "ambos" | string
  categoria: string
  tarefa: string
  ordem: number
  concluido: boolean
  concluido_em: string | null
  concluido_por: string | null
}

const RESP: Record<string, { label: string; badge: string }> = {
  laisa: { label: "Laisa", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  abel: { label: "Abel", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  ambos: { label: "Laisa + Abel", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
}

function rotuloMes(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  const s = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function mesAtualIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
}

export function MetasChecklist({ metas }: { metas: MetaRow[] }) {
  const router = useRouter()
  const [itens, setItens] = useState<MetaRow[]>(metas)
  const [salvando, setSalvando] = useState<string | null>(null)

  const grupos = useMemo(() => {
    const mapa = new Map<string, MetaRow[]>()
    for (const m of itens) {
      mapa.set(m.mes, [...(mapa.get(m.mes) ?? []), m])
    }
    const entradas = Array.from(mapa.entries())
    entradas.forEach(([, lista]) => lista.sort((a, b) => a.ordem - b.ordem))
    return entradas.sort(([a], [b]) => a.localeCompare(b))
  }, [itens])

  const mesAtual = mesAtualIso()
  const [aberto, setAberto] = useState<string | null>(
    grupos.find(([mes]) => mes >= mesAtual)?.[0] ?? grupos[0]?.[0] ?? null
  )

  async function alternar(item: MetaRow) {
    const novo = !item.concluido
    setSalvando(item.id)
    // otimista
    setItens((prev) => prev.map((m) => (m.id === item.id ? { ...m, concluido: novo } : m)))
    try {
      const res = await fetch(`/api/admin/metas/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concluido: novo }),
      })
      if (!res.ok) throw new Error()
      if (novo) toast.success("Meta concluída! 🎯")
      router.refresh()
    } catch {
      // desfaz otimista
      setItens((prev) => prev.map((m) => (m.id === item.id ? { ...m, concluido: !novo } : m)))
      toast.error("Erro ao atualizar a meta.")
    } finally {
      setSalvando(null)
    }
  }

  if (itens.length === 0) {
    return (
      <div className="admin-panel p-14 text-center">
        <ListChecks className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">
          Checklist ainda não criado. Rode a migration{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">supabase/migrations/metas_checklist.sql</code>{" "}
          no Supabase e recarregue esta página.
        </p>
      </div>
    )
  }

  const totalGeral = itens.length
  const feitasGeral = itens.filter((m) => m.concluido).length
  const pctGeral = Math.round((feitasGeral / totalGeral) * 100)

  return (
    <div className="space-y-4">
      {/* Progresso geral */}
      <div className="admin-panel p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-slate-950">Progresso do Ano 1</p>
          <p className="text-sm font-bold text-blue-800">
            {feitasGeral}/{totalGeral} · {pctGeral}%
          </p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all"
            style={{ width: `${pctGeral}%` }}
          />
        </div>
      </div>

      {grupos.map(([mes, lista]) => {
        const feitas = lista.filter((m) => m.concluido).length
        const pct = Math.round((feitas / lista.length) * 100)
        const tudoFeito = feitas === lista.length
        const expandido = aberto === mes
        const ehMesAtual = mes === mesAtual
        return (
          <div key={mes} className="admin-panel overflow-hidden">
            <button
              onClick={() => setAberto(expandido ? null : mes)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    tudoFeito ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {tudoFeito ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-bold">{pct}%</span>}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-950 flex items-center gap-2">
                    {rotuloMes(mes)}
                    {ehMesAtual && (
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Mês atual
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {feitas} de {lista.length} concluídas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full transition-all", tudoFeito ? "bg-emerald-500" : "bg-blue-500")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", expandido && "rotate-180")} />
              </div>
            </button>

            {expandido && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {lista.map((item) => {
                  const resp = RESP[item.responsavel] ?? { label: item.responsavel, badge: "bg-slate-50 text-slate-600 border-slate-200" }
                  return (
                    <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                      <button
                        onClick={() => alternar(item)}
                        disabled={salvando === item.id}
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors disabled:opacity-50",
                          item.concluido
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 bg-white hover:border-blue-500"
                        )}
                        aria-label={item.concluido ? "Desmarcar" : "Marcar como concluída"}
                      >
                        {item.concluido && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm leading-snug", item.concluido ? "text-slate-400 line-through" : "text-slate-800")}>
                          {item.tarefa}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", resp.badge)}>
                            {resp.label}
                          </span>
                          {item.concluido && item.concluido_por && (
                            <span className="text-[11px] text-slate-400">
                              marcada por {item.concluido_por}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
