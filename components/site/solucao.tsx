"use client"

import { motion } from "framer-motion"

export function Solucao() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10">
            Por isso criamos uma parceria com a Zucchetti.
          </h2>
          <div className="space-y-5 text-lg text-slate-500 leading-relaxed">
            <p>
              A Zucchetti é referência mundial em software de gestão há mais de 40 anos. O ZWeb é
              a solução desenvolvida especialmente para o varejo brasileiro, com toda a robustez de
              quem atende mais de 700 mil empresas — mas com a simplicidade que o pequeno e médio
              varejista precisa.
            </p>
            <p>
              E aqui na DoisB Sistemas, você não fala com call center.
            </p>
          </div>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 text-3xl font-bold text-blue-800"
          >
            Fala com a gente. Direto.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
