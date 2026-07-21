import { createAdminClient } from "@/lib/supabase/admin"
import { Target, Wallet, Rocket } from "lucide-react"
import { MetasChecklist, type MetaRow } from "./_components/metas-checklist"

export const metadata = { title: "Metas Ano 1 | DoisB Admin" }
export const dynamic = "force-dynamic"

const FOLHA = [
  { nome: "Laisa", valor: "R$ 7.000", pct: 100, tipo: "Sócia" },
  { nome: "Abel", valor: "R$ 7.000", pct: 100, tipo: "Sócio" },
  { nome: "Douglas", valor: "R$ 2.500", pct: 36, tipo: "Equipe" },
  { nome: "Ailla", valor: "R$ 2.000", pct: 29, tipo: "Equipe" },
]

const MOTORES = [
  {
    rotulo: "Motor 1 · Indústria",
    valor: "R$ 16 mil",
    hipotese: true,
    desc: "6 clientes ativos a ~R$ 2.650/mês. Sistema Zucchetti para indústrias — produto, preço e margem a confirmar com a Zucchetti.",
    quem: "Abel · venda presencial, ticket alto",
  },
  {
    rotulo: "Motor 2 · ZWeb",
    valor: "R$ 10 mil",
    hipotese: false,
    desc: "60 clientes ativos com margem média de ~R$ 165/cliente. Volume, base e indicações — o motor que constrói presença. Reforço: vendedora externa com meta de 5 ZWeb/mês (comissão = 1ª mensalidade).",
    quem: "Laisa + vendedora externa · anúncios em escala",
  },
  {
    rotulo: "Motor 3 · Sob medida",
    valor: "R$ 4 mil",
    hipotese: false,
    desc: "1 projeto/mês (projeto menor) + mensalidade de R$ 450 que acumula a cada projeto entregue — a anuidade silenciosa.",
    quem: "Laisa · desenvolvimento",
  },
]

const TRIMESTRES = [
  { quando: "T1 · out/26", industria: "1º cliente fechado", zweb: "16 clientes", marco: "validação dos modelos", cor: "amber" },
  { quando: "T2 · jan/27", industria: "3 clientes", zweb: "30 clientes", marco: "—", cor: "slate" },
  { quando: "T3 · abr/27", industria: "5 clientes", zweb: "45 clientes", marco: "receita > R$ 20 mil → DoisB absorve 1 salário", cor: "amber" },
  { quando: "T4 · jul/27", industria: "6 clientes", zweb: "60 clientes", marco: "folha completa · agência encerrada", cor: "emerald" },
]

const REGRAS = [
  { chave: "R1", texto: "Indústria é hipótese até a Zucchetti confirmar. Nome do produto, preço de tabela e margem da revenda — tarefa do Abel antes de qualquer anúncio. Enquanto isso: mapear e sondar as indústrias da região." },
  { chave: "R2", texto: "Equipe antes dos sócios. Os salários de Douglas e Ailla têm prioridade sobre o pró-labore de Laisa e Abel." },
  { chave: "R3", texto: "Custo fixo só sobre receita provada. A loja física não tem data — tem gatilho: receita ≥ R$ 35 mil/mês sustentada por 6 meses + reserva de 6× o custo do ponto. Horizonte: ano 2." },
  { chave: "R4", texto: "Nenhum real de mídia sem aprovação humana — e o Estrategista cobra estas metas todo relatório de segunda-feira." },
]

const MARCO_COR: Record<string, string> = {
  amber: "text-amber-700 font-semibold",
  emerald: "text-emerald-700 font-semibold",
  slate: "text-slate-600",
}

export default async function MetasPage() {
  const db = createAdminClient()
  const { data: metas } = await db
    .from("metas_checklist")
    .select("id, mes, responsavel, categoria, tarefa, ordem, concluido, concluido_em, concluido_por")
    .order("mes", { ascending: true })
    .order("ordem", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Metas — Ano 1</h1>
        <p className="text-sm text-slate-700 mt-1">
          Jul/2026 → Jul/2027. O plano para a DoisB pagar todos os salários — equipe e sócios — em 12 meses,
          com três motores de receita e regras claras de prioridade.
        </p>
      </div>

      {/* Meta-mãe */}
      <div className="admin-panel p-6 bg-gradient-to-br from-blue-900 to-slate-950 text-white border-0">
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
          {FOLHA.map((p) => (
            <div key={p.nome} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm font-semibold text-slate-800">{p.nome}</span>
              <div className="flex-1 h-6 rounded-lg bg-slate-100 overflow-hidden">
                <div className="h-full rounded-lg bg-gradient-to-r from-blue-600 to-sky-400" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="w-24 text-right text-sm font-bold text-blue-800">{p.valor}</span>
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

      {/* 3 motores */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-4 w-4 text-blue-900" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900">De onde vem o dinheiro · três motores</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOTORES.map((m) => (
            <div key={m.rotulo} className={`admin-panel p-5 relative ${m.hipotese ? "ring-1 ring-amber-200" : ""}`}>
              {m.hipotese && (
                <span className="absolute top-4 right-4 rounded border border-amber-300 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-600">
                  Hipótese
                </span>
              )}
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{m.rotulo}</p>
              <p className="text-2xl font-black text-slate-950 mt-1.5">{m.valor}</p>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">{m.desc}</p>
              <p className="text-xs text-slate-700 mt-3 pt-3 border-t border-slate-100">{m.quem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trimestres */}
      <div className="admin-panel p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-blue-900 mb-4">O caminho · trimestre a trimestre</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="pb-2.5 pr-4 text-xs font-bold uppercase tracking-wide text-blue-900">Quando</th>
                <th className="pb-2.5 pr-4 text-xs font-bold uppercase tracking-wide text-blue-900">Indústria (Abel)</th>
                <th className="pb-2.5 pr-4 text-xs font-bold uppercase tracking-wide text-blue-900">ZWeb (Laisa)</th>
                <th className="pb-2.5 text-xs font-bold uppercase tracking-wide text-blue-900">Marco de folha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TRIMESTRES.map((t) => (
                <tr key={t.quando}>
                  <td className="py-3 pr-4 font-bold text-slate-900 whitespace-nowrap">{t.quando}</td>
                  <td className="py-3 pr-4 text-slate-800">{t.industria}</td>
                  <td className="py-3 pr-4 text-slate-800">{t.zweb}</td>
                  <td className={`py-3 ${MARCO_COR[t.cor]}`}>{t.marco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-700 mt-4">
          Sob medida em ritmo constante o ano todo: 1 projeto por mês, base de manutenção crescendo junto.
        </p>
      </div>

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

      {/* Checklist mês a mês */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-slate-950 mb-1">Checklist mês a mês</h2>
        <p className="text-sm text-slate-700 mb-4">
          Laisa e Abel marcam cada meta conforme concluem. O sistema registra quem marcou.
        </p>
        <MetasChecklist metas={(metas ?? []) as MetaRow[]} />
      </div>
    </div>
  )
}
