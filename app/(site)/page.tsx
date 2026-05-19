import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Hero } from "@/components/site/hero"
import { Problemas } from "@/components/site/problemas"
import { Solucao } from "@/components/site/solucao"
import { Vantagens } from "@/components/site/vantagens"
import { Segmentos } from "@/components/site/segmentos"
import { Planos } from "@/components/site/planos"
import { SobreZucchetti } from "@/components/site/sobre-zucchetti"
import { SobreDoisb } from "@/components/site/sobre-doisb"
import { Faq } from "@/components/site/faq"
import { CtaFinal } from "@/components/site/cta-final"
import { Footer } from "@/components/site/footer"

export const metadata: Metadata = {
  title: "DoisB Sistemas | Sistema de Gestão ZWeb para o Varejo Brasileiro",
  description:
    "Revenda autorizada Zucchetti. O ZWeb é o sistema de gestão completo para varejo, com PDV, NF-e, controle de estoque, financeiro e ordens de serviço. Venda. Controle. Cresça.",
  keywords:
    "sistema de gestão, ERP varejo, PDV, ZWeb, Zucchetti, NFCe, retaguarda offline, sistema para mercado, sistema para oficina, sistema para padaria, software de gestão, gestão de estoque, emissor NF-e",
  authors: [{ name: "DoisB Sistemas" }],
  openGraph: {
    title: "DoisB Sistemas | ZWeb para o Varejo Brasileiro",
    description:
      "Tecnologia italiana, atendimento brasileiro. Sistema completo de gestão pra você vender, controlar e crescer.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoisB Sistemas | ZWeb para o Varejo Brasileiro",
    description:
      "Tecnologia italiana, atendimento brasileiro. Sistema completo de gestão pra você vender, controlar e crescer.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="scroll-smooth">
        <Hero />
        <Problemas />
        <Solucao />
        <Vantagens />
        <Segmentos />
        <Planos />
        <SobreZucchetti />
        <SobreDoisb />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  )
}
