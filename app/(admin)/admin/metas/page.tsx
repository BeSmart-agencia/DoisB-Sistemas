import { createAdminClient } from "@/lib/supabase/admin"
import { Target, Wallet } from "lucide-react"
import { MetasPlanner, type Premissas, type RealizadoRow } from "./_components/metas-planner"

export const metadata = { title: "Metas Ano 1 | DoisB Admin" }
export const dynamic = "force-dynamic"

const FOLHA = [
  { nome: "Laisa", valor: "R$ 7.000", pct: 100 },
  { nome: "Abel", valor: "R$ 7.000", pct: 100 },
  { nome: "Douglas", valor: "R$ 2.500", pct: 36 },
  { nome: "Ailla", valor: "R$ 2.000", pct: 29 },
]

const REGRAS = [
  { chave: "R1", texto: "Indústria é hipótese até a Zucchetti confirmar. Nome do produto, preço de tabela e margem da revenda — tarefa do Abel antes de qualquer anúncio. Enquanto isso: mapear e sondar as indústrias da região." },
  { chave: "R2", texto: "Equipe antes dos sócios. Os salários de Douglas e Ailla têm prioridade sobre o pró-labore de Laisa e Abel." },
  { chave: "R3", texto: "Custo fixo só sobre receita provada. A loja física não tem data — tem gatilho: receita ≥ R$ 35 mil/mês sustentada por 6 meses + reserva de 6× o custo do ponto. Horizonte: ano 2." },
  { chave: "R4", texto: "Nenhum real de mídia sem aprovação humana — e o Estrategista cobra estas metas todo relatório de segunda-feira." },
]

const PREMISSAS_PADRAO: Premissas = {
  zweb_vendedora: 5, zweb_socios_m1: 2, zweb_socios: 10, sob_medida_mes: 1,
  mix_essencial: 70, mix_standard: 20, mix_premium: 10,
  dev_sm: 2000, mens_sm: 350, pro_labore_pct: 70, outros_custos: 80,
}

export default async function MetasPage() {
  const db = createAdminClient()

  const [premRes, realRes] = await Promise.all([
    db.from("metas_premissas").select("*").eq("id", 1).maybeSingle(),
    db.from("metas_realizado").select("mes, metrica, valor"),
  ])

  const p = premRes.data
  const premissas: Premissas = p
    ? {
        zweb_vendedora: p.zweb_vendedora, zweb_socios_m1: p.zweb_socios_m1, zweb_socios: p.zweb_socios,
        sob_medida_mes: p.sob_medida_mes, mix_essencial: p.mix_essencial, mix_standard: p.mix_standard,
        mix_premium: p.mix_premium, dev_sm: Number(p.dev_sm), mens_sm: Number(p.mens_sm),
        pro_labore_pct: p.pro_labore_pct, outros_custos: Number(p.outros_custos),
      }
    : PREMISSAS_PADRAO

  const realizado: RealizadoRow[] = (realRes.data ?? []).map((r) => ({
    mes: r.mes, metrica: r.metrica, valor: Number(r.valor),
  }))

  const tabelaFalta = !!premRes.error || !!realRes.error

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Metas — Ano 1</h1>
        <p className="text-sm text-slate-700 mt-1">
          Ago/2026 → Jul/2027. Defina as metas, veja a projeção recalcular na hora e marque mês a mês o que já foi
          cumprido — o plano para a DoisB pagar todos os salários em 12 meses.
        </p>
      </div>

      {tabelaFalta && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Rode a migration <code className="rounded bg-white/70 px-1.5 py-0.5 text-xs">supabase/migrations/metas_planner.sql</code>{" "}
          no Supabase para salvar as metas e o progresso. Enquanto isso, a tela funciona com valores padrão (sem salvar).
        </div>
      )}

      {/* Meta-mãe */}
      <div className="p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br from-blue-900 to-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-sky-300">A meta-mãe · mês 12</p>
            <p className="text-3xl font-black mt-1 text-white">R$ 30 mil<span className="text-lg font-bold text-sky-200">/mês recorrente</span></p>
            <p className="text-sm text-slate-100 mt-2 max-w-2xl leading-relaxed">
              Receita necessária para sustentar a folha de <b className="text-white">R$ 18,5 mil</b> com folga saudável
              (folha ≈ 62% da receita) — sobrando para impostos, marketing, ferramentas e reserva.
            </p>
          </div>
        </div>
      </div>

      {/* A folha */}
      <div className="admin-panel p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-4 w-4 text-blue-900" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900">A folha que a DoisB vai sustentar</h2>
        </div>
        <div className="space-y-3">
          {FOLHA.map((f) => (
            <div key={f.nome} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm font-semibold text-slate-800">{f.nome}</span>
              <div className="flex-1 h-6 rounded-lg bg-slate-100 overflow-hidden">
                <div className="h-full rounded-lg bg-gradient-to-r from-blue-600 to-sky-400" style={{ width: `${f.pct}%` }} />
              </div>
              <span className="w-24 text-right text-sm font-bold text-blue-800">{f.valor}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <p className="text-lg font-black text-slate-950">Total: <span className="text-blue-800">R$ 18.500/mês</span></p>
          <p className="text-xs text-slate-700 max-w-md">
            Regra de prioridade: <b className="text-slate-700">equipe primeiro, sócios por último.</b> Douglas e Ailla
            saem da agência para a DoisB quando a receita sustentar seus salários.
          </p>
        </div>
      </div>

      {/* Simulador + acompanhamento */}
      <MetasPlanner premissasIniciais={premissas} realizadoInicial={realizado} />

      {/* Regras */}
      <div className="admin-panel p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900 mb-4">Regras do jogo · o que protege o plano</h2>
        <div className="space-y-3">
          {REGRAS.map((r) => (
            <div key={r.chave} className="flex gap-3">
              <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 h-fit">{r.chave}</span>
              <p className="text-sm text-slate-700 leading-relaxed">{r.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
