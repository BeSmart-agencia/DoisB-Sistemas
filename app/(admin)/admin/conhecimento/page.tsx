"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { MessageSquare, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Brain, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Conversa {
  id: string
  sessao_id: string
  pergunta: string
  resposta: string
  sem_resposta: boolean
  chunks_ids: string[]
  criado_em: string
}

interface SemResposta {
  id: string
  pergunta: string
  criado_em: string
}

interface Analytics {
  totalConversas: number
  semResposta: number
  conversas: Conversa[]
  semRespostaLista: SemResposta[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function ConversaCard({ conversa }: { conversa: Conversa }) {
  const [aberta, setAberta] = useState(false)

  return (
    <div
      className={cn(
        "admin-panel transition-all",
        conversa.sem_resposta && "border-l-4 border-l-amber-400"
      )}
    >
      <button
        onClick={() => setAberta((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50/50 rounded-xl transition-colors"
      >
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          conversa.sem_resposta ? "bg-amber-100" : "bg-blue-50"
        )}>
          {conversa.sem_resposta
            ? <AlertCircle className="h-4 w-4 text-amber-600" />
            : <CheckCircle className="h-4 w-4 text-blue-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 line-clamp-2 text-left">
            {conversa.pergunta}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-xs text-slate-400">{formatDate(conversa.criado_em)}</span>
            {conversa.sem_resposta
              ? <Badge className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 rounded-full px-2">Sem resposta</Badge>
              : <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full px-2">
                  {conversa.chunks_ids?.length ?? 0} fontes usadas
                </Badge>
            }
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {aberta
            ? <ChevronUp className="h-4 w-4 text-slate-400" />
            : <ChevronDown className="h-4 w-4 text-slate-400" />
          }
        </div>
      </button>

      {aberta && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3 mx-4">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
              Pergunta
            </p>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
              {conversa.pergunta}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
              Resposta do assistente
            </p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap bg-blue-50/50 rounded-lg px-3 py-2 leading-relaxed max-h-60 overflow-y-auto">
              {conversa.resposta || "—"}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">sessão: {conversa.sessao_id}</p>
        </div>
      )}
    </div>
  )
}

export default function ConhecimentoPage() {
  const [busca, setBusca] = useState("")
  const [aba, setAba] = useState<"todas" | "sem_resposta">("todas")

  const { data, isLoading } = useQuery<Analytics>({
    queryKey: ["admin", "chat"],
    queryFn: () => fetch("/api/admin/chat").then((r) => r.json()),
    refetchInterval: 30_000,
  })

  const conversasFiltradas = (aba === "sem_resposta" ? data?.semRespostaLista?.map(s => ({
    id: s.id,
    sessao_id: "",
    pergunta: s.pergunta,
    resposta: "",
    sem_resposta: true,
    chunks_ids: [],
    criado_em: s.criado_em,
  })) : data?.conversas ?? [])?.filter((c) =>
    busca === "" || c.pergunta.toLowerCase().includes(busca.toLowerCase())
  ) ?? []

  const conversasCompletas = aba === "sem_resposta"
    ? conversasFiltradas.map((c) => {
        const completa = data?.conversas.find((cv) => cv.id === c.id)
        return completa ?? c
      })
    : conversasFiltradas

  const taxaSemResposta = data && data.totalConversas > 0
    ? ((data.semResposta / data.totalConversas) * 100).toFixed(0)
    : "0"

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="admin-panel-strong p-6">
        <span className="section-kicker">
          <Brain className="h-3.5 w-3.5" />
          Base de conhecimento RAG
        </span>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Assistente IA</h1>
            <p className="text-slate-500 text-sm mt-1">
              Analytics do chat com base de conhecimento vetorizada (ZWeb PDFs).
            </p>
          </div>
          <a
            href="/chat-suporte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-700 hover:underline underline-offset-2"
          >
            Abrir chat público →
          </a>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total de conversas",
            value: isLoading ? null : data?.totalConversas ?? 0,
            icon: MessageSquare,
            bg: "bg-blue-50", color: "text-blue-600",
            accent: "border-l-blue-400",
            sub: "todas as sessões",
          },
          {
            label: "Sem resposta",
            value: isLoading ? null : data?.semResposta ?? 0,
            icon: AlertCircle,
            bg: "bg-amber-50", color: "text-amber-600",
            accent: "border-l-amber-400",
            sub: "base de conhecimento não cobriu",
          },
          {
            label: "Taxa de cobertura",
            value: isLoading ? null : `${100 - Number(taxaSemResposta)}%`,
            icon: CheckCircle,
            bg: "bg-emerald-50", color: "text-emerald-600",
            accent: "border-l-emerald-400",
            sub: "perguntas respondidas com sucesso",
          },
        ].map((card) => (
          <div key={card.label} className={cn("admin-panel p-5 border-l-4", card.accent)}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                {card.label}
              </p>
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", card.bg)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </div>
            {card.value === null
              ? <Skeleton className="h-8 w-20" />
              : <p className="text-2xl font-black tracking-tight text-slate-950">{card.value}</p>
            }
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Perguntas sem resposta — destaque */}
      {(data?.semResposta ?? 0) > 0 && (
        <div className="admin-panel border-l-4 border-l-amber-400 p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lacunas na base de conhecimento
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Estas perguntas não foram cobertas pelos PDFs. Adicione documentos sobre esses tópicos.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {isLoading
              ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)
              : data?.semRespostaLista.slice(0, 8).map((s) => (
                  <div key={s.id} className="flex items-start gap-2 bg-amber-50/70 rounded-lg px-3 py-2.5">
                    <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                    <span className="text-sm text-slate-800">{s.pergunta}</span>
                    <span className="ml-auto text-xs text-slate-400 shrink-0 mt-0.5">
                      {formatDate(s.criado_em)}
                    </span>
                  </div>
                ))
            }
          </div>
        </div>
      )}

      {/* Histórico de conversas */}
      <div className="admin-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Histórico de conversas</h2>
          </div>

          {/* Abas */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
            {([
              { key: "todas", label: "Todas" },
              { key: "sem_resposta", label: "Sem resposta" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setAba(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                  aba === tab.key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pergunta..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 w-44"
            />
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
          ) : conversasCompletas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {busca ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
              </p>
              {!busca && (
                <p className="text-slate-400 text-xs">
                  As conversas aparecerão aqui quando alguém usar o chat
                </p>
              )}
            </div>
          ) : (
            conversasCompletas.map((conversa) => (
              <ConversaCard key={conversa.id} conversa={conversa as Conversa} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
