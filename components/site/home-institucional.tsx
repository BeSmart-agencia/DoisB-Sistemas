"use client"

import { useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Store,
  Workflow,
  ArrowRight,
  Check,
  Heart,
  MapPin,
  Wrench,
} from "lucide-react"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// Links externos antigos apontando para âncoras da home (ex.: /#planos)
// continuam funcionando: a seção agora vive em /zweb.
function HashRedirect() {
  useEffect(() => {
    if (window.location.hash === "#planos") {
      window.location.replace("/zweb#planos")
    }
  }, [])
  return null
}

const LINHAS = [
  {
    icon: Store,
    titulo: "ZWeb — sistema de gestão para o varejo",
    tipo: "Produto de catálogo",
    desc: "O sistema completo da Zucchetti (700 mil clientes no mundo) para quem vende: PDV com retaguarda offline, NFe/NFCe/NFSe, estoque, financeiro, boletos e ordens de serviço.",
    pontos: ["Fiscal completo, adequado à Reforma Tributária", "Funciona até sem internet", "Configuração e treinamento com a gente"],
    cta: "Conheça o ZWeb",
    href: "/zweb",
    destaque: "Pra varejo e quem emite nota",
  },
  {
    icon: Workflow,
    titulo: "Sistemas sob medida",
    tipo: "Desenvolvimento personalizado",
    desc: "Seu processo interno vive em planilha, papel e WhatsApp? A gente desenvolve o sistema de gestão ou automação exato para o jeito que a sua empresa trabalha.",
    pontos: ["Diagnóstico do processo antes de qualquer proposta", "Projeto de escopo fechado + evolução mensal", "Para PMEs de qualquer setor"],
    cta: "Automatize seu processo",
    href: "/sob-medida",
    destaque: "Pra processos que sistema pronto não resolve",
  },
]

export function HomeInstitucional() {
  return (
    <>
      <HashRedirect />

      {/* Hero institucional */}
      <section className="relative overflow-hidden bg-slate-950 pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(20,114,181,0.35), transparent)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p {...fadeUp(0)} className="font-mono text-xs sm:text-sm text-blue-300/80 tracking-widest mb-5">
            &lt;Venda. Controle. Cresça.&gt;
          </motion.p>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
            Uma software house familiar.
            <br />
            <span className="text-blue-400">Tecnologia de nível mundial.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A DoisB entrega o sistema certo para cada negócio: produto de prateleira
            quando serve, desenvolvimento sob medida quando não serve — sempre com
            atendimento de quem te chama pelo nome.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/zweb"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 hover:bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition-all hover:-translate-y-0.5"
            >
              <Store className="h-4 w-4" />
              Conheça o ZWeb
            </a>
            <a
              href="/sob-medida"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-all hover:-translate-y-0.5"
            >
              <Workflow className="h-4 w-4" />
              Automatize seu processo
            </a>
          </motion.div>
        </div>
      </section>

      {/* As duas linhas */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Dois caminhos. Um jeito de atender.
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
              Varejo ou precisa emitir nota? É ZWeb. Processo interno específico, sem
              necessidade fiscal? É sob medida. Simples assim.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {LINHAS.map((linha, i) => (
              <motion.div
                key={linha.href}
                {...fadeUp(0.1 + i * 0.1)}
                className="group rounded-3xl border border-slate-200 bg-slate-50/60 p-8 sm:p-10 flex flex-col transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/60"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md">
                    <linha.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                    {linha.tipo}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-950 leading-snug">{linha.titulo}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{linha.desc}</p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {linha.pontos.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 font-medium">{linha.destaque}</span>
                  <a
                    href={linha.href}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 group-hover:bg-blue-800 px-6 py-3 text-sm font-bold text-white transition-colors"
                  >
                    {linha.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quem é a DoisB */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            <motion.div {...fadeUp(0)}>
              <Image
                src="/logos/doisb-color.png"
                alt="DoisB Sistemas"
                width={220}
                height={116}
                className="h-20 w-auto object-contain mb-8"
              />
              <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
                Quem resolve, atende.
                <br />
                Quem atende, resolve.
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="space-y-5">
              <p className="text-slate-600 leading-relaxed">
                A DoisB é uma software house familiar do Rio Grande do Sul, fundada por
                Laisa Barth (desenvolvimento, marketing e operação técnica) e Abel Barth
                (prospecção e relacionamento), sócios em partes iguais. Aqui não tem fila
                de chamado: quem configura o seu sistema é quem atende quando você precisa.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Heart, label: "Empresa familiar", desc: "pai e filha, sócios" },
                  { icon: MapPin, label: "Base no RS", desc: "com visita presencial" },
                  { icon: Wrench, label: "Honestidade técnica", desc: "pronto quando serve, sob medida quando não" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <item.icon className="h-5 w-5 text-blue-700 mb-2" />
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
