"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, MapPin, Wrench, ShieldCheck, Users, Sparkles, ArrowRight } from "lucide-react"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const VALORES = [
  { icon: Heart, t: "Empresa familiar", d: "Pai e filha, sócios em partes iguais. O nome da empresa é o nosso sobrenome." },
  { icon: Wrench, t: "Honestidade técnica", d: "Sistema pronto quando serve; sob medida quando não. A gente fala a verdade." },
  { icon: Users, t: "Quem atende, resolve", d: "Sem fila de chamado: quem configura o seu sistema é quem te atende depois." },
  { icon: ShieldCheck, t: "Compromisso de longo prazo", d: "A gente cresce junto com o seu negócio, não vende e some." },
]

export function SobreNos() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(16,185,129,0.25), transparent)" }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.span {...fadeUp(0)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Sobre nós
          </motion.span>
          <motion.h1 {...fadeUp(0.1)} className="mt-5 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl">
            Uma software house familiar,
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">com tecnologia de nível mundial.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            A DoisB nasceu no Rio Grande do Sul para levar sistema de gente grande com
            atendimento de vizinho — de quem te chama pelo nome.
          </motion.p>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <motion.div {...fadeUp(0)}>
              <Image
                src="/logos/doisb-color.png"
                alt="DoisB Sistemas"
                width={240}
                height={126}
                className="mb-8 h-20 w-auto object-contain"
              />
              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950">
                Dois B. Dois Barth.
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="space-y-5 text-slate-600">
              <p className="leading-relaxed">
                A DoisB é tocada por <strong className="text-slate-900">Laisa Barth</strong> — responsável por
                desenvolvimento, marketing e operação técnica — e <strong className="text-slate-900">Abel Barth</strong> —
                à frente da prospecção e do relacionamento. Sócios em partes iguais, pai e filha.
              </p>
              <p className="leading-relaxed">
                Acreditamos que empresa nenhuma deveria escolher entre um sistema bom e um
                atendimento humano. Por isso reunimos tecnologia robusta e um jeito de atender
                em que quem resolve o seu problema é quem já conhece a sua operação.
              </p>
              <p className="leading-relaxed">
                Do <strong className="text-slate-900">DoisB Web</strong>, nosso ERP completo, ao sistema
                sob medida, a gente entrega o software certo para cada negócio — e continua do lado
                depois que o contrato começa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-6xl">
          <motion.h2 {...fadeUp(0)} className="text-center text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            No que a gente acredita.
          </motion.h2>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map((v, i) => (
              <motion.div key={v.t} {...fadeUp(0.05 + i * 0.08)} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-black text-slate-950">{v.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARCEIROS / TECNOLOGIA */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2 {...fadeUp(0)} className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Tecnologia de parceiros de peso.
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mx-auto mt-4 max-w-2xl text-slate-500">
            Somos desenvolvedores dos nossos próprios produtos e também revenda oficial de
            plataformas consolidadas — o que garante robustez fiscal e atualização constante.
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { t: "DoisB Web", d: "Nosso ERP completo, desenvolvido e mantido pela DoisB." },
              { t: "ZWeb · Zucchetti", d: "Revenda oficial do grupo italiano com 700 mil clientes no mundo." },
              { t: "GWeb · Gdoor", d: "Plataforma consolidada de gestão para o varejo brasileiro." },
            ].map((p) => (
              <div key={p.t} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-left">
                <p className="font-black text-slate-950">{p.t}</p>
                <p className="mt-1.5 text-sm text-slate-600">{p.d}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2 {...fadeUp(0)} className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Vamos conversar sobre o seu negócio?
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mx-auto mt-4 max-w-xl text-slate-400">
            Conte o que você precisa. A gente indica com honestidade o sistema certo pra você.
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/produtos" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-400">
              Ver os produtos
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/contato" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">
              Falar com a gente
            </a>
          </motion.div>
          <motion.div {...fadeUp(0.3)} className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            Rio Grande do Sul · atendemos o Brasil todo
          </motion.div>
        </div>
      </section>
    </>
  )
}
