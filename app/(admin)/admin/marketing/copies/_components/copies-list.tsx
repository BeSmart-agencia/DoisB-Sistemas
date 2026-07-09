"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Check, Copy as CopyIcon, Archive, RotateCcw, Inbox } from "lucide-react"

interface CopyRow {
  id: string
  linha: string
  canal: string
  formato: string | null
  angulo: string | null
  categoria: string | null
  titulo: string | null
  corpo: string
  status: string
  created_at: string
}

const STATUS_META: Record<string, { label: string; badge: string }> = {
  rascunho: { label: "Rascunho", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  aprovada: { label: "Aprovada", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  no_ar: { label: "No ar", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  arquivada: { label: "Arquivada", badge: "bg-slate-100 text-slate-500 border-slate-200" },
}

const LINHA_META: Record<string, string> = {
  zweb: "bg-blue-700 text-white",
  sob_medida: "bg-violet-700 text-white",
}

export function CopiesList({ copies }: { copies: CopyRow[] }) {
  const router = useRouter()
  const [filtroLinha, setFiltroLinha] = useState<string>("todas")
  const [filtroStatus, setFiltroStatus] = useState<string>("todas")
  const [filtroCanal, setFiltroCanal] = useState<string>("todos")
  const [atualizando, setAtualizando] = useState<string | null>(null)

  const canais = useMemo(() => Array.from(new Set(copies.map((c) => c.canal))).sort(), [copies])

  const filtradas = copies.filter(
    (c) =>
      (filtroLinha === "todas" || c.linha === filtroLinha) &&
      (filtroStatus === "todas" || c.status === filtroStatus) &&
      (filtroCanal === "todos" || c.canal === filtroCanal)
  )

  async function mudarStatus(id: string, status: string) {
    setAtualizando(id)
    try {
      const res = await fetch(`/api/admin/copies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success(status === "aprovada" ? "Copy aprovada — entra no repertório dos agentes." : "Status atualizado.")
      router.refresh()
    } catch {
      toast.error("Erro ao atualizar status.")
    } finally {
      setAtualizando(null)
    }
  }

  function copiar(texto: string) {
    navigator.clipboard.writeText(texto)
    toast.success("Copy copiada para a área de transferência.")
  }

  function FiltroPill({
    ativo,
    onClick,
    children,
  }: {
    ativo: boolean
    onClick: () => void
    children: React.ReactNode
  }) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          ativo
            ? "border-blue-700 bg-blue-700 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filtros */}
      <div className="admin-panel p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400 w-14">Linha</span>
          <FiltroPill ativo={filtroLinha === "todas"} onClick={() => setFiltroLinha("todas")}>Todas</FiltroPill>
          <FiltroPill ativo={filtroLinha === "zweb"} onClick={() => setFiltroLinha("zweb")}>ZWeb</FiltroPill>
          <FiltroPill ativo={filtroLinha === "sob_medida"} onClick={() => setFiltroLinha("sob_medida")}>Sob medida</FiltroPill>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400 w-14">Status</span>
          <FiltroPill ativo={filtroStatus === "todas"} onClick={() => setFiltroStatus("todas")}>Todos</FiltroPill>
          {Object.entries(STATUS_META).map(([valor, meta]) => (
            <FiltroPill key={valor} ativo={filtroStatus === valor} onClick={() => setFiltroStatus(valor)}>
              {meta.label}
            </FiltroPill>
          ))}
        </div>
        {canais.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400 w-14">Canal</span>
            <FiltroPill ativo={filtroCanal === "todos"} onClick={() => setFiltroCanal("todos")}>Todos</FiltroPill>
            {canais.map((c) => (
              <FiltroPill key={c} ativo={filtroCanal === c} onClick={() => setFiltroCanal(c)}>
                {c}
              </FiltroPill>
            ))}
          </div>
        )}
      </div>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div className="admin-panel p-14 text-center">
          <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">
            {copies.length === 0
              ? "Nenhuma copy salva ainda. Peça ao Copywriter no chat — cada variação que ele salvar aparece aqui."
              : "Nenhuma copy com esses filtros."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtradas.map((c) => {
            const status = STATUS_META[c.status] ?? STATUS_META.rascunho
            return (
              <div key={c.id} className="admin-panel p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", LINHA_META[c.linha] ?? "bg-slate-700 text-white")}>
                    {c.linha === "sob_medida" ? "Sob medida" : "ZWeb"}
                  </span>
                  <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", status.badge)}>
                    {status.label}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {c.canal}
                    {c.formato ? ` · ${c.formato}` : ""}
                  </span>
                  {c.angulo && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      ângulo: {c.angulo}
                    </span>
                  )}
                  {c.categoria && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {c.categoria}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-slate-400">
                    {new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {c.titulo && <h3 className="text-base font-bold text-slate-950 mb-2">{c.titulo}</h3>}
                <p className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4">
                  {c.corpo}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copiar(c.corpo)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <CopyIcon className="h-3.5 w-3.5" />
                    Copiar texto
                  </button>
                  {c.status === "rascunho" && (
                    <button
                      onClick={() => mudarStatus(c.id, "aprovada")}
                      disabled={atualizando === c.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Aprovar
                    </button>
                  )}
                  {(c.status === "rascunho" || c.status === "aprovada") && (
                    <button
                      onClick={() => mudarStatus(c.id, "arquivada")}
                      disabled={atualizando === c.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Arquivar
                    </button>
                  )}
                  {c.status === "arquivada" && (
                    <button
                      onClick={() => mudarStatus(c.id, "rascunho")}
                      disabled={atualizando === c.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restaurar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
