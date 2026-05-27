"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MessageCircle, ArrowRight } from "lucide-react"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

const STATS = [
  { value: "+700 mil", label: "clientes no mundo" },
  { value: "+45 anos", label: "de inovação" },
  { value: "Top 3", label: "Europa" },
  { value: "+30", label: "países atendidos" },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function CtaFinal() {
  return (
    <section
      className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060e1a 0%, #0a1628 60%, #0d1e35 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Grid texture */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }} />
        {/* Glow left */}
        <div className="absolute" style={{ top: "20%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,114,181,0.14) 0%, transparent 65%)" }} />
        {/* Glow right */}
        <div className="absolute" style={{ bottom: "10%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,58,110,0.18) 0%, transparent 65%)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto">

        {/* Trust stats row */}
        <motion.div
          {...fadeUp(0.1)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-20"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
              <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.65)" }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="w-16 h-px mx-auto mb-12" style={{ background: "rgba(20,114,181,0.4)" }} />

        {/* Main CTA content */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div {...fadeUp(0.2)} className="flex justify-center mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: "rgba(20,114,181,0.12)", border: "1px solid rgba(20,114,181,0.3)", color: "rgba(147,197,253,0.9)" }}>
              🇮🇹 Tecnologia italiana · 🇧🇷 Atendimento brasileiro
            </div>
          </motion.div>

          <motion.h2
            {...fadeUp(0.3)}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight"
          >
            Pronto pra organizar de vez{" "}
            <span style={{ color: "#1472B5" }}>o seu negócio?</span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.4)}
            className="text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: "rgba(148,163,184,0.8)" }}
          >
            Mais de 700 mil empresas no mundo já confiam na Zucchetti.
            Agora é a sua vez — com o suporte de quem te conhece pelo nome.
          </motion.p>

          <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="#planos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, #1472B5 0%, #0e3a6e 100%)",
                boxShadow: "0 8px 24px rgba(20,114,181,0.4)",
              }}
            >
              Ver planos e começar agora
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(37,211,102,0.12)",
                border: "1px solid rgba(37,211,102,0.35)",
                color: "rgba(74,222,128,0.95)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </motion.div>

          <motion.p
            {...fadeUp(0.6)}
            className="text-xs pt-1"
            style={{ color: "rgba(100,116,139,0.7)" }}
          >
            Resposta em até 15 minutos em horário comercial · Sem fidelidade · Cancele quando quiser
          </motion.p>
        </div>

        {/* Logos row */}
        <motion.div
          {...fadeUp(0.7)}
          className="flex flex-wrap items-center justify-center gap-4 mt-16 pt-12"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Image src="/logos/doisb-color.png" alt="DoisB Sistemas" width={100} height={53} className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
          <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
          <span className="text-xs" style={{ color: "rgba(148,163,184,0.45)" }}>revenda oficial</span>
          <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
          <Image src="/logos/zweb-color.png" alt="ZWeb" width={70} height={23} className="h-7 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </section>
  )
}
