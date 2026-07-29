"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Copy,
  Check,
  Wallet,
  BadgeCheck,
  ShoppingBag,
  Link2,
  Target,
  BookOpen,
  Lightbulb,
  Quote,
  ShieldQuestion,
  Flag,
  Sparkles,
  CircleDollarSign,
} from "lucide-react"
import { PLANO_PRECO, PLANO_LABEL } from "@/lib/planos"
import { ROTEIROS, type Roteiro } from "@/lib/roteiros"
import { cn } from "@/lib/utils"

export interface VendaPortal {
  id: string
  nome_empresa: string
  cidade: string | null
  estado: string | null
  plano: "essencial" | "standard" | "premium"
  status_pagamento: "aguardando" | "ativo" | "atrasado" | "cancelado"
  data_assinatura: string | null
  created_at: string
  comissao_paga: boolean
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const fmtData = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—"

const STATUS_CLIENTE: Record<VendaPortal["status_pagamento"], { label: string; cls: string }> = {
  aguardando: { label: "Aguardando pagamento", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  ativo: { label: "Cliente ativo", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  atrasado: { label: "Pagamento atrasado", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  cancelado: { label: "Cancelado", cls: "bg-slate-100 text-slate-500 border-slate-200" },
}

const converteu = (v: VendaPortal) => !!v.data_assinatura
const valor = (v: VendaPortal) => PLANO_PRECO[v.plano] ?? 0

type Tab = "vendas" | "roteiro"

export function PortalClient({
  nome,
  ativo,
  chavePix,
  linkVenda,
  vendas,
}: {
  nome: string
  ativo: boolean
  chavePix: string | null
  linkVenda: string
  vendas: VendaPortal[]
}) {
  const [tab, setTab] = useState<Tab>("vendas")
  const [copiado, setCopiado] = useState(false)

  const confirmadas = vendas.filter(converteu)
  const aReceber = confirmadas.filter((v) => !v.comissao_paga).reduce((a, v) => a + valor(v), 0)
  const recebido = confirmadas.filter((v) => v.comissao_paga).reduce((a, v) => a + valor(v), 0)

  function copiar() {
    navigator.clipboard.writeText(linkVenda)
    setCopiado(true)
    toast.success("Link copiado! Agora é só divulgar.")
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topo */}
      <header className="bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Portal do Vendedor</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">Olá, {nome.split(" ")[0]} 👋</h1>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-800 font-black shadow-lg">
              2B
            </div>
          </div>

          {!ativo && (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-200">
              Seu cadastro está inativo no momento. Fale com a DoisB para reativar seu link.
            </div>
          )}

          {/* Link de venda — o gerador de comissão */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
              <Link2 className="h-4 w-4" />
              Seu link de venda do ZWeb
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Toda venda feita por este link é sua. Divulgue no WhatsApp, redes e conversas.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <code className="flex-1 truncate rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 text-sm text-slate-200">
                {linkVenda}
              </code>
              <button
                onClick={copiar}
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-blue-50 transition-colors"
              >
                {copiado ? <><Check className="h-4 w-4" /> Copiado</> : <><Copy className="h-4 w-4" /> Copiar link</>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Abas */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          <TabBtn ativo={tab === "vendas"} onClick={() => setTab("vendas")} icon={ShoppingBag}>
            Minhas vendas
          </TabBtn>
          <TabBtn ativo={tab === "roteiro"} onClick={() => setTab("roteiro")} icon={BookOpen}>
            Roteiro de vendas
          </TabBtn>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === "vendas" ? (
          <VendasView
            vendas={vendas}
            confirmadas={confirmadas.length}
            aReceber={aReceber}
            recebido={recebido}
            chavePix={chavePix}
          />
        ) : (
          <RoteiroView />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-slate-400">
        DoisB Sistemas · Venda. Controle. Cresça.
      </footer>
    </div>
  )
}

function TabBtn({
  ativo,
  onClick,
  icon: Icon,
  children,
}: {
  ativo: boolean
  onClick: () => void
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors -mb-px",
        ativo ? "border-blue-700 text-blue-800" : "border-transparent text-slate-500 hover:text-slate-800"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  )
}

function VendasView({
  vendas,
  confirmadas,
  aReceber,
  recebido,
  chavePix,
}: {
  vendas: VendaPortal[]
  confirmadas: number
  aReceber: number
  recebido: number
  chavePix: string | null
}) {
  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi icon={Wallet} cor="amber" label="Comissão a receber" valor={BRL.format(aReceber)} />
        <Kpi icon={BadgeCheck} cor="emerald" label="Comissão recebida" valor={BRL.format(recebido)} />
        <Kpi icon={CircleDollarSign} cor="blue" label="Vendas confirmadas" valor={String(confirmadas)} />
      </div>

      {chavePix && (
        <p className="text-xs text-slate-500">
          Comissão paga na sua chave PIX: <strong className="text-slate-700">{chavePix}</strong>
        </p>
      )}

      {/* Lista */}
      {vendas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Target className="h-8 w-8 mx-auto text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">Nenhuma venda ainda</p>
          <p className="text-sm text-slate-500 mt-1">
            Comece divulgando seu link lá em cima. Assim que alguém assinar por ele, aparece aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendas.map((v) => {
            const conv = converteu(v)
            const st = STATUS_CLIENTE[v.status_pagamento]
            return (
              <div
                key={v.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-950 truncate">{v.nome_empresa}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {PLANO_LABEL[v.plano]} · {[v.cidade, v.estado].filter(Boolean).join("/") || "—"} · cadastro {fmtData(v.created_at)}
                  </p>
                  <span className={cn("inline-flex items-center mt-2 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", st.cls)}>
                    {st.label}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-slate-950">{BRL.format(valor(v))}</p>
                  {!conv ? (
                    <span className="text-xs text-slate-400">comissão em espera</span>
                  ) : v.comissao_paga ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" /> Comissão recebida
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                      <Wallet className="h-3.5 w-3.5" /> A receber
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed">
        A comissão de cada venda é <strong>100% da 1ª mensalidade</strong> do plano e entra como
        &quot;a receber&quot; assim que o cliente confirma o primeiro pagamento. Vendas ainda aguardando
        pagamento aparecem como &quot;comissão em espera&quot;.
      </p>
    </div>
  )
}

function Kpi({
  icon: Icon,
  cor,
  label,
  valor,
}: {
  icon: React.ElementType
  cor: "amber" | "emerald" | "blue"
  label: string
  valor: string
}) {
  const cls = { amber: "bg-amber-50 text-amber-700", emerald: "bg-emerald-50 text-emerald-700", blue: "bg-blue-50 text-blue-700" }[cor]
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-4">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", cls)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-xl font-black text-slate-950 mt-0.5">{valor}</p>
      </div>
    </div>
  )
}

function RoteiroView() {
  const [sel, setSel] = useState<Roteiro["id"]>("zweb")
  const roteiro = ROTEIROS.find((r) => r.id === sel)!

  return (
    <div className="space-y-6">
      {/* Seletor de produto */}
      <div className="grid grid-cols-3 gap-2">
        {ROTEIROS.map((r) => (
          <button
            key={r.id}
            onClick={() => setSel(r.id)}
            className={cn(
              "rounded-xl border px-3 py-3 text-center transition-all",
              sel === r.id
                ? "border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            )}
          >
            <p className="text-sm font-bold">{r.produto}</p>
          </button>
        ))}
      </div>

      {/* Cabeçalho do produto */}
      <div className="rounded-2xl bg-slate-950 text-white p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-300">{roteiro.produto}</p>
        <h2 className="mt-1 text-xl font-black leading-snug">{roteiro.tagline}</h2>
        <p className="mt-2 text-sm text-slate-300">{roteiro.preco}</p>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 px-3 py-2.5">
          <CircleDollarSign className="h-4 w-4 mt-0.5 shrink-0 text-emerald-300" />
          <p className="text-sm text-emerald-100">{roteiro.comoGanho}</p>
        </div>
      </div>

      {/* Regra de ouro */}
      <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5 flex items-start gap-3">
        <Sparkles className="h-5 w-5 shrink-0 text-blue-700 mt-0.5" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Regra de ouro</p>
          <p className="mt-1 text-sm font-medium text-blue-950">{roteiro.regraDeOuro}</p>
        </div>
      </div>

      <Secao icon={Target} titulo="Para quem é">
        <ul className="space-y-2">
          {roteiro.paraQuem.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
              {p}
            </li>
          ))}
        </ul>
      </Secao>

      <Secao icon={Quote} titulo="Ganchos de abertura">
        <div className="space-y-2.5">
          {roteiro.ganchos.map((g, i) => (
            <p key={i} className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-800 italic">
              {g}
            </p>
          ))}
        </div>
      </Secao>

      <Secao icon={Lightbulb} titulo="Dores que você vai ouvir">
        <ul className="space-y-2">
          {roteiro.dores.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
              {d}
            </li>
          ))}
        </ul>
      </Secao>

      <Secao icon={Flag} titulo="Argumentos que fecham">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roteiro.argumentos.map((a, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-950 text-sm">{a.titulo}</p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{a.texto}</p>
            </div>
          ))}
        </div>
      </Secao>

      <Secao icon={ShieldQuestion} titulo="Quebra de objeções">
        <div className="space-y-3">
          {roteiro.objecoes.map((o, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <p className="bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 border-b border-slate-200">
                {o.objecao}
              </p>
              <p className="px-4 py-3 text-sm text-slate-600 leading-relaxed">{o.resposta}</p>
            </div>
          ))}
        </div>
      </Secao>

      <Secao icon={BadgeCheck} titulo="Como fechar">
        <ol className="space-y-2.5">
          {roteiro.fechamento.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white text-[11px] font-bold">
                {i + 1}
              </span>
              {f}
            </li>
          ))}
        </ol>
      </Secao>
    </div>
  )
}

function Secao({
  icon: Icon,
  titulo,
  children,
}: {
  icon: React.ElementType
  titulo: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-slate-950">{titulo}</h3>
      </div>
      {children}
    </section>
  )
}
