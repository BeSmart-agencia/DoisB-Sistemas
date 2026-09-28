"use client"

import { motion } from "framer-motion"
import {
  ArrowRight, Check, ReceiptText, WifiOff, Tag, ShoppingBasket,
  Store, Boxes, Wallet, X,
} from "lucide-react"
import { getProduto, BRL } from "@/lib/planos"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const gweb = getProduto("gweb")!
const plano = gweb.planos[0]
const assinarHref = `/cadastro?produto=gweb&plano=${plano.key}`

const PILARES = [
  {
    icon: ReceiptText,
    n: "01",
    t: "Nota fiscal sem dor de cabeça",
    d: "Emita NF-e e NFC-e direto do caixa, com tributação certa. Tudo em ordem com o fisco.",
  },
  {
    icon: WifiOff,
    n: "02",
    t: "PDV que não para",
    d: "Caiu a internet? O PDV continua vendendo offline e sincroniza sozinho quando volta.",
  },
  {
    icon: Tag,
    n: "03",
    t: "Etiquetas na hora",
    d: "Imprima etiquetas de gôndola e de produtos com preço sempre certo na prateleira.",
  },
]

const SEM = ["Sem e-commerce que você não vai usar", "Sem dezenas de menus pra se perder", "Sem mensalidade cara de ERP grande"]
const COM = ["Emissão fiscal completa", "PDV híbrido (online + offline)", "Etiquetas de gôndola e produto", "Estoque e financeiro do mercado"]

export function GwebLanding() {
  return (
    <>
      {/* HERO — claro e quente, bem diferente das outras landings */}
      <section className="relative overflow-hidden bg-orange-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.span {...fadeUp(0)} className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700">
            <ShoppingBasket className="h-3.5 w-3.5" />
            Feito para mini-mercados
          </motion.span>
          <motion.h1 {...fadeUp(0.1)} className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-orange-950 sm:text-6xl">
            O sistema do seu
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">mini-mercado.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mx-auto mt-5 max-w-xl text-lg text-orange-900/70">
            O GWeb faz o que o mercado precisa e nada além: nota fiscal, PDV que funciona
            offline e etiqueta. Simples, rápido e barato.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={assinarHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-0.5 hover:bg-orange-700">
              Assinar por {BRL.format(plano.precoMensal)}/mês
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#planos" className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-300 bg-white px-8 py-3.5 text-sm font-bold text-orange-800 transition-all hover:-translate-y-0.5 hover:bg-orange-100">
              Ver o que inclui
            </a>
          </motion.div>
        </div>
      </section>

      {/* 3 PILARES */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2 {...fadeUp(0)} className="text-center text-3xl font-black tracking-tight text-orange-950 sm:text-4xl">
            Três coisas. Muito bem feitas.
          </motion.h2>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILARES.map((p, i) => (
              <motion.div
                key={p.n}
                {...fadeUp(0.05 + i * 0.1)}
                className="relative rounded-3xl border-2 border-orange-100 bg-orange-50/50 p-8 transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100"
              >
                <span className="absolute right-6 top-6 text-5xl font-black text-orange-100">{p.n}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-600/30">
                  <p.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-black text-orange-950">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-orange-900/70">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMPLES DE PROPÓSITO */}
      <section className="bg-orange-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp(0)} className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Simples de propósito.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-orange-200/80">
              Mercado pequeno não precisa de sistema gigante. O GWeb tira o que atrapalha
              e mantém só o que faz o caixa girar.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div {...fadeUp(0.1)} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-orange-300">O que fica de fora</h3>
              <ul className="mt-5 space-y-3">
                {SEM.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-orange-100/80">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-orange-400/60" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp(0.2)} className="rounded-3xl border border-orange-400/40 bg-orange-500/10 p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-orange-300">O que você usa todo dia</h3>
              <ul className="mt-5 space-y-3">
                {COM.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-white">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRA QUEM É */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.h2 {...fadeUp(0)} className="text-center text-3xl font-black tracking-tight text-orange-950 sm:text-4xl">
            Feito pra quem trabalha no balcão.
          </motion.h2>
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { icon: ShoppingBasket, t: "Mini-mercados" },
              { icon: Store, t: "Mercearias e conveniência" },
              { icon: Boxes, t: "Hortifrúti e empórios" },
              { icon: Wallet, t: "Padarias e adegas" },
            ].map((s, i) => (
              <motion.div key={s.t} {...fadeUp(0.05 + i * 0.06)} className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6 text-center">
                <s.icon className="mx-auto h-7 w-7 text-orange-600" />
                <p className="mt-3 text-sm font-bold text-orange-950">{s.t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANO */}
      <section id="planos" className="bg-orange-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <motion.div {...fadeUp(0)} className="rounded-3xl border-2 border-orange-300 bg-white p-8 shadow-xl shadow-orange-200/50">
            <div className="text-center">
              <h2 className="text-2xl font-black text-orange-950">GWeb</h2>
              <p className="mt-1 text-sm text-orange-900/60">{plano.descricao}</p>
              <div className="mt-6 flex items-end justify-center gap-1">
                <span className="text-5xl font-black text-orange-600">{BRL.format(plano.precoMensal)}</span>
                <span className="mb-2 text-sm text-orange-900/50">/mês</span>
              </div>
            </div>
            <ul className="mt-7 space-y-3">
              {plano.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-orange-950">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                  {f}
                </li>
              ))}
            </ul>
            <a href={assinarHref} className="mt-8 flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-0.5 hover:bg-orange-700">
              Assinar o GWeb
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-4 text-center text-xs text-orange-900/50">
              Sem fidelidade. Cancele quando quiser.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
