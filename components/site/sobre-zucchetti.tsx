"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "+700 mil", label: "clientes no mundo", emoji: "🌍" },
  { value: "Desde 1978", label: "de inovação contínua", emoji: "🇮🇹" },
  { value: "+30 países", label: "atendidos", emoji: "🌎" },
  { value: "Top 3", label: "software houses da Europa", emoji: "🏆" },
]

export function SobreZucchetti() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
            Você não está comprando{" "}
            <span className="italic text-slate-500">&ldquo;mais um sistema&rdquo;</span>.
          </h2>
          <div className="space-y-4 text-lg text-slate-500 leading-relaxed">
            <p>
              A Zucchetti é uma das maiores software houses do mundo. Italiana, fundada em 1978,
              hoje atende mais de{" "}
              <span className="font-semibold text-slate-700">700.000 clientes</span> em todos os
              continentes.
            </p>
            <p>
              No Brasil, suas soluções são usadas por indústrias, redes de varejo, escritórios
              contábeis e prestadores de serviço de todos os portes. O ZWeb é a versão pensada
              especialmente pro varejo brasileiro — com integração total à legislação fiscal, ao
              SPED, à NFC-e e a todas as exigências do nosso país.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-8 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-2xl mb-2">{s.emoji}</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-800 mb-1 tracking-tight">
                {s.value}
              </span>
              <span className="text-xs text-slate-500 text-center leading-relaxed">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
