"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { linkWhatsApp } from "@/lib/emails/templates/interna-lead-marketing"
import {
  Inbox,
  X,
  MessageCircle,
  Copy as CopyIcon,
  Info,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Building2,
  Users,
} from "lucide-react"

interface LeadRow {
  id: string
  nome: string | null
  telefone: string | null
  email: string | null
  empresa: string | null
  segmento: string | null
  cidade: string | null
  origem: string | null
  linha: string
  score: number | null
  score_motivo: string | null
  estagio: string
  script_whatsapp: string | null
  notas: unknown
  created_at: string
}

const ESTAGIOS: { valor: string; label: string; badge: string }[] = [
  { valor: "novo", label: "Novo", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  { valor: "contatado", label: "Contatado", badge: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { valor: "demo", label: "Diagnóstico/demo", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  { valor: "proposta", label: "Proposta", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { valor: "fechado", label: "Fechado", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { valor: "perdido", label: "Perdido", badge: "bg-slate-100 text-slate-500 border-slate-200" },
]

const LINHA_BADGE: Record<string, string> = {
  zweb: "bg-blue-700 text-white",
  sob_medida: "bg-violet-700 text-white",
}

function notasCampo(notas: unknown, campo: string): string | null {
  if (notas && typeof notas === "object" && campo in notas) {
    const valor = (notas as Record<string, unknown>)[campo]
    return valor == null ? null : String(valor)
  }
  return null
}

function scoreCor(score: number): string {
  if (score >= 70) return "text-emerald-700 bg-emerald-50 border-emerald-200"
  if (score >= 40) return "text-amber-700 bg-amber-50 border-amber-200"
  return "text-slate-500 bg-slate-50 border-slate-200"
}

function dataCurta(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function LeadsList({ leads }: { leads: LeadRow[] }) {
  const router = useRouter()
  const [filtroLinha, setFiltroLinha] = useState("todas")
  const [filtroEstagio, setFiltroEstagio] = useState("todos")
  const [selecionado, setSelecionado] = useState<LeadRow | null>(null)
  const [salvandoEstagio, setSalvandoEstagio] = useState(false)

  const filtrados = leads.filter(
    (l) =>
      (filtroLinha === "todas" || l.linha === filtroLinha) &&
      (filtroEstagio === "todos" || l.estagio === filtroEstagio)
  )

  async function mudarEstagio(lead: LeadRow, estagio: string) {
    setSalvandoEstagio(true)
    try {
      const res = await fetch(`/api/admin/marketing-leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estagio }),
      })
      if (!res.ok) throw new Error()
      setSelecionado({ ...lead, estagio })
      toast.success(`Estágio atualizado para ${ESTAGIOS.find((e) => e.valor === estagio)?.label ?? estagio}.`)
      router.refresh()
    } catch {
      toast.error("Erro ao atualizar o estágio.")
    } finally {
      setSalvandoEstagio(false)
    }
  }

  function copiarScript(script: string) {
    navigator.clipboard.writeText(script)
    toast.success("Script copiado para a área de transferência.")
  }

  function FiltroPill({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          ativo ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        )}
      >
        {children}
      </button>
    )
  }

  const estagioMeta = (valor: string) => ESTAGIOS.find((e) => e.valor === valor)

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
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400 w-14">Estágio</span>
          <FiltroPill ativo={filtroEstagio === "todos"} onClick={() => setFiltroEstagio("todos")}>Todos</FiltroPill>
          {ESTAGIOS.map((e) => (
            <FiltroPill key={e.valor} ativo={filtroEstagio === e.valor} onClick={() => setFiltroEstagio(e.valor)}>
              {e.label}
            </FiltroPill>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="admin-panel p-14 text-center">
          <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">
            {leads.length === 0
              ? "Nenhum lead de marketing ainda. Eles chegam pelo form do site e pelos anúncios — e o SDR qualifica na entrada."
              : "Nenhum lead com esses filtros."}
          </p>
        </div>
      ) : (
        <div className="admin-panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-400">Lead</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-400">Linha</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-400 hidden md:table-cell">Origem</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-400">Score</th>
                <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-400">Estágio</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-400 hidden sm:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((lead) => {
                const est = estagioMeta(lead.estagio)
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelecionado(lead)}
                    className="border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{lead.nome ?? "—"}</p>
                      <p className="text-xs text-slate-500">{lead.empresa ?? "—"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap", LINHA_BADGE[lead.linha] ?? "bg-slate-700 text-white")}>
                        {lead.linha === "sob_medida" ? "Sob medida" : "ZWeb"}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-500 font-mono">{lead.origem ?? "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      {lead.score !== null ? (
                        <span
                          title={lead.score_motivo ?? undefined}
                          className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold", scoreCor(lead.score))}
                        >
                          {lead.score}
                          {lead.score_motivo && <Info className="h-3 w-3 opacity-60" />}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap", est?.badge ?? "bg-slate-50 text-slate-600 border-slate-200")}>
                        {est?.label ?? lead.estagio}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs text-slate-400 whitespace-nowrap">{dataCurta(lead.created_at)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Painel de detalhe */}
      {selecionado && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" onClick={() => setSelecionado(null)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4 z-10">
              <div>
                <p className="text-lg font-bold text-slate-950">{selecionado.nome ?? "Lead sem nome"}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide", LINHA_BADGE[selecionado.linha] ?? "bg-slate-700 text-white")}>
                    {selecionado.linha === "sob_medida" ? "Sob medida" : "ZWeb"}
                  </span>
                  <span className="text-xs text-slate-400">{dataCurta(selecionado.created_at)}</span>
                  <span className="text-xs text-slate-400 font-mono">{selecionado.origem}</span>
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
              {/* Score */}
              {selecionado.score !== null && (
                <div className={cn("rounded-2xl border p-4", scoreCor(selecionado.score))}>
                  <p className="text-2xl font-black">Score {selecionado.score}/100</p>
                  {selecionado.score_motivo && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{selecionado.score_motivo}</p>
                  )}
                </div>
              )}

              {/* Dados */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Dados</p>
                <div className="grid grid-cols-1 gap-2 text-sm text-slate-800">
                  <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400 shrink-0" />{selecionado.empresa ?? "—"}{selecionado.segmento ? ` · ${selecionado.segmento}` : ""}</p>
                  {notasCampo(selecionado.notas, "tamanho_equipe") && (
                    <p className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400 shrink-0" />{notasCampo(selecionado.notas, "tamanho_equipe")}</p>
                  )}
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400 shrink-0" />{selecionado.telefone ?? "sem telefone"}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400 shrink-0" />{selecionado.email ?? "sem e-mail"}</p>
                  {selecionado.cidade && (
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400 shrink-0" />{selecionado.cidade}</p>
                  )}
                </div>
              </div>

              {/* Relato */}
              {notasCampo(selecionado.notas, "processo") && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">O que o lead contou</p>
                  <p className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4">
                    {notasCampo(selecionado.notas, "processo")}
                  </p>
                </div>
              )}

              {/* Script do SDR */}
              {selecionado.script_whatsapp && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Script do SDR</p>
                  <p className="whitespace-pre-wrap text-sm text-sky-950 leading-relaxed bg-sky-50 border border-sky-100 rounded-xl p-4">
                    {selecionado.script_whatsapp}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selecionado.telefone && (
                      <a
                        href={linkWhatsApp(selecionado.telefone, selecionado.script_whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Abrir WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => copiarScript(selecionado.script_whatsapp!)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <CopyIcon className="h-3.5 w-3.5" />
                      Copiar script
                    </button>
                  </div>
                  {!selecionado.telefone && (
                    <p className="text-xs text-amber-700">Lead sem telefone — copie o script e envie manualmente quando conseguir o contato.</p>
                  )}
                </div>
              )}

              {/* Estágio */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-2">
                  Estágio no pipeline
                  {salvandoEstagio && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ESTAGIOS.map((e) => (
                    <button
                      key={e.valor}
                      disabled={salvandoEstagio || selecionado.estagio === e.valor}
                      onClick={() => mudarEstagio(selecionado, e.valor)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-default",
                        selecionado.estagio === e.valor
                          ? cn(e.badge, "ring-2 ring-offset-1 ring-blue-500/40")
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                      )}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
