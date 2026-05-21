"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Link from "next/link"
import { Search, ExternalLink, Filter, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type StatusChamado = "a_atender" | "em_andamento" | "aguardando_cliente" | "resolvido" | "cancelado"
type PrioridadeChamado = "baixa" | "media" | "alta" | "urgente"

interface Chamado {
  id: number
  assunto: string
  status: StatusChamado
  prioridade: PrioridadeChamado
  email_retorno: string
  cnpj_informado: string
  criado_em: string
  atualizado_em: string
  cliente: { nome_empresa: string; plano: string } | null
  atendente: { nome: string } | null
}

const STATUS_LABEL: Record<StatusChamado, string> = {
  a_atender: "A atender",
  em_andamento: "Em andamento",
  aguardando_cliente: "Aguardando cliente",
  resolvido: "Resolvido",
  cancelado: "Cancelado",
}
const STATUS_CLASS: Record<StatusChamado, string> = {
  a_atender: "bg-amber-100 text-amber-800 border-amber-200",
  em_andamento: "bg-blue-100 text-blue-800 border-blue-200",
  aguardando_cliente: "bg-purple-100 text-purple-800 border-purple-200",
  resolvido: "bg-green-100 text-green-800 border-green-200",
  cancelado: "bg-slate-100 text-slate-500 border-slate-200",
}
const PRIO_CLASS: Record<PrioridadeChamado, string> = {
  baixa: "bg-slate-100 text-slate-600 border-slate-200",
  media: "bg-blue-50 text-blue-700 border-blue-100",
  alta: "bg-orange-100 text-orange-700 border-orange-200",
  urgente: "bg-red-100 text-red-700 border-red-200",
}
const PRIO_LABEL: Record<PrioridadeChamado, string> = {
  baixa: "Baixa", media: "Média", alta: "Alta", urgente: "Urgente",
}

function tempoDesde(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "< 1h"
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export default function SuporteAdminPage() {
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [status, setStatus] = useState("")
  const [prioridade, setPrioridade] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery<{ chamados: Chamado[]; total: number; totalPages: number }>({
    queryKey: ["admin", "suporte", { page, search, status, prioridade }],
    queryFn: () => {
      const p = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(status && { status }),
        ...(prioridade && { prioridade }),
      })
      return fetch(`/api/admin/suporte?${p}`).then((r) => r.json())
    },
  })

  const chamados = data?.chamados ?? []

  return (
    <div className="space-y-6">
      <div className="admin-panel-strong flex items-center justify-between p-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Chamados de suporte</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLoading ? "..." : `${data?.total ?? 0} chamados ativos`}
          </p>
        </div>
        <Link href="/admin/suporte/historico">
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" /> Histórico
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="admin-panel p-4 flex flex-wrap gap-3">
        <form
          onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }}
          className="flex gap-2 flex-1 min-w-[200px]"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por assunto, CNPJ ou e-mail..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-9">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex gap-2">
          <Select defaultValue="todos" onValueChange={(v) => { setStatus(v === "todos" ? "" : (v ?? "")); setPage(1) }}>
            <SelectTrigger className="h-9 w-40">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              <SelectItem value="a_atender">A atender</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="aguardando_cliente">Aguardando cliente</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="todos" onValueChange={(v) => { setPrioridade(v === "todos" ? "" : (v ?? "")); setPage(1) }}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="admin-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700 w-16">#</TableHead>
              <TableHead className="font-semibold text-slate-700">Cliente / Assunto</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Prioridade</TableHead>
              <TableHead className="font-semibold text-slate-700">Atendente</TableHead>
              <TableHead className="font-semibold text-slate-700">Aberto há</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : chamados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  Nenhum chamado encontrado
                </TableCell>
              </TableRow>
            ) : (
              chamados.map((c) => (
                <TableRow
                  key={c.id}
                  className={cn(
                    "hover:bg-slate-50/50",
                    c.status === "a_atender" && "bg-amber-50/30",
                    c.prioridade === "urgente" && "border-l-2 border-l-red-400"
                  )}
                >
                  <TableCell className="text-slate-500 text-sm font-mono">#{c.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900 text-sm">{c.assunto}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {c.cliente?.nome_empresa ?? c.cnpj_informado}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${STATUS_CLASS[c.status]}`}>
                      {STATUS_LABEL[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${PRIO_CLASS[c.prioridade]}`}>
                      {PRIO_LABEL[c.prioridade]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {c.atendente?.nome ?? <span className="text-slate-300 italic">Não atribuído</span>}
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">{tempoDesde(c.criado_em)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/suporte/${c.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
