"use client"

import { motion } from "framer-motion"
import { WifiOff, CreditCard, PackageX, FileWarning } from "lucide-react"

const problems = [
  {
    icon: WifiOff,
    title: "Internet caiu, vendas pararam.",
    text: "Você fica refém da conexão e perde clientes na fila enquanto reza pro Wi-Fi voltar.",
  },
  {
    icon: CreditCard,
    title: "Sistema que não fala com a maquininha.",
    text: "Você digita o valor duas vezes, erra troco, e ainda tem que conferir tudo no fim do dia.",
  },
  {
    icon: PackageX,
    title: "Controle de estoque no chute.",
    text: "Vende o que não tem, falta o que vende bem, e descobre a perda só no inventário.",
  },
  {
    icon: FileWarning,
    title: "Hora do imposto vira pesadelo.",
    text: "Contador pede mil arquivos, você não sabe onde estão, e ainda paga multa por atraso.",
  },
]

export function Problemas() {
  return (
    <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Cansou de perder dinheiro com sistema ruim?
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Se você se identifica com qualquer um destes problemas, está na hora de mudar:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-red-100/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
