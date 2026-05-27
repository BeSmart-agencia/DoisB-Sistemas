"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

/* ─── Card data ─── */
type Card = { emoji: string; title: string; body: string }

const COL1: Card[] = [
  { emoji: "🌍", title: "+700 mil clientes", body: "A Zucchetti atende mais de 700.000 empresas em todos os continentes." },
  { emoji: "🇮🇹", title: "Fundada em 1978", body: "Mais de 45 anos de inovação contínua em software de gestão empresarial." },
  { emoji: "🏆", title: "Top 3 da Europa", body: "Uma das três maiores software houses do continente europeu." },
  { emoji: "🌎", title: "+30 países", body: "Presença global com soluções adaptadas para cada legislação local." },
  { emoji: "📊", title: "Líder em ERP", body: "Reconhecida por analistas como referência em soluções integradas de gestão." },
  { emoji: "🔒", title: "Dados seguros", body: "Infraestrutura de nível enterprise com redundância e backups automáticos." },
]

const COL2: Card[] = [
  { emoji: "🤝", title: "Atendimento próximo", body: "Você fala direto com a DoisB. Sem call center, sem URA, sem espera infinita." },
  { emoji: "⚡", title: "Resposta rápida", body: "Suporte via WhatsApp em horário comercial. Urgente? A gente resolve." },
  { emoji: "🎓", title: "Implantação assistida", body: "Não te entregamos o sistema e sumimos. Te ensinamos até você se sentir seguro." },
  { emoji: "👨‍👩‍👧", title: "Empresa familiar", body: "Somos pai e filha. Aqui você vira amigo, não número de protocolo." },
  { emoji: "🔄", title: "Migração incluída", body: "Importamos seus dados do sistema antigo para você não começar do zero." },
  { emoji: "📱", title: "AppsCloud incluso", body: "Gestão no celular, NFC-e, pedidos e orçamentos de qualquer lugar." },
]

const COL3: Card[] = [
  { emoji: "❓", title: "Preciso instalar algo?", body: "O ZWeb roda 100% na nuvem. Para PDV, instalamos um terminal local. A implantação é assistida." },
  { emoji: "📲", title: "Funciona no celular?", body: "Sim! Pelo AppsCloud você emite NFC-e, pedidos e OS direto do celular Android." },
  { emoji: "🔧", title: "E o suporte?", body: "WhatsApp, e-mail e chat. Clientes Standard e Premium têm prioridade." },
  { emoji: "🔒", title: "Tem fidelidade?", body: "Não. Cancele quando quiser, sem multa. Acreditamos em valor, não em contrato." },
  { emoji: "📈", title: "Posso mudar de plano?", body: "Pode mudar a qualquer momento, pra mais ou pra menos. Cobrança proporcional." },
  { emoji: "🇧🇷", title: "E a Reforma Tributária?", body: "O ZWeb já se adapta a cada mudança. A Zucchetti acompanha toda legislação brasileira." },
]

/* ─── Infinite scroll column ─── */
function ScrollColumn({ cards, direction = "up", duration = 30 }: { cards: Card[]; direction?: "up" | "down"; duration?: number }) {
  const doubled = [...cards, ...cards]

  return (
    <div className="overflow-hidden h-[380px] md:h-[520px]" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)" }}>
      <motion.div
        animate={{ y: direction === "up" ? [0, -(cards.length * 180)] : [-(cards.length * 180), 0] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        className="flex flex-col gap-4"
      >
        {doubled.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 shrink-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              minHeight: "164px",
            }}
          >
            <span className="text-2xl mb-3 block">{card.emoji}</span>
            <p className="font-bold text-white text-sm mb-2">{card.title}</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.75)" }}>
              {card.body}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Section ─── */
export function SobreZucchetti() {
  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a1628 0%, #060e1a 100%)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{
            background: "radial-gradient(ellipse, rgba(20,114,181,0.08) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
            style={{
              background: "rgba(20,114,181,0.15)",
              border: "1px solid rgba(20,114,181,0.3)",
              color: "rgba(147,197,253,0.9)",
            }}
          >
            Por que confiar na DoisB + Zucchetti?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tecnologia de ponta com{" "}
            <span style={{ color: "#1472B5" }}>atendimento humano</span>
          </h2>
          <p className="text-lg" style={{ color: "rgba(148,163,184,0.75)" }}>
            Mais de 700 mil empresas confiam na Zucchetti. A DoisB traz isso pro seu negócio,
            com suporte de quem conhece você pelo nome.
          </p>
        </motion.div>

        {/* 3-column scroll grid — on mobile only first column shows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ScrollColumn cards={COL1} direction="up" duration={28} />
          <div className="hidden md:block">
            <ScrollColumn cards={COL2} direction="down" duration={32} />
          </div>
          <div className="hidden md:block">
            <ScrollColumn cards={COL3} direction="up" duration={25} />
          </div>
        </div>
      </div>
    </section>
  )
}
