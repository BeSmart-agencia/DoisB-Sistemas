"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

const faqs = [
  {
    q: "Preciso instalar alguma coisa?",
    a: "O ZWeb roda 100% na nuvem — basta acessar pelo navegador. Para frente de caixa (PDV), instalamos um terminal local no seu computador. A implantação é assistida pela nossa equipe.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim! Pelo AppsCloud, você emite NFC-e, vendas, orçamentos, pedidos e ordens de serviço diretamente do celular Android ou da maquininha de cartão.",
  },
  {
    q: "Como funciona o suporte?",
    a: "Atendimento via WhatsApp, e-mail e chat. Em horário comercial, com resposta rápida. Clientes do Standard e Premium têm prioridade.",
  },
  {
    q: "Preciso ter contador?",
    a: "Sim, o ZWeb gera todos os arquivos fiscais (SPED, Sintegra, etc.) — mas quem entrega à Receita é o seu contador. A gente integra direitinho com o contador que você já tem.",
  },
  {
    q: "Tem fidelidade?",
    a: "Não. Você pode cancelar quando quiser, sem multa. A gente acredita que o melhor jeito de manter cliente é entregando valor — não amarrando contrato.",
  },
  {
    q: "E se eu quiser mudar de plano?",
    a: "Pode mudar a qualquer momento, pra mais ou pra menos. A cobrança é ajustada proporcionalmente.",
  },
  {
    q: "E a Reforma Tributária?",
    a: "O ZWeb já está sendo adaptado para todas as mudanças da Reforma Tributária brasileira. Você não precisa se preocupar — a Zucchetti acompanha cada alteração da legislação.",
  },
  {
    q: "Como começo?",
    a: "Você escolhe o plano, faz o pagamento e em até 24 horas úteis liberamos seu acesso, junto com agendamento da implantação.",
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{ background: "#060e1a" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Dúvidas comuns
          </h2>
          <p className="mt-3 text-lg" style={{ color: "rgba(148,163,184,0.7)" }}>
            Tudo o que você precisa saber antes de começar.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: isOpen ? "rgba(20,114,181,0.1)" : "rgba(255,255,255,0.04)",
                  border: isOpen ? "1px solid rgba(20,114,181,0.35)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className="font-semibold text-sm leading-snug"
                    style={{ color: isOpen ? "rgba(147,197,253,0.95)" : "rgba(226,232,240,0.9)" }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-transform duration-300"
                    style={{
                      background: isOpen ? "rgba(20,114,181,0.3)" : "rgba(255,255,255,0.06)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" style={{ color: isOpen ? "#93c5fd" : "rgba(148,163,184,0.7)" }} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p
                        className="px-6 pb-5 text-sm leading-relaxed"
                        style={{ color: "rgba(148,163,184,0.8)" }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
