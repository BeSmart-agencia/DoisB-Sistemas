"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Compass,
  Pencil,
  Megaphone,
  TrendingUp,
  CalendarDays,
  MessageSquare,
  Send,
  Loader2,
  Trash2,
  Wrench,
} from "lucide-react"

const AGENTES = [
  { id: "estrategista", nome: "Estrategista", papel: "CMO virtual — plano, funil e prioridades", icon: Compass, ativo: true },
  { id: "copywriter", nome: "Copywriter", papel: "Anúncios, LPs, e-mails e WhatsApp", icon: Pencil, ativo: true },
  { id: "trafego", nome: "Gestor de Tráfego", papel: "Meta e Google Ads (Fase 3)", icon: Megaphone, ativo: false },
  { id: "tendencias", nome: "Tendências", papel: "Pesquisa na web e briefings semanais", icon: TrendingUp, ativo: true },
  { id: "social", nome: "Social", papel: "Calendário e roteiros orgânicos", icon: CalendarDays, ativo: true },
  { id: "sdr", nome: "SDR", papel: "Roteamento, scoring e scripts de WhatsApp", icon: MessageSquare, ativo: true },
] as const

type AgenteId = (typeof AGENTES)[number]["id"]

type ChatItem =
  | { kind: "msg"; role: "user" | "assistant"; content: string }
  | { kind: "tool"; name: string }

const TOOL_LABELS: Record<string, string> = {
  search_zweb_kb: "consultando a base de conhecimento ZWeb",
  save_copy: "salvando copy na biblioteca",
  get_top_copies: "buscando copies da biblioteca",
  read_metrics: "lendo métricas de campanhas",
  update_plan: "gravando plano do mês",
  create_task: "registrando tarefa",
  delegate_to_agent: "delegando briefing a outro agente",
  get_lead: "buscando lead no banco",
  score_lead: "gravando score do lead",
  generate_whatsapp_script: "gravando script de WhatsApp",
  update_lead_stage: "atualizando estágio do lead",
  get_calendar: "lendo o calendário editorial",
  create_calendar_item: "gravando item no calendário",
  update_calendar_item: "editando item do calendário",
  delete_calendar_item: "excluindo item do calendário",
  get_trend_briefs: "lendo briefings de tendências",
  save_trend_brief: "salvando briefing de tendências",
  web_search: "pesquisando na web",
}

export function MarketingChat() {
  const [agente, setAgente] = useState<AgenteId>("estrategista")
  const [itens, setItens] = useState<ChatItem[]>([])
  const [input, setInput] = useState("")
  const [carregandoHistorico, setCarregandoHistorico] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const fimRef = useRef<HTMLDivElement>(null)

  const agenteAtual = AGENTES.find((a) => a.id === agente)!

  useEffect(() => {
    let cancelado = false
    setCarregandoHistorico(true)
    fetch(`/api/agents/${agente}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelado) return
        const msgs = (data.messages ?? []) as { role: "user" | "assistant"; content: string }[]
        setItens(msgs.map((m) => ({ kind: "msg", role: m.role, content: m.content })))
      })
      .catch(() => !cancelado && setItens([]))
      .finally(() => !cancelado && setCarregandoHistorico(false))
    return () => {
      cancelado = true
    }
  }, [agente])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [itens, enviando])

  async function enviar() {
    const mensagem = input.trim()
    if (!mensagem || enviando) return
    setInput("")
    setEnviando(true)
    setItens((prev) => [...prev, { kind: "msg", role: "user", content: mensagem }])

    try {
      const res = await fetch(`/api/agents/${agente}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: mensagem }),
      })

      if (!res.ok || !res.body) {
        const erro = await res.json().catch(() => null)
        toast.error(erro?.error ?? "Erro ao falar com o agente.")
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const linhas = buffer.split("\n")
        buffer = linhas.pop() ?? ""

        for (const linha of linhas) {
          if (!linha.trim()) continue
          let evento: { type: string; text?: string; name?: string; message?: string }
          try {
            evento = JSON.parse(linha)
          } catch {
            continue
          }

          if (evento.type === "text" && evento.text) {
            setItens((prev) => {
              const ultimo = prev[prev.length - 1]
              if (ultimo?.kind === "msg" && ultimo.role === "assistant") {
                return [...prev.slice(0, -1), { ...ultimo, content: ultimo.content + evento.text }]
              }
              return [...prev, { kind: "msg", role: "assistant", content: evento.text! }]
            })
          } else if (evento.type === "tool" && evento.name) {
            setItens((prev) => [...prev, { kind: "tool", name: evento.name! }])
          } else if (evento.type === "error") {
            toast.error(evento.message ?? "Erro no agente.")
          }
        }
      }
    } catch {
      toast.error("Erro de conexão com o agente.")
    } finally {
      setEnviando(false)
    }
  }

  async function limparConversa() {
    if (!confirm(`Limpar todo o histórico com o agente ${agenteAtual.nome}?`)) return
    const res = await fetch(`/api/agents/${agente}`, { method: "DELETE" })
    if (res.ok) {
      setItens([])
      toast.success("Conversa limpa.")
    } else {
      toast.error("Erro ao limpar conversa.")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
      {/* Seletor de agentes */}
      <div className="admin-panel p-3 space-y-1">
        {AGENTES.map((a) => (
          <button
            key={a.id}
            onClick={() => a.ativo && setAgente(a.id)}
            disabled={!a.ativo}
            className={cn(
              "w-full flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
              agente === a.id
                ? "bg-blue-50 border border-blue-200"
                : "border border-transparent hover:bg-slate-50",
              !a.ativo && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                agente === a.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              <a.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                {a.nome}
                {!a.ativo && (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
                    em breve
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{a.papel}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="admin-panel flex flex-col h-[calc(100vh-220px)] min-h-[480px]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <agenteAtual.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">{agenteAtual.nome}</p>
              <p className="text-xs text-slate-500">{agenteAtual.papel}</p>
            </div>
          </div>
          {itens.length > 0 && (
            <button
              onClick={limparConversa}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {carregandoHistorico ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <agenteAtual.icon className="h-8 w-8 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">
                Comece uma conversa com o {agenteAtual.nome}.
              </p>
              <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
                {agente === "estrategista"
                  ? 'Ex.: "Monte o plano deste mês com o orçamento de R$ 1.000" ou "Quais as 3 prioridades da semana?"'
                  : agente === "sdr"
                    ? 'Ex.: "Mostre os leads mais recentes" ou "Refaça o score do lead da Transportadora X" — ele busca o lead no banco pelo nome ou empresa.'
                    : agente === "social"
                      ? 'Ex.: "Monte a próxima semana com 3 conteúdos, alternando pilares" — cada roteiro sai pronto para gravar em menos de 30 minutos.'
                      : agente === "tendencias"
                        ? 'Ex.: "Rode o briefing desta semana" — ele pesquisa a web e salva os achados, que viram contexto dos outros agentes. Também roda sozinho toda segunda de manhã.'
                        : 'Ex.: "Escreva um anúncio de Meta para mercados, ângulo retaguarda offline" — ele confirma tudo na base ZWeb.'}
              </p>
            </div>
          ) : (
            itens.map((item, i) =>
              item.kind === "tool" ? (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                  <Wrench className="h-3 w-3" />
                  {TOOL_LABELS[item.name] ?? item.name}...
                </div>
              ) : (
                <div key={i} className={cn("flex", item.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                      item.role === "user"
                        ? "bg-slate-950 text-white"
                        : "bg-slate-50 border border-slate-100 text-slate-800"
                    )}
                  >
                    {item.role === "assistant" ? (
                      <div className="prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{item.content}</p>
                    )}
                  </div>
                </div>
              )
            )
          )}
          {enviando && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              {agenteAtual.nome} trabalhando...
            </div>
          )}
          <div ref={fimRef} />
        </div>

        <div className="border-t border-slate-100 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              enviar()
            }}
            className="flex gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  enviar()
                }
              }}
              rows={2}
              placeholder={`Mensagem para o ${agenteAtual.nome}...`}
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              type="submit"
              disabled={enviando || !input.trim()}
              className="flex h-auto items-center justify-center rounded-xl bg-slate-950 px-4 text-white transition-colors hover:bg-blue-900 disabled:opacity-40"
              aria-label="Enviar"
            >
              {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
