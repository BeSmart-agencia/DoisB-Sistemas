import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { CalculadoraReforma } from "./calc-client"
import { Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Calculadora da Reforma Tributária — quanto você vai pagar | DoisB",
  description:
    "Descubra em 1 minuto, de graça, uma estimativa de quanto a sua empresa vai pagar de imposto com a Reforma Tributária (CBS + IBS). Para MEI, Simples Nacional e regime regular.",
  keywords:
    "calculadora reforma tributária, CBS, IBS, quanto vou pagar reforma, imposto reforma tributária, simples nacional reforma, calculadora imposto 2026",
  alternates: { canonical: "/calculadora-reforma" },
  openGraph: {
    title: "Calcule seu imposto na Reforma Tributária — grátis",
    description:
      "Estimativa gratuita de quanto a sua empresa vai pagar com a CBS + IBS. Feita pela DoisB Sistemas.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/calculadora-reforma",
  },
}

export default function CalculadoraReformaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-slate-950 px-4 pb-10 pt-14 text-center sm:pt-20">
          <div className="pointer-events-none absolute inset-0" aria-hidden
            style={{ background: "radial-gradient(ellipse at top, rgba(20,114,181,0.18) 0%, transparent 60%)" }} />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
              <Sparkles className="h-3.5 w-3.5" /> Reforma Tributária 2026
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Quanto a sua empresa vai pagar de imposto com a reforma?
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Descubra uma estimativa em 1 minuto, de graça. Responda 3 perguntas e veja o impacto da CBS + IBS no seu negócio.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20 -mt-4">
          <CalculadoraReforma />
        </section>
      </main>
      <Footer />
    </>
  )
}
