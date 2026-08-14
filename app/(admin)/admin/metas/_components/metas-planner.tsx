"use client"

import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Info, Save, TrendingUp, DollarSign, PiggyBank, Wallet,
  ChevronDown, CheckCircle2, Minus, Plus, Trophy, Target,
} from "lucide-react"

// ---------------------------------------------------------------
// Tipos vindos do banco
// ---------------------------------------------------------------
export interface Premissas {
  zweb_vendedora: number
  zweb_socios_m1: number
  zweb_socios: number
  sob_medida_mes: number
  mix_essencial: number
  mix_standard: number
  mix_premium: number
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

type Metrica = "zweb_vendedora" | "zweb_socios" | "sob_medida"

// ---------------------------------------------------------------
// Constantes do plano
// ---------------------------------------------------------------
const PLANOS = {
  essencial: { preco: 129.9, custo: 31.79 },
  standard: { preco: 199.9, custo: 45.49 },
  premium: { preco: 249.9, custo: 69.7 },
}
const MESES_INICIO = { ano: 2026, mes: 7 } // agosto/2026 (0-index: 7)
const LIMITE_MEI = 81000

const METRICAS: { chave: Metrica; label: string; cor: string }[] = [
  { chave: "zweb_vendedora", label: "ZWeb vendedora externa", cor: "amber" },
  { chave: "zweb_socios", label: "ZWeb sócios (Abel/Laisa)", cor: "blue" },
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
  amber: "from-amber-500 to-amber-400",
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
    // debounce do PUT para não spammar em cliques rápidos
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

  // -------- Projeção mês a mês (agosto/26 → julho/27) --------
  const mixTotal = p.mix_essencial + p.mix_standard + p.mix_premium || 1
  const avgPrice =
    (p.mix_essencial * PLANOS.essencial.preco +
      p.mix_standard * PLANOS.standard.preco +
      p.mix_premium * PLANOS.premium.preco) / mixTotal
  const avgCost =
    (p.mix_essencial * PLANOS.essencial.custo +
      p.mix_standard * PLANOS.standard.custo +
      p.mix_premium * PLANOS.premium.custo) / mixTotal

  const linhas = useMemo(() => {
    let caixaAcum = 0
    let faturAcum = 0
    let ativosAntes = 0
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      const metaVendedora = p.zweb_vendedora
      const metaSocios = m === 1 ? p.zweb_socios_m1 : p.zweb_socios
      const metaSM = p.sob_medida_mes
      const newTotal = metaVendedora + metaSocios
      const ativosFim = ativosAntes + newTotal

      // 1ª mensalidade dos clientes da vendedora vira comissão dela (não entra no caixa DoisB nesse mês)
      const bonusVend = metaVendedora * avgPrice
      const recZWeb = (ativosFim - metaVendedora) * avgPrice
      const custoZWeb = ativosFim * avgCost

      const smDev = metaSM * p.dev_sm
      const smMens = (m - 1) * metaSM * p.mens_sm
      const recSM = smDev + smMens

      const receitaDoisB = recZWeb + recSM
      const custos = custoZWeb + p.outros_custos
      const lucro = receitaDoisB - custos
      const proLaboreTotal = Math.max(0, lucro) * (p.pro_labore_pct / 100)
      const proLaboreCada = proLaboreTotal / 2
      const caixaMes = lucro - proLaboreTotal
      caixaAcum += caixaMes

      const faturamentoBruto = ativosFim * avgPrice + recSM
      faturAcum += faturamentoBruto
      ativosAntes = ativosFim

      const mes = mesIso(i)
      const metaReceitaNova = newTotal * avgPrice + smDev
      return {
        i, m, mes, rotulo: rotuloMes(i),
        metaVendedora, metaSocios, metaSM, newTotal, ativosFim,
        recZWeb, recSM, bonusVend, custos, lucro, proLaboreCada,
        caixaMes, caixaAcum, faturamentoBruto, faturAcum, metaReceitaNova,
      }
    })
  }, [p, avgPrice, avgCost])

  const ultimo = linhas[linhas.length - 1]
  const mesLimiteMEI = linhas.find((l) => l.faturAcum > LIMITE_MEI)
  const totalProLaboreCada = linhas.reduce((s, l) => s + l.proLaboreCada, 0)
  const mrr12 = ultimo.recZWeb + (11 * p.sob_medida_mes * p.mens_sm)

  const cards = [
    { icon: TrendingUp, label: "MRR no mês 12", valor: brl(mrr12), sub: `${ultimo.ativosFim} ZWeb + sob medida` },
    { icon: DollarSign, label: "Pró-labore de cada (mês 12)", valor: brl(ultimo.proLaboreCada), sub: "Laisa e Abel" },
    { icon: PiggyBank, label: "Caixa ao fim do ano", valor: brl(ultimo.caixaAcum), sub: "acumulado 12 meses" },
    { icon: Wallet, label: "Pró-labore/ano de cada", valor: brl(totalProLaboreCada), sub: "somando os 12 meses" },
  ]

  // -------- Progresso global (todas as metas de contagem, 12 meses) --------
  const totalMeta = linhas.reduce((s, l) => s + l.metaVendedora + l.metaSocios + l.metaSM, 0)
  const totalReal = linhas.reduce(
    (s, l) =>
      s + getReal(l.mes, "zweb_vendedora") + getReal(l.mes, "zweb_socios") + getReal(l.mes, "sob_medida"),
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-blue-900">
            <Target className="h-4 w-4" />
            <h2 className="text-sm font-bold uppercase tracking-wide">Nossas metas (edite e a projeção recalcula)</h2>
          </div>
          <button
            onClick={salvarPremissas}
            disabled={!dirty || salvandoPrem}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              dirty
                ? "bg-slate-950 text-white hover:bg-blue-900"
                : "bg-slate-100 text-slate-400 cursor-default"
            )}
          >
            <Save className="h-4 w-4" />
            {salvandoPrem ? "Salvando..." : dirty ? "Salvar metas" : "Salvo"}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Campo label="ZWeb vendedora / mês" value={p.zweb_vendedora} onChange={(v) => setPremissa("zweb_vendedora", v)} />
          <Campo label="ZWeb sócios — mês 1 (ago)" value={p.zweb_socios_m1} onChange={(v) => setPremissa("zweb_socios_m1", v)} />
          <Campo label="ZWeb sócios — demais" value={p.zweb_socios} onChange={(v) => setPremissa("zweb_socios", v)} />
          <Campo label="Sob medida / mês" value={p.sob_medida_mes} onChange={(v) => setPremissa("sob_medida_mes", v)} />
          <Campo label="% Essencial" value={p.mix_essencial} onChange={(v) => setPremissa("mix_essencial", v)} />
          <Campo label="% Standard" value={p.mix_standard} onChange={(v) => setPremissa("mix_standard", v)} />
          <Campo label="% Premium" value={p.mix_premium} onChange={(v) => setPremissa("mix_premium", v)} />
          <Campo label="Dev sob medida (R$)" value={p.dev_sm} onChange={(v) => setPremissa("dev_sm", v)} />
          <Campo label="Mensalidade sob medida (R$)" value={p.mens_sm} onChange={(v) => setPremissa("mens_sm", v)} />
          <Campo label="% Pró-labore (resto = caixa)" value={p.pro_labore_pct} onChange={(v) => setPremissa("pro_labore_pct", v)} />
          <Campo label="Imposto MEI (DAS)/mês (R$)" value={p.outros_custos} onChange={(v) => setPremissa("outros_custos", v)} />
        </div>
        <p className="text-xs text-slate-600 mt-3">
          Ticket médio ZWeb: <b className="text-slate-800">{brl(avgPrice)}</b> · custo médio:{" "}
          <b className="text-slate-800">{brl(avgCost)}</b> · margem por cliente:{" "}
          <b className="text-slate-800">{brl(avgPrice - avgCost)}</b>. Plano começa em{" "}
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

        {/* Barra global */}
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
            const metas: Record<Metrica, number> = {
              zweb_vendedora: l.metaVendedora,
              zweb_socios: l.metaSocios,
              sob_medida: l.metaSM,
            }
            const somaMeta = metas.zweb_vendedora + metas.zweb_socios + metas.sob_medida
            const somaReal =
              getReal(l.mes, "zweb_vendedora") + getReal(l.mes, "zweb_socios") + getReal(l.mes, "sob_medida")
            const pct = somaMeta > 0 ? Math.round((somaReal / somaMeta) * 100) : 0
            const completo = somaReal >= somaMeta && somaMeta > 0
            const expandido = aberto === l.mes
            const ehAtual = l.mes === mesAtual

            const realReceita =
              getReal(l.mes, "zweb_vendedora") * avgPrice +
              getReal(l.mes, "zweb_socios") * avgPrice +
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

                    {/* Receita nova gerada no mês (calculada) */}
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
          <table className="w-full text-sm min-w-[980px]">
            <thead>
              <tr className="bg-slate-50 text-right">
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-blue-900 sticky left-0 bg-slate-50">Mês</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Novos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Ativos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Rec. ZWeb</th>
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
                    <td className="px-3 py-2.5 text-slate-700" title={`Vendedora ${l.metaVendedora} + sócios ${l.metaSocios}`}>{l.newTotal}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{l.ativosFim}</td>
                    <td className="px-3 py-2.5 text-slate-800">{brl(l.recZWeb)}</td>
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
