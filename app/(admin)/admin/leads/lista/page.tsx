"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  useDraggable, useDroppable, closestCenter,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { toast } from "sonner"
import {
  GripVertical, Phone, MapPin, ExternalLink, Loader2, MessageCircle,
  Search, X, Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { aplicarVariaveis, templateParaStatus, proximoStatus } from "@/lib/templates/whatsapp"

type StatusLead = "a_enviar" | "1_msg" | "2_msg" | "3_msg" | "interessado" | "em_negociacao" | "fechado" | "perdido" | "sem_resposta"

interface Lead {
  id: string
  nome: string
  segmento: string | null
  cidade: string | null
  estado: string | null
  telefone: string | null
  rating: number | null
  status: StatusLead
  ultima_interacao: string | null
  created_at: string
}

const COLUNAS: { status: StatusLead; label: string; cor: string; corBg: string; corBorda: string }[] = [
  { status: "a_enviar",     label: "A enviar",       cor: "text-slate-600",  corBg: "bg-slate-100",   corBorda: "border-slate-200" },
  { status: "1_msg",        label: "1ª msg",          cor: "text-blue-600",   corBg: "bg-blue-50",     corBorda: "border-blue-200" },
  { status: "2_msg",        label: "2ª msg",          cor: "text-indigo-600", corBg: "bg-indigo-50",   corBorda: "border-indigo-200" },
  { status: "3_msg",        label: "3ª msg",          cor: "text-violet-600", corBg: "bg-violet-50",   corBorda: "border-violet-200" },
  { status: "interessado",  label: "Interessado",     cor: "text-amber-600",  corBg: "bg-amber-50",    corBorda: "border-amber-200" },
  { status: "em_negociacao",label: "Em negociação",   cor: "text-orange-600", corBg: "bg-orange-50",   corBorda: "border-orange-200" },
  { status: "fechado",      label: "Fechado",         cor: "text-green-600",  corBg: "bg-green-50",    corBorda: "border-green-200" },
  { status: "perdido",      label: "Perdido",         cor: "text-red-600",    corBg: "bg-red-50",      corBorda: "border-red-200" },
  { status: "sem_resposta", label: "Sem resposta",    cor: "text-slate-400",  corBg: "bg-slate-50",    corBorda: "border-slate-200" },
]

// ─── WhatsApp Modal ───────────────────────────────────────────────────────────
function WhatsAppModal({
  lead, onClose, onConfirm,
}: {
  lead: Lead | null
  onClose: () => void
  onConfirm: (lead: Lead, mensagem: string, templateId: number | null) => Promise<void>
}) {
  const template = lead ? templateParaStatus(lead.status) : null
  const [mensagem, setMensagem] = useState("")
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    if (!lead) return
    const t = templateParaStatus(lead.status)
    if (t) {
      const vars = {
        Nome: lead.nome.split(" ")[0] ?? lead.nome,
        segmento: lead.segmento ?? "empresa",
        cidade: lead.cidade ?? "sua cidade",
      }
      setMensagem(aplicarVariaveis(t.texto, vars))
    } else {
      setMensagem("")
    }
  }, [lead?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!lead) return null

  const telefone = (lead.telefone ?? "").replace(/\D/g, "")
  const waUrl = telefone
    ? `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`
    : null

  async function handleConfirm() {
    setConfirmando(true)
    await onConfirm(lead!, mensagem, template?.id ?? null)
    setConfirmando(false)
    onClose()
  }

  return (
    <Dialog open={!!lead} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            WhatsApp — <span className="font-normal">{lead.nome}</span>
          </DialogTitle>
        </DialogHeader>

        {template && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
            Template: <strong>{template.nome}</strong>
          </p>
        )}

        <Textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="min-h-[160px] text-sm resize-none"
          placeholder="Edite a mensagem antes de enviar..."
        />

        {!telefone && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Este lead não tem telefone cadastrado. Adicione um número no detalhe do lead.
          </p>
        )}

        <DialogFooter className="gap-2 flex-wrap sm:flex-nowrap">
          <Button variant="outline" onClick={onClose} size="sm" className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          {waUrl && (
            <Button
              variant="outline" size="sm"
              onClick={() => window.open(waUrl, "_blank")}
              className="gap-2 text-green-700 border-green-300 hover:bg-green-50 flex-1 sm:flex-none"
            >
              <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
            </Button>
          )}
          <Button
            size="sm" disabled={confirmando}
            onClick={handleConfirm}
            className="bg-blue-800 hover:bg-blue-900 text-white gap-2 flex-1 sm:flex-none"
          >
            {confirmando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Confirmar envio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Draggable Card ───────────────────────────────────────────────────────────
function LeadCard({ lead, onWhatsApp, dragging }: {
  lead: Lead
  onWhatsApp: (lead: Lead) => void
  dragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white border border-slate-200 rounded-lg p-3 space-y-2 shadow-sm select-none",
        (isDragging || dragging) && "opacity-40 ring-2 ring-blue-300"
      )}
    >
      <div className="flex items-start gap-1.5">
        <div
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 mt-0.5 shrink-0 touch-none"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <p className="font-medium text-slate-900 text-xs leading-snug flex-1 break-words">{lead.nome}</p>
      </div>

      <div className="pl-5 space-y-1">
        {lead.segmento && (
          <Badge variant="outline" className="text-[10px] h-4 px-1.5 py-0 text-slate-500 border-slate-200">
            {lead.segmento}
          </Badge>
        )}
        {lead.cidade && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin className="h-3 w-3 shrink-0" />
            {lead.cidade}{lead.estado ? `, ${lead.estado}` : ""}
          </div>
        )}
        {lead.telefone && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Phone className="h-3 w-3 shrink-0" />
            {lead.telefone}
          </div>
        )}
        {lead.rating != null && (
          <div className="flex items-center gap-0.5 text-[11px] text-amber-500">
            <Star className="h-3 w-3 fill-current" />
            {lead.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex gap-1 pt-1 pl-5">
        <Button
          size="sm" variant="outline"
          onClick={(e) => { e.stopPropagation(); onWhatsApp(lead) }}
          className="flex-1 h-6 text-[11px] gap-1 text-green-700 border-green-200 hover:bg-green-50 px-2"
        >
          <MessageCircle className="h-3 w-3" /> WA
        </Button>
        <Link href={`/admin/leads/${lead.id}`}>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

// ─── Droppable Column ─────────────────────────────────────────────────────────
function Column({ status, label, cor, corBg, corBorda, leads, onWhatsApp, activeLead }: {
  status: StatusLead; label: string; cor: string; corBg: string; corBorda: string
  leads: Lead[]; onWhatsApp: (lead: Lead) => void; activeLead: Lead | null
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col w-60 shrink-0">
      <div className={cn("rounded-t-lg border border-b-0 px-3 py-2", corBg, corBorda)}>
        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-semibold", cor)}>{label}</span>
          <span className={cn("text-xs font-bold tabular-nums", cor)}>{leads.length}</span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-[300px] rounded-b-lg border p-2 space-y-2 transition-colors",
          corBorda,
          isOver ? "bg-blue-50 border-blue-300" : "bg-slate-50/40"
        )}
      >
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onWhatsApp={onWhatsApp}
            dragging={activeLead?.id === lead.id}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeadsListaPage() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [waLead, setWaLead] = useState<Lead | null>(null)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<{ leads: Lead[]; total: number }>({
    queryKey: ["admin", "leads", search],
    queryFn: () => {
      const p = new URLSearchParams({ limite: "500", ...(search && { search }) })
      return fetch(`/api/admin/leads?${p}`).then((r) => r.json())
    },
    staleTime: 30_000,
  })

  const leads = data?.leads ?? []

  function optimisticMove(id: string, status: StatusLead) {
    queryClient.setQueryData<{ leads: Lead[]; total: number }>(
      ["admin", "leads", search],
      (old) => old ? { ...old, leads: old.leads.map((l) => l.id === id ? { ...l, status } : l) } : old
    )
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveLead(event.active.data.current?.lead as Lead ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null)
    const { active, over } = event
    if (!over) return
    const lead = active.data.current?.lead as Lead
    const novoStatus = over.id as StatusLead
    if (!lead || lead.status === novoStatus) return

    optimisticMove(lead.id, novoStatus)

    fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    }).then((r) => {
      if (!r.ok) {
        optimisticMove(lead.id, lead.status)
        toast.error("Erro ao mover lead")
      }
    })
  }

  async function handleWhatsAppConfirm(lead: Lead, mensagem: string, templateId: number | null) {
    const proximo = proximoStatus(lead.status)
    const body: Record<string, unknown> = {
      interacao: {
        tipo: "whatsapp",
        descricao: `Template ${templateId ?? "personalizado"} — "${mensagem.slice(0, 100)}${mensagem.length > 100 ? "…" : ""}"`,
      },
    }
    if (proximo) body.status = proximo

    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (proximo) optimisticMove(lead.id, proximo as StatusLead)
    toast.success("Envio confirmado!")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Funil de leads</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLoading ? "..." : `${data?.total ?? 0} leads`}
          </p>
        </div>
        <div className="flex gap-2">
          <form
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput) }}
            className="flex gap-2"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Buscar por nome..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 h-8 w-44 text-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(""); setSearch("") }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>
          <Link href="/admin/leads">
            <Button size="sm" variant="outline" className="gap-1.5 h-8">
              <Search className="h-3.5 w-3.5" /> Buscar leads
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUNAS.map((col) => (
            <div key={col.status} className="w-60 shrink-0">
              <div className={cn("rounded-t-lg border border-b-0 px-3 py-2 h-9", col.corBg, col.corBorda)} />
              <div className={cn("min-h-[300px] rounded-b-lg border p-2 space-y-2 bg-slate-50/40", col.corBorda)}>
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUNAS.map((col) => (
              <Column
                key={col.status}
                {...col}
                leads={leads.filter((l) => l.status === col.status)}
                onWhatsApp={setWaLead}
                activeLead={activeLead}
              />
            ))}
          </div>
          <DragOverlay>
            {activeLead && (
              <div className="bg-white border-2 border-blue-400 rounded-lg p-3 shadow-xl w-60 opacity-95">
                <p className="font-medium text-slate-900 text-xs">{activeLead.nome}</p>
                {activeLead.cidade && (
                  <p className="text-[11px] text-slate-400 mt-1">{activeLead.cidade}</p>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      <WhatsAppModal
        lead={waLead}
        onClose={() => setWaLead(null)}
        onConfirm={handleWhatsAppConfirm}
      />
    </div>
  )
}
