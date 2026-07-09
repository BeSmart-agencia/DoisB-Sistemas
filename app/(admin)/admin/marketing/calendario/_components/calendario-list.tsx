"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  CalendarDays,
  X,
  Copy as CopyIcon,
  Clapperboard,
  Hash,
  MessageSquareText,
} from "lucide-react"

interface ItemRow {
  id: string
  linha: string
  data_prevista: string | null
  pilar: string
  formato: string | null
  plataforma: string | null
  roteiro: string | null
  copy_legenda: string | null
  hashtags: string | null
  status: string
  copy_id: string | null
}

const STATUS: { valor: string; label: string; badge: string }[] = [
  { valor: "ideia", label: "Ideia", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { valor: "roteiro_pronto", label: "Roteiro pronto", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  { valor: "gravado", label: "Gravado", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  { valor: "publicado", label: "Publicado", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
]

const LINHA_BADGE: Record<string, string> = {
  zweb: "bg-blue-700 text-white",
  sob_medida: "bg-violet-700 text-white",
}

function dataLocal(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

function inicioDaSemana(iso: string): string {
  const d = dataLocal(iso)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // segunda-feira
  return d.toISOString().slice(0, 10)
}

function rotuloSemana(segundaIso: string): string {
  const seg = dataLocal(segundaIso)
  const dom = new Date(seg)
  dom.setDate(dom.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  return `Semana de ${fmt(seg)} a ${fmt(dom)}`
}

function diaCurto(iso: string): string {
  return dataLocal(iso).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })
}

export function CalendarioList({ itens }: { itens: ItemRow[] }) {
  const router = useRouter()
  const [selecionado, setSelecionado] = useState<ItemRow | null>(null)
  const [salvando, setSalvando] = useState<string | null>(null)

  // Agrupa por semana (segunda a domingo); itens sem data ficam no fim.
  const grupos = new Map<string, ItemRow[]>()
  for (const item of itens) {
    const chave = item.data_prevista ? inicioDaSemana(item.data_prevista) : "sem_data"
    grupos.set(chave, [...(grupos.get(chave) ?? []), item])
  }
  const chavesOrdenadas = Array.from(grupos.keys()).sort((a, b) =>
    a === "sem_data" ? 1 : b === "sem_data" ? -1 : a.localeCompare(b)
  )

  async function mudarStatus(item: ItemRow, status: string) {
    setSalvando(item.id)
    try {
      const res = await fetch(`/api/admin/calendario/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      if (selecionado?.id === item.id) setSelecionado({ ...item, status })
      toast.success(`Status: ${STATUS.find((s) => s.valor === status)?.label ?? status}.`)
      router.refresh()
    } catch {
      toast.error("Erro ao atualizar o status.")
    } finally {
      setSalvando(null)
    }
  }

  function copiar(rotulo: string, texto: string) {
    navigator.clipboard.writeText(texto)
    toast.success(`${rotulo} copiado para a área de transferência.`)
  }

  const statusMeta = (valor: string) => STATUS.find((s) => s.valor === valor)

  if (itens.length === 0) {
    return (
      <div className="admin-panel p-14 text-center">
        <CalendarDays className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">
          Calendário vazio. Peça ao agente Social no chat — ex.: &quot;monte a próxima semana
          com 3 conteúdos&quot; — e cada item salvo aparece aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {chavesOrdenadas.map((chave) => (
        <div key={chave} className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 px-1">
            {chave === "sem_data" ? "Sem data definida" : rotuloSemana(chave)}
          </h2>
          <div className="space-y-3">
            {grupos.get(chave)!.map((item) => {
              const st = statusMeta(item.status)
              return (
                <div
                  key={item.id}
                  onClick={() => setSelecionado(item)}
                  className="admin-panel p-5 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {item.data_prevista && (
                      <span className="text-xs font-bold text-slate-700 capitalize w-24 shrink-0">
                        {diaCurto(item.data_prevista)}
                      </span>
                    )}
                    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", LINHA_BADGE[item.linha] ?? "bg-slate-700 text-white")}>
                      {item.linha === "sob_medida" ? "Sob medida" : "ZWeb"}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {item.pilar}
                    </span>
                    {item.formato && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {item.formato}
                      </span>
                    )}
                    {item.plataforma && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {item.plataforma}
                      </span>
                    )}
                    <select
                      value={item.status}
                      disabled={salvando === item.id}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => mudarStatus(item, e.target.value)}
                      className={cn(
                        "ml-auto rounded-full border px-2.5 py-1 text-[11px] font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50",
                        st?.badge ?? "bg-slate-50 text-slate-600 border-slate-200"
                      )}
                    >
                      {STATUS.map((s) => (
                        <option key={s.valor} value={s.valor}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  {item.copy_legenda && (
                    <p className="mt-2.5 text-sm text-slate-600 line-clamp-1">{item.copy_legenda}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Detalhe */}
      {selecionado && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" onClick={() => setSelecionado(null)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4 z-10">
              <div>
                <p className="text-lg font-bold text-slate-950 capitalize">
                  {selecionado.pilar}
                  {selecionado.formato ? ` · ${selecionado.formato}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide", LINHA_BADGE[selecionado.linha] ?? "bg-slate-700 text-white")}>
                    {selecionado.linha === "sob_medida" ? "Sob medida" : "ZWeb"}
                  </span>
                  {selecionado.plataforma && <span className="text-xs text-slate-500">{selecionado.plataforma}</span>}
                  {selecionado.data_prevista && (
                    <span className="text-xs text-slate-400 capitalize">{diaCurto(selecionado.data_prevista)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelecionado(null)}
                className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Status */}
              <div className="flex flex-wrap gap-2">
                {STATUS.map((s) => (
                  <button
                    key={s.valor}
                    disabled={salvando === selecionado.id || selecionado.status === s.valor}
                    onClick={() => mudarStatus(selecionado, s.valor)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-default",
                      selecionado.status === s.valor
                        ? cn(s.badge, "ring-2 ring-offset-1 ring-blue-500/40")
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Roteiro */}
              {selecionado.roteiro && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                      <Clapperboard className="h-3.5 w-3.5" /> Roteiro
                    </p>
                    <button
                      onClick={() => copiar("Roteiro", selecionado.roteiro!)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <CopyIcon className="h-3 w-3" /> Copiar
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4">
                    {selecionado.roteiro}
                  </p>
                </div>
              )}

              {/* Legenda */}
              {selecionado.copy_legenda && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                      <MessageSquareText className="h-3.5 w-3.5" /> Legenda
                    </p>
                    <button
                      onClick={() => copiar("Legenda", selecionado.copy_legenda!)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <CopyIcon className="h-3 w-3" /> Copiar
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4">
                    {selecionado.copy_legenda}
                  </p>
                </div>
              )}

              {/* Hashtags */}
              {selecionado.hashtags && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" /> Hashtags
                    </p>
                    <button
                      onClick={() => copiar("Hashtags", selecionado.hashtags!)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <CopyIcon className="h-3 w-3" /> Copiar
                    </button>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed bg-blue-50/60 border border-blue-100 rounded-xl p-4">
                    {selecionado.hashtags}
                  </p>
                </div>
              )}

              {!selecionado.roteiro && !selecionado.copy_legenda && (
                <p className="text-sm text-slate-400 text-center py-6">
                  Item ainda sem roteiro — peça ao agente Social para desenvolver esta pauta.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
