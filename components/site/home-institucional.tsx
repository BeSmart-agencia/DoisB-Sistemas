"use client"

import { useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowRight, Check, Crown, Heart, MapPin, Wrench,
  Store, ShoppingBasket, Workflow, Boxes,
} from "lucide-react"
import { PRODUTOS, BRL, type CorProduto, type ProdutoCatalogo } from "@/lib/planos"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// Links externos antigos apontando para /#planos continuam funcionando.
function HashRedirect() {
  useEffect(() => {
    if (window.location.hash === "#planos") window.location.replace("/doisb-web#planos")
  }, [])
  return null
}

const CARD: Record<CorProduto, { text: string; chip: string; icon: React.ElementType; hover: string }> = {
  verde: { text: "text-emerald-700", chip: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: Boxes, hover: "hover:border-emerald-300 hover:shadow-emerald-100/60" },
  azul: { text: "text-blue-700", chip: "bg-blue-50 text-blue-700 border-blue-100", icon: Store, hover: "hover:border-blue-300 hover:shadow-blue-100/60" },
  laranja: { text: "text-orange-700", chip: "bg-orange-50 text-orange-700 border-orange-100", icon: ShoppingBasket, hover: "hover:border-orange-300 hover:shadow-orange-100/60" },
  roxo: { text: "text-violet-700", chip: "bg-violet-50 text-violet-700 border-violet-100", icon: Workflow, hover: "hover:border-violet-300 hover:shadow-violet-100/60" },
}

function precoDe(p: ProdutoCatalogo): string {
  if (!p.planos.length) return "Sob orçamento"
  return `a partir de ${BRL.format(Math.min(...p.planos.map((pl) => pl.precoMensal)))}/mês`
}

export function HomeInstitucional() {
  const outros = PRODUTOS.filter((p) => p.id !== "doisb-web")

  return (
    <>
      <HashRedirect />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(16,185,129,0.28), transparent)" }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p {...fadeUp(0)} className="mb-5 font-mono text-xs tracking-widest text-emerald-300/80 sm:text-sm">
            &lt;Venda. Controle. Cresça.&gt;
          </motion.p>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Software house familiar.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Sistema para cada negócio.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Do nosso ERP completo, o <strong className="text-white">DoisB Web</strong>, ao sistema
            sob medida para o seu processo — sempre com atendimento de quem te chama pelo nome.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/doisb-web" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all hover:-translate-y-0.5 hover:bg-emerald-400">
              <Boxes className="h-4 w-4" />
              Conheça o DoisB Web
            </a>
            <a href="/produtos" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10">
              Ver todos os produtos
            </a>
          </motion.div>
        </div>
      </section>

      {/* DESTAQUE — DoisB Web (carro-chefe, verde) */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} className="grid items-center gap-12 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-xl shadow-emerald-100/50 lg:grid-cols-[1.05fr_1fr] lg:p-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                <Crown className="h-3.5 w-3.5" />
                Nosso carro-chefe
              </span>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                DoisB Web: o ERP completo da sua empresa.
              </h2>
              <p className="mt-4 text-slate-600">
                Vendas, NF-e/NFC-e, estoque, financeiro, serviços, food service, CRM,
                catálogo digital e multiempresa — tudo online, num sistema só.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {["ERP fiscal completo", "PDV offline e food service", "CRM e multiempresa", "5 dias grátis, sem fidelidade"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="/doisb-web" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">
                  Conhecer o DoisB Web
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="/doisb-web#planos" className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 px-6 py-3 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50">
                  Ver planos
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl shadow-emerald-900/10">
                <Image
                  src="/produtos/doisb/dashboard.png"
                  alt="Dashboard do DoisB Web"
                  width={1640}
                  height={922}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VITRINE — os outros produtos */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Cada negócio tem o seu sistema.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Varejo completo, mini-mercado ou um processo só seu. Escolha o certo pra você.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {outros.map((p, i) => {
              const c = CARD[p.cor]
              const Icon = c.icon
              return (
                <motion.div
                  key={p.id}
                  {...fadeUp(0.1 + i * 0.1)}
                  className={`group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-xl ${c.hover}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{p.nome}</h3>
                      <p className={`text-xs font-semibold ${c.text}`}>{p.tagline}</p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{p.descricaoCurta}</p>
                  <span className={`mt-4 inline-block rounded-full border px-3 py-1 text-xs font-medium ${c.chip}`}>
                    {precoDe(p)}
                  </span>
                  <a href={p.href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-950 transition-colors group-hover:text-emerald-700">
                    Saber mais
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <a href="/produtos" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800">
              Comparar todos os produtos
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* QUEM É A DOISB */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <motion.div {...fadeUp(0)}>
              <Image
                src="/logos/doisb-color.png"
                alt="DoisB Sistemas"
                width={220}
                height={116}
                className="mb-8 h-20 w-auto object-contain"
              />
              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950">
                Quem resolve, atende.
                <br />
                Quem atende, resolve.
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="space-y-5">
              <p className="leading-relaxed text-slate-600">
                A DoisB é uma software house familiar do Rio Grande do Sul, fundada por
                Laisa Barth (desenvolvimento, marketing e operação técnica) e Abel Barth
                (prospecção e relacionamento), sócios em partes iguais. Aqui não tem fila
                de chamado: quem configura o seu sistema é quem atende quando você precisa.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: Heart, label: "Empresa familiar", desc: "pai e filha, sócios" },
                  { icon: MapPin, label: "Base no RS", desc: "com visita presencial" },
                  { icon: Wrench, label: "Honestidade técnica", desc: "pronto quando serve, sob medida quando não" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <item.icon className="mb-2 h-5 w-5 text-emerald-700" />
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
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
