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
  MessagesSquare,
  ClipboardList,
  UserPlus,
  Store,
  Globe,
  ArrowLeft,
  ChevronRight,
  Loader2,
  Wand2,
  Users,
  MessageCircle,
  Brain,
  GraduationCap,
  Gauge,
  ArrowRight,
} from "lucide-react"
import { ROTEIROS, REENQUADRAMENTO, VETORES_VALOR, type Roteiro } from "@/lib/roteiros"
import { TREINAMENTOS, type Treinamento, type Bloco } from "@/lib/treinamentos"
import type { ComissaoEntry, StatusComissao } from "@/lib/comissoes"
import {
  recomendar,
  RECOMENDACAO_INFO,
  STATUS_CAPTACAO_INFO,
  STATUS_MANUAIS,
  REGIME_OPCOES,
  USUARIOS_OPCOES,
  CHECKBOXES_OPERACAO,
  CHECKBOXES_SOB_MEDIDA,
  type Respostas,
  type StatusCaptacao,
  type PlanoRecomendado,
  type TipoCaptacao,
} from "@/lib/captacao"
import { cn } from "@/lib/utils"

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const fmtData = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—"

const STATUS_CLIENTE: Record<StatusComissao, { label: string; cls: string }> = {
  aguardando: { label: "Aguardando pagamento", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  ativo: { label: "Cliente ativo", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  atrasado: { label: "Pagamento atrasado", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  cancelado: { label: "Cancelado", cls: "bg-slate-100 text-slate-500 border-slate-200" },
}

type Tab = "vendas" | "captacoes" | "roteiro" | "treinamentos"

export interface Captacao {
  id: string
  tipo: TipoCaptacao
  nome_cliente: string
  whatsapp: string | null
  respostas: Respostas
  plano_recomendado: PlanoRecomendado | null
  motivo_recomendacao: string[] | null
  status: StatusCaptacao
  motivo_perda: string | null
  created_at: string
}

export function PortalClient({
  token,
  nome,
  ativo,
  chavePix,
  linkVenda,
  comissoes,
  captacoesIniciais,
}: {
  token: string
  nome: string
  ativo: boolean
  chavePix: string | null
  linkVenda: string
  comissoes: ComissaoEntry[]
  captacoesIniciais: Captacao[]
}) {
  const [tab, setTab] = useState<Tab>("vendas")
  const [copiado, setCopiado] = useState(false)

  const confirmadas = comissoes.filter((v) => v.convertido)
  const aReceber = confirmadas.filter((v) => !v.comissao_paga).reduce((a, v) => a + v.valor, 0)
  const recebido = confirmadas.filter((v) => v.comissao_paga).reduce((a, v) => a + v.valor, 0)

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
          <TabBtn ativo={tab === "captacoes"} onClick={() => setTab("captacoes")} icon={ClipboardList}>
            Captações
          </TabBtn>
          <TabBtn ativo={tab === "roteiro"} onClick={() => setTab("roteiro")} icon={BookOpen}>
            Roteiro de vendas
          </TabBtn>
          <TabBtn ativo={tab === "treinamentos"} onClick={() => setTab("treinamentos")} icon={GraduationCap}>
            Treinamentos
          </TabBtn>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === "vendas" ? (
          <VendasView
            comissoes={comissoes}
            confirmadas={confirmadas.length}
            aReceber={aReceber}
            recebido={recebido}
            chavePix={chavePix}
          />
        ) : tab === "captacoes" ? (
          <CaptacoesView token={token} ativo={ativo} iniciais={captacoesIniciais} />
        ) : tab === "roteiro" ? (
          <RoteiroView />
        ) : (
          <TreinamentosView />
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
  comissoes,
  confirmadas,
  aReceber,
  recebido,
  chavePix,
}: {
  comissoes: ComissaoEntry[]
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
      {comissoes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Target className="h-8 w-8 mx-auto text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">Nenhuma venda ainda</p>
          <p className="text-sm text-slate-500 mt-1">
            Comece divulgando seu link lá em cima. Assim que alguém assinar por ele, aparece aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comissoes.map((v) => {
            const conv = v.convertido
            const st = STATUS_CLIENTE[v.status]
            return (
              <div
                key={`${v.tipo}:${v.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-950 truncate">{v.cliente}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {v.produto} · {v.local ?? "—"} · {fmtData(v.data)}
                  </p>
                  <span className={cn("inline-flex items-center mt-2 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", st.cls)}>
                    {st.label}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-slate-950">{BRL.format(v.valor)}</p>
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

type ModoRoteiro = "whatsapp" | "presencial"

function RoteiroView() {
  const [sel, setSel] = useState<Roteiro["id"]>("zweb")
  const [modo, setModo] = useState<ModoRoteiro>("whatsapp")
  const [msgCopiada, setMsgCopiada] = useState<string | null>(null)
  const roteiro = ROTEIROS.find((r) => r.id === sel)!

  function copiarMsg(key: string, texto: string) {
    navigator.clipboard.writeText(texto)
    setMsgCopiada(key)
    toast.success("Mensagem copiada!")
    setTimeout(() => setMsgCopiada((c) => (c === key ? null : c)), 2000)
  }

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

      {/* Seletor de modo: WhatsApp x Presencial */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-1.5">
        <ModoBtn ativo={modo === "whatsapp"} onClick={() => setModo("whatsapp")} icon={MessageCircle}>
          Roteiro WhatsApp
        </ModoBtn>
        <ModoBtn ativo={modo === "presencial"} onClick={() => setModo("presencial")} icon={Users}>
          Roteiro presencial
        </ModoBtn>
      </div>

      {/* Regra de ouro (vale nos dois modos) */}
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

      <VetoresValor />

      {modo === "whatsapp" ? (
        <RoteiroWhatsApp roteiro={roteiro} copiarMsg={copiarMsg} msgCopiada={msgCopiada} />
      ) : (
        <RoteiroPresencial roteiro={roteiro} />
      )}
    </div>
  )
}

function ModoBtn({
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
        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
        ativo ? "bg-blue-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  )
}

// ---------- Modo WhatsApp: sequência de mensagens pra colar ----------
function RoteiroWhatsApp({
  roteiro,
  copiarMsg,
  msgCopiada,
}: {
  roteiro: Roteiro
  copiarMsg: (key: string, texto: string) => void
  msgCopiada: string | null
}) {
  return (
    <>
      <section className="rounded-2xl border-2 border-emerald-100 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <MessagesSquare className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-950">Sequência de mensagens</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          O passo a passo do WhatsApp, na ordem. Troque [nome], [seu nome] e [SEU LINK]. Toque pra copiar.
        </p>
        <ol className="space-y-3">
          {roteiro.sequencia.map((passo, i) => {
            const key = `${roteiro.id}:${i}`
            return (
              <li key={key} className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px]">
                      {i + 1}
                    </span>
                    {passo.quando}
                  </span>
                  <button
                    onClick={() => copiarMsg(key, passo.mensagem)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-700 hover:border-blue-200"
                  >
                    {msgCopiada === key ? <><Check className="h-3.5 w-3.5" /> Copiado</> : <><Copy className="h-3.5 w-3.5" /> Copiar</>}
                  </button>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{passo.mensagem}</p>
              </li>
            )
          })}
        </ol>
      </section>

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

      <ReframesRapidos />

      <Secao icon={BadgeCheck} titulo="Como fechar">
        <Fechamento itens={roteiro.fechamento} />
      </Secao>
    </>
  )
}

// ---------- Modo presencial: conversa cara a cara + Técnica 3A ----------
function RoteiroPresencial({ roteiro }: { roteiro: Roteiro }) {
  return (
    <>
      <Secao icon={Quote} titulo="Perguntas pra abrir a conversa">
        <p className="-mt-2 mb-3 text-sm text-slate-500">
          Comece perguntando, não apresentando. Deixe o cliente falar da dor dele primeiro.
        </p>
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

      <Tecnica3A />

      <Secao icon={ShieldQuestion} titulo="Quebra de objeções">
        <p className="-mt-2 mb-3 text-sm text-slate-500">
          Ao vivo, aplique o 3A: <strong>reconheça</strong>, <strong>associe</strong> e devolva com uma{" "}
          <strong>pergunta</strong> antes de responder.
        </p>
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
        <Fechamento itens={roteiro.fechamento} />
      </Secao>
    </>
  )
}

function Fechamento({ itens }: { itens: string[] }) {
  return (
    <ol className="space-y-2.5">
      {itens.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white text-[11px] font-bold">
            {i + 1}
          </span>
          {f}
        </li>
      ))}
    </ol>
  )
}

// Card completo da Técnica 3A de reenquadramento (modo presencial).
function Tecnica3A() {
  const t = REENQUADRAMENTO
  return (
    <section className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
          <Brain className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-slate-950">{t.nome}</h3>
      </div>
      <p className="text-sm font-semibold text-indigo-700">{t.chamada}</p>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.resumo}</p>

      {/* 3 passos */}
      <div className="mt-4 space-y-2.5">
        {t.passos.map((p, i) => (
          <div key={i} className="rounded-xl border border-indigo-100 bg-white p-4">
            <p className="text-sm font-bold text-indigo-800">{p.titulo}</p>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{p.texto}</p>
            <p className="mt-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm italic text-indigo-900">{p.exemplo}</p>
          </div>
        ))}
      </div>

      {/* 5 regras */}
      <p className="mt-5 mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">As 5 regras</p>
      <ul className="space-y-2">
        {t.regras.map((r, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-[11px] font-bold">
              {i + 1}
            </span>
            <span className="text-slate-700">
              <strong className="text-slate-900">{r.titulo}.</strong> {r.texto}
            </span>
          </li>
        ))}
      </ul>

      {/* Reframes prontos */}
      <p className="mt-5 mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">Reenquadramentos prontos</p>
      <ReframeList />

      <p className="mt-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-indigo-100">
        {t.mantra}
      </p>
    </section>
  )
}

// Versão compacta dos reframes (usada no modo WhatsApp como cheat-sheet).
function ReframesRapidos() {
  return (
    <Secao icon={Brain} titulo="Reenquadramentos rápidos (3A)">
      <p className="-mt-2 mb-3 text-sm text-slate-500">
        Respostas prontas pras objeções mais comuns. A técnica completa está na aba{" "}
        <strong>Roteiro presencial</strong>.
      </p>
      <ReframeList />
    </Secao>
  )
}

function ReframeList() {
  return (
    <div className="space-y-3">
      {REENQUADRAMENTO.reframes.map((r, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <p className="bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 border-b border-slate-200">
            {r.objecao}
          </p>
          <p className="px-4 py-3 text-sm text-slate-600 leading-relaxed">{r.como}</p>
        </div>
      ))}
    </div>
  )
}

// Vetores de valor — argumento essencial (arquivo 3), nos dois modos do roteiro.
function VetoresValor() {
  return (
    <Secao icon={Gauge} titulo="Vetores de valor (não brigue por preço)">
      <p className="-mt-2 mb-3 text-sm text-slate-500">{VETORES_VALOR.intro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {VETORES_VALOR.itens.map((v, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-bold text-slate-950 text-sm">{v.titulo}</p>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{v.texto}</p>
          </div>
        ))}
      </div>
    </Secao>
  )
}

// ============================================================
// Treinamentos — apresentações visuais pra ensinar os vendedores
// ============================================================

const COR_TREINO = {
  blue: { grad: "from-blue-600 to-blue-900", chip: "bg-blue-100 text-blue-700", ring: "border-blue-100", dot: "bg-blue-600", soft: "bg-blue-50" },
  indigo: { grad: "from-indigo-600 to-indigo-900", chip: "bg-indigo-100 text-indigo-700", ring: "border-indigo-100", dot: "bg-indigo-600", soft: "bg-indigo-50" },
  emerald: { grad: "from-emerald-600 to-emerald-900", chip: "bg-emerald-100 text-emerald-700", ring: "border-emerald-100", dot: "bg-emerald-600", soft: "bg-emerald-50" },
} as const

function PublicoBadge({ publico }: { publico: Treinamento["publico"] }) {
  const vend = publico.tipo === "vendedor"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold",
        vend ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"
      )}
    >
      {vend ? <Users className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
      {vend ? "Ensine aos vendedores" : "Base de estudo"}
    </span>
  )
}

function TreinamentosView() {
  const [abertoId, setAbertoId] = useState<string | null>(null)
  const aberto = TREINAMENTOS.find((t) => t.id === abertoId) ?? null

  if (aberto) return <TreinamentoDetalhe treino={aberto} onVoltar={() => setAbertoId(null)} />

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-slate-950">Treinamentos de venda</h2>
        <p className="text-sm text-slate-500">
          Apresentações completas pra estudar e ensinar a equipe. A etiqueta indica o que usar com os vendedores.
        </p>
      </div>

      <div className="space-y-3">
        {TREINAMENTOS.map((t) => {
          const c = COR_TREINO[t.cor]
          return (
            <button
              key={t.id}
              onClick={() => setAbertoId(t.id)}
              className="w-full text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all flex items-start gap-4"
            >
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white font-black bg-gradient-to-br", c.grad)}>
                {t.numero}
              </div>
              <div className="min-w-0 flex-1">
                <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", c.chip)}>
                  {t.etiqueta}
                </span>
                <p className="mt-1.5 font-black text-slate-950 leading-snug">{t.titulo}</p>
                <p className="text-sm text-slate-500 mt-0.5">{t.subtitulo}</p>
                <div className="mt-2.5">
                  <PublicoBadge publico={t.publico} />
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 mt-1" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TreinamentoDetalhe({ treino, onVoltar }: { treino: Treinamento; onVoltar: () => void }) {
  const c = COR_TREINO[treino.cor]
  return (
    <div className="space-y-6">
      <VoltarBtn onClick={onVoltar} label="Todos os treinamentos" />

      {/* Hero */}
      <div className={cn("rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-br", c.grad)}>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 font-black">{treino.numero}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">{treino.etiqueta}</span>
        </div>
        <h2 className="mt-3 text-2xl font-black leading-tight">{treino.titulo}</h2>
        <p className="mt-1 text-base font-medium text-white/85">{treino.subtitulo}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/80">{treino.resumo}</p>
        <div className="mt-4">
          <PublicoBadge publico={treino.publico} />
        </div>
        {treino.publico.nota && (
          <p className="mt-2 text-xs text-white/70">{treino.publico.nota}</p>
        )}
      </div>

      {/* Seções */}
      {treino.secoes.map((s, i) => (
        <section key={i} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-white text-sm font-black", c.dot)}>
              {i + 1}
            </span>
            <h3 className="font-black text-slate-950 leading-snug">{s.titulo}</h3>
          </div>
          <div className="space-y-3">
            {s.blocos.map((b, j) => (
              <BlocoView key={j} bloco={b} cor={treino.cor} />
            ))}
          </div>
        </section>
      ))}

      {/* Como usar no ZWeb */}
      <section className={cn("rounded-2xl border-2 p-5 sm:p-6", c.ring, c.soft)}>
        <div className="flex items-center gap-2 mb-4">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-white", c.dot)}>
            <ArrowRight className="h-4 w-4" />
          </div>
          <h3 className="font-black text-slate-950">Como usar no ZWeb</h3>
        </div>
        <div className="space-y-3">
          {treino.aplicacao.map((b, j) => (
            <BlocoView key={j} bloco={b} cor={treino.cor} />
          ))}
        </div>
      </section>
    </div>
  )
}

function BlocoView({ bloco, cor }: { bloco: Bloco; cor: Treinamento["cor"] }) {
  const c = COR_TREINO[cor]
  switch (bloco.tipo) {
    case "paragrafo":
      return <p className="text-sm text-slate-700 leading-relaxed">{bloco.texto}</p>
    case "destaque": {
      const tom = bloco.tom ?? "info"
      const cls = {
        info: "border-blue-200 bg-blue-50 text-blue-950",
        alerta: "border-amber-200 bg-amber-50 text-amber-950",
        sucesso: "border-emerald-200 bg-emerald-50 text-emerald-950",
      }[tom]
      return <p className={cn("rounded-xl border px-4 py-3 text-sm font-medium leading-relaxed", cls)}>{bloco.texto}</p>
    }
    case "citacao":
      return (
        <blockquote className="relative rounded-xl bg-slate-950 px-5 py-4 text-sm font-medium italic text-slate-100 leading-relaxed">
          <span className="absolute left-2 top-1 text-3xl leading-none text-white/20">“</span>
          <span className="relative">{bloco.texto}</span>
        </blockquote>
      )
    case "lista":
      return (
        <ul className="space-y-2">
          {bloco.itens.map((it, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
              <Check className={cn("h-4 w-4 mt-0.5 shrink-0", cor === "emerald" ? "text-emerald-600" : cor === "indigo" ? "text-indigo-600" : "text-blue-600")} />
              {it}
            </li>
          ))}
        </ul>
      )
    case "passos":
      return (
        <div className="space-y-2.5">
          {bloco.itens.map((p, i) => (
            <div key={i} className={cn("rounded-xl border bg-white p-4", c.ring)}>
              <p className={cn("text-sm font-bold", cor === "emerald" ? "text-emerald-800" : cor === "indigo" ? "text-indigo-800" : "text-blue-800")}>
                {p.titulo}
              </p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{p.texto}</p>
              {p.exemplo && (
                <p className={cn("mt-2 rounded-lg px-3 py-2 text-sm italic text-slate-800", c.soft)}>{p.exemplo}</p>
              )}
            </div>
          ))}
        </div>
      )
    case "cards":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bloco.itens.map((it, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-950 text-sm">{it.titulo}</p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{it.texto}</p>
            </div>
          ))}
        </div>
      )
    case "tabela":
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2.5 font-bold text-slate-800 whitespace-nowrap">{bloco.colunas[0]}</th>
                <th className="px-4 py-2.5 font-bold text-slate-800">{bloco.colunas[1]}</th>
              </tr>
            </thead>
            <tbody>
              {bloco.linhas.map((linha, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{linha[0]}</td>
                  <td className="px-4 py-2.5 text-slate-600 leading-relaxed">{linha[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
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

// ============================================================
// Captações — funil de leads do vendedor (só controle interno)
// ============================================================

function CaptacoesView({
  token,
  ativo,
  iniciais,
}: {
  token: string
  ativo: boolean
  iniciais: Captacao[]
}) {
  const [lista, setLista] = useState<Captacao[]>(iniciais)
  const [abertaId, setAbertaId] = useState<string | null>(null)
  const [criando, setCriando] = useState(false)

  const aberta = lista.find((c) => c.id === abertaId) ?? null

  async function api(method: "POST" | "PATCH", body: unknown): Promise<Captacao> {
    const res = await fetch(`/api/vendedor/${token}/captacoes`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error ?? "Não foi possível salvar")
    return data as Captacao
  }

  function upsert(c: Captacao) {
    setLista((prev) => {
      const i = prev.findIndex((x) => x.id === c.id)
      if (i === -1) return [c, ...prev]
      const copy = [...prev]
      copy[i] = c
      return copy
    })
  }

  if (criando) {
    return (
      <NovaCaptacao
        onCancelar={() => setCriando(false)}
        onCriar={async (payload) => {
          const c = await api("POST", payload)
          upsert(c)
          setCriando(false)
          setAbertaId(c.id)
        }}
      />
    )
  }

  if (aberta) {
    return (
      <CaptacaoDetalhe
        captacao={aberta}
        onVoltar={() => setAbertaId(null)}
        onFinalizar={async (respostas) => {
          upsert(await api("PATCH", { id: aberta.id, acao: "finalizar", respostas }))
        }}
        onStatus={async (status, motivo) => {
          upsert(await api("PATCH", { id: aberta.id, acao: "status", status, motivo_perda: motivo }))
        }}
      />
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Captações</h2>
          <p className="text-sm text-slate-500">Registre cada contato e descubra o plano ideal.</p>
        </div>
        <button
          onClick={() => setCriando(true)}
          disabled={!ativo}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          Nova captação
        </button>
      </div>

      {lista.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <ClipboardList className="h-8 w-8 mx-auto text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">Nenhuma captação ainda</p>
          <p className="text-sm text-slate-500 mt-1">
            Toque em <strong>Nova captação</strong> quando começar uma conversa com um cliente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((c) => {
            const st = STATUS_CAPTACAO_INFO[c.status]
            const rec = c.plano_recomendado ? RECOMENDACAO_INFO[c.plano_recomendado] : null
            return (
              <button
                key={c.id}
                onClick={() => setAbertaId(c.id)}
                className="w-full text-left rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-blue-300 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {c.tipo === "fisica" ? (
                      <Store className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Globe className="h-4 w-4 text-slate-400" />
                    )}
                    <p className="font-bold text-slate-950 truncate">{c.nome_cliente}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", st.cls)}>
                      {st.label}
                    </span>
                    {rec && (
                      <span className="text-[11px] font-medium text-slate-500">
                        Indicação: <strong className="text-slate-700">{rec.label}</strong>
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
              </button>
            )
          })}
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed">
        Esta aba é só para <strong>seu controle</strong> — não gera venda nem comissão. A comissão continua
        entrando automaticamente quando o cliente assina pelo seu link.
      </p>
    </div>
  )
}

function NovaCaptacao({
  onCriar,
  onCancelar,
}: {
  onCriar: (p: { tipo: TipoCaptacao; nome_cliente: string; whatsapp: string }) => Promise<void>
  onCancelar: () => void
}) {
  const [tipo, setTipo] = useState<TipoCaptacao | null>(null)
  const [nome, setNome] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [salvando, setSalvando] = useState(false)

  async function iniciar() {
    if (!tipo) return toast.error("Escolha visita física ou online")
    if (nome.trim().length < 2) return toast.error("Informe o nome do cliente")
    setSalvando(true)
    try {
      await onCriar({ tipo, nome_cliente: nome.trim(), whatsapp: whatsapp.trim() })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao iniciar")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-5">
      <VoltarBtn onClick={onCancelar} label="Cancelar" />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-black text-slate-950">Nova captação</h2>
          <p className="text-sm text-slate-500">Como é o contato?</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([
            { v: "fisica" as const, icon: Store, label: "Visita física" },
            { v: "online" as const, icon: Globe, label: "Online" },
          ]).map(({ v, icon: Icon, label }) => (
            <button
              key={v}
              onClick={() => setTipo(v)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all",
                tipo === v ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-bold">{label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Nome do cliente</label>
            <input
              data-slot="input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Loja do João"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">WhatsApp (opcional)</label>
            <input
              data-slot="input"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              inputMode="tel"
              placeholder="(51) 99999-9999"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <button
          onClick={iniciar}
          disabled={salvando}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
          Iniciar captação
        </button>
      </div>
    </div>
  )
}

function CaptacaoDetalhe({
  captacao,
  onVoltar,
  onFinalizar,
  onStatus,
}: {
  captacao: Captacao
  onVoltar: () => void
  onFinalizar: (respostas: Respostas) => Promise<void>
  onStatus: (status: StatusCaptacao, motivo: string) => Promise<void>
}) {
  const [respostas, setRespostas] = useState<Respostas>(captacao.respostas ?? {})
  const [salvando, setSalvando] = useState(false)
  const [motivoPerda, setMotivoPerda] = useState(captacao.motivo_perda ?? "")

  const st = STATUS_CAPTACAO_INFO[captacao.status]
  const finalizada = captacao.status !== "iniciada"
  const preview = recomendar(respostas)
  const recInfo = RECOMENDACAO_INFO[preview.plano]

  function set(chave: keyof Respostas, valor: unknown) {
    setRespostas((r) => ({ ...r, [chave]: valor }))
  }
  function toggle(chave: keyof Respostas) {
    setRespostas((r) => ({ ...r, [chave]: !r[chave] }))
  }

  async function finalizar() {
    setSalvando(true)
    try {
      await onFinalizar(respostas)
      toast.success("Captação finalizada!")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao finalizar")
    } finally {
      setSalvando(false)
    }
  }

  async function mudarStatus(novo: StatusCaptacao) {
    if (novo === "venda_negada" && motivoPerda.trim().length === 0) {
      toast.error("Escreva o motivo antes de marcar como negada")
      return
    }
    setSalvando(true)
    try {
      await onStatus(novo, motivoPerda.trim())
      toast.success("Status atualizado")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-5">
      <VoltarBtn onClick={onVoltar} label="Voltar" />

      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {captacao.tipo === "fisica" ? <Store className="h-4 w-4 text-slate-400" /> : <Globe className="h-4 w-4 text-slate-400" />}
              <h2 className="text-lg font-black text-slate-950 truncate">{captacao.nome_cliente}</h2>
            </div>
            {captacao.whatsapp && <p className="text-sm text-slate-500 mt-0.5">{captacao.whatsapp}</p>}
          </div>
          <span className={cn("inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", st.cls)}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Questionário */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <ClipboardList className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-slate-950">Perguntas estratégicas</h3>
        </div>
        <p className="-mt-3 text-sm text-slate-500">Vá marcando conforme o cliente responde.</p>

        <Pergunta titulo="Regime tributário">
          <Segmented
            valor={respostas.regime}
            opcoes={REGIME_OPCOES}
            onEscolher={(v) => set("regime", v)}
          />
        </Pergunta>

        <Pergunta titulo="Quantas pessoas vão usar?">
          <Segmented
            valor={respostas.usuarios}
            opcoes={USUARIOS_OPCOES}
            onEscolher={(v) => set("usuarios", v)}
          />
        </Pergunta>

        <Pergunta titulo="Marque tudo que se aplica">
          <div className="space-y-2">
            {CHECKBOXES_OPERACAO.map((c) => (
              <CheckLinha key={c.chave} checked={!!respostas[c.chave]} onToggle={() => toggle(c.chave)}>
                {c.label}
              </CheckLinha>
            ))}
          </div>
        </Pergunta>

        <Pergunta titulo="É caso de sistema sob medida?">
          <div className="space-y-2">
            {CHECKBOXES_SOB_MEDIDA.map((c) => (
              <CheckLinha key={c.chave} checked={!!respostas[c.chave]} onToggle={() => toggle(c.chave)}>
                {c.label}
              </CheckLinha>
            ))}
          </div>
        </Pergunta>
      </div>

      {/* Recomendação (prévia ao vivo + resultado ao finalizar) */}
      {preview.plano !== "indefinido" && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-emerald-800">
            <Wand2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wide">
              {finalizada ? "Plano recomendado" : "Indicação prévia"}
            </span>
          </div>
          <p className="mt-1 text-xl font-black text-emerald-950">{recInfo.label}</p>
          {recInfo.sub && <p className="text-sm text-emerald-800">{recInfo.sub}</p>}
          <ul className="mt-3 space-y-1.5">
            {preview.motivos.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-medium text-emerald-800">{recInfo.acao}</p>
        </div>
      )}

      {/* Ação: finalizar questionário */}
      {!finalizada && (
        <button
          onClick={finalizar}
          disabled={salvando}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
        >
          {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
          Finalizar questionário
        </button>
      )}

      {/* Controle de status (após finalizar) */}
      {finalizada && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-slate-500" />
            <h3 className="font-bold text-slate-950">Andamento (controle interno)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {STATUS_MANUAIS.map((s) => {
              const info = STATUS_CAPTACAO_INFO[s]
              const ativoBtn = captacao.status === s
              return (
                <button
                  key={s}
                  onClick={() => mudarStatus(s)}
                  disabled={salvando}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all disabled:opacity-50",
                    ativoBtn ? info.cls : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  {info.label}
                </button>
              )
            })}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Motivo (se venda negada)
            </label>
            <input
              data-slot="input"
              value={motivoPerda}
              onChange={(e) => setMotivoPerda(e.target.value)}
              placeholder="Ex: achou caro, foi pra concorrência…"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function VoltarBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  )
}

function Pergunta({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-slate-800">{titulo}</p>
      {children}
    </div>
  )
}

function Segmented<T extends string>({
  valor,
  opcoes,
  onEscolher,
}: {
  valor: T | undefined
  opcoes: { valor: T; label: string }[]
  onEscolher: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          onClick={() => onEscolher(o.valor)}
          className={cn(
            "rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all",
            valor === o.valor
              ? "border-blue-700 bg-blue-700 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function CheckLinha({
  checked,
  onToggle,
  children,
}: {
  checked: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full text-left flex items-start gap-3 rounded-xl border px-3.5 py-3 transition-all",
        checked ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-white"
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className={cn("text-sm", checked ? "text-blue-950 font-medium" : "text-slate-700")}>
        {children}
      </span>
    </button>
  )
}
