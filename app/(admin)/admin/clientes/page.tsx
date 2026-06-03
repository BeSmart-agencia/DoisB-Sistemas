"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Search,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type StatusPagamento = "aguardando" | "ativo" | "atrasado" | "cancelado"
type Plano = "essencial" | "standard" | "premium"

interface Cliente {
  id: string
  nome_empresa: string
  cnpj: string
  email: string
  plano: Plano
  status_pagamento: StatusPagamento
  acesso_liberado: boolean
  data_assinatura: string | null
  created_at: string
}

interface ClientesResponse {
  clientes: Cliente[]
  total: number
  page: number
  totalPages: number
}

const STATUS_LABEL: Record<StatusPagamento, string> = {
  aguardando: "Aguardando",
  ativo: "Ativo",
  atrasado: "Atrasado",
  cancelado: "Cancelado",
}

const STATUS_CLASS: Record<StatusPagamento, string> = {
  aguardando: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ativo: "bg-green-100 text-green-800 border-green-200",
  atrasado: "bg-red-100 text-red-800 border-red-200",
  cancelado: "bg-slate-100 text-slate-500 border-slate-200",
}

const PLANO_LABEL: Record<Plano, string> = {
  essencial: "Essencial",
  standard: "Standard",
  premium: "Premium",
}

function formatCNPJ(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR")
}

export default function ClientesPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [status, setStatus] = useState("")
  const [plano, setPlano] = useState("")

  const { data, isLoading, error } = useQuery<ClientesResponse>({
    queryKey: ["admin", "clientes", { page, search, status, plano }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(status && { status }),
        ...(plano && { plano }),
      })
      const r = await fetch(`/api/admin/clientes?${params}`)
      const json = await r.json()
      if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`)
      return json
    },
  })

  const liberarMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/clientes/${id}/liberar`, { method: "PATCH" }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast.error(res.error); return }
      toast.success("Acesso liberado! E-mail enviado ao cliente.")
      qc.invalidateQueries({ queryKey: ["admin", "clientes"] })
    },
    onError: () => toast.error("Erro ao liberar acesso"),
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function handleFilter(key: "status" | "plano", value: string) {
    if (key === "status") setStatus(value === "todos" ? "" : value)
    if (key === "plano") setPlano(value === "todos" ? "" : value)
    setPage(1)
  }

  const clientes = data?.clientes ?? []
  const totalPages = data?.totalPages ?? 1

  if (error) {
    return (
      <div className="admin-panel-strong p-8 text-center">
        <p className="text-red-600 font-semibold">Erro ao carregar clientes</p>
        <p className="text-slate-500 text-sm mt-1">{(error as Error).message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="admin-panel-strong p-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Clientes</h1>
        <p className="text-slate-500 text-sm mt-1">
          {isLoading ? "Carregando..." : `${data?.total ?? 0} clientes encontrados`}
        </p>
      </div>

      {/* Filtros */}
      <div className="admin-panel p-4 flex flex-wrap gap-3 items-end">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por empresa, CNPJ ou e-mail..."
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
          <Select defaultValue="todos" onValueChange={(v) => handleFilter("status", v ?? "todos")}>
            <SelectTrigger className="h-9 w-36">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="aguardando">Aguardando</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="todos" onValueChange={(v) => handleFilter("plano", v ?? "todos")}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos planos</SelectItem>
              <SelectItem value="essencial">Essencial</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="admin-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Empresa</TableHead>
              <TableHead className="font-semibold text-slate-700">CNPJ</TableHead>
              <TableHead className="font-semibold text-slate-700">Plano</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Cadastro</TableHead>
              <TableHead className="font-semibold text-slate-700">Assinatura</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{c.nome_empresa}</p>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 font-mono">
                    {formatCNPJ(c.cnpj)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{PLANO_LABEL[c.plano]}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${STATUS_CLASS[c.status_pagamento]}`}
                    >
                      {STATUS_LABEL[c.status_pagamento]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {formatDate(c.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {formatDate(c.data_assinatura)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {c.status_pagamento === "ativo" && !c.acesso_liberado && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-green-700 border-green-200 hover:bg-green-50"
                          onClick={() => liberarMutation.mutate(c.id)}
                          disabled={liberarMutation.isPending}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Liberar acesso
                        </Button>
                      )}
                      {c.acesso_liberado && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Liberado
                        </span>
                      )}
                      <Link href={`/admin/clientes/${c.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Detalhes
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
