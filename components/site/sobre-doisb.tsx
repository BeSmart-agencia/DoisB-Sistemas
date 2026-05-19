"use client"

import { motion } from "framer-motion"
import { Users, Zap, GraduationCap } from "lucide-react"

const pilares = [
  {
    icon: Users,
    title: "Atendimento próximo",
    text: "Você fala direto com a gente. Sem call center, sem URA, sem espera.",
  },
  {
    icon: Zap,
    title: "Resposta rápida",
    text: "Suporte via WhatsApp em horário comercial. E se for urgente, a gente resolve.",
  },
  {
    icon: GraduationCap,
    title: "Implantação assistida",
    text: "Não te entregamos o sistema e sumimos. Te ensinamos a usar até você se sentir seguro.",
  },
]

export function SobreDoisb() {
  return (
    <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            E por que escolher a DoisB Sistemas?
          </h2>
          <div className="text-lg text-slate-500 max-w-2xl mx-auto space-y-3 leading-relaxed">
            <p>
              Somos uma empresa familiar, formada por{" "}
              <span className="font-semibold text-slate-700">pai e filha</span>, que escolheu
              representar o ZWeb porque acredita que tecnologia boa precisa vir com atendimento bom.
            </p>
            <p>
              Aqui, você não vira número de protocolo. Aqui, você fala com gente que conhece o seu
              nome, o seu negócio e o seu sistema.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {pilares.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                <p.icon className="h-7 w-7 text-blue-800" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
