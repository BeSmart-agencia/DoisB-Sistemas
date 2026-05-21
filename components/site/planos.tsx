"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
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
    header: null,
    features: [
      { text: "1 usuário", bold: false },
      { text: "Cadastro de Clientes", bold: false },
      { text: "Cadastro de Produtos", bold: false },
      { text: "Cadastro de Fornecedores", bold: false },
      { text: "Emissão de Nota Fiscal Eletrônica (NF-e)", bold: false },
      { text: "Emissão de Orçamentos", bold: false },
      { text: "Suporte via WhatsApp em horário comercial", bold: false },
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
    header: "Tudo do Essencial, mais:",
    features: [
      { text: "3 usuários", bold: false },
      { text: "Frente de Caixa (PDV)", bold: true },
      { text: "Controle de Contas e Saldos", bold: false },
      { text: "Emissão de Boletos", bold: false },
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
    header: "Tudo do Standard, mais:",
    features: [
      { text: "Usuários ilimitados", bold: true },
      { text: "SPED Fiscal e Sintegra", bold: false },
      { text: "Tabelas de Preço por cliente/região", bold: false },
      { text: "Retaguarda Offline (venda sem internet)", bold: true },
      { text: "Ordens de Serviço completas", bold: false },
      { text: "Cadastro de Grades (vestuário/calçado)", bold: false },
      { text: "Integração com marketplaces e e-commerce próprio", bold: true },
      { text: "Suporte prioritário + treinamento", bold: false },
    ],
    cta: "Quero o Premium",
    href: "/cadastro?plano=premium",
  },
]

export function Planos() {
  return (
    <section id="planos" className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {planos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={cn(
                "relative bg-white rounded-2xl p-8 border transition-all duration-300",
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
                  "mb-5 text-xs font-medium",
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

              {p.header && (
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  {p.header}
                </p>
              )}

              <ul className="space-y-2.5 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className={cn(f.bold ? "font-semibold text-slate-800" : "text-slate-600")}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

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
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
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
            {[
              "Sem fidelidade",
              "Cancele quando quiser",
              "Suporte humano",
              "Implantação assistida",
            ].map((t) => (
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
