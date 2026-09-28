"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Check, ArrowRight, Crown, ShoppingCart, Boxes, Wallet, FileCheck2,
  Wrench, UtensilsCrossed, Users, Store, Building2, Tag, WifiOff, Sparkles,
} from "lucide-react"
import { getProduto, precoMensalNoAnual, BRL, type IntervaloCobranca } from "@/lib/planos"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const doisb = getProduto("doisb-web")!

const MODULOS = [
  { icon: ShoppingCart, nome: "Vendas e faturamento", desc: "NF-e, NFC-e, pré-venda, orçamentos, pedidos e terminais de venda." },
  { icon: Boxes, nome: "Estoque e produção", desc: "Lotes, validade, variações, kits, inventário e ordem de produção." },
  { icon: Wallet, nome: "Financeiro completo", desc: "Caixa, contas a pagar/receber, DRE, conciliação bancária e conta digital." },
  { icon: FileCheck2, nome: "Fiscal e contábil", desc: "SPED, Sintegra, perfis tributários e envio automático pra contabilidade." },
  { icon: Wrench, nome: "Serviços e OS", desc: "Ordem de serviço, NFS-e, contratos recorrentes e técnicos." },
  { icon: UtensilsCrossed, nome: "Food service", desc: "Salão, mesas, comandas, cozinha, cardápio digital e self-pedido." },
  { icon: Users, nome: "CRM com funil", desc: "Oportunidades, funil de vendas, agenda e automações." },
  { icon: Store, nome: "Catálogo digital", desc: "Vitrine online dos seus produtos, sem duplicar cadastros." },
  { icon: Building2, nome: "Multiempresa", desc: "Gerencie várias empresas numa conta só, com um clique." },
]

const PRINTS = [
  { src: "/produtos/doisb/movimentacoes.png", cap: "Vendas, NF-e/NFC-e e condicional de mercadorias" },
  { src: "/produtos/doisb/financeiro.png", cap: "Financeiro: caixa, contas, DRE e conciliação" },
  { src: "/produtos/doisb/restaurante.png", cap: "Food service: mesas, cozinha e cardápio digital" },
  { src: "/produtos/doisb/crm.png", cap: "CRM com funil de oportunidades" },
  { src: "/produtos/doisb/cadastros.png", cap: "Cadastros: produtos, kits, variações e vendedores" },
  { src: "/produtos/doisb/configuracoes.png", cap: "Configuração fiscal e emissão de documentos" },
]

const DIFERENCIAIS = [
  { icon: WifiOff, t: "Vende até sem internet", d: "PDV Offline que sincroniza sozinho quando a conexão volta." },
  { icon: Building2, t: "Multiempresa de verdade", d: "Troque entre empresas sem sair do sistema." },
  { icon: UtensilsCrossed, t: "Pronto pro food", d: "Restaurante, delivery e cardápio digital nativos." },
  { icon: Tag, t: "Com a sua marca", d: "Sistema, e-mails e documentos com a identidade da sua empresa." },
]

export function DoisbWebLanding() {
  const [intervalo, setIntervalo] = useState<IntervaloCobranca>("mensal")

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(16,185,129,0.30), transparent)" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <motion.span {...fadeUp(0)} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Crown className="h-3.5 w-3.5" />
                Nosso carro-chefe
              </motion.span>
              <motion.h1 {...fadeUp(0.1)} className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                DoisB Web: o{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">ERP completo</span>{" "}
                da sua empresa.
              </motion.h1>
              <motion.p {...fadeUp(0.2)} className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                Vendas, fiscal, estoque, financeiro, serviços, food, CRM e multiempresa —
                tudo online, num sistema só, com a cara do seu negócio.
              </motion.p>
              <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#planos" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition-all hover:-translate-y-0.5 hover:bg-emerald-400">
                  Ver planos e assinar
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#modulos" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10">
                  Ver o sistema por dentro
                </a>
              </motion.div>
              <motion.p {...fadeUp(0.4)} className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
                <Sparkles className="h-4 w-4" />
                5 dias grátis · sem fidelidade · 10% de desconto no plano anual
              </motion.p>
            </div>

            <motion.div {...fadeUp(0.25)} className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-500/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-emerald-950/50">
                <Image
                  src="/produtos/doisb/dashboard.png"
                  alt="Dashboard do DoisB Web com indicadores, metas e gráficos"
                  width={1640}
                  height={922}
                  className="w-full"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section id="modulos" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Um sistema. Todos os módulos.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Do balcão à contabilidade: o DoisB Web cobre toda a operação do seu negócio.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULOS.map((m, i) => (
              <motion.div
                key={m.nome}
                {...fadeUp(0.05 + (i % 3) * 0.08)}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-all hover:border-emerald-300 hover:bg-white hover:shadow-lg hover:shadow-emerald-100/60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md">
                  <m.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-black text-slate-950">{m.nome}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINTS REAIS */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} className="text-center">
            <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
              Telas reais
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Veja o DoisB Web por dentro.
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {PRINTS.map((p, i) => (
              <motion.figure
                key={p.src}
                {...fadeUp(0.05 + (i % 2) * 0.08)}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="overflow-hidden bg-slate-100">
                  <Image src={p.src} alt={p.cap} width={1640} height={700} className="w-full" />
                </div>
                <figcaption className="border-t border-slate-100 px-5 py-3 text-sm font-medium text-slate-600">
                  {p.cap}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIFERENCIAIS.map((d, i) => (
              <motion.div key={d.t} {...fadeUp(0.05 + i * 0.08)} className="rounded-2xl border border-slate-200 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <d.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-black text-slate-950">{d.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{d.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp(0)} className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Planos do DoisB Web</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Comece com 5 dias grátis. Sem fidelidade, cancele quando quiser.
            </p>

            {/* Toggle mensal/anual */}
            <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setIntervalo("mensal")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${intervalo === "mensal" ? "bg-emerald-500 text-white" : "text-slate-300 hover:text-white"}`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIntervalo("anual")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${intervalo === "anual" ? "bg-emerald-500 text-white" : "text-slate-300 hover:text-white"}`}
              >
                Anual <span className="text-emerald-300">−10%</span>
              </button>
            </div>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {doisb.planos.map((plano, i) => {
              const ehAnual = intervalo === "anual" && !!plano.precoAnual
              const precoMes = ehAnual ? precoMensalNoAnual(plano)! : plano.precoMensal
              const destaque = !!plano.destaque
              return (
                <motion.div
                  key={plano.key}
                  {...fadeUp(0.1 + i * 0.1)}
                  className={`relative flex flex-col rounded-3xl border p-8 ${destaque ? "border-emerald-400 bg-gradient-to-b from-emerald-500/10 to-white/[0.02] ring-1 ring-emerald-400/40" : "border-white/10 bg-white/[0.03]"}`}
                >
                  {destaque && (
                    <span className="absolute -top-3 left-8 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                      Mais completo
                    </span>
                  )}
                  <h3 className="text-xl font-black text-white">{plano.nome}</h3>
                  <p className="mt-1 text-sm text-slate-400">{plano.descricao}</p>

                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-4xl font-black text-white">{BRL.format(precoMes)}</span>
                    <span className="mb-1 text-sm text-slate-400">/mês</span>
                  </div>
                  <p className="mt-1 text-xs text-emerald-300">
                    {ehAnual
                      ? `${BRL.format(plano.precoAnual!)} à vista no ano · 5 dias grátis`
                      : "cobrado mensalmente · 5 dias grátis"}
                  </p>

                  <a
                    href={`/cadastro?produto=doisb-web&plano=${plano.key}&intervalo=${intervalo}`}
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${destaque ? "bg-emerald-500 text-white hover:bg-emerald-400" : "border border-emerald-400/40 bg-white/5 text-white hover:bg-white/10"}`}
                  >
                    Assinar {plano.nome}
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <ul className="mt-7 space-y-2.5">
                    {plano.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Precisa de ajuda pra escolher?{" "}
            <a href="/contato" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300">
              Fale com a gente
            </a>.
          </p>
        </div>
      </section>
    </>
  )
}
