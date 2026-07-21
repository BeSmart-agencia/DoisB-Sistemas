"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Search, X, Loader2, UserPlus } from "lucide-react"

export interface ProjetoData {
  id?: string
  cliente_id: string | null
  cliente_nome: string
  cliente_doc: string | null
  cliente_email: string | null
  cliente_telefone: string | null
  nome_projeto: string
  descricao: string | null
  tipo_sistema: string | null
  status: string
  responsavel: string | null
  tecnologias: string | null
  repo_url: string | null
  deploy_url: string | null
  observacoes: string | null
  data_inicio: string | null
  previsao_entrega: string | null
  data_entrega: string | null
  valor_desenvolvimento: number
  valor_recebido: number
  mensalidade_valor: number
  mensalidade_dia: number | null
  mensalidade_inicio: string | null
}

const TIPOS = [
  { v: "web", l: "Sistema web" },
  { v: "app", l: "Aplicativo" },
  { v: "integracao", l: "Integração" },
  { v: "automacao", l: "Automação" },
  { v: "outro", l: "Outro" },
]

const STATUS = [
  { v: "proposta", l: "Proposta" },
  { v: "em_desenvolvimento", l: "Em desenvolvimento" },
  { v: "entregue", l: "Entregue" },
  { v: "manutencao", l: "Manutenção" },
  { v: "cancelado", l: "Cancelado" },
]

interface ClienteBusca {
  id: string
  nome_empresa: string
  cnpj: string
  email: string
  telefone: string
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
const labelCls = "block text-xs font-bold uppercase tracking-wide text-blue-900 mb-1.5"

export function ProjetoForm({ projeto }: { projeto?: ProjetoData }) {
  const router = useRouter()
  const editando = !!projeto?.id
  const [salvando, setSalvando] = useState(false)

  const [form, setForm] = useState<ProjetoData>(
    projeto ?? {
      cliente_id: null,
      cliente_nome: "",
      cliente_doc: "",
      cliente_email: "",
      cliente_telefone: "",
      nome_projeto: "",
      descricao: "",
      tipo_sistema: "web",
      status: "proposta",
      responsavel: "",
      tecnologias: "",
      repo_url: "",
      deploy_url: "",
      observacoes: "",
      data_inicio: null,
      previsao_entrega: null,
      data_entrega: null,
      valor_desenvolvimento: 0,
      valor_recebido: 0,
      mensalidade_valor: 0,
      mensalidade_dia: null,
      mensalidade_inicio: null,
    }
  )

  const [avulso, setAvulso] = useState(!projeto?.cliente_id)
  const [busca, setBusca] = useState("")
  const [resultados, setResultados] = useState<ClienteBusca[]>([])
  const [buscando, setBuscando] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  function set<K extends keyof ProjetoData>(k: K, v: ProjetoData[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  useEffect(() => {
    if (avulso || busca.trim().length < 2) {
      setResultados([])
      return
    }
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      setBuscando(true)
      try {
        const r = await fetch(`/api/admin/clientes?search=${encodeURIComponent(busca)}`)
        const j = await r.json()
        setResultados(j.clientes ?? [])
      } catch {
        setResultados([])
      } finally {
        setBuscando(false)
      }
    }, 300)
  }, [busca, avulso])

  function selecionarCliente(c: ClienteBusca) {
    setForm((f) => ({
      ...f,
      cliente_id: c.id,
      cliente_nome: c.nome_empresa,
      cliente_doc: c.cnpj,
      cliente_email: c.email,
      cliente_telefone: c.telefone,
    }))
    setBusca("")
    setResultados([])
  }

  function limparCliente() {
    setForm((f) => ({ ...f, cliente_id: null }))
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.cliente_nome.trim()) return toast.error("Informe o cliente.")
    if (!form.nome_projeto.trim()) return toast.error("Informe o nome do projeto.")
    setSalvando(true)

    const payload = {
      ...form,
      cliente_id: avulso ? null : form.cliente_id,
      valor_desenvolvimento: Number(form.valor_desenvolvimento) || 0,
      valor_recebido: Number(form.valor_recebido) || 0,
      mensalidade_valor: Number(form.mensalidade_valor) || 0,
      mensalidade_dia: form.mensalidade_dia ? Number(form.mensalidade_dia) : null,
    }

    try {
      const url = editando ? `/api/admin/sob-medida/${projeto!.id}` : "/api/admin/sob-medida"
      const res = await fetch(url, {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error ?? "Erro")
      toast.success(editando ? "Projeto atualizado." : "Projeto criado.")
      router.push(editando ? `/admin/sob-medida/${projeto!.id}` : "/admin/sob-medida")
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message || "Erro ao salvar o projeto.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={salvar} className="space-y-5">
      {/* Cliente */}
      <div className="admin-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900">Cliente</h2>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={avulso}
              onChange={(e) => {
                setAvulso(e.target.checked)
                if (e.target.checked) limparCliente()
              }}
              className="h-4 w-4 rounded border-slate-300"
            />
            <UserPlus className="h-3.5 w-3.5" />
            Cliente avulso (não é ZWeb)
          </label>
        </div>

        {!avulso && (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar cliente ZWeb por empresa, CNPJ ou e-mail..."
                className={cn(inputCls, "pl-9")}
              />
              {buscando && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />}
            </div>
            {resultados.length > 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-64 overflow-y-auto">
                {resultados.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selecionarCliente(c)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                  >
                    <p className="text-sm font-medium text-slate-900">{c.nome_empresa}</p>
                    <p className="text-xs text-slate-500">{c.email}</p>
                  </button>
                ))}
              </div>
            )}
            {form.cliente_id && (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-blue-900">{form.cliente_nome}</p>
                  <p className="text-xs text-blue-700">{form.cliente_email} · vinculado ao ZWeb</p>
                </div>
                <button type="button" onClick={limparCliente} className="text-blue-700 hover:text-blue-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {(avulso || !form.cliente_id) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nome / Empresa *</label>
              <input value={form.cliente_nome} onChange={(e) => set("cliente_nome", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>CNPJ / CPF</label>
              <input value={form.cliente_doc ?? ""} onChange={(e) => set("cliente_doc", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>E-mail</label>
              <input value={form.cliente_email ?? ""} onChange={(e) => set("cliente_email", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefone</label>
              <input value={form.cliente_telefone ?? ""} onChange={(e) => set("cliente_telefone", e.target.value)} className={inputCls} />
            </div>
          </div>
        )}
      </div>

      {/* Projeto */}
      <div className="admin-panel p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900">Projeto</h2>
        <div>
          <label className={labelCls}>Nome do projeto *</label>
          <input value={form.nome_projeto} onChange={(e) => set("nome_projeto", e.target.value)} className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Tipo</label>
            <select value={form.tipo_sistema ?? "web"} onChange={(e) => set("tipo_sistema", e.target.value)} className={inputCls}>
              {TIPOS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              {STATUS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Responsável</label>
            <input value={form.responsavel ?? ""} onChange={(e) => set("responsavel", e.target.value)} placeholder="Laisa / Douglas" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Escopo / descrição</label>
          <textarea value={form.descricao ?? ""} onChange={(e) => set("descricao", e.target.value)} rows={3} className={cn(inputCls, "resize-y")} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Tecnologias</label>
            <input value={form.tecnologias ?? ""} onChange={(e) => set("tecnologias", e.target.value)} placeholder="Next.js, Supabase..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Repositório</label>
            <input value={form.repo_url ?? ""} onChange={(e) => set("repo_url", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Deploy / URL</label>
            <input value={form.deploy_url ?? ""} onChange={(e) => set("deploy_url", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Início</label>
            <input type="date" value={form.data_inicio ?? ""} onChange={(e) => set("data_inicio", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Previsão de entrega</label>
            <input type="date" value={form.previsao_entrega ?? ""} onChange={(e) => set("previsao_entrega", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Entregue em</label>
            <input type="date" value={form.data_entrega ?? ""} onChange={(e) => set("data_entrega", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Financeiro */}
      <div className="admin-panel p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900">Financeiro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Valor de desenvolvimento (R$)</label>
            <input type="number" step="0.01" min="0" value={form.valor_desenvolvimento} onChange={(e) => set("valor_desenvolvimento", e.target.valueAsNumber || 0)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Já recebido (R$)</label>
            <input type="number" step="0.01" min="0" value={form.valor_recebido} onChange={(e) => set("valor_recebido", e.target.valueAsNumber || 0)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <div>
            <label className={labelCls}>Mensalidade (R$/mês)</label>
            <input type="number" step="0.01" min="0" value={form.mensalidade_valor} onChange={(e) => set("mensalidade_valor", e.target.valueAsNumber || 0)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Dia do vencimento</label>
            <input type="number" min="1" max="28" value={form.mensalidade_dia ?? ""} onChange={(e) => set("mensalidade_dia", e.target.value ? Number(e.target.value) : null)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Início da mensalidade</label>
            <input type="date" value={form.mensalidade_inicio ?? ""} onChange={(e) => set("mensalidade_inicio", e.target.value)} className={inputCls} />
          </div>
        </div>
        <p className="text-xs text-slate-600">
          A cobrança automática da mensalidade (Stripe) é gerada na tela do projeto depois de salvar.
        </p>
      </div>

      {/* Observações */}
      <div className="admin-panel p-5">
        <label className={labelCls}>Observações</label>
        <textarea value={form.observacoes ?? ""} onChange={(e) => set("observacoes", e.target.value)} rows={3} className={cn(inputCls, "resize-y")} />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={salvando} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
          {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
          {editando ? "Salvar alterações" : "Criar projeto"}
        </button>
        <button type="button" onClick={() => router.push("/admin/sob-medida")} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Cancelar
        </button>
      </div>
    </form>
  )
}
