"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  BookOpen, Search, Plus, Pencil, Trash2, Eye, EyeOff,
  ExternalLink, Loader2, Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type Categoria = "primeiros_passos" | "cadastros" | "vendas" | "fiscal" | "financeiro" |
  "ordens_servico" | "estoque_compras" | "integracoes" | "configuracoes"

type Status = "publicado" | "rascunho"

interface Tutorial {
  id: string
  titulo: string
  slug: string
  categoria: Categoria
  status: Status
  resumo: string | null
  ordem: number
  atualizado_em: string
}

const CAT_LABEL: Record<Categoria, string> = {
  primeiros_passos: "Primeiros passos",
  cadastros: "Cadastros",
  vendas: "Vendas",
  fiscal: "Fiscal",
  financeiro: "Financeiro",
  ordens_servico: "Ordens de Serviço",
  estoque_compras: "Estoque e Compras",
  integracoes: "Integrações",
  configuracoes: "Configurações avançadas",
}

const CAT_COLOR: Record<Categoria, string> = {
  primeiros_passos: "bg-green-50 text-green-700 border-green-200",
  cadastros: "bg-blue-50 text-blue-700 border-blue-200",
  vendas: "bg-violet-50 text-violet-700 border-violet-200",
  fiscal: "bg-amber-50 text-amber-700 border-amber-200",
  financeiro: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ordens_servico: "bg-orange-50 text-orange-700 border-orange-200",
  estoque_compras: "bg-cyan-50 text-cyan-700 border-cyan-200",
  integracoes: "bg-purple-50 text-purple-700 border-purple-200",
  configuracoes: "bg-slate-100 text-slate-600 border-slate-200",
}

export default function AdminTutoriaisPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [categoria, setCategoria] = useState("")
  const [status, setStatus] = useState("")
  const [deletandoId, setDeletandoId] = useState<string | null>(null)

  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (categoria) params.set("categoria", categoria)
  if (status) params.set("status", status)

  const { data, isLoading } = useQuery<{ tutoriais: Tutorial[]; total: number }>({
    queryKey: ["admin-tutoriais", search, categoria, status],
    queryFn: () => fetch(`/api/admin/tutoriais?${params}`).then((r) => r.json()),
  })

  const toggleStatus = useMutation({
    mutationFn: ({ id, novoStatus }: { id: string; novoStatus: Status }) =>
      fetch(`/api/admin/tutoriais/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      }),
    onSuccess: (_, { novoStatus }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-tutoriais"] })
      toast.success(novoStatus === "publicado" ? "Tutorial publicado" : "Tutorial despublicado")
    },
  })

  const deletar = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/tutoriais/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tutoriais"] })
      toast.success("Tutorial excluído")
      setDeletandoId(null)
    },
  })

  const tutoriais = data?.tutoriais ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="admin-panel-strong flex items-center justify-between p-6">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Tutoriais
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total} tutorial{total !== 1 ? "is" : ""} cadastrado{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/tutoriais/novo">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Novo tutorial
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-panel flex flex-wrap gap-3 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Buscar por título…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoria || "todos"} onValueChange={(v) => setCategoria(v === "todos" ? "" : (v ?? ""))}>
          <SelectTrigger className="w-48">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as categorias</SelectItem>
            {Object.entries(CAT_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status || "todos"} onValueChange={(v) => setStatus(v === "todos" ? "" : (v ?? ""))}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="publicado">Publicados</SelectItem>
            <SelectItem value="rascunho">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="admin-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-8 text-center">#</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Atualizado</TableHead>
              <TableHead className="w-28 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : tutoriais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  Nenhum tutorial encontrado.
                </TableCell>
              </TableRow>
            ) : (
              tutoriais.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/50">
                  <TableCell className="text-center text-xs text-slate-400">{t.ordem}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 text-sm leading-snug">{t.titulo}</div>
                    {t.resumo && (
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{t.resumo}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", CAT_COLOR[t.categoria] ?? "bg-slate-50 text-slate-600")}
                    >
                      {CAT_LABEL[t.categoria] ?? t.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        t.status === "publicado"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      )}
                    >
                      {t.status === "publicado" ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {new Date(t.atualizado_em).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/tutoriais/${t.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Ver publicado">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title={t.status === "publicado" ? "Despublicar" : "Publicar"}
                        onClick={() =>
                          toggleStatus.mutate({
                            id: t.id,
                            novoStatus: t.status === "publicado" ? "rascunho" : "publicado",
                          })
                        }
                      >
                        {t.status === "publicado" ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Link href={`/admin/tutoriais/${t.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Editar">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Excluir"
                        onClick={() => setDeletandoId(t.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deletandoId} onOpenChange={(open: boolean) => !open && setDeletandoId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir tutorial?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O tutorial será removido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletandoId(null)}>Cancelar</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deletandoId && deletar.mutate(deletandoId)}
            >
              {deletar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
