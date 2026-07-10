"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, ChevronDown, ExternalLink } from "lucide-react"

interface BriefingRow {
  id: string
  semana: string
  resumo: string | null
  achados: unknown
  fontes: unknown
  created_at: string
}

interface Achado {
  tema?: string
  evidencia?: string
  recomendacao?: string
  para_quem?: string
}

interface Fonte {
  titulo?: string
  url?: string
}

const PARA_QUEM_BADGE: Record<string, string> = {
  copywriter: "bg-blue-50 text-blue-700 border-blue-200",
  social: "bg-violet-50 text-violet-700 border-violet-200",
  trafego: "bg-amber-50 text-amber-700 border-amber-200",
  estrategista: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

function comoArray<T>(valor: unknown): T[] {
  return Array.isArray(valor) ? (valor as T[]) : []
}

function rotuloSemana(iso: string): string {
  const seg = new Date(`${iso}T00:00:00`)
  const dom = new Date(seg)
  dom.setDate(dom.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  return `Semana de ${fmt(seg)} a ${fmt(dom)}`
}

export function BriefingsList({ briefings }: { briefings: BriefingRow[] }) {
  const [aberto, setAberto] = useState<string | null>(briefings[0]?.id ?? null)

  if (briefings.length === 0) {
    return (
      <div className="admin-panel p-14 text-center">
        <TrendingUp className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">
          Nenhum briefing ainda. O primeiro chega segunda de manhã — ou peça agora ao
          agente Tendências no chat: &quot;rode o briefing desta semana&quot;.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {briefings.map((b) => {
        const achados = comoArray<Achado>(b.achados)
        const fontes = comoArray<Fonte>(b.fontes)
        const expandido = aberto === b.id
        return (
          <div key={b.id} className="admin-panel overflow-hidden">
            <button
              onClick={() => setAberto(expandido ? null : b.id)}
              className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-slate-50/70 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-950">{rotuloSemana(b.semana)}</p>
                {b.resumo && (
                  <p className={cn("mt-1.5 text-sm text-slate-600 leading-relaxed", !expandido && "line-clamp-2")}>
                    {b.resumo}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                  {achados.length} achado{achados.length === 1 ? "" : "s"}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", expandido && "rotate-180")} />
              </div>
            </button>

            {expandido && (
              <div className="border-t border-slate-100 px-6 py-5 space-y-4">
                {achados.map((a, i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="text-sm font-bold text-slate-950">{a.tema ?? `Achado ${i + 1}`}</p>
                      {a.para_quem && (
                        <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", PARA_QUEM_BADGE[a.para_quem] ?? "bg-slate-50 text-slate-600 border-slate-200")}>
                          → {a.para_quem}
                        </span>
                      )}
                    </div>
                    {a.evidencia && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-500">Evidência:</span> {a.evidencia}
                      </p>
                    )}
                    {a.recomendacao && (
                      <p className="mt-1.5 text-sm text-slate-800 leading-relaxed">
                        <span className="font-semibold text-slate-500">Recomendação:</span> {a.recomendacao}
                      </p>
                    )}
                  </div>
                ))}

                {fontes.length > 0 && (
                  <div className="pt-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Fontes</p>
                    <div className="flex flex-wrap gap-2">
                      {fontes.map((f, i) =>
                        f.url ? (
                          <a
                            key={i}
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-800 hover:bg-blue-50 transition-colors max-w-full"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-64">{f.titulo || new URL(f.url).hostname}</span>
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
