"use client"

import { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  UserPlus,
  Link2,
  Copy,
  Check,
  Pencil,
  Power,
  Trash2,
  ChevronDown,
  ChevronRight,
  Wallet,
  BadgeCheck,
  Clock,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Vendedor {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  chave_pix: string | null
  codigo: string
  ativo: boolean
  observacoes: string | null
  portal_token: string
  created_at: string
}

interface Comissao {
  id: string
  tipo: "zweb" | "agendab"
  vendedor_id: string
  cliente: string
  local: string | null
  produto: string
  valor: number
  status: "aguardando" | "ativo" | "atrasado" | "cancelado"
  convertido: boolean
  data: string
  comissao_paga: boolean
}

interface ApiResponse {
  vendedores: Vendedor[]
  comissoes: Comissao[]
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const fmtData = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—"

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== "undefined" ? window.location.origin : "https://www.doisbsistemas.com.br")
  )
}

export default function VendedoresPage() {
  const qc = useQueryClient()
  const [copiado, setCopiado] = useState<string | null>(null)
  const [expandido, setExpandido] = useState<Set<string>>(new Set())
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Vendedor | null>(null)

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["vendedores"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vendedores")
      if (!res.ok) throw new Error("Erro ao carregar vendedores")
      return res.json()
    },
  })

  const comissoesPorVendedor = useMemo(() => {
    const map = new Map<string, Comissao[]>()
    for (const c of data?.comissoes ?? []) {
      const arr = map.get(c.vendedor_id) ?? []
      arr.push(c)
      map.set(c.vendedor_id, arr)
    }
    return map
  }, [data?.comissoes])

  const totais = useMemo(() => {
    let aPagar = 0
    let pago = 0
    for (const c of data?.comissoes ?? []) {
      if (!c.convertido) continue
      if (c.comissao_paga) pago += c.valor
      else aPagar += c.valor
    }
    const ativos = (data?.vendedores ?? []).filter((x) => x.ativo).length
    return { aPagar, pago, ativos }
  }, [data])

  const comissaoMut = useMutation({
    mutationFn: async ({ id, tipo, paga }: { id: string; tipo: "zweb" | "agendab"; paga: boolean }) => {
      const res = await fetch("/api/admin/vendedores/comissao", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, tipo, paga }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro")
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendedores"] }),
    onError: (e: Error) => toast.error(e.message),
  })

  const toggleAtivoMut = useMutation({
    mutationFn: async (v: Vendedor) => {
      const res = await fetch(`/api/admin/vendedores/${v.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !v.ativo }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro")
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendedores"] }),
    onError: (e: Error) => toast.error(e.message),
  })

  const excluirMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/vendedores/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro")
    },
    onSuccess: () => {
      toast.success("Vendedor excluído")
      qc.invalidateQueries({ queryKey: ["vendedores"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function copiar(key: string, texto: string, msg: string) {
    navigator.clipboard.writeText(texto)
    setCopiado(key)
    toast.success(msg)
    setTimeout(() => setCopiado((c) => (c === key ? null : c)), 2000)
  }

  function toggleExpandir(id: string) {
    setExpandido((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const vendedores = data?.vendedores ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">Vendedores externos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Cada vendedor tem um link exclusivo. Vendas vindas do link geram comissão de{" "}
            <strong>100% da primeira mensalidade</strong>.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditando(null)
            setDialogAberto(true)
          }}
          className="bg-slate-950 hover:bg-blue-900 text-white font-semibold"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Novo vendedor
        </Button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardResumo icon={Users} cor="blue" label="Vendedores ativos" valor={String(totais.ativos)} />
        <CardResumo icon={Wallet} cor="amber" label="Comissão a pagar" valor={BRL.format(totais.aPagar)} />
        <CardResumo icon={BadgeCheck} cor="emerald" label="Comissão já paga" valor={BRL.format(totais.pago)} />
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : vendedores.length === 0 ? (
        <div className="admin-panel p-10 text-center">
          <Link2 className="h-8 w-8 mx-auto text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">Nenhum vendedor cadastrado</p>
          <p className="text-sm text-slate-500 mt-1">
            Cadastre um vendedor para gerar o link exclusivo de vendas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendedores.map((v) => {
            const comissoes = comissoesPorVendedor.get(v.id) ?? []
            const convertidas = comissoes.filter((c) => c.convertido)
            const aPagar = convertidas.filter((s) => !s.comissao_paga).reduce((a, s) => a + s.valor, 0)
            const pago = convertidas.filter((s) => s.comissao_paga).reduce((a, s) => a + s.valor, 0)
            const pendentes = comissoes.length - convertidas.length
            const aberto = expandido.has(v.id)
            const link = `${baseUrl()}/?v=${v.codigo}`
            const portalLink = `${baseUrl()}/vendedor/${v.portal_token}`

            return (
              <div key={v.id} className={cn("admin-panel overflow-hidden", !v.ativo && "opacity-70")}>
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-950 text-lg">{v.nome}</h3>
                        {v.ativo ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Ativo</Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-500 border-slate-200">Inativo</Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 mt-0.5 space-x-2">
                        {v.telefone && <span>{v.telefone}</span>}
                        {v.email && <span>· {v.email}</span>}
                        {v.chave_pix && <span>· PIX: {v.chave_pix}</span>}
                      </div>

                      {/* Links: venda (público) + portal (secreto) */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 max-w-full">
                          <span className="shrink-0 text-[11px] font-semibold text-slate-400 w-12">Venda</span>
                          <code className="truncate text-xs bg-slate-100 text-slate-700 rounded-lg px-2.5 py-1.5 border border-slate-200">
                            {link}
                          </code>
                          <button
                            onClick={() => copiar(`venda:${v.id}`, link, "Link de venda copiado!")}
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-900"
                          >
                            {copiado === `venda:${v.id}` ? (
                              <><Check className="h-3.5 w-3.5" /> Copiado</>
                            ) : (
                              <><Copy className="h-3.5 w-3.5" /> Copiar</>
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 max-w-full">
                          <span className="shrink-0 text-[11px] font-semibold text-slate-400 w-12">Portal</span>
                          <code className="truncate text-xs bg-slate-100 text-slate-700 rounded-lg px-2.5 py-1.5 border border-slate-200">
                            {portalLink}
                          </code>
                          <button
                            onClick={() => copiar(`portal:${v.id}`, portalLink, "Link do portal copiado!")}
                            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-900"
                          >
                            {copiado === `portal:${v.id}` ? (
                              <><Check className="h-3.5 w-3.5" /> Copiado</>
                            ) : (
                              <><Copy className="h-3.5 w-3.5" /> Copiar</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" title="Editar"
                        onClick={() => { setEditando(v); setDialogAberto(true) }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title={v.ativo ? "Desativar" : "Ativar"}
                        onClick={() => toggleAtivoMut.mutate(v)}>
                        <Power className={cn("h-4 w-4", v.ativo ? "text-emerald-600" : "text-slate-400")} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Excluir"
                        onClick={() => {
                          if (confirm(`Excluir o vendedor "${v.nome}"?`)) excluirMut.mutate(v.id)
                        }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Métricas do vendedor */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Metrica label="Vendas pagas" valor={String(convertidas.length)} />
                    <Metrica label="A pagar" valor={BRL.format(aPagar)} destaque="amber" />
                    <Metrica label="Já paga" valor={BRL.format(pago)} destaque="emerald" />
                    <Metrica label="Aguardando pgto" valor={String(pendentes)} />
                  </div>

                  {comissoes.length > 0 && (
                    <button
                      onClick={() => toggleExpandir(v.id)}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      {aberto ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {comissoes.length} venda{comissoes.length > 1 ? "s" : ""} atribuída{comissoes.length > 1 ? "s" : ""}
                    </button>
                  )}
                </div>

                {/* Detalhe das vendas */}
                {aberto && comissoes.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50/60 divide-y divide-slate-100">
                    {comissoes.map((s) => (
                      <div key={`${s.tipo}:${s.id}`} className="px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{s.cliente}</p>
                          <p className="text-xs text-slate-500">
                            {s.produto} · {BRL.format(s.valor)} · {fmtData(s.data)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!s.convertido ? (
                            <Badge className="bg-slate-100 text-slate-500 border-slate-200 gap-1">
                              <Clock className="h-3 w-3" /> Aguardando pagamento
                            </Badge>
                          ) : s.comissao_paga ? (
                            <button
                              onClick={() => comissaoMut.mutate({ id: s.id, tipo: s.tipo, paga: false })}
                              title="Clique para desfazer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                            >
                              <BadgeCheck className="h-3.5 w-3.5" /> Comissão paga
                            </button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => comissaoMut.mutate({ id: s.id, tipo: s.tipo, paga: true })}
                              className="h-8 bg-slate-950 hover:bg-blue-900 text-white text-xs"
                            >
                              Marcar comissão paga
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <VendedorDialog
        aberto={dialogAberto}
        vendedor={editando}
        onClose={() => setDialogAberto(false)}
        onSaved={() => {
          setDialogAberto(false)
          qc.invalidateQueries({ queryKey: ["vendedores"] })
        }}
      />
    </div>
  )
}

function CardResumo({
  icon: Icon,
  cor,
  label,
  valor,
}: {
  icon: React.ElementType
  cor: "blue" | "amber" | "emerald"
  label: string
  valor: string
}) {
  const cores = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[cor]
  return (
    <div className="admin-panel p-5 flex items-center gap-4">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", cores)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-xl font-black text-slate-950 mt-0.5">{valor}</p>
      </div>
    </div>
  )
}

function Metrica({
  label,
  valor,
  destaque,
}: {
  label: string
  valor: string
  destaque?: "amber" | "emerald"
}) {
  const cor = destaque === "amber" ? "text-amber-700" : destaque === "emerald" ? "text-emerald-700" : "text-slate-900"
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className={cn("text-base font-bold mt-0.5", cor)}>{valor}</p>
    </div>
  )
}

function VendedorDialog({
  aberto,
  vendedor,
  onClose,
  onSaved,
}: {
  aberto: boolean
  vendedor: Vendedor | null
  onClose: () => void
  onSaved: () => void
}) {
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      nome: fd.get("nome"),
      codigo: fd.get("codigo"),
      email: fd.get("email"),
      telefone: fd.get("telefone"),
      chave_pix: fd.get("chave_pix"),
      observacoes: fd.get("observacoes"),
    }
    setSalvando(true)
    try {
      const res = await fetch(
        vendedor ? `/api/admin/vendedores/${vendedor.id}` : "/api/admin/vendedores",
        {
          method: vendedor ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? "Erro ao salvar")
        return
      }
      toast.success(vendedor ? "Vendedor atualizado" : "Vendedor cadastrado")
      onSaved()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{vendedor ? "Editar vendedor" : "Novo vendedor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" name="nome" required defaultValue={vendedor?.nome ?? ""} placeholder="Nome do vendedor" data-slot="input" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="codigo">Código do link *</Label>
            <Input
              id="codigo"
              name="codigo"
              defaultValue={vendedor?.codigo ?? ""}
              placeholder="ex: joao (se vazio, gera a partir do nome)"
              data-slot="input"
            />
            <p className="text-xs text-slate-500">
              Vira o link: <code>{baseUrl()}/?v=<strong>codigo</strong></code>. Só letras, números, ponto, hífen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="telefone">WhatsApp</Label>
              <Input id="telefone" name="telefone" defaultValue={vendedor?.telefone ?? ""} placeholder="(00) 00000-0000" data-slot="input" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" defaultValue={vendedor?.email ?? ""} placeholder="email@exemplo.com" data-slot="input" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="chave_pix">Chave PIX (para pagar a comissão)</Label>
            <Input id="chave_pix" name="chave_pix" defaultValue={vendedor?.chave_pix ?? ""} placeholder="CPF, telefone, e-mail ou aleatória" data-slot="input" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" name="observacoes" defaultValue={vendedor?.observacoes ?? ""} rows={2} placeholder="Anotações internas (opcional)" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando} className="bg-slate-950 hover:bg-blue-900 text-white">
              {salvando ? "Salvando..." : vendedor ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
