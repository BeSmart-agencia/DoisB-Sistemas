"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

const planos = [
  {
    tag: "Pra quem está começando",
    nome: "Essencial",
    preco: "R$ 129,90",
    desc: "Tudo o que sua empresa precisa pra ter cadastro, emitir nota e organizar a rotina.",
    highlight: false,
    popularBadge: null,
    gancho: [
      { text: "Emissão de NF-e inclusa", bold: true },
      { text: "1 usuário + suporte WhatsApp", bold: false },
    ],
    features: [
      { text: "Cadastro de Clientes", bold: false },
      { text: "Cadastro de Produtos", bold: false },
      { text: "Cadastro de Fornecedores", bold: false },
      { text: "Emissão de Orçamentos", bold: false },
    ],
    cta: "Quero o Essencial",
    href: "/cadastro?plano=essencial",
  },
  {
    tag: "O queridinho do varejo",
    nome: "Standard",
    preco: "R$ 199,90",
    desc: "A escolha de 8 em cada 10 lojistas. Frente de caixa profissional + financeiro completo.",
    highlight: true,
    popularBadge: "⭐ MAIS POPULAR",
    gancho: [
      { text: "Frente de Caixa (PDV)", bold: true },
      { text: "Financeiro + emissão de boletos", bold: false },
    ],
    features: [
      { text: "3 usuários", bold: false },
      { text: "Controle de Contas e Saldos", bold: false },
      { text: "Emissão de MDF-e", bold: false },
      { text: "Integração com maquininhas", bold: false },
      { text: "Importação assistida de dados do sistema antigo", bold: false },
      { text: "Suporte prioritário", bold: false },
    ],
    cta: "Quero o Standard",
    href: "/cadastro?plano=standard",
  },
  {
    tag: "Pra quem leva o varejo a sério",
    nome: "Premium",
    preco: "R$ 249,90",
    desc: "Solução completa pra quem quer escalar. Sem limites de usuários, com todos os módulos avançados.",
    highlight: false,
    popularBadge: null,
    gancho: [
      { text: "Usuários ilimitados", bold: true },
      { text: "Venda offline + integração e-commerce", bold: true },
    ],
    features: [
      { text: "SPED Fiscal e Sintegra", bold: false },
      { text: "Tabelas de Preço por cliente/região", bold: false },
      { text: "Retaguarda Offline (venda sem internet)", bold: false },
      { text: "Ordens de Serviço completas", bold: false },
      { text: "Cadastro de Grades (vestuário/calçado)", bold: false },
      { text: "Integração com marketplaces e e-commerce próprio", bold: false },
      { text: "Suporte prioritário + treinamento", bold: false },
    ],
    cta: "Quero o Premium",
    href: "/cadastro?plano=premium",
  },
]

function PlanoCard({ p, i }: { p: typeof planos[0]; i: number }) {
  const [aberto, setAberto] = useState(false)

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.12 }}
      className={cn(
        "relative bg-white rounded-2xl p-8 border transition-all duration-300 flex flex-col",
        p.highlight
          ? "border-blue-500 shadow-2xl lg:scale-105 z-10 ring-1 ring-blue-500/20"
          : "border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300"
      )}
    >
      {p.popularBadge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            {p.popularBadge}
          </Badge>
        </div>
      )}

      <Badge
        variant="secondary"
        className={cn(
          "mb-5 text-xs font-medium w-fit",
          p.highlight
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "bg-slate-100 text-slate-600"
        )}
      >
        {p.tag}
      </Badge>

      <h3 className="text-xl font-bold text-slate-900 mb-1">Plano {p.nome}</h3>

      <div className="flex items-baseline gap-1 my-4">
        <span
          className={cn(
            "text-4xl font-extrabold tracking-tight",
            p.highlight ? "text-blue-800" : "text-slate-900"
          )}
        >
          {p.preco}
        </span>
        <span className="text-slate-400 text-sm font-normal">/mês</span>
      </div>

      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{p.desc}</p>

      {/* Gancho principal — sempre visível */}
      <ul className="space-y-2.5 mb-4">
        {p.gancho.map((f, j) => (
          <li key={j} className="flex items-start gap-2.5 text-sm">
            <Check className={cn("h-4 w-4 mt-0.5 shrink-0", p.highlight ? "text-blue-600" : "text-green-600")} />
            <span className={cn(f.bold ? "font-semibold text-slate-800" : "text-slate-600")}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Toggle — ver funcionalidades completas */}
      <button
        onClick={() => setAberto(!aberto)}
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors w-fit",
          p.highlight ? "text-blue-700 hover:text-blue-900" : "text-slate-400 hover:text-slate-700"
        )}
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", aberto && "rotate-180")} />
        {aberto ? "Ver menos" : "Ver funcionalidades completas"}
      </button>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.ul
            key="features"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden space-y-2.5 mb-6"
          >
            {p.features.map((f, j) => (
              <li key={j} className="flex items-start gap-2.5 text-sm">
                <Check className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-slate-500">{f.text}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <div className="mt-auto">
        <a
          href={p.href}
          className={cn(
            buttonVariants({ size: "default" }),
            "w-full justify-center rounded-xl font-semibold hover:-translate-y-0.5 transition-transform",
            p.highlight
              ? "bg-blue-800 hover:bg-blue-900 text-white shadow-lg shadow-blue-900/20"
              : "border border-blue-800 text-blue-800 bg-transparent hover:bg-blue-50"
          )}
        >
          {p.cta}
        </a>
      </div>
    </motion.div>
  )
}

export function Planos() {
  return (
    <section id="planos" className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Planos pensados pra crescer com você
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Comece com o essencial. Evolua quando precisar. Sem multa de fidelidade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {planos.map((p, i) => (
            <PlanoCard key={i} p={p} i={i} />
          ))}
        </div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center space-y-5"
        >
          <p className="text-sm text-slate-500">
            💡 Não sabe qual escolher?{" "}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline"
            >
              Fale com a gente no WhatsApp
            </a>{" "}
            e a gente te ajuda a decidir.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-400">
            {["Sem fidelidade", "Cancele quando quiser", "Suporte humano", "Implantação assistida"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
