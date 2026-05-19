"use client"

import { motion } from "framer-motion"
import { Wrench, Shirt, ShoppingCart, Cookie, Laptop, HeartHandshake } from "lucide-react"

const segmentos = [
  {
    icon: Wrench,
    title: "Oficinas Mecânicas",
    desc: "OS, peças, serviços, garantia. Tudo integrado.",
  },
  {
    icon: Shirt,
    title: "Vestuário e Calçados",
    desc: "Controle de grades (tamanho, cor), etiquetas, vitrine.",
  },
  {
    icon: ShoppingCart,
    title: "Mercados e Minimercados",
    desc: "PDV ágil, balança integrada, controle de validade.",
  },
  {
    icon: Cookie,
    title: "Empórios e Padarias",
    desc: "Produção, fichas técnicas, pesagem, frente de caixa rápida.",
  },
  {
    icon: Laptop,
    title: "Assistências Técnicas",
    desc: "OS detalhada com objeto, identificadores e situações.",
  },
  {
    icon: HeartHandshake,
    title: "Prestadores de Serviço",
    desc: "Orçamentos, NFS-e e cobrança recorrente.",
  },
]

export function Segmentos() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Feito para o varejo que você conhece
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Não importa o seu segmento — temos a configuração certa pra você.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {segmentos.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-100 hover:shadow-sm transition-all duration-200 group cursor-default"
            >
              <div className="shrink-0 h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:shadow-blue-50 transition-all">
                <s.icon className="h-5 w-5 text-blue-800" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
