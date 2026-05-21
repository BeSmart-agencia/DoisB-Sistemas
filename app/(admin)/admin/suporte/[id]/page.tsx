"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft, Send, Loader2, MessageSquare, ExternalLink, Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusChamado = "a_atender" | "em_andamento" | "aguardando_cliente" | "resolvido" | "cancelado"
type PrioridadeChamado = "baixa" | "media" | "alta" | "urgente"
type AutorMensagem = "cliente" | "equipe"

interface Mensagem { id: string; autor: AutorMensagem; autor_nome: string; conteudo: string; criado_em: string }
interface Admin { id: string; nome: string }
interface ChamadoDetalhe {
  id: number; assunto: string; descricao: string; email_retorno: string
  cnpj_informado: string; status: StatusChamado; prioridade: PrioridadeChamado
  atendente_id: string | null; criado_em: string
  cliente: { id: string; nome_empresa: string; cnpj: string; telefone: string; email: string; plano: string; status_pagamento: string } | null
  atendente: { id: string; nome: string } | null
}
interface DetalheResponse {
  chamado: ChamadoDetalhe; mensagens: Mensagem[]
  admins: Admin[]; chamadosAnteriores: { id: number; assunto: string; status: StatusChamado; criado_em: string }[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<StatusChamado, string> = {
  a_atender: "A atender", em_andamento: "Em andamento",
  aguardando_cliente: "Aguardando cliente", resolvido: "Resolvido", cancelado: "Cancelado",
}
const STATUS_CLASS: Record<StatusChamado, string> = {
  a_atender: "bg-amber-100 text-amber-800 border-amber-200",
  em_andamento: "bg-blue-100 text-blue-800 border-blue-200",
  aguardando_cliente: "bg-purple-100 text-purple-800 border-purple-200",
  resolvido: "bg-green-100 text-green-800 border-green-200",
  cancelado: "bg-slate-100 text-slate-500 border-slate-200",
}
const PRIO_LABEL: Record<PrioridadeChamado, string> = { baixa: "Baixa", media: "Média", alta: "Alta", urgente: "Urgente" }
const PRIO_CLASS: Record<PrioridadeChamado, string> = {
  baixa: "bg-slate-100 text-slate-600",
  media: "bg-blue-50 text-blue-700",
  alta: "bg-orange-100 text-orange-700",
  urgente: "bg-red-100 text-red-700",
}
const PLANO_LABEL: Record<string, string> = { essencial: "Essencial", standard: "Standard", premium: "Premium" }
const STATUS_PAG_CLASS: Record<string, string> = {
  ativo: "bg-green-100 text-green-800", atrasado: "bg-red-100 text-red-800",
  aguardando: "bg-yellow-100 text-yellow-800", cancelado: "bg-slate-100 text-slate-500",
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
}

function formatCNPJ(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}

function whatsappLink(telefone: string, nomeEmpresa: string, numeroChamado: number) {
  const tel = "55" + telefone.replace(/\D/g, "")
  const msg = encodeURIComponent(`Olá, ${nomeEmpresa}! Aqui é a equipe DoisB Sistemas referente ao chamado #${numeroChamado}.`)
  return `https://wa.me/${tel}?text=${msg}`
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ChamadoDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [resposta, setResposta] = useState("")
  const [statusLocal, setStatusLocal] = useState<StatusChamado | "">("")
  const [prioridadeLocal, setPrioridadeLocal] = useState<PrioridadeChamado | "">("")
  const [atendenteLocal, setAtendenteLocal] = useState<string>("")

  const { data, isLoading } = useQuery<DetalheResponse>({
    queryKey: ["admin", "suporte", id],
    queryFn: () => fetch(`/api/admin/suporte/${id}`).then((r) => r.json()),
    refetchInterval: 30000, // auto-refresh 30s
  })

  // Sincronizar estado local quando dados carregam
  useEffect(() => {
    if (!data?.chamado) return
    if (!statusLocal) setStatusLocal(data.chamado.status)
    if (!prioridadeLocal) setPrioridadeLocal(data.chamado.prioridade)
    if (!atendenteLocal) setAtendenteLocal(data.chamado.atendente_id ?? "nenhum")
  }, [data?.chamado]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll pra última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [data?.mensagens?.length])

  const enviarMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/admin/suporte/${id}/mensagens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo: resposta }),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast.error(res.error); return }
      setResposta("")
      qc.invalidateQueries({ queryKey: ["admin", "suporte", id] })
    },
    onError: () => toast.error("Erro ao enviar resposta"),
  })

  const salvarMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/admin/suporte/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(statusLocal && { status: statusLocal }),
          ...(prioridadeLocal && { prioridade: prioridadeLocal }),
          atendente_id: atendenteLocal === "nenhum" ? null : (atendenteLocal || null),
        }),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast.error(res.error); return }
      toast.success("Chamado atualizado!")
      qc.invalidateQueries({ queryKey: ["admin", "suporte", id] })
      qc.invalidateQueries({ queryKey: ["admin", "suporte"] })
    },
  })

  const chamado = data?.chamado
  const mensagens = data?.mensagens ?? []
  const admins = data?.admins ?? []
  const chamadosAnteriores = data?.chamadosAnteriores ?? []

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </button>
        {isLoading ? <Skeleton className="h-7 w-64" /> : (
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold text-slate-900">
              <span className="text-slate-400 font-mono text-base mr-2">#{chamado?.id}</span>
              {chamado?.assunto}
            </h1>
            {chamado && (
              <>
                <Badge variant="outline" className={`text-xs ${STATUS_CLASS[chamado.status]}`}>
                  {STATUS_LABEL[chamado.status]}
                </Badge>
                <Badge variant="outline" className={`text-xs ${PRIO_CLASS[chamado.prioridade]}`}>
                  {PRIO_LABEL[chamado.prioridade]}
                </Badge>
              </>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : !chamado ? (
        <p className="text-center py-16 text-slate-400">Chamado não encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

          {/* ─── Coluna esquerda: conversa ─────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Thread */}
              <div className="h-[500px] overflow-y-auto p-5 space-y-4">
                {/* Mensagem inicial */}
                <MensagemBubble
                  autor="cliente"
                  autorNome={chamado.cliente?.nome_empresa ?? chamado.cnpj_informado}
                  conteudo={chamado.descricao}
                  data={chamado.criado_em}
                />

                {mensagens.map((m) => (
                  <MensagemBubble
                    key={m.id}
                    autor={m.autor}
                    autorNome={m.autor_nome}
                    conteudo={m.conteudo}
                    data={m.criado_em}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <div className="border-t border-slate-100 p-4 space-y-3">
                <Textarea
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  placeholder="Escreva sua resposta..."
                  className="min-h-[90px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey && resposta.trim()) enviarMutation.mutate()
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">Ctrl+Enter para enviar</p>
                  <Button
                    onClick={() => enviarMutation.mutate()}
                    disabled={!resposta.trim() || enviarMutation.isPending}
                    size="sm"
                    className="bg-blue-700 hover:bg-blue-800 gap-2"
                  >
                    {enviarMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Enviar resposta
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Coluna direita: sidebar ───────────────────────── */}
          <div className="space-y-4">
            {/* Dados do cliente */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Cliente</h3>
              {chamado.cliente ? (
                <>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{chamado.cliente.nome_empresa}</p>
                    <p className="text-xs text-slate-400 font-mono">{formatCNPJ(chamado.cliente.cnpj)}</p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-slate-600">{chamado.cliente.email}</p>
                    <p className="text-slate-600">{chamado.cliente.telefone}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {PLANO_LABEL[chamado.cliente.plano] ?? chamado.cliente.plano}
                    </span>
                    <span className={cn("text-xs px-2 py-0.5 rounded", STATUS_PAG_CLASS[chamado.cliente.status_pagamento] ?? "bg-slate-100")}>
                      {chamado.cliente.status_pagamento}
                    </span>
                  </div>
                  <a href={whatsappLink(chamado.cliente.telefone, chamado.cliente.nome_empresa, chamado.id)} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="w-full gap-2 text-green-700 border-green-200 hover:bg-green-50 mt-1">
                      <Phone className="h-3.5 w-3.5" /> Abrir WhatsApp
                    </Button>
                  </a>
                  <Link href={`/admin/clientes/${chamado.cliente.id}`}>
                    <Button size="sm" variant="ghost" className="w-full gap-2 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" /> Ver ficha do cliente
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="text-sm text-slate-500 space-y-1">
                  <p className="italic">Cliente não cadastrado</p>
                  <p className="font-mono text-xs">{formatCNPJ(chamado.cnpj_informado)}</p>
                  <p>{chamado.email_retorno}</p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Alterar chamado</h3>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-500">Status</p>
                <Select value={statusLocal} onValueChange={(v) => v && setStatusLocal(v as StatusChamado)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_atender">A atender</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="aguardando_cliente">Aguardando cliente</SelectItem>
                    <SelectItem value="resolvido">Resolvido</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-500">Prioridade</p>
                <Select value={prioridadeLocal} onValueChange={(v) => v && setPrioridadeLocal(v as PrioridadeChamado)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-500">Atendente</p>
                <Select value={atendenteLocal} onValueChange={(v) => setAtendenteLocal(v ?? "nenhum")}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Não atribuído" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não atribuído</SelectItem>
                    {admins.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => salvarMutation.mutate()}
                disabled={salvarMutation.isPending}
                size="sm"
                className="w-full bg-blue-700 hover:bg-blue-800"
              >
                {salvarMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Salvar alterações
              </Button>
            </div>

            {/* Chamados anteriores */}
            {chamadosAnteriores.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  Chamados anteriores ({chamadosAnteriores.length})
                </h3>
                <div className="space-y-2">
                  {chamadosAnteriores.map((c) => (
                    <Link key={c.id} href={`/admin/suporte/${c.id}`}>
                      <div className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-slate-700 leading-snug flex-1">{c.assunto}</p>
                          <Badge variant="outline" className={cn("text-[10px] shrink-0", STATUS_CLASS[c.status])}>
                            {STATUS_LABEL[c.status]}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          #{c.id} · {new Date(c.criado_em).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente de mensagem ────────────────────────────────────────────────────

function MensagemBubble({
  autor, autorNome, conteudo, data,
}: { autor: AutorMensagem; autorNome: string; conteudo: string; data: string }) {
  const isEquipe = autor === "equipe"
  return (
    <div className={cn("flex gap-3", isEquipe && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback
          className={cn(
            "text-xs font-semibold",
            isEquipe ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
          )}
        >
          {initials(autorNome)}
        </AvatarFallback>
      </Avatar>
      <div className={cn("max-w-[75%] space-y-1", isEquipe && "items-end flex flex-col")}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-700">{autorNome}</span>
          <span className="text-[11px] text-slate-400">{fmtDate(data)}</span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
            isEquipe
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-slate-100 text-slate-800 rounded-tl-sm"
          )}
        >
          {conteudo}
        </div>
      </div>
    </div>
  )
}
