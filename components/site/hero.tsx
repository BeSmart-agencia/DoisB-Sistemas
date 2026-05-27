"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Wifi, ReceiptText, CreditCard, Check } from "lucide-react"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

const SLIDES = [
  { src: "/slides/slide-01.png", alt: "Seu negócio na palma da mão" },
  { src: "/slides/slide-02.png", alt: "Mais liberdade, mais controle" },
  { src: "/slides/slide-03.png", alt: "Reabasteça com o ZWeb" },
  { src: "/slides/slide-04.png", alt: "Faça orçamentos de qualquer lugar" },
  { src: "/slides/slide-05.png", alt: "Simplifique sua gestão" },
]
const INTERVAL = 3500

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

const fadeIn = (delay: number, x = 0) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
})

/* ─── Floating badge component ─── */
function FloatingBadge({
  icon: Icon,
  label,
  iconBg,
  iconColor,
  delay,
  bobDelay = 0,
  style,
}: {
  icon: React.ElementType
  label: string
  iconBg: string
  iconColor: string
  delay: number
  bobDelay?: number
  style: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className="absolute z-20"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.6 + bobDelay, repeat: Infinity, ease: "easeInOut", delay: bobDelay }}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
        style={{
          background: "rgba(8,16,32,0.88)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        {/* Icon circle */}
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
        {/* Text */}
        <div className="leading-none">
          <p className="text-xs font-bold text-white whitespace-nowrap">{label}</p>
          <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: "rgba(52,211,153,0.9)" }}>
            <Check className="h-2.5 w-2.5" />
            Incluído no ZWeb
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused, next])

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060e1a 0%, #0a1628 60%, #0d1e35 100%)" }}
    >
      {/* ── Page-level bg decorations ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute" style={{ top: "10%", left: "0%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,114,181,0.14) 0%, transparent 65%)" }} />
        <div className="absolute" style={{ bottom: "5%", right: "0%", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,58,110,0.2) 0%, transparent 65%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "4rem 4rem" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left text ── */}
          <div className="space-y-7">
            <motion.span
              {...fadeUp(0.1)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: "rgba(20,114,181,0.15)", border: "1px solid rgba(20,114,181,0.35)", color: "rgba(147,197,253,0.9)" }}
            >
              🇮🇹 Tecnologia italiana · 🇧🇷 Atendimento brasileiro
            </motion.span>

            <div className="space-y-2">
              <motion.h1 {...fadeUp(0.25)} className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Venda. Controle.
              </motion.h1>
              <motion.span {...fadeUp(0.4)} className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight block" style={{ color: "#1472B5" }}>
                Cresça.
              </motion.span>
            </div>

            <motion.p {...fadeUp(0.55)} className="text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "rgba(148,163,184,0.85)" }}>
              O ZWeb é o sistema de gestão da Zucchetti — a maior software house da Itália,
              com mais de{" "}
              <strong className="text-white font-semibold">700 mil clientes</strong> pelo mundo.
              Agora no varejo brasileiro.
            </motion.p>

            <motion.div {...fadeUp(0.65)} className="flex flex-wrap gap-3 sm:gap-5">
              <span className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "rgba(147,197,253,0.8)" }}>⭐ +700.000 clientes no mundo</span>
              <span className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "rgba(52,211,153,0.9)" }}>✓ Suporte humano via WhatsApp</span>
              <span className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "rgba(52,211,153,0.9)" }}>✓ Implantação assistida</span>
            </motion.div>

            <motion.div {...fadeUp(0.78)} className="flex flex-col sm:flex-row gap-3">
              <a href="#planos" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white text-sm transition-transform hover:-translate-y-0.5" style={{ background: "linear-gradient(145deg, #1472B5 0%, #0e3a6e 100%)", boxShadow: "0 8px 24px rgba(20,114,181,0.4)" }}>
                Ver planos e preços
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5" style={{ border: "1px solid rgba(20,114,181,0.5)", color: "rgba(147,197,253,0.9)", background: "rgba(20,114,181,0.1)" }}>
                Falar com consultor
              </a>
            </motion.div>
          </div>

          {/* ── Right: carousel + badges ── */}
          <motion.div
            {...fadeIn(0.45, 60)}
            className="relative hidden lg:flex justify-center items-center py-12 px-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* ── Glow layers behind the phone ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
              {/* Outer soft bloom */}
              <div style={{ width: "340px", height: "460px", borderRadius: "32px", background: "radial-gradient(ellipse at center, rgba(20,114,181,0.22) 0%, transparent 70%)", filter: "blur(32px)", position: "absolute" }} />
              {/* Mid glow */}
              <div style={{ width: "280px", height: "380px", borderRadius: "28px", background: "radial-gradient(ellipse at 50% 40%, rgba(20,114,181,0.3) 0%, transparent 65%)", filter: "blur(16px)", position: "absolute" }} />
              {/* Rotating conic shimmer */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "308px",
                  height: "420px",
                  borderRadius: "28px",
                  background: "conic-gradient(from 0deg, transparent 30%, rgba(20,114,181,0.45) 50%, transparent 70%)",
                  filter: "blur(6px)",
                  position: "absolute",
                  opacity: 0.6,
                }}
              />
              {/* Inner bright core */}
              <div style={{ width: "200px", height: "280px", borderRadius: "24px", background: "radial-gradient(ellipse at 50% 30%, rgba(20,114,181,0.18) 0%, transparent 70%)", filter: "blur(8px)", position: "absolute" }} />
            </div>

            {/* ── Phone frame + carousel ── */}
            <div
              className="relative w-[272px] aspect-[3/4] rounded-3xl overflow-hidden z-10"
              style={{
                border: "1px solid rgba(20,114,181,0.45)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset, 0 24px 64px rgba(0,0,0,0.6)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={SLIDES[current].src}
                    alt={SLIDES[current].alt}
                    fill
                    className="object-cover"
                    sizes="272px"
                    priority={current === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Progress bars */}
              <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-3 z-10">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="relative flex-1 h-[3px] rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                    aria-label={`Slide ${i + 1}`}
                  >
                    {i === current && (
                      <motion.div
                        key={current}
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                      />
                    )}
                    {i < current && <div className="absolute inset-0 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Slide dots ── */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "18px" : "6px",
                    height: "6px",
                    background: i === current ? "rgba(147,197,253,0.9)" : "rgba(147,197,253,0.3)",
                  }}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>

            {/* ── Floating badges ── */}
            <FloatingBadge
              icon={Wifi}
              label="Venda offline"
              iconBg="rgba(52,211,153,0.2)"
              iconColor="#34d399"
              delay={0.9}
              bobDelay={0}
              style={{ top: "2rem", right: "-1rem" }}
            />
            <FloatingBadge
              icon={CreditCard}
              label="Maquininha integrada"
              iconBg="rgba(167,139,250,0.2)"
              iconColor="#a78bfa"
              delay={1.1}
              bobDelay={0.8}
              style={{ top: "48%", right: "-2rem" }}
            />
            <FloatingBadge
              icon={ReceiptText}
              label="NF-e emitida"
              iconBg="rgba(96,165,250,0.2)"
              iconColor="#60a5fa"
              delay={1.3}
              bobDelay={1.6}
              style={{ bottom: "4.5rem", left: "-1rem" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
