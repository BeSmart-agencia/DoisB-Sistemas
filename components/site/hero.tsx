"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const WA_LINK =
  "https://wa.me/5551999999999?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

const slides = [
  { src: "/slides/slide-01.png", alt: "Seu negócio na palma da mão" },
  { src: "/slides/slide-02.png", alt: "Mais liberdade, mais controle" },
  { src: "/slides/slide-03.png", alt: "Reabasteça com o ZWeb" },
  { src: "/slides/slide-04.png", alt: "Faça orçamentos de qualquer lugar" },
  { src: "/slides/slide-05.png", alt: "Simplifique sua gestão" },
]

const INTERVAL = 3500

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, INTERVAL)
    return () => clearInterval(id)
  }, [paused, next])

  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-white overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Texto ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-7"
        >
          <Badge className="self-start bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-50 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
            🇮🇹 Tecnologia italiana. 🇧🇷 Atendimento brasileiro.
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Seu negócio merece um sistema à altura.
          </h1>

          <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
            O ZWeb é o sistema de gestão completo da Zucchetti — a maior software house da Itália,
            com mais de{" "}
            <span className="font-semibold text-slate-700">700 mil clientes</span> pelo mundo.
            Agora disponível para o varejo brasileiro através da DoisB Sistemas.
          </p>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
            <p className="font-mono text-sm text-slate-400 tracking-widest whitespace-nowrap">
              &lt;Venda. Controle. Cresça.&gt;
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#planos"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-blue-800 hover:bg-blue-900 text-white rounded-xl px-8 shadow-md hover:-translate-y-0.5 transition-transform font-semibold"
              )}
            >
              Ver planos e preços
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl px-8 hover:-translate-y-0.5 transition-transform font-semibold border-slate-300 text-slate-700"
              )}
            >
              Falar com um consultor
            </a>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-1">
            <span>⭐ +700.000 clientes no mundo</span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              Suporte humano via WhatsApp
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              Implantação assistida
            </span>
          </div>
        </motion.div>

        {/* ── Carrossel ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex flex-col items-center gap-5 py-8 px-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Moldura do slide */}
          <div className="relative w-72 sm:w-80 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/80 bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[current].src}
                  alt={slides[current].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 288px, 320px"
                  priority={current === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Barra de progresso */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="relative flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
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
                  {i < current && (
                    <div className="absolute inset-0 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pontos de navegação */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === current
                    ? "bg-blue-700 w-5 h-2"
                    : "bg-slate-300 hover:bg-slate-400 w-2 h-2"
                )}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Badge: Venda offline */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.4 }}
            className="absolute top-4 -right-2 sm:-right-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2.5"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm shadow-green-300" />
            <span className="text-sm font-semibold text-slate-700">Venda offline ✓</span>
          </motion.div>

          {/* Badge: NF-e */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-16 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2.5"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-300" />
            <span className="text-sm font-semibold text-slate-700">NF-e emitida ✓</span>
          </motion.div>

          {/* Badge: Maquininha */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 -right-2 sm:-right-8 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2.5"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-300" />
            <span className="text-sm font-semibold text-slate-700">Maquininha integrada ✓</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
