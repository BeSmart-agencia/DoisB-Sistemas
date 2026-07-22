"use client"

import { useMemo, useState } from "react"
import { DollarSign, TrendingUp, PiggyBank, Wallet, Info } from "lucide-react"

const PLANOS = {
  essencial: { preco: 129.9, custo: 31.79 },
  standard: { preco: 199.9, custo: 45.49 },
  premium: { preco: 249.9, custo: 69.7 },
}

const MESES_INICIO = { ano: 2026, mes: 6 } // julho/2026 (0-index: 6)

function brl(v: number): string {
  return (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function rotuloMes(offset: number): string {
  const d = new Date(MESES_INICIO.ano, MESES_INICIO.mes + offset, 1)
  const s = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
  return s.replace(".", "").replace(" de ", "/")
}

const num = (s: string) => {
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
const labelCls = "block text-[11px] font-bold uppercase tracking-wide text-blue-900 mb-1"

export function FinanceiroCalc() {
  const [novos, setNovos] = useState(5)
  const [mixE, setMixE] = useState(70)
  const [mixS, setMixS] = useState(20)
  const [mixP, setMixP] = useState(10)
  const [devSM, setDevSM] = useState(2000)
  const [mensSM, setMensSM] = useState(350)
  const [proLaborePct, setProLaborePct] = useState(70)
  const [outrosCustos, setOutrosCustos] = useState(80) // DAS do MEI (fixo/mês) + outros

  const LIMITE_MEI = 81000 // teto de faturamento anual do MEI

  const mixTotal = mixE + mixS + mixP || 1
  const avgPrice = (mixE * PLANOS.essencial.preco + mixS * PLANOS.standard.preco + mixP * PLANOS.premium.preco) / mixTotal
  const avgCost = (mixE * PLANOS.essencial.custo + mixS * PLANOS.standard.custo + mixP * PLANOS.premium.custo) / mixTotal

  const linhas = useMemo(() => {
    let caixaAcum = 0
    let faturAcum = 0
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      const prevAtivos = novos * (m - 1)
      const ativosFim = novos * m

      const recZWeb = prevAtivos * avgPrice // recorrente dos clientes antigos
      const bonusJucele = novos * avgPrice // 1ª mensalidade dos novos → Jucele
      const custoZWeb = ativosFim * avgCost // custo da plataforma p/ todos ativos

      const smDev = devSM // 1 projeto entregue no mês
      const smMens = (m - 1) * mensSM // projetos anteriores pagando mensalidade
      const recSM = smDev + smMens

      const receitaDoisB = recZWeb + recSM
      const custos = custoZWeb + outrosCustos
      const lucro = receitaDoisB - custos

      const proLaboreTotal = Math.max(0, lucro) * (proLaborePct / 100)
      const proLaboreCada = proLaboreTotal / 2
      const caixaMes = lucro - proLaboreTotal
      caixaAcum += caixaMes

      // Faturamento bruto (tudo que passa pelo CNPJ, inclui a parte da Jucele) — conta pro teto do MEI
      const faturamentoBruto = recZWeb + bonusJucele + recSM
      faturAcum += faturamentoBruto

      return {
        m, rotulo: rotuloMes(i), novos, ativosFim,
        recZWeb, recSM, smDev, smMens, bonusJucele, custos, lucro,
        proLaboreCada, caixaMes, caixaAcum, faturamentoBruto, faturAcum,
      }
    })
  }, [novos, avgPrice, avgCost, devSM, mensSM, proLaborePct, outrosCustos])

  const ultimo = linhas[linhas.length - 1]
  const mesLimiteMEI = linhas.find((l) => l.faturAcum > LIMITE_MEI)
  const totalProLaboreCada = linhas.reduce((s, l) => s + l.proLaboreCada, 0)
  const mrr12 = ultimo.recZWeb + ultimo.smMens // receita recorrente no mês 12

  const cards = [
    { icon: TrendingUp, label: "MRR no mês 12", valor: brl(mrr12), sub: `${ultimo.ativosFim} ZWeb + sob medida` },
    { icon: DollarSign, label: "Pró-labore de cada (mês 12)", valor: brl(ultimo.proLaboreCada), sub: "Laisa e Abel" },
    { icon: PiggyBank, label: "Caixa ao fim do ano", valor: brl(ultimo.caixaAcum), sub: "acumulado 12 meses" },
    { icon: Wallet, label: "Pró-labore/ano de cada", valor: brl(totalProLaboreCada), sub: "somando os 12 meses" },
  ]

  return (
    <div className="space-y-6">
      {/* Premissas editáveis */}
      <div className="admin-panel p-5">
        <div className="flex items-center gap-2 text-blue-900 mb-3">
          <Info className="h-4 w-4" />
          <h2 className="text-sm font-bold uppercase tracking-wide">Premissas (edite e a tabela recalcula)</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>ZWeb novos / mês (Jucele)</label>
            <input type="number" min={0} value={novos} onChange={(e) => setNovos(num(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>% Essencial</label>
            <input type="number" min={0} value={mixE} onChange={(e) => setMixE(num(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>% Standard</label>
            <input type="number" min={0} value={mixS} onChange={(e) => setMixS(num(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>% Premium</label>
            <input type="number" min={0} value={mixP} onChange={(e) => setMixP(num(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Dev sob medida (R$)</label>
            <input type="number" min={0} value={devSM} onChange={(e) => setDevSM(num(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mensalidade sob medida (R$)</label>
            <input type="number" min={0} value={mensSM} onChange={(e) => setMensSM(num(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>% Pró-labore (resto = caixa)</label>
            <input type="number" min={0} max={100} value={proLaborePct} onChange={(e) => setProLaborePct(num(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Imposto MEI (DAS)/mês (R$)</label>
            <input type="number" min={0} value={outrosCustos} onChange={(e) => setOutrosCustos(num(e.target.value))} className={inputCls} />
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          Ticket médio ZWeb: <b className="text-slate-800">{brl(avgPrice)}</b> · custo médio: <b className="text-slate-800">{brl(avgCost)}</b> ·
          margem por cliente: <b className="text-slate-800">{brl(avgPrice - avgCost)}</b>. Meta de vendas/mês:
          <b className="text-slate-800"> {novos} ZWeb + 1 projeto sob medida</b>.
        </p>
      </div>

      {/* Resumo */}
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

      {/* Alerta teto MEI */}
      {mesLimiteMEI && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex gap-3">
          <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-900">
            <b>Teto do MEI (R$ 81.000/ano) é ultrapassado em {mesLimiteMEI.rotulo}.</b> O faturamento acumulado passa de{" "}
            {brl(mesLimiteMEI.faturAcum)} nesse mês. A partir daí é preciso migrar para <b>ME (Simples Nacional)</b> — o
            imposto deixa de ser o DAS fixo e passa a ser um percentual do faturamento (some ao campo de imposto quando fizer a troca).
          </div>
        </div>
      )}

      {/* Tabela mês a mês */}
      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1040px]">
            <thead>
              <tr className="bg-slate-50 text-right">
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-blue-900 sticky left-0 bg-slate-50">Mês</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Novos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Ativos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Rec. ZWeb</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Sob medida</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Bônus Jucele</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Custos</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Lucro</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Laisa</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Abel</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Caixa mês</th>
                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wide text-blue-900">Caixa acum.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-right">
              {linhas.map((l) => {
                const acimaTeto = l.faturAcum > LIMITE_MEI
                const primeiroAcima = mesLimiteMEI?.m === l.m
                return (
                <tr key={l.m} className={acimaTeto ? "bg-amber-50/60 hover:bg-amber-50" : "hover:bg-slate-50/70"}>
                  <td className={`px-3 py-2.5 text-left font-bold text-slate-900 capitalize sticky left-0 ${acimaTeto ? "bg-amber-50" : "bg-white"}`}>
                    {l.rotulo}
                    {primeiroAcima && <span className="ml-1.5 rounded bg-amber-200 px-1 py-0.5 text-[9px] font-bold text-amber-800 align-middle">teto MEI</span>}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{l.novos}</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-900">{l.ativosFim}</td>
                  <td className="px-3 py-2.5 text-slate-800">{brl(l.recZWeb)}</td>
                  <td className="px-3 py-2.5 text-slate-800" title={`Dev ${brl(l.smDev)} + mensalidades ${brl(l.smMens)}`}>{brl(l.recSM)}</td>
                  <td className="px-3 py-2.5 text-amber-700">{brl(l.bonusJucele)}</td>
                  <td className="px-3 py-2.5 text-red-700">{brl(l.custos)}</td>
                  <td className="px-3 py-2.5 font-bold text-slate-950">{brl(l.lucro)}</td>
                  <td className="px-3 py-2.5 text-blue-800 font-semibold">{brl(l.proLaboreCada)}</td>
                  <td className="px-3 py-2.5 text-blue-800 font-semibold">{brl(l.proLaboreCada)}</td>
                  <td className="px-3 py-2.5 text-slate-800">{brl(l.caixaMes)}</td>
                  <td className="px-3 py-2.5 font-bold text-emerald-700">{brl(l.caixaAcum)}</td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notas */}
      <div className="admin-panel p-5 space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900">Como ler / premissas</h2>
        <ul className="space-y-1.5 text-sm text-slate-700">
          <li>• <b>Prioridade:</b> primeiro o pró-labore de Laisa e Abel (cresce com a receita). Os salários de Ailla e Douglas entram <b>depois de fechar o 1º ano</b> (mês 13) — por isso não aparecem aqui.</li>
          <li>• <b>Bônus Jucele:</b> a 1ª mensalidade de cada cliente novo vai para a Jucele (comissão) e por isso não entra no caixa da DoisB naquele mês. Do 2º mês em diante o cliente vira receita recorrente.</li>
          <li>• <b>Custos:</b> custo do ZWeb por cliente ativo (Essencial 31,79 · Standard 45,49 · Premium 69,70) + o imposto do MEI (DAS fixo/mês — ajuste o valor vigente). Indústria fica de fora por enquanto; sob medida não tem custo.</li>
          <li>• <b>MEI:</b> imposto é o DAS fixo mensal. O teto de faturamento do MEI é R$ 81.000/ano — quando o acumulado passa disso (linha em âmbar), é hora de migrar para ME (Simples Nacional) e trocar o imposto para um % do faturamento.</li>
          <li>• <b>Sob medida:</b> 1 projeto por mês (o dev entra no mês) e a mensalidade de R$ {mensSM} acumula a partir do mês seguinte.</li>
          <li>• <b>Caixa:</b> o que sobra do lucro depois do pró-labore ({100 - proLaborePct}% do lucro do mês), somado mês a mês.</li>
        </ul>
      </div>
    </div>
  )
}
