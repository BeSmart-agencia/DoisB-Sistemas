"use client"

import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { precoMensalDe } from "@/lib/planos"
import {
  Info, Save, TrendingUp, DollarSign, PiggyBank, Wallet,
  ChevronDown, CheckCircle2, Minus, Plus, Trophy, Target,
} from "lucide-react"

// ---------------------------------------------------------------
// Tipos vindos do banco
// ---------------------------------------------------------------
export interface Premissas {
  // DoisB Web (carro-chefe)
  doisb_vendedora: number
  doisb_socios_m1: number
  doisb_socios: number
  doisb_mix_essencial: number
  doisb_mix_standard: number
  doisb_custo_fixo: number
  // ZWeb (nicho)
  zweb_vendedora: number
  zweb_socios_m1: number
  zweb_socios: number
  mix_essencial: number
  mix_standard: number
  mix_premium: number
  // Sob medida + gerais
  sob_medida_mes: number
  dev_sm: number
  mens_sm: number
  pro_labore_pct: number
  outros_custos: number
}

export interface RealizadoRow {
  mes: string // YYYY-MM-DD
  metrica: string
  valor: number
}

type Metrica = "doisb_vendedora" | "doisb_socios" | "zweb_vendedora" | "zweb_socios" | "sob_medida"

// ---------------------------------------------------------------
// Preços (da tabela central) e custos
// ---------------------------------------------------------------
// Preços de venda vêm de lib/planos — nunca desatualizam.
const PRECO_DOISB = {
  essencial: precoMensalDe("doisb-web", "essencial"), // 129,90
  standard: precoMensalDe("doisb-web", "standard"),   // 189,90
}
const PRECO_ZWEB = {
  essencial: precoMensalDe("zweb", "essencial"), // 199,90
  standard: precoMensalDe("zweb", "standard"),   // 249,90
  premium: precoMensalDe("zweb", "premium"),     // 299,90
}
// Custo do ZWeb por cliente (Zucchetti). O DoisB Web não tem custo por
// cliente — é um custo fixo mensal (pacote Nuts), editável nas premissas.
const CUSTO_ZWEB = { essencial: 31.79, standard: 45.49, premium: 69.7 }

const MESES_INICIO = { ano: 2026, mes: 7 } // agosto/2026 (0-index: 7)
const LIMITE_MEI = 81000

const METRICAS: { chave: Metrica; label: string; cor: string }[] = [
  { chave: "doisb_vendedora", label: "DoisB Web — vendedora externa", cor: "emerald" },
  { chave: "doisb_socios", label: "DoisB Web — sócios (Abel/Laisa)", cor: "emerald" },
  { chave: "zweb_vendedora", label: "ZWeb — vendedora externa", cor: "blue" },
  { chave: "zweb_socios", label: "ZWeb — sócios (Abel/Laisa)", cor: "blue" },
  { chave: "sob_medida", label: "Sob medida entregue", cor: "violet" },
]

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function brl(v: number): string {
  return (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
function mesIso(offset: number): string {
  const d = new Date(MESES_INICIO.ano, MESES_INICIO.mes + offset, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
}
function rotuloMes(offset: number): string {
  const d = new Date(MESES_INICIO.ano, MESES_INICIO.mes + offset, 1)
  const s = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function mesAtualIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
}
const num = (s: string) => {
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
const labelCls = "block text-[11px] font-bold uppercase tracking-wide text-blue-900 mb-1"

const BAR_COR: Record<string, string> = {
  emerald: "from-emerald-500 to-emerald-400",
  blue: "from-blue-600 to-sky-400",
  violet: "from-violet-600 to-fuchsia-400",
}

// ===============================================================
export function MetasPlanner({
  premissasIniciais,
  realizadoInicial,
}: {
  premissasIniciais: Premissas
  realizadoInicial: RealizadoRow[]
}) {
  // -------- Premissas (editáveis, salvas no banco) --------
  const [p, setP] = useState<Premissas>(premissasIniciais)
  const [salvo, setSalvo] = useState<Premissas>(premissasIniciais)
  const [salvandoPrem, setSalvandoPrem] = useState(false)
  const dirty = JSON.stringify(p) !== JSON.stringify(salvo)
  const setPremissa = (k: keyof Premissas, v: number) => setP((prev) => ({ ...prev, [k]: v }))

  async function salvarPremissas() {
    setSalvandoPrem(true)
    try {
      const res = await fetch("/api/admin/metas/premissas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      })
      if (!res.ok) throw new Error()
      setSalvo(p)
      toast.success("Metas salvas! 🎯")
    } catch {
      toast.error("Erro ao salvar as metas.")
    } finally {
      setSalvandoPrem(false)
    }
  }

  // -------- Realizado (contador vs meta, salvo no banco) --------
  const [real, setReal] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    for (const r of realizadoInicial) map[`${r.mes}|${r.metrica}`] = Number(r.valor) || 0
    return map
  })
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const getReal = (mes: string, metrica: Metrica) => real[`${mes}|${metrica}`] ?? 0

  function setRealizado(mes: string, metrica: Metrica, valor: number) {
    const v = Math.max(0, Math.round(valor))
    const key = `${mes}|${metrica}`
    setReal((prev) => ({ ...prev, [key]: v }))
    clearTimeout(timers.current[key])
    timers.current[key] = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/metas/realizado", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mes, metrica, valor: v }),
        })
        if (!res.ok) throw new Error()
      } catch {
        toast.error("Erro ao salvar o progresso.")
      }
    }, 600)
  }

  // -------- Ticket médio por produto (a partir do mix) --------
  const mixD = p.doisb_mix_essencial + p.doisb_mix_standard || 1
  const avgPriceD =
    (p.doisb_mix_essencial * PRECO_DOISB.essencial + p.doisb_mix_standard * PRECO_DOISB.standard) / mixD

  const mixZ = p.mix_essencial + p.mix_standard + p.mix_premium || 1
  const avgPriceZ =
    (p.mix_essencial * PRECO_ZWEB.essencial +
      p.mix_standard * PRECO_ZWEB.standard +
      p.mix_premium * PRECO_ZWEB.premium) / mixZ
  const avgCostZ =
    (p.mix_essencial * CUSTO_ZWEB.essencial +
      p.mix_standard * CUSTO_ZWEB.standard +
      p.mix_premium * CUSTO_ZWEB.premium) / mixZ

  // -------- Projeção mês a mês (agosto/26 → julho/27) --------
  const linhas = useMemo(() => {
    let caixaAcum = 0
    let faturAcum = 0
    let ativosDAntes = 0
    let ativosZAntes = 0
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1

      // DoisB Web (carro-chefe)
      const doisbVend = p.doisb_vendedora
      const doisbSocios = m === 1 ? p.doisb_socios_m1 : p.doisb_socios
      const novosD = doisbVend + doisbSocios
      const ativosD = ativosDAntes + novosD
      // 1ª mensalidade dos clientes da vendedora vira comissão dela (não entra no caixa nesse mês)
      const recD = (ativosD - doisbVend) * avgPriceD

      // ZWeb (nicho)
      const zwebVend = p.zweb_vendedora
      const zwebSocios = m === 1 ? p.zweb_socios_m1 : p.zweb_socios
      const novosZ = zwebVend + zwebSocios
      const ativosZ = ativosZAntes + novosZ
      const recZ = (ativosZ - zwebVend) * avgPriceZ
      const custoZ = ativosZ * avgCostZ

      // Sob medida
      const smDev = p.sob_medida_mes * p.dev_sm
      const smMens = (m - 1) * p.sob_medida_mes * p.mens_sm
      const recSM = smDev + smMens

      const receitaDoisB = recD + recZ + recSM
      // Custo do DoisB Web é fixo mensal (pacote Nuts), não por cliente
      const custos = custoZ + p.doisb_custo_fixo + p.outros_custos
      const lucro = receitaDoisB - custos
      const proLaboreTotal = Math.max(0, lucro) * (p.pro_labore_pct / 100)
      const proLaboreCada = proLaboreTotal / 2
      const caixaMes = lucro - proLaboreTotal
      caixaAcum += caixaMes

      const faturamentoBruto = ativosD * avgPriceD + ativosZ * avgPriceZ + recSM
      faturAcum += faturamentoBruto
      ativosDAntes = ativosD
      ativosZAntes = ativosZ

      const mes = mesIso(i)
      const novosTotal = novosD + novosZ
      const ativosTotal = ativosD + ativosZ
      const metaReceitaNova = novosD * avgPriceD + novosZ * avgPriceZ + smDev
      return {
        i, m, mes, rotulo: rotuloMes(i),
        doisbVend, doisbSocios, zwebVend, zwebSocios, metaSM: p.sob_medida_mes,
        novosD, novosZ, novosTotal, ativosD, ativosZ, ativosTotal,
        recD, recZ, recSM, custos, lucro, proLaboreCada,
        caixaMes, caixaAcum, faturamentoBruto, faturAcum, metaReceitaNova,
      }
    })
  }, [p, avgPriceD, avgPriceZ, avgCostZ])

  const ultimo = linhas[linhas.length - 1]
  const mesLimiteMEI = linhas.find((l) => l.faturAcum > LIMITE_MEI)
  const totalProLaboreCada = linhas.reduce((s, l) => s + l.proLaboreCada, 0)
  const mrr12 = ultimo.recD + ultimo.recZ + 11 * p.sob_medida_mes * p.mens_sm

  const cards = [
    { icon: TrendingUp, label: "MRR no mês 12", valor: brl(mrr12), sub: `${ultimo.ativosTotal} assinantes + sob medida` },
    { icon: DollarSign, label: "Pró-labore de cada (mês 12)", valor: brl(ultimo.proLaboreCada), sub: "Laisa e Abel" },
    { icon: PiggyBank, label: "Caixa ao fim do ano", valor: brl(ultimo.caixaAcum), sub: "acumulado 12 meses" },
    { icon: Wallet, label: "Pró-labore/ano de cada", valor: brl(totalProLaboreCada), sub: "somando os 12 meses" },
  ]

  // -------- Progresso global (todas as metas de contagem, 12 meses) --------
  const metaDoMes = (l: (typeof linhas)[number]): Record<Metrica, number> => ({
    doisb_vendedora: l.doisbVend,
    doisb_socios: l.doisbSocios,
    zweb_vendedora: l.zwebVend,
    zweb_socios: l.zwebSocios,
    sob_medida: l.metaSM,
  })
  const totalMeta = linhas.reduce((s, l) => {
    const mt = metaDoMes(l)
    return s + mt.doisb_vendedora + mt.doisb_socios + mt.zweb_vendedora + mt.zweb_socios + mt.sob_medida
  }, 0)
  const totalReal = linhas.reduce(
    (s, l) =>
      s + METRICAS.reduce((a, mt) => a + getReal(l.mes, mt.chave), 0),
    0
  )
  const pctGlobal = totalMeta > 0 ? Math.round((totalReal / totalMeta) * 100) : 0

  const mesAtual = mesAtualIso()
  const [aberto, setAberto] = useState<string | null>(
    linhas.find((l) => l.mes >= mesAtual)?.mes ?? linhas[0]?.mes ?? null
  )

  return (
    <div className="space-y-6">
      {/* ============ PREMISSAS (metas editáveis) ============ */}
      <div className="admin-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-blue-900">
            <Target className="h-4 w-4" />
            <h2 className="text-sm font-bold uppercase tracking-wide">Nossas metas (edite e a projeção recalcula)</h2>
          </div>
          <button
            onClick={salvarPremissas}
            disabled={!dirty || salvandoPrem}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              dirty ? "bg-slate-950 text-white hover:bg-blue-900" : "bg-slate-100 text-slate-400 cursor-default"
            )}
          >
            <Save className="h-4 w-4" />
            {salvandoPrem ? "Salvando..." : dirty ? "Salvar metas" : "Salvo"}
          </button>
        </div>

        {/* DoisB Web */}
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 mb-2">DoisB Web · carro-chefe</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Campo label="Vendedora / mês" value={p.doisb_vendedora} onChange={(v) => setPremissa("doisb_vendedora", v)} />
          <Campo label="Sócios — mês 1 (ago)" value={p.doisb_socios_m1} onChange={(v) => setPremissa("doisb_socios_m1", v)} />
          <Campo label="Sócios — demais" value={p.doisb_socios} onChange={(v) => setPremissa("doisb_socios", v)} />
          <Campo label="% Essencial" value={p.doisb_mix_essencial} onChange={(v) => setPremissa("doisb_mix_essencial", v)} />
          <Campo label="% Standard" value={p.doisb_mix_standard} onChange={(v) => setPremissa("doisb_mix_standard", v)} />
          <Campo label="Custo fixo Nuts/mês (R$)" value={p.doisb_custo_fixo} onChange={(v) => setPremissa("doisb_custo_fixo", v)} />
        </div>

        {/* ZWeb */}
        <p className="text-[11px] font-bold uppercase tracking-wide text-sky-700 mt-5 mb-2">ZWeb · nicho premium</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Campo label="Vendedora / mês" value={p.zweb_vendedora} onChange={(v) => setPremissa("zweb_vendedora", v)} />
          <Campo label="Sócios — mês 1 (ago)" value={p.zweb_socios_m1} onChange={(v) => setPremissa("zweb_socios_m1", v)} />
          <Campo label="Sócios — demais" value={p.zweb_socios} onChange={(v) => setPremissa("zweb_socios", v)} />
          <Campo label="% Essencial" value={p.mix_essencial} onChange={(v) => setPremissa("mix_essencial", v)} />
          <Campo label="% Standard" value={p.mix_standard} onChange={(v) => setPremissa("mix_standard", v)} />
          <Campo label="% Premium" value={p.mix_premium} onChange={(v) => setPremissa("mix_premium", v)} />
        </div>

        {/* Sob medida + gerais */}
        <p className="text-[11px] font-bold uppercase tracking-wide text-violet-700 mt-5 mb-2">Sob medida e gerais</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Campo label="Sob medida / mês" value={p.sob_medida_mes} onChange={(v) => setPremissa("sob_medida_mes", v)} />
          <Campo label="Dev sob medida (R$)" value={p.dev_sm} onChange={(v) => setPremissa("dev_sm", v)} />
          <Campo label="Mensalidade sob medida (R$)" value={p.mens_sm} onChange={(v) => setPremissa("mens_sm", v)} />
          <Campo label="% Pró-labore (resto = caixa)" value={p.pro_labore_pct} onChange={(v) => setPremissa("pro_labore_pct", v)} />
          <Campo label="Imposto MEI (DAS)/mês (R$)" value={p.outros_custos} onChange={(v) => setPremissa("outros_custos", v)} />
        </div>

        <p className="text-xs text-slate-600 mt-4">
          Ticket médio <b className="text-emerald-700">DoisB Web {brl(avgPriceD)}</b> ·{" "}
          <b className="text-sky-700">ZWeb {brl(avgPriceZ)}</b> (custo {brl(avgCostZ)}/cliente). O custo do DoisB Web é
          fixo mensal (pacote Nuts): <b className="text-slate-800">{brl(p.doisb_custo_fixo)}</b>. Plano começa em{" "}
          <b className="text-slate-800">agosto/2026</b>.
        </p>
      </div>

      {/* ============ RESUMO ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="admin-panel p-5">
            <div className="flex items-center gap-2 text-blue-900">
              <c.icon className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wide">{c.label}</p>
            </div>
            <p className="text-2xl font-black text-slate-950 mt-2">{c.valor}</p>
            <p className="text-xs text-slate-600 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {mesLimiteMEI && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex gap-3">
          <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-900">
            <b>Teto do MEI (R$ 81.000/ano) é ultrapassado em {mesLimiteMEI.rotulo}.</b> O faturamento acumulado passa de{" "}
            {brl(mesLimiteMEI.faturAcum)} nesse mês — a partir daí é preciso migrar para <b>ME (Simples Nacional)</b>.
          </div>
        </div>
      )}

      {/* ============ ACOMPANHAMENTO (contador vs meta) ============ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-blue-900" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900">Progresso mês a mês</h2>
        </div>

        <div className="admin-panel p-5 mb-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-slate-950">Progresso do plano (ago/26 → jul/27)</p>
            <p className="text-sm font-bold text-blue-800">{totalReal}/{totalMeta} · {pctGlobal}%</p>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all"
              style={{ width: `${Math.min(100, pctGlobal)}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {linhas.map((l) => {
            const metas = metaDoMes(l)
            const somaMeta = METRICAS.reduce((a, mt) => a + metas[mt.chave], 0)
            const somaReal = METRICAS.reduce((a, mt) => a + getReal(l.mes, mt.chave), 0)
            const pct = somaMeta > 0 ? Math.round((somaReal / somaMeta) * 100) : 0
            const completo = somaReal >= somaMeta && somaMeta > 0
            const expandido = aberto === l.mes
            const ehAtual = l.mes === mesAtual

            const realReceita =
              (getReal(l.mes, "doisb_vendedora") + getReal(l.mes, "doisb_socios")) * avgPriceD +
              (getReal(l.mes, "zweb_vendedora") + getReal(l.mes, "zweb_socios")) * avgPriceZ +
              getReal(l.mes, "sob_medida") * p.dev_sm

            return (
              <div key={l.mes} className="admin-panel overflow-hidden">
                <button
                  onClick={() => setAberto(expandido ? null : l.mes)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        completo ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {completo ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-bold">{pct}%</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-950 flex items-center gap-2">
                        {l.rotulo}
                        {ehAtual && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Mês atual
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">
                        {somaReal} de {somaMeta} metas · {brl(realReceita)} de {brl(l.metaReceitaNova)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:block h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn("h-full rounded-full transition-all", completo ? "bg-emerald-500" : "bg-blue-500")}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-slate-600 transition-transform", expandido && "rotate-180")} />
                  </div>
                </button>

                {expandido && (
                  <div className="border-t border-slate-100 p-5 space-y-4">
                    {METRICAS.map((mt) => {
                      const meta = metas[mt.chave]
                      const feito = getReal(l.mes, mt.chave)
                      const barra = meta > 0 ? Math.min(100, (feito / meta) * 100) : 0
                      const ok = feito >= meta && meta > 0
                      return (
                        <div key={mt.chave}>
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <span className="text-sm font-semibold text-slate-800">{mt.label}</span>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-sm font-bold tabular-nums", ok ? "text-emerald-700" : "text-slate-900")}>
                                {feito}/{meta}
                              </span>
                              <div className="flex items-center gap-1">
                                <StepBtn onClick={() => setRealizado(l.mes, mt.chave, feito - 1)} disabled={feito <= 0}>
                                  <Minus className="h-3.5 w-3.5" />
                                </StepBtn>
                                <input
                                  type="number"
                                  min={0}
                                  value={feito}
                                  onChange={(e) => setRealizado(l.mes, mt.chave, num(e.target.value))}
                                  className="w-14 rounded-md border border-slate-300 px-2 py-1 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                />
                                <StepBtn onClick={() => setRealizado(l.mes, mt.chave, feito + 1)}>
                                  <Plus className="h-3.5 w-3.5" />
                                </StepBtn>
                              </div>
                            </div>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={cn(
                                "h-full rounded-full bg-gradient-to-r transition-all",
                                ok ? "from-emerald-600 to-emerald-400" : BAR_COR[mt.cor]
                              )}
                              style={{ width: `${barra}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}

                    <div className="rounded-xl bg-slate-50 p-3.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-900">Receita nova no mês</span>
                      <span className="text-sm text-slate-700">
                        <b className="text-slate-950">{brl(realReceita)}</b> de {brl(l.metaReceitaNova)} projetados
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ============ PROJEÇÃO (tabela mês a mês) ============ */}
      <details className="admin-panel overflow-hidden group">
        <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-bold uppercase tracking-wide text-blue-900 hover:bg-slate-50/70">
          Projeção financeira mês a mês
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="overflow-x-auto border-t border-slate-100">
          <table className="w-full text-sm min-w-[1040px]">
            <thead>
              <tr className="bg-slate-50 text-right">
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-blue-900 sticky left-0 bg-slate-50">Mês</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Novos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Ativos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-emerald-700">Rec. DoisB</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-sky-700">Rec. ZWeb</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Sob medida</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Custos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Lucro</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Cada sócio</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Caixa acum.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-right">
              {linhas.map((l) => {
                const acimaTeto = l.faturAcum > LIMITE_MEI
                return (
                  <tr key={l.m} className={acimaTeto ? "bg-amber-50/60" : "hover:bg-slate-50/70"}>
                    <td className={cn("px-3 py-2.5 text-left font-bold text-slate-900 capitalize sticky left-0", acimaTeto ? "bg-amber-50" : "bg-white")}>
                      {l.rotulo}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700" title={`DoisB ${l.novosD} + ZWeb ${l.novosZ}`}>{l.novosTotal}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900" title={`DoisB ${l.ativosD} + ZWeb ${l.ativosZ}`}>{l.ativosTotal}</td>
                    <td className="px-3 py-2.5 text-emerald-700">{brl(l.recD)}</td>
                    <td className="px-3 py-2.5 text-sky-700">{brl(l.recZ)}</td>
                    <td className="px-3 py-2.5 text-slate-800">{brl(l.recSM)}</td>
                    <td className="px-3 py-2.5 text-red-700">{brl(l.custos)}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-950">{brl(l.lucro)}</td>
                    <td className="px-3 py-2.5 text-blue-800 font-semibold">{brl(l.proLaboreCada)}</td>
                    <td className="px-3 py-2.5 font-bold text-emerald-700">{brl(l.caixaAcum)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

// ---------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------
function Campo({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type="number" min={0} value={value} onChange={(e) => onChange(num(e.target.value))} className={inputCls} />
    </div>
  )
}

function StepBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-700 disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-700 transition-colors"
    >
      {children}
    </button>
  )
}
