"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check, Crown, Store, Workflow, ShoppingBasket, Boxes } from "lucide-react"
import { PRODUTOS, BRL, type CorProduto, type ProdutoCatalogo } from "@/lib/planos"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const COR: Record<CorProduto, {
  ring: string; grad: string; text: string; chip: string; btn: string; icon: React.ElementType
}> = {
  verde: {
    ring: "border-emerald-300 hover:border-emerald-400 hover:shadow-emerald-100",
    grad: "from-emerald-500 to-green-600",
    text: "text-emerald-700",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    icon: Boxes,
  },
  azul: {
    ring: "border-slate-200 hover:border-blue-300 hover:shadow-blue-100",
    grad: "from-blue-600 to-sky-700",
    text: "text-blue-700",
    chip: "bg-blue-50 text-blue-700 border-blue-100",
    btn: "bg-blue-700 hover:bg-blue-800",
    icon: Store,
  },
  laranja: {
    ring: "border-slate-200 hover:border-orange-300 hover:shadow-orange-100",
    grad: "from-orange-500 to-amber-600",
    text: "text-orange-700",
    chip: "bg-orange-50 text-orange-700 border-orange-100",
    btn: "bg-orange-600 hover:bg-orange-700",
    icon: ShoppingBasket,
  },
  roxo: {
    ring: "border-slate-200 hover:border-violet-300 hover:shadow-violet-100",
    grad: "from-violet-600 to-purple-700",
    text: "text-violet-700",
    chip: "bg-violet-50 text-violet-700 border-violet-100",
    btn: "bg-violet-700 hover:bg-violet-800",
    icon: Workflow,
  },
}

function precoDe(p: ProdutoCatalogo): string {
  if (!p.planos.length) return "Sob orçamento"
  const min = Math.min(...p.planos.map((pl) => pl.precoMensal))
  return `a partir de ${BRL.format(min)}/mês`
}

function ProdutoCard({ p, i }: { p: ProdutoCatalogo; i: number }) {
  const c = COR[p.cor]
  const Icon = c.icon
  const destaque = !!p.destaque
  const planoDefault = p.planos.find((pl) => pl.destaque)?.key ?? p.planos[0]?.key
  const assinarHref = p.assinavel && planoDefault
    ? `/cadastro?produto=${p.id}&plano=${planoDefault}`
    : "/contato"

  return (
    <motion.div
      {...fadeUp(0.05 + i * 0.08)}
      className={`group relative flex flex-col rounded-3xl border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-2xl ${c.ring} ${destaque ? "lg:col-span-2 ring-2 ring-emerald-400/60" : ""}`}
    >
      {destaque && (
        <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
          <Crown className="h-3.5 w-3.5" />
          Carro-chefe
        </span>
      )}

      <div className={`flex ${destaque ? "flex-col lg:flex-row lg:items-start lg:gap-8" : "flex-col"}`}>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${c.grad}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-950">{p.nome}</h3>
              <p className={`text-sm font-semibold ${c.text}`}>{p.tagline}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{p.descricaoCurta}</p>

          <span className={`mt-4 inline-block rounded-full border px-3 py-1 text-xs font-medium ${c.chip}`}>
            {p.publico}
          </span>
        </div>

        {destaque && (
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-0 lg:w-[46%]">
            {["ERP fiscal completo", "PDV, food e delivery", "CRM e multiempresa", "Catálogo digital e etiquetas"].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <span className="text-sm font-bold text-slate-900">{precoDe(p)}</span>
        <div className="flex items-center gap-2">
          <a
            href={p.href}
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Saber mais
          </a>
          <a
            href={assinarHref}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${c.btn}`}
          >
            {p.assinavel ? "Assinar" : "Falar com a gente"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export function ProdutosGrid() {
  return (
    <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
            Nossos produtos
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            O sistema certo para cada negócio.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Do ERP completo ao sistema sob medida. Escolha o seu, saiba mais ou assine agora mesmo.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PRODUTOS.map((p, i) => (
            <ProdutoCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
