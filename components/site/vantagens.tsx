"use client"

import { motion } from "framer-motion"
import { WifiOff, CreditCard, Wrench, FileCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const vantagens = [
  {
    icon: WifiOff,
    title: "Venda mesmo sem internet",
    subtitle: "Sua loja nunca mais para.",
    text: "Com a tecnologia de Retaguarda Offline, o ZWeb continua vendendo mesmo se a internet cair. Quando a conexão volta, tudo sincroniza automaticamente. Sem prejuízo. Sem desculpa pro cliente. Sem dor de cabeça.",
    quote: '"Se a internet falhar, o caixa continua faturando."',
    badges: [],
  },
  {
    icon: CreditCard,
    title: "Integra com as maquininhas que você já usa",
    subtitle: "Um sistema, todas as maquininhas.",
    text: "Vero, Stone, PagSeguro, Cielo, Rede, Sicredi, Sipag... o ZWeb se conecta com as principais maquininhas do Brasil. O valor da venda vai direto pra maquininha, sem retrabalho. E ainda emite boletos pelo banco Inter.",
    quote: "",
    badges: ["Vero", "Stone", "PagSeguro", "Cielo", "Rede", "Sicredi"],
  },
  {
    icon: Wrench,
    title: "Ordem de Serviço do começo ao fim",
    subtitle: "Pra quem presta serviço, tudo num lugar só.",
    text: "Da chegada do cliente à emissão da nota fiscal de serviço. Cadastre objetos, controle situações, acompanhe garantias, faça orçamentos e transforme em NF-e ou NFS-e em poucos cliques. Tudo pelo celular, com o AppsCloud.",
    quote: "",
    badges: [],
  },
  {
    icon: FileCheck,
    title: "Gestão completa, fiscal descomplicado",
    subtitle: "Imposto não dá mais dor de cabeça.",
    text: "SPED, Sintegra, MDF-e, NFC-e, NF-e... o ZWeb emite e organiza tudo. Seu contador agradece, a Receita não te incomoda, e você dorme tranquilo sabendo que está em dia.",
    quote: "",
    badges: [],
  },
]

export function Vantagens() {
  return (
    <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            O que torna o ZWeb diferente
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {vantagens.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                <v.icon className="h-7 w-7 text-blue-800" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{v.title}</h3>
              <p className="text-blue-700 font-semibold text-sm mb-4">{v.subtitle}</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{v.text}</p>
              {v.quote && (
                <blockquote className="border-l-2 border-blue-300 pl-4 text-slate-600 italic text-sm bg-blue-50/50 py-2 pr-3 rounded-r-lg">
                  {v.quote}
                </blockquote>
              )}
              {v.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {v.badges.map((b) => (
                    <Badge
                      key={b}
                      variant="secondary"
                      className="bg-slate-100 text-slate-600 text-xs hover:bg-slate-200"
                    >
                      {b}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
