"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Link from "next/link"
import { Search, Download, ExternalLink, ArrowLeft } from "lucide-react"
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

type StatusChamado = "a_atender" | "em_andamento" | "aguardando_cliente" | "resolvido" | "cancelado"
type PrioridadeChamado = "baixa" | "media" | "alta" | "urgente"

interface Chamado {
  id: number
  assunto: string
  status: StatusChamado
  prioridade: PrioridadeChamado
  cnpj_informado: string
  criado_em: string
  resolvido_em: string | null
  cliente: { nome_empresa: string } | null
  atendente: { nome: string } | null
}

const STATUS_CLASS: Record<string, string> = {
  resolvido: "bg-green-100 text-green-800 border-green-200",
  cancelado: "bg-slate-100 text-slate-500 border-slate-200",
}

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR")
}

export default function HistoricoPage() {
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [status, setStatus] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery<{ chamados: Chamado[]; total: number; totalPages: number }>({
    queryKey: ["admin", "suporte", "historico", { page, search, status, dataInicio, dataFim }],
    queryFn: () => {
      const p = new URLSearchParams({
        page: page.toString(),
        historico: "true",
        ...(search && { search }),
        ...(status && { status }),
        ...(dataInicio && { dataInicio }),
        ...(dataFim && { dataFim }),
      })
      return fetch(`/api/admin/suporte?${p}`).then((r) => r.json())
    },
  })

  function exportarCSV() {
    const p = new URLSearchParams({
      ...(dataInicio && { dataInicio }),
      ...(dataFim && { dataFim }),
    })
    window.open(`/api/admin/suporte/exportar?${p}`, "_blank")
  }

  const chamados = data?.chamados ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/suporte">
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Histórico de chamados</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isLoading ? "..." : `${data?.total ?? 0} chamados resolvidos/cancelados`}
          </p>
        </div>
        <Button onClick={exportarCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 shadow-sm">
        <form
          onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }}
          className="flex gap-2 flex-1 min-w-[200px]"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por assunto ou empresa..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-9">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="todos" onValueChange={(v) => { setStatus(v === "todos" ? "" : (v ?? "")); setPage(1) }}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => { setDataInicio(e.target.value); setPage(1) }}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="De"
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => { setDataFim(e.target.value); setPage(1) }}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Até"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700 w-16">#</TableHead>
              <TableHead className="font-semibold text-slate-700">Cliente / Assunto</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Atendente</TableHead>
              <TableHead className="font-semibold text-slate-700">Aberto em</TableHead>
              <TableHead className="font-semibold text-slate-700">Resolvido em</TableHead>
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
                <TableRow key={c.id} className="hover:bg-slate-50/50">
                  <TableCell className="text-slate-500 text-sm font-mono">#{c.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900 text-sm">{c.assunto}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {c.cliente?.nome_empresa ?? c.cnpj_informado}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${STATUS_CLASS[c.status] ?? ""}`}>
                      {c.status === "resolvido" ? "Resolvido" : "Cancelado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {c.atendente?.nome ?? <span className="text-slate-300">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{fmtDate(c.criado_em)}</TableCell>
                  <TableCell className="text-sm text-slate-500">{fmtDate(c.resolvido_em)}</TableCell>
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
