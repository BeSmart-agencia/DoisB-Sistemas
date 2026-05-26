"use client"

import React from "react"
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
  Building2,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Hash,
  DollarSign,
  Shield,
  TrendingUp,
  FileText,
  Pencil,
  Wallet,
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
import { cn } from "@/lib/utils"

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

const STATUS_CONFIG: Record<StatusPagamento, { label: string; card: string; dot: string; badge: string }> = {
  aguardando: {
    label: "Aguardando pagamento",
    card: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400 shadow-amber-400/50",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  ativo: {
    label: "Ativo",
    card: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500 shadow-emerald-400/50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  atrasado: {
    label: "Pagamento atrasado",
    card: "bg-red-50 border-red-200",
    dot: "bg-red-500 shadow-red-400/50",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  cancelado: {
    label: "Cancelado",
    card: "bg-slate-100 border-slate-200",
    dot: "bg-slate-400 shadow-slate-400/50",
    badge: "bg-slate-100 text-slate-500 border-slate-200",
  },
}

const PLANO_CONFIG: Record<Plano, { label: string; preco: string; badge: string }> = {
  essencial: { label: "Essencial", preco: "R$ 129,90/mês", badge: "bg-slate-100 text-slate-700 border-slate-200" },
  standard: { label: "Standard", preco: "R$ 199,90/mês", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  premium: { label: "Premium", preco: "R$ 249,90/mês", badge: "bg-violet-50 text-violet-700 border-violet-200" },
}

const PLANO_LABEL: Record<Plano, string> = {
  essencial: "Essencial — R$ 129,90/mês",
  standard: "Standard — R$ 199,90/mês",
  premium: "Premium — R$ 249,90/mês",
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
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
  const faturasPagas = faturas.filter((f) => f.status === "paid")
  const totalPago = faturasPagas.reduce((acc, f) => acc + f.valor, 0)

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Voltar */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Voltar para clientes
      </button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      ) : !cliente ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Cliente não encontrado</p>
        </div>
      ) : (
        <>
          {/* ── Hero header ── */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-8 shadow-xl">
            {/* Círculos decorativos */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-16 right-8 h-64 w-64 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute top-6 right-40 h-20 w-20 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute bottom-4 left-1/2 h-10 w-10 rounded-full bg-white/5" />

            <div className="relative flex items-start gap-6">
              {/* Avatar */}
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg select-none">
                {getInitials(cliente.nome_empresa)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold text-white leading-tight tracking-tight">
                      {cliente.nome_empresa}
                    </h1>
                    <p className="text-blue-300 text-sm mt-1 font-mono">{formatCNPJ(cliente.cnpj)}</p>
                  </div>

                  <Badge
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border shrink-0",
                      STATUS_CONFIG[cliente.status_pagamento].badge
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shadow-sm",
                        STATUS_CONFIG[cliente.status_pagamento].dot
                      )}
                    />
                    {STATUS_CONFIG[cliente.status_pagamento].label}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-5 mt-4">
                  <span className="flex items-center gap-2 text-blue-200 text-sm">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    {cliente.nome_responsavel}
                  </span>
                  <span className="flex items-center gap-2 text-blue-200 text-sm">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {cliente.email}
                  </span>
                  <span className="flex items-center gap-2 text-blue-200 text-sm">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {cliente.telefone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Cards de métricas ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total pago",
                value: formatBRL(totalPago),
                icon: DollarSign,
                iconBg: "bg-emerald-100",
                iconColor: "text-emerald-600",
                accent: "border-l-emerald-400",
              },
              {
                label: "Faturas pagas",
                value: String(faturasPagas.length),
                sub: faturasPagas.length === 1 ? "fatura" : "faturas",
                icon: FileText,
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
                accent: "border-l-blue-400",
              },
              {
                label: "Plano atual",
                value: PLANO_CONFIG[cliente.plano].label,
                sub: PLANO_CONFIG[cliente.plano].preco,
                icon: CreditCard,
                iconBg: "bg-violet-100",
                iconColor: "text-violet-600",
                accent: "border-l-violet-400",
              },
              {
                label: "Cliente desde",
                value: formatDate(cliente.criado_em),
                icon: Calendar,
                iconBg: "bg-amber-100",
                iconColor: "text-amber-600",
                accent: "border-l-amber-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "bg-white rounded-xl border border-slate-200 border-l-4 p-5 shadow-sm hover:shadow-md transition-shadow",
                  stat.accent
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", stat.iconBg)}>
                    <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-900 leading-tight">{stat.value}</p>
                {stat.sub && <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>}
              </div>
            ))}
          </div>

          {/* ── Grid principal ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Coluna esquerda */}
            <div className="lg:col-span-2 space-y-6">

              {/* Dados do cliente */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-900">Dados do cliente</h2>
                </div>

                <div className="divide-y divide-slate-50">
                  {(
                    [
                      { icon: Building2, label: "Empresa", value: cliente.nome_empresa },
                      { icon: Hash, label: "CNPJ", value: formatCNPJ(cliente.cnpj), mono: true },
                      { icon: User, label: "Responsável", value: cliente.nome_responsavel },
                      { icon: Mail, label: "E-mail", value: cliente.email },
                      { icon: Phone, label: "Telefone", value: cliente.telefone },
                      { icon: CreditCard, label: "Plano", value: PLANO_LABEL[cliente.plano] },
                      { icon: Calendar, label: "Assinatura", value: formatDate(cliente.data_assinatura) },
                      { icon: Calendar, label: "Cadastro", value: formatDate(cliente.criado_em) },
                      {
                        icon: Shield,
                        label: "Acesso",
                        value: cliente.acesso_liberado ? "Liberado ✓" : "Pendente",
                        highlight: cliente.acesso_liberado,
                      },
                    ] as { icon: React.ElementType; label: string; value: string; mono?: boolean; highlight?: boolean }[]
                  ).map(({ icon: Icon, label, value, mono, highlight }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="h-7 w-7 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium w-28 shrink-0">{label}</p>
                      <p
                        className={cn(
                          "text-sm font-medium flex-1",
                          mono && "font-mono text-slate-600",
                          highlight ? "text-emerald-600 font-semibold" : "text-slate-800"
                        )}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Pencil className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900">Observações internas</h2>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 h-8 text-xs bg-blue-800 hover:bg-blue-900 text-white rounded-lg"
                    onClick={() => salvarObsMutation.mutate()}
                    disabled={salvarObsMutation.isPending}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Salvar
                  </Button>
                </div>
                <div className="p-6">
                  <Textarea
                    value={observacoes ?? ""}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Adicione notas internas sobre este cliente..."
                    className="min-h-[120px] text-sm resize-none border-slate-200 focus:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Coluna direita */}
            <div className="space-y-4">

              {/* Ações */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Shield className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-900">Acesso & Ações</h2>
                </div>

                <div className="p-5 space-y-3">
                  {/* Acesso liberado */}
                  {cliente.acesso_liberado ? (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">Acesso liberado</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Sistema ativo para o cliente</p>
                      </div>
                    </div>
                  ) : cliente.status_pagamento === "ativo" ? (
                    <button
                      className="w-full flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-xl p-4 text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                      onClick={() => liberarMutation.mutate()}
                      disabled={liberarMutation.isPending}
                    >
                      <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">Liberar acesso</p>
                        <p className="text-xs text-emerald-100 mt-0.5">Clique para ativar o sistema</p>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-700 font-medium leading-relaxed">
                        Aguardando pagamento para liberar o acesso
                      </p>
                    </div>
                  )}

                  {/* Stripe */}
                  {cliente.stripe_customer_id && (
                    <a
                      href={`https://dashboard.stripe.com/customers/${cliente.stripe_customer_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          Ver no Stripe
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate font-mono">
                          {cliente.stripe_customer_id}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                    </a>
                  )}

                  {/* Cancelar */}
                  {cliente.status_pagamento !== "cancelado" && cliente.stripe_subscription_id && (
                    <>
                      <button
                        className="w-full group flex items-center gap-3 border border-red-200 rounded-xl p-4 hover:bg-red-50 hover:border-red-300 transition-all"
                        onClick={() => setCancelarOpen(true)}
                      >
                        <div className="h-9 w-9 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
                          <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-red-600">Cancelar assinatura</p>
                          <p className="text-xs text-red-400 mt-0.5">Encerra ao fim do período atual</p>
                        </div>
                      </button>

                      <Dialog open={cancelarOpen} onOpenChange={setCancelarOpen}>
                        <DialogContent className="max-w-md rounded-2xl">
                          <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                              </div>
                              <DialogTitle className="text-base">Cancelar assinatura</DialogTitle>
                            </div>
                            <DialogDescription className="text-sm leading-relaxed">
                              A assinatura de{" "}
                              <strong className="text-slate-800">{cliente.nome_empresa}</strong> será
                              cancelada ao fim do período atual. O cliente ainda poderá usar o sistema
                              até o vencimento.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2 mt-2">
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

              {/* Card Stripe IDs */}
              {(cliente.stripe_customer_id || cliente.stripe_subscription_id) && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center">
                      <TrendingUp className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900">Stripe</h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {cliente.stripe_customer_id && (
                      <div className="px-6 py-3.5">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">
                          Customer ID
                        </p>
                        <p className="text-xs font-mono text-slate-600 truncate">
                          {cliente.stripe_customer_id}
                        </p>
                      </div>
                    )}
                    {cliente.stripe_subscription_id && (
                      <div className="px-6 py-3.5">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">
                          Subscription ID
                        </p>
                        <p className="text-xs font-mono text-slate-600 truncate">
                          {cliente.stripe_subscription_id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Histórico de pagamentos ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">Histórico de pagamentos</h2>
              </div>
              {faturas.length > 0 && (
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 rounded-full px-3">
                  {faturas.length} {faturas.length === 1 ? "fatura" : "faturas"}
                </Badge>
              )}
            </div>

            {faturas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium">Nenhuma fatura ainda</p>
                <p className="text-slate-400 text-xs">
                  As faturas aparecerão aqui após o primeiro pagamento
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    {["Data", "Período", "Valor", "Status", ""].map((h) => (
                      <TableHead
                        key={h}
                        className={cn(
                          "text-[11px] font-semibold text-slate-500 uppercase tracking-widest",
                          h === "" && "text-right"
                        )}
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faturas.map((f, idx) => (
                    <TableRow
                      key={f.id}
                      className={cn(
                        "hover:bg-blue-50/30 transition-colors",
                        idx % 2 !== 0 && "bg-slate-50/40"
                      )}
                    >
                      <TableCell className="text-sm font-medium text-slate-800">
                        {formatDate(f.data)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {f.periodo_inicio && f.periodo_fim
                          ? `${formatDate(f.periodo_inicio)} → ${formatDate(f.periodo_fim)}`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-900">
                        {formatBRL(f.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                            f.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                        >
                          {f.status === "paid" ? "Pago" : (f.status ?? "—")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {f.pdf ? (
                          <a
                            href={f.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Baixar
                          </a>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
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
