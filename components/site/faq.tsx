"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Dúvidas comuns</h2>
        </motion.div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion multiple={false} className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-slate-200 rounded-xl px-6 shadow-sm data-[state=open]:border-blue-200 data-[state=open]:shadow-md data-[state=open]:bg-blue-50/30 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:no-underline hover:text-blue-800 text-sm py-5 [&[data-state=open]]:text-blue-800">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
