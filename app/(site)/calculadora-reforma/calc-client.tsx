"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Calculator, ArrowRight, Lock, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { estimarReforma, BRL_REFORMA, type Regime, type Setor, type ResultadoReforma } from "@/lib/reforma"

type Etapa = "form" | "gate" | "resultado"

const REGIMES: { v: Regime; label: string; desc: string }[] = [
  { v: "mei", label: "MEI", desc: "Microempreendedor" },
  { v: "simples", label: "Simples Nacional", desc: "Até R$ 4,8 mi/ano" },
  { v: "regular", label: "Lucro Presumido/Real", desc: "Regime regular" },
]
const SETORES: { v: Setor; label: string }[] = [
  { v: "comercio", label: "Comércio" },
  { v: "servicos", label: "Serviços" },
  { v: "industria", label: "Indústria" },
]

const WA = "https://wa.me/5551992622787?text=Ol%C3%A1!%20Usei%20a%20calculadora%20da%20reforma%20e%20quero%20entender%20como%20preparar%20minha%20empresa."

function maskMoeda(v: string) {
  const n = v.replace(/\D/g, "")
  if (!n) return ""
  return (Number(n) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function parseMoeda(v: string) {
  const n = v.replace(/\D/g, "")
  return n ? Number(n) / 100 : 0
}

const impactoCor: Record<string, string> = {
  baixo: "text-emerald-700 bg-emerald-50 border-emerald-200",
  medio: "text-amber-700 bg-amber-50 border-amber-200",
  alto: "text-red-700 bg-red-50 border-red-200",
}

export function CalculadoraReforma() {
  const [etapa, setEtapa] = useState<Etapa>("form")
  const [regime, setRegime] = useState<Regime | null>(null)
  const [setor, setSetor] = useState<Setor | null>(null)
  const [faturamento, setFaturamento] = useState("")
  const [resultado, setResultado] = useState<ResultadoReforma | null>(null)

  // Captura
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [enviando, setEnviando] = useState(false)

  function calcular() {
    const fat = parseMoeda(faturamento)
    if (!regime) return toast.error("Escolha o seu regime tributário")
    if (!setor) return toast.error("Escolha o seu setor")
    if (fat <= 0) return toast.error("Informe o faturamento mensal")
    setResultado(estimarReforma({ regime, setor, faturamentoMensal: fat }))
    setEtapa("gate")
  }

  async function capturar(e: React.FormEvent) {
    e.preventDefault()
    if (nome.trim().length < 2) return toast.error("Informe seu nome")
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("E-mail inválido")
    if (telefone.replace(/\D/g, "").length < 10) return toast.error("WhatsApp inválido")
    setEnviando(true)
    try {
      const res = await fetch("/api/leads/calculadora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome, email, telefone, empresa, website,
          regime, setor, faturamento_mensal: parseMoeda(faturamento),
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        toast.error(j.error ?? "Erro ao enviar. Tente pelo WhatsApp.")
        return
      }
      setEtapa("resultado")
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* ---------- ETAPA 1: FORM ---------- */}
      {etapa === "form" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="mb-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Qual o seu regime hoje?</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {REGIMES.map((r) => (
                  <button key={r.v} type="button" onClick={() => setRegime(r.v)}
                    className={cn("rounded-xl border p-3 text-left transition-all",
                      regime === r.v ? "border-blue-700 bg-blue-50 shadow-sm" : "border-slate-200 hover:border-slate-300")}>
                    <p className={cn("text-sm font-bold", regime === r.v ? "text-blue-900" : "text-slate-700")}>{r.label}</p>
                    <p className="text-xs text-slate-500">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Qual o seu setor?</label>
              <div className="grid grid-cols-3 gap-2">
                {SETORES.map((s) => (
                  <button key={s.v} type="button" onClick={() => setSetor(s.v)}
                    className={cn("rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all",
                      setor === s.v ? "border-blue-700 bg-blue-50 text-blue-900 shadow-sm" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Faturamento médio por mês</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">R$</span>
                <input inputMode="numeric" placeholder="0,00" value={faturamento}
                  onChange={(e) => setFaturamento(maskMoeda(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
              </div>
            </div>
          </div>

          <button onClick={calcular}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-base font-bold text-white transition-colors hover:bg-blue-900">
            <Calculator className="h-5 w-5" /> Calcular meu imposto na reforma
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Estimativa gratuita e sem compromisso
          </p>
        </div>
      )}

      {/* ---------- ETAPA 2: GATE (captura) ---------- */}
      {etapa === "gate" && resultado && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className={cn("mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold", impactoCor[resultado.impactoNivel])}>
            <TrendingUp className="h-3.5 w-3.5" /> {resultado.impactoLabel} para o seu perfil
          </div>
          <h2 className="text-xl font-black text-slate-950">Seu resultado está pronto! 🎉</h2>
          <p className="mt-1 text-sm text-slate-500">
            Preencha seus dados para ver <b>quanto você vai pagar</b>, o comparativo com hoje e o que muda pro seu negócio.
          </p>

          {/* preview borrado */}
          <div className="relative my-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="select-none blur-sm" aria-hidden>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimativa na reforma</p>
              <p className="text-3xl font-black text-slate-900">R$ ••••,••/mês</p>
              <p className="mt-1 text-sm text-slate-500">vs. R$ ••••,•• que você paga hoje</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="h-6 w-6 text-slate-400" />
            </div>
          </div>

          <form onSubmit={capturar} className="space-y-3">
            <input type="text" tabIndex={-1} autoComplete="off" value={website}
              onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input placeholder="Seu nome *" value={nome} onChange={(e) => setNome(e.target.value)} className={inp} />
              <input placeholder="Nome da empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className={inp} />
            </div>
            <input type="email" placeholder="Seu melhor e-mail *" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} />
            <input placeholder="WhatsApp *" value={telefone} onChange={(e) => setTelefone(maskTel(e.target.value))} className={inp} />
            <button type="submit" disabled={enviando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white transition-colors hover:bg-emerald-700">
              {enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowRight className="h-5 w-5" /> Ver meu resultado</>}
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Seus dados ficam só com a DoisB. Veja nossa{" "}
              <a href="/politica-de-privacidade" target="_blank" className="underline">Política de Privacidade</a>.
            </p>
          </form>
        </div>
      )}

      {/* ---------- ETAPA 3: RESULTADO ---------- */}
      {etapa === "resultado" && resultado && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            <div className={cn("mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold", impactoCor[resultado.impactoNivel])}>
              <TrendingUp className="h-3.5 w-3.5" /> {resultado.impactoLabel}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Você paga hoje (estimado)</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{BRL_REFORMA.format(resultado.impostoAtual)}<span className="text-sm font-bold text-slate-400">/mês</span></p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Estimativa na reforma</p>
                <p className="mt-1 text-2xl font-black text-blue-900">
                  {resultado.impostoNovoMin === resultado.impostoNovoMax
                    ? `${BRL_REFORMA.format(resultado.impostoNovoMax)}`
                    : `${BRL_REFORMA.format(resultado.impostoNovoMin)} a ${BRL_REFORMA.format(resultado.impostoNovoMax)}`}
                  <span className="text-sm font-bold text-blue-400">/mês</span>
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-700">{resultado.resumo}</p>

            <ul className="mt-5 space-y-2.5">
              {resultado.pontos.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA DoisB Web */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white shadow-xl sm:p-8">
            <h3 className="text-xl font-black">Quer chegar na reforma preparado?</h3>
            <p className="mt-2 text-sm leading-relaxed text-emerald-50">
              O <b>DoisB Web</b> já nasce pronto pra Reforma Tributária: emite nota com CBS/IBS, organiza seus créditos e mostra o impacto no seu caixa em tempo real. A gente te ajuda a fazer a transição sem susto.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a href="/doisb-web" className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition-transform hover:-translate-y-0.5">
                Conhecer o DoisB Web <ArrowRight className="h-4 w-4" />
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                <MessageCircle className="h-4 w-4" /> Falar com um especialista
              </a>
            </div>
          </div>

          {/* disclaimer */}
          <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>
              <b>Estimativa ilustrativa.</b> Usa a alíquota de referência (~26,5%) e cargas médias por setor. O valor real depende dos seus créditos, do seu setor específico e da transição (2029→2033), e <b>não substitui a orientação do seu contador</b>. Em breve, o cálculo oficial da Receita Federal.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const inp =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"

function maskTel(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}
