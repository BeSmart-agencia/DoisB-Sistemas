"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  ArrowLeft, MapPin, Phone, Star, MessageCircle, Loader2,
  Save, Trash2, UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { aplicarVariaveis, templateParaStatus, proximoStatus, TEMPLATES } from "@/lib/templates/whatsapp"

type StatusLead = "a_enviar" | "1_msg" | "2_msg" | "3_msg" | "interessado" | "em_negociacao" | "fechado" | "perdido" | "sem_resposta"

interface Lead {
  id: string
  google_place_id: string | null
  nome: string
  segmento: string | null
  cidade: string | null
  estado: string | null
  endereco: string | null
  telefone: string | null
  rating: number | null
  status: StatusLead
  observacoes: string | null
  ultima_interacao: string | null
  responsavel_id: string | null
  responsavel: { id: string; nome: string } | null
  created_at: string
}

interface Interacao {
  id: string
  tipo: string
  descricao: string
  admin_nome: string | null
  created_at: string
}

const STATUS_LABEL: Record<StatusLead, string> = {
  a_enviar: "A enviar", "1_msg": "1ª msg", "2_msg": "2ª msg", "3_msg": "3ª msg",
  interessado: "Interessado", em_negociacao: "Em negociação",
  fechado: "Fechado", perdido: "Perdido", sem_resposta: "Sem resposta",
}
const STATUS_CLASS: Record<StatusLead, string> = {
  a_enviar: "bg-slate-100 text-slate-600 border-slate-200",
  "1_msg": "bg-blue-100 text-blue-700 border-blue-200",
  "2_msg": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "3_msg": "bg-violet-100 text-violet-700 border-violet-200",
  interessado: "bg-amber-100 text-amber-700 border-amber-200",
  em_negociacao: "bg-orange-100 text-orange-700 border-orange-200",
  fechado: "bg-green-100 text-green-700 border-green-200",
  perdido: "bg-red-100 text-red-700 border-red-200",
  sem_resposta: "bg-slate-100 text-slate-400 border-slate-200",
}
const TIPO_ICON: Record<string, string> = {
  whatsapp: "💬", nota: "📝", status: "🔄",
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })
}

// ─── WhatsApp Modal ───────────────────────────────────────────────────────────
function WhatsAppModal({ lead, onClose, onConfirm }: {
  lead: Lead | null
  onClose: () => void
  onConfirm: (mensagem: string, templateId: number | null) => Promise<void>
}) {
  const [mensagem, setMensagem] = useState("")
  const [confirmando, setConfirmando] = useState(false)
  const [templateId, setTemplateId] = useState<number | null>(null)

  useEffect(() => {
    if (!lead) return
    const t = templateParaStatus(lead.status)
    if (t) {
      setTemplateId(t.id)
      setMensagem(aplicarVariaveis(t.texto, {
        Nome: lead.nome.split(" ")[0] ?? lead.nome,
        segmento: lead.segmento ?? "empresa",
        cidade: lead.cidade ?? "sua cidade",
      }))
    } else {
      setTemplateId(null)
      setMensagem("")
    }
  }, [lead?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!lead) return null

  const telefone = (lead.telefone ?? "").replace(/\D/g, "")
  const waUrl = telefone ? `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}` : null

  async function handleConfirm() {
    setConfirmando(true)
    await onConfirm(mensagem, templateId)
    setConfirmando(false)
    onClose()
  }

  return (
    <Dialog open={!!lead} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Select
            value={templateId?.toString() ?? "custom"}
            onValueChange={(v) => {
              if (!v || v === "custom") { setTemplateId(null); return }
              const t = TEMPLATES.find((t) => t.id === parseInt(v))
              if (!t) return
              setTemplateId(t.id)
              setMensagem(aplicarVariaveis(t.texto, {
                Nome: lead.nome.split(" ")[0] ?? lead.nome,
                segmento: lead.segmento ?? "empresa",
                cidade: lead.cidade ?? "sua cidade",
              }))
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecionar template" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>{t.nome}</SelectItem>
              ))}
              <SelectItem value="custom">Mensagem personalizada</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="min-h-[160px] text-sm resize-none"
            placeholder="Digite a mensagem..."
          />
        </div>
        {!telefone && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Nenhum telefone cadastrado para este lead.
          </p>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} size="sm">Cancelar</Button>
          {waUrl && (
            <Button variant="outline" size="sm" onClick={() => window.open(waUrl, "_blank")}
              className="gap-2 text-green-700 border-green-300 hover:bg-green-50">
              <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
            </Button>
          )}
          <Button size="sm" disabled={confirmando} onClick={handleConfirm}
            className="bg-blue-800 hover:bg-blue-900 text-white gap-2">
            {confirmando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Confirmar envio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeadDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [waOpen, setWaOpen] = useState(false)
  const [deletando, setDeletando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [nota, setNota] = useState("")
  const [enviandoNota, setEnviandoNota] = useState(false)

  // Editable fields
  const [segmento, setSegmento] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [telefone, setTelefone] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [status, setStatus] = useState<StatusLead>("a_enviar")
  const [responsavelId, setResponsavelId] = useState("")

  const { data, isLoading, refetch } = useQuery<{ lead: Lead; interacoes: Interacao[]; admins: { id: string; nome: string }[] }>({
    queryKey: ["admin", "lead", id],
    queryFn: () => fetch(`/api/admin/leads/${id}`).then((r) => r.json()),
  })

  const lead = data?.lead
  const interacoes = data?.interacoes ?? []
  const admins = data?.admins ?? []

  useEffect(() => {
    if (!lead) return
    setSegmento(lead.segmento ?? "")
    setCidade(lead.cidade ?? "")
    setEstado(lead.estado ?? "")
    setTelefone(lead.telefone ?? "")
    setObservacoes(lead.observacoes ?? "")
    setStatus(lead.status)
    setResponsavelId(lead.responsavel_id ?? "")
  }, [lead?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function salvar() {
    setSalvando(true)
    const statusAnterior = lead?.status
    const body: Record<string, unknown> = { segmento, cidade, estado, telefone, observacoes, status }
    if (responsavelId) body.responsavel_id = responsavelId
    if (status !== statusAnterior) {
      body.interacao = { tipo: "status", descricao: `Status alterado para "${STATUS_LABEL[status]}"` }
    }
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    setSalvando(false)
    if (res.ok) { toast.success("Salvo"); refetch() }
    else toast.error("Erro ao salvar")
  }

  async function adicionarNota() {
    if (!nota.trim()) return
    setEnviandoNota(true)
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interacao: { tipo: "nota", descricao: nota.trim() } }),
    })
    setNota("")
    setEnviandoNota(false)
    refetch()
  }

  async function deletar() {
    if (!confirm("Excluir este lead? Esta ação não pode ser desfeita.")) return
    setDeletando(true)
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" })
    queryClient.invalidateQueries({ queryKey: ["admin", "leads"] })
    router.push("/admin/leads/lista")
  }

  async function handleWhatsAppConfirm(mensagem: string, tplId: number | null) {
    const proximo = proximoStatus(status)
    const body: Record<string, unknown> = {
      interacao: {
        tipo: "whatsapp",
        descricao: `Template ${tplId ?? "personalizado"} enviado: "${mensagem.slice(0, 100)}${mensagem.length > 100 ? "…" : ""}"`,
      },
    }
    if (proximo) { body.status = proximo; setStatus(proximo as StatusLead) }
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    refetch()
    toast.success("Envio confirmado!")
  }

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  )

  if (!lead) return <p className="text-slate-500">Lead não encontrado</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/admin/leads/lista">
          <Button variant="outline" size="sm" className="gap-1.5 h-8 mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 truncate">{lead.nome}</h1>
            <Badge variant="outline" className={cn("text-xs", STATUS_CLASS[lead.status])}>
              {STATUS_LABEL[lead.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
            {lead.endereco && (
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lead.endereco}</span>
            )}
            {lead.rating != null && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />{lead.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm" variant="outline"
            onClick={() => setWaOpen(true)}
            className="gap-2 text-green-700 border-green-300 hover:bg-green-50"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Link href="/cadastro" target="_blank">
            <Button size="sm" variant="outline" className="gap-2">
              <UserPlus className="h-4 w-4" /> Converter em cliente
            </Button>
          </Link>
          <Button
            size="sm" variant="ghost" onClick={deletar} disabled={deletando}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            {deletando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: editable fields */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-slate-900">Dados do lead</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Segmento">
                <Input value={segmento} onChange={(e) => setSegmento(e.target.value)} placeholder="padaria, oficina..." />
              </Field>
              <Field label="Telefone">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="pl-9" placeholder="(51) 99999-9999" />
                </div>
              </Field>
              <Field label="Cidade">
                <Input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Porto Alegre" />
              </Field>
              <Field label="Estado">
                <Input value={estado} onChange={(e) => setEstado(e.target.value.toUpperCase())} placeholder="RS" maxLength={2} />
              </Field>
              <Field label="Status">
                <Select value={status} onValueChange={(v) => v && setStatus(v as StatusLead)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(STATUS_LABEL) as [StatusLead, string][]).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Responsável">
                <Select value={responsavelId || "nenhum"} onValueChange={(v) => setResponsavelId(!v || v === "nenhum" ? "" : v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Não atribuído" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Não atribuído</SelectItem>
                    {admins.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Observações">
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Anotações sobre este lead..."
                className="min-h-[100px] resize-none text-sm"
              />
            </Field>
            <Button onClick={salvar} disabled={salvando} className="gap-2 bg-blue-800 hover:bg-blue-900 text-white">
              {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar alterações
            </Button>
          </div>
        </div>

        {/* Right: history */}
        <div className="space-y-4">
          {/* Add note */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <h2 className="font-semibold text-slate-900 text-sm">Adicionar nota</h2>
            <Textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Escreva uma observação..."
              className="min-h-[80px] resize-none text-sm"
              onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) adicionarNota() }}
            />
            <Button
              size="sm" onClick={adicionarNota} disabled={enviandoNota || !nota.trim()}
              className="w-full gap-2 bg-slate-800 hover:bg-slate-900 text-white"
            >
              {enviandoNota ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Salvar nota
            </Button>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900 text-sm">Histórico</h2>
            </div>
            {interacoes.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Nenhuma interação registrada</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                {interacoes.map((item) => (
                  <div key={item.id} className="px-4 py-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        {TIPO_ICON[item.tipo] ?? "📋"} {item.admin_nome ?? "Sistema"}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">{fmtDate(item.created_at)}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.descricao}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <WhatsAppModal
        lead={waOpen ? lead : null}
        onClose={() => setWaOpen(false)}
        onConfirm={handleWhatsAppConfirm}
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-700 font-medium text-sm">{label}</Label>
      {children}
    </div>
  )
}
