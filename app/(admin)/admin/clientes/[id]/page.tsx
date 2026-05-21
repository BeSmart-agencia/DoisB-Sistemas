"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Save,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type StatusPagamento = "aguardando" | "ativo" | "atrasado" | "cancelado"
type Plano = "essencial" | "standard" | "premium"

interface ClienteDetalhe {
  id: string
  nome_empresa: string
  cnpj: string
  email: string
  telefone: string
  nome_responsavel: string
  plano: Plano
  status_pagamento: StatusPagamento
  acesso_liberado: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  data_assinatura: string | null
  observacoes: string | null
  criado_em: string
}

interface Fatura {
  id: string
  valor: number
  status: string | null
  data: string
  pdf: string | null
  periodo_inicio: string | null
  periodo_fim: string | null
}

const STATUS_CLASS: Record<StatusPagamento, string> = {
  aguardando: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ativo: "bg-green-100 text-green-800 border-green-200",
  atrasado: "bg-red-100 text-red-800 border-red-200",
  cancelado: "bg-slate-100 text-slate-500 border-slate-200",
}

const STATUS_LABEL: Record<StatusPagamento, string> = {
  aguardando: "Aguardando pagamento",
  ativo: "Ativo",
  atrasado: "Pagamento atrasado",
  cancelado: "Cancelado",
}

const PLANO_LABEL: Record<Plano, string> = {
  essencial: "Essencial — R$ 99,90/mês",
  standard: "Standard — R$ 159,90/mês",
  premium: "Premium — R$ 219,90/mês",
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR")
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatCNPJ(cnpj: string) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
}

export default function ClienteDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()

  const [observacoes, setObservacoes] = useState<string | null>(null)
  const [cancelarOpen, setCancelarOpen] = useState(false)

  const { data, isLoading } = useQuery<{ cliente: ClienteDetalhe; faturas: Fatura[] }>({
    queryKey: ["admin", "cliente", id],
    queryFn: () => fetch(`/api/admin/clientes/${id}`).then((r) => r.json()),
    select: (d) => {
      if (observacoes === null && d.cliente.observacoes !== undefined) {
        setObservacoes(d.cliente.observacoes ?? "")
      }
      return d
    },
  })

  const liberarMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/admin/clientes/${id}/liberar`, { method: "PATCH" }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast.error(res.error); return }
      toast.success("Acesso liberado!")
      qc.invalidateQueries({ queryKey: ["admin", "cliente", id] })
      qc.invalidateQueries({ queryKey: ["admin", "clientes"] })
    },
  })

  const cancelarMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/admin/clientes/${id}/cancelar`, { method: "POST" }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast.error(res.error); return }
      toast.success(res.mensagem ?? "Assinatura cancelada.")
      setCancelarOpen(false)
      qc.invalidateQueries({ queryKey: ["admin", "cliente", id] })
    },
  })

  const salvarObsMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/admin/clientes/${id}/observacoes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observacoes: observacoes ?? "" }),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast.error(res.error); return }
      toast.success("Observações salvas.")
    },
  })

  const cliente = data?.cliente
  const faturas = data?.faturas ?? []

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </button>
        <div>
          {isLoading ? (
            <Skeleton className="h-7 w-48" />
          ) : (
            <h1 className="text-xl font-bold text-slate-900">{cliente?.nome_empresa}</h1>
          )}
          <p className="text-slate-500 text-sm">Detalhe do cliente</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
      ) : !cliente ? (
        <div className="text-center py-16 text-slate-400">Cliente não encontrado.</div>
      ) : (
        <>
          {/* Dados + ações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Info card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-semibold text-slate-900">Dados do cliente</h2>
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${STATUS_CLASS[cliente.status_pagamento]}`}
                >
                  {STATUS_LABEL[cliente.status_pagamento]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ["Empresa", cliente.nome_empresa],
                  ["CNPJ", formatCNPJ(cliente.cnpj)],
                  ["Responsável", cliente.nome_responsavel],
                  ["E-mail", cliente.email],
                  ["Telefone", cliente.telefone],
                  ["Plano", PLANO_LABEL[cliente.plano]],
                  ["Assinatura", formatDate(cliente.data_assinatura)],
                  ["Cadastro", formatDate(cliente.criado_em)],
                  ["Acesso liberado", cliente.acesso_liberado ? "Sim ✅" : "Não"],
                  ["Stripe Customer", cliente.stripe_customer_id ?? "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-slate-800 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Ações</h2>

              {cliente.status_pagamento === "ativo" && !cliente.acesso_liberado && (
                <Button
                  className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => liberarMutation.mutate()}
                  disabled={liberarMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Liberar acesso
                </Button>
              )}

              {cliente.acesso_liberado && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  Acesso já liberado
                </div>
              )}

              {cliente.stripe_customer_id && (
                <a
                  href={`https://dashboard.stripe.com/customers/${cliente.stripe_customer_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Ver no Stripe
                  </Button>
                </a>
              )}

              {cliente.status_pagamento !== "cancelado" && cliente.stripe_subscription_id && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setCancelarOpen(true)}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar assinatura
                  </Button>
                  <Dialog open={cancelarOpen} onOpenChange={setCancelarOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Cancelar assinatura
                      </DialogTitle>
                      <DialogDescription>
                        A assinatura de <strong>{cliente.nome_empresa}</strong> será cancelada ao fim do período atual. O cliente ainda poderá usar o sistema até o vencimento.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCancelarOpen(false)}>
                        Voltar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => cancelarMutation.mutate()}
                        disabled={cancelarMutation.isPending}
                      >
                        Confirmar cancelamento
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Observações internas</h2>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                onClick={() => salvarObsMutation.mutate()}
                disabled={salvarObsMutation.isPending}
              >
                <Save className="h-3.5 w-3.5" />
                Salvar
              </Button>
            </div>
            <Textarea
              value={observacoes ?? ""}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione notas internas sobre este cliente..."
              className="min-h-[100px] text-sm resize-none"
            />
          </div>

          {/* Histórico de pagamentos */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Histórico de pagamentos</h2>
            </div>
            {faturas.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-sm">Nenhuma fatura encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Data</TableHead>
                    <TableHead className="font-semibold text-slate-700">Período</TableHead>
                    <TableHead className="font-semibold text-slate-700">Valor</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faturas.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="text-sm">{formatDate(f.data)}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {f.periodo_inicio && f.periodo_fim
                          ? `${formatDate(f.periodo_inicio)} → ${formatDate(f.periodo_fim)}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{formatBRL(f.valor)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            f.status === "paid"
                              ? "bg-green-100 text-green-800 border-green-200 text-xs"
                              : "bg-red-100 text-red-800 border-red-200 text-xs"
                          }
                        >
                          {f.status === "paid" ? "Pago" : f.status ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {f.pdf ? (
                          <a
                            href={f.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center justify-end gap-1"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Baixar
                          </a>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
