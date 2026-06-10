"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import NumberFlow from "@number-flow/react"
import { Check, MessageCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"
const WA_ORCAMENTO_LINK =
  "https://wa.me/5551998518895?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20tenho%20empresa%20no%20regime%20geral%20%28lucro%20real%20ou%20presumido%29.%20Quero%20solicitar%20um%20or%C3%A7amento%20sob%20medida%20para%20o%20ZWeb."

type Billing = "monthly" | "yearly"

const PLANOS = [
  {
    nome: "Essencial",
    tag: "Pra quem está começando",
    precoMensal: 129.9,
    precoAnual: 109.9,
    desc: "Tudo que sua empresa precisa pra ter cadastro, emitir nota e organizar a rotina.",
    features: [
      "1 usuário",
      "Cadastro de Clientes e Fornecedores",
      "Cadastro de Produtos",
      "Emissão de NF-e",
      "Emissão de Orçamentos",
      "Suporte via WhatsApp",
    ],
    cta: "Começar com o Essencial",
    href: "/cadastro?plano=essencial",
    highlight: false,
    popular: false,
  },
  {
    nome: "Standard",
    tag: "O queridinho do varejo",
    precoMensal: 199.9,
    precoAnual: 169.9,
    desc: "A escolha de 8 em cada 10 lojistas. PDV profissional + financeiro completo.",
    features: [
      "3 usuários",
      "Frente de Caixa (PDV)",
      "Controle de Contas e Saldos",
      "Emissão de Boletos e MDF-e",
      "Integração com maquininhas",
      "Importação assistida de dados",
      "Suporte prioritário",
    ],
    cta: "Começar com o Standard",
    href: "/cadastro?plano=standard",
    highlight: true,
    popular: true,
  },
  {
    nome: "Premium",
    tag: "Pra quem leva o varejo a sério",
    precoMensal: 249.9,
    precoAnual: 212.4,
    desc: "Solução completa pra quem quer escalar. Sem limites, com todos os módulos.",
    features: [
      "Usuários ilimitados",
      "SPED Fiscal e Sintegra",
      "Tabelas de Preço por cliente",
      "Retaguarda Offline",
      "Ordens de Serviço completas",
      "Grades (vestuário/calçado)",
      "Marketplaces e e-commerce",
      "Suporte prioritário + treinamento",
    ],
    cta: "Começar com o Premium",
    href: "/cadastro?plano=premium",
    highlight: false,
    popular: false,
  },
]

const PROMO_FIM = new Date("2026-06-09T20:00:00Z") // 17h BRT

export function Planos() {
  const [billing, setBilling] = useState<Billing>("monthly")
  const promoAtiva = new Date() <= PROMO_FIM

  return (
    <section
      id="planos"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060e1a 0%, #0a1628 100%)" }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(20,114,181,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(14,58,110,0.15) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Planos pensados pra crescer com você
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(148,163,184,0.8)" }}>
            Comece com o essencial. Evolua quando precisar. Sem multa de fidelidade.
          </p>
          <div
            className="mt-6 mx-auto max-w-3xl rounded-2xl px-5 py-4 text-left sm:flex sm:items-center sm:justify-between sm:gap-5"
            style={{
              background: "rgba(20,114,181,0.12)",
              border: "1px solid rgba(147,197,253,0.22)",
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "rgba(226,232,240,0.88)" }}>
              Os planos abaixo são indicados para empresas <strong className="text-white">MEI</strong> e{" "}
              <strong className="text-white">Simples Nacional</strong>. Empresas do regime geral, como{" "}
              <strong className="text-white">lucro real</strong> ou <strong className="text-white">lucro presumido</strong>,
              recebem um orçamento sob medida.
            </p>
            <a
              href={WA_ORCAMENTO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 sm:mt-0"
              style={{
                background: "linear-gradient(145deg, #16a34a 0%, #15803d 100%)",
                boxShadow: "0 8px 24px rgba(22,163,74,0.28)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Orçamento sob medida
            </a>
          </div>

          {/* Banner promoção Gdoor */}
          {promoAtiva && (
            <div className="mt-8 mx-auto max-w-2xl rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)", border: "1px solid rgba(99,179,237,0.3)" }}>
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="text-2xl">🎉</div>
                <div className="flex-1">
                  <p className="text-white font-bold text-base leading-tight">
                    1ª mensalidade por <span style={{ color: "#63b3ed" }}>R$ 19,90</span> — em parceria com a Gdoor
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "rgba(148,163,184,0.85)" }}>
                    Somente no cartão · CNPJs novos · Válido até 09/06 às 17h · A partir do 2º mês, o valor normal do plano
                  </p>
                </div>
                <div className="shrink-0 text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(99,179,237,0.15)", color: "#63b3ed", border: "1px solid rgba(99,179,237,0.3)" }}>
                  OFERTA LIMITADA
                </div>
              </div>
            </div>
          )}

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 mt-8 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {(["monthly", "yearly"] as Billing[]).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
                  billing === b
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {b === "monthly" ? "Mensal" : (
                  <span className="flex items-center gap-1.5">
                    Anual
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(52,211,153,0.2)", color: "#34d399" }}>
                      -15%
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {PLANOS.map((p, i) => (
            <motion.div
              key={i}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl p-6 sm:p-8 transition-all duration-300",
                p.highlight
                  ? "lg:scale-105 z-10"
                  : "hover:-translate-y-1"
              )}
              style={{
                background: p.highlight
                  ? "linear-gradient(145deg, rgba(20,114,181,0.2) 0%, rgba(14,58,110,0.15) 100%)"
                  : "rgba(255,255,255,0.04)",
                border: p.highlight
                  ? "1px solid rgba(20,114,181,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: p.highlight
                  ? "0 0 40px rgba(20,114,181,0.2), 0 20px 60px rgba(0,0,0,0.4)"
                  : "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {/* Popular badge */}
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                    style={{ background: "linear-gradient(90deg, #1472B5, #0e3a6e)" }}
                  >
                    <Sparkles className="h-3 w-3" />
                    MAIS POPULAR
                  </span>
                </div>
              )}

              {/* Tag */}
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: p.highlight ? "rgba(147,197,253,0.9)" : "rgba(100,116,139,0.8)" }}
              >
                {p.tag}
              </span>

              <h3 className="text-xl font-bold text-white mt-2 mb-1">Plano {p.nome}</h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 my-5">
                <span className="text-sm font-medium" style={{ color: "rgba(147,197,253,0.6)" }}>
                  R$
                </span>
                <span className="text-4xl font-extrabold tracking-tight text-white">
                  <NumberFlow
                    value={billing === "monthly" ? p.precoMensal : p.precoAnual}
                    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  />
                </span>
                <span className="text-sm" style={{ color: "rgba(100,116,139,0.7)" }}>/mês</span>
              </div>

              <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(148,163,184,0.7)" }}>
                {p.desc}
              </p>

              <ul className="space-y-2.5 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="h-4 w-4 mt-0.5 shrink-0"
                      style={{ color: p.highlight ? "#34d399" : "rgba(52,211,153,0.7)" }}
                    />
                    <span style={{ color: "rgba(226,232,240,0.85)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={p.href}
                className="block w-full text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                style={
                  p.highlight
                    ? {
                        background: "linear-gradient(145deg, #1472B5 0%, #0e3a6e 100%)",
                        color: "white",
                        boxShadow: "0 8px 24px rgba(20,114,181,0.4)",
                      }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(226,232,240,0.9)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }
                }
              >
                {p.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center space-y-4"
        >
          <p className="text-sm" style={{ color: "rgba(100,116,139,0.8)" }}>
            💡 Não sabe qual escolher?{" "}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "rgba(147,197,253,0.9)" }}
            >
              Fale com a gente no WhatsApp
            </a>{" "}
            e a gente te ajuda a decidir.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm" style={{ color: "rgba(100,116,139,0.7)" }}>
            {["Sem fidelidade", "Cancele quando quiser", "Suporte humano", "Implantação assistida"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  {t}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
