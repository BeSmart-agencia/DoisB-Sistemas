import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { SobMedidaForm } from "./sob-medida-form"
import {
  FileSpreadsheet,
  Repeat2,
  UserX,
  Search,
  FileCheck2,
  Rocket,
  Store,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Sistemas Sob Medida e Automação de Processos | DoisB Sistemas",
  description:
    "Seu processo vive em planilha, papel e WhatsApp? A DoisB desenvolve sistemas de gestão e automação sob medida para PMEs. Diagnóstico gratuito do processo, escopo fechado e entregas por fase.",
  keywords:
    "sistema sob medida, desenvolvimento de sistemas, automação de processos, software personalizado, sistema para empresa, substituir planilha, software house RS",
  alternates: { canonical: "/sob-medida" },
  openGraph: {
    title: "Sistemas Sob Medida | DoisB Sistemas",
    description:
      "O sistema exato para o jeito que a sua empresa trabalha. Diagnóstico do processo gratuito, escopo fechado, entregas por fase.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/sob-medida",
  },
  robots: { index: true, follow: true },
}

const DORES = [
  {
    icon: FileSpreadsheet,
    titulo: "A planilha virou um monstro",
    desc: "Ela começou simples. Hoje só uma pessoa sabe mexer, quebra toda semana e ninguém confia no número que sai dela.",
  },
  {
    icon: Repeat2,
    titulo: "O mesmo dado, digitado 3 vezes",
    desc: "Pedido no WhatsApp, copiado pra planilha, passado pro caderno. Cada cópia é uma chance de erro — e uma hora perdida.",
  },
  {
    icon: UserX,
    titulo: "O dono no escuro",
    desc: "Pra saber como o mês está indo, você precisa perguntar pra alguém, esperar, conferir. Informação que deveria estar na sua tela.",
  },
]

const PASSOS = [
  {
    icon: Search,
    numero: "01",
    titulo: "Diagnóstico do processo",
    desc: "Uma conversa de 20 minutos, gratuita. A gente entende como o trabalho acontece hoje — quem faz o quê, onde trava, o que dói. Sem compromisso e sem vendedor no meio.",
  },
  {
    icon: FileCheck2,
    numero: "02",
    titulo: "Escopo fechado",
    desc: "Você recebe uma proposta com escopo, prazo e preço fechados. Sem surpresa no boleto, sem 'hora extra de desenvolvimento'.",
  },
  {
    icon: Rocket,
    numero: "03",
    titulo: "Entregas por fase",
    desc: "O sistema entra em uso por partes, começando pelo que dói mais. Depois, uma mensalidade de manutenção e evolução mantém tudo rodando e crescendo com a empresa.",
  },
]

export default function SobMedidaPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero — a dor */}
        <section className="relative overflow-hidden bg-slate-950 pt-36 pb-24 px-4 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(20,114,181,0.35), transparent)",
            }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs sm:text-sm text-blue-300/80 tracking-widest mb-5">
              &lt;sistemas sob medida&gt;
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
              Sua empresa não é genérica.
              <br />
              <span className="text-blue-400">Por que o sistema seria?</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Se o seu processo vive em planilha, papel e WhatsApp, a gente desenvolve o
              sistema exato para o jeito que a sua empresa trabalha — sem você se adaptar
              a software feito pra outro negócio.
            </p>
            <a
              href="#briefing"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-blue-700 hover:bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition-all hover:-translate-y-0.5"
            >
              Pedir diagnóstico gratuito
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* As dores */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Reconhece alguma dessas cenas?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DORES.map((dor) => (
                <div key={dor.titulo} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-5">
                    <dor.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{dor.titulo}</h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{dor.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-center text-slate-600 max-w-2xl mx-auto">
              Com um sistema sob medida: qualquer um da equipe resolve, o dado é digitado
              uma vez só, e você acompanha tudo num painel em tempo real.
            </p>
          </div>
        </section>

        {/* Como funciona */}
        <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Como funciona
              </h2>
              <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                Sob medida se vende entendendo o processo primeiro — por isso o caminho
                começa com diagnóstico, não com orçamento.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PASSOS.map((passo) => (
                <div key={passo.numero} className="relative rounded-3xl border border-slate-200 bg-white p-8">
                  <span className="absolute top-6 right-7 font-mono text-3xl font-black text-slate-100">
                    {passo.numero}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white mb-5">
                    <passo.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{passo.titulo}</h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{passo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Honestidade comercial */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-8 sm:p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white mx-auto mb-6">
                <Store className="h-5 w-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Quando sistema pronto resolve,
                <br className="hidden sm:block" /> a gente indica o nosso.
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
                A DoisB também é revenda do ZWeb, o sistema de gestão da Zucchetti para o
                varejo. Se no diagnóstico ficar claro que um produto de prateleira resolve o
                seu caso melhor e mais barato, é isso que vamos recomendar. Ter as duas
                opções no catálogo é o que nos deixa livres para ser honestos com você.
              </p>
              <a
                href="/zweb"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-800 hover:bg-blue-50 transition-colors"
              >
                Conheça o ZWeb
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Form de briefing */}
        <section id="briefing" className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100 scroll-mt-24">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Conte onde dói
              </h2>
              <p className="mt-4 text-slate-500">
                Descreva o processo em poucas linhas. A gente lê, analisa e chama você no
                WhatsApp para o diagnóstico gratuito de 20 minutos.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              <SobMedidaForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
