"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

export function CtaFinal() {
  return (
    <section className="relative bg-blue-800 py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/60 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            Pronto pra organizar de vez o seu negócio?
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto leading-relaxed">
            Mais de 700 mil empresas no mundo já confiam na Zucchetti.
            <br className="hidden sm:block" />
            Agora é a sua vez de fazer parte.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="#planos"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-blue-800 hover:bg-slate-100 rounded-xl px-8 font-semibold shadow-xl hover:-translate-y-0.5 transition-transform"
              )}
            >
              Ver planos e começar agora
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-9 px-8 rounded-xl font-semibold text-white border-2 border-white/60 bg-transparent hover:bg-white/10 hover:border-white hover:-translate-y-0.5 transition-all text-sm"
            >
              Falar no WhatsApp
            </a>
          </div>

          <p className="text-blue-300/80 text-sm pt-2">
            Resposta em até 15 minutos em horário comercial.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
