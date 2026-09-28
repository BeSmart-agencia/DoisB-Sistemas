import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { HomeInstitucional } from "@/components/site/home-institucional"
import { Footer } from "@/components/site/footer"

export const metadata: Metadata = {
  title: "DoisB Sistemas | DoisB Web, ZWeb, GWeb e Sistemas Sob Medida",
  description:
    "Software house familiar do RS. Nosso carro-chefe é o DoisB Web, um ERP completo (vendas, fiscal, estoque, financeiro, food e CRM). Também ZWeb para o varejo, GWeb para mini-mercados e sistemas sob medida. Venda. Controle. Cresça.",
  keywords:
    "DoisB Web, ERP completo, software house, sistema de gestão, ZWeb, GWeb, mini-mercado, Zucchetti, sistema sob medida, automação de processos, NF-e, PDV, food service, DoisB Sistemas",
  authors: [{ name: "DoisB Sistemas" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "DoisB Sistemas | O sistema certo para cada negócio",
    description:
      "DoisB Web (ERP completo — carro-chefe), ZWeb para o varejo, GWeb para mini-mercados e sob medida. Tecnologia de nível mundial, atendimento de vizinho.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoisB Sistemas | O sistema certo para cada negócio",
    description:
      "DoisB Web, ZWeb, GWeb e sistemas sob medida. Do ERP completo ao sistema do seu jeito.",
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
      <main>
        <HomeInstitucional />
      </main>
      <Footer />
    </>
  )
}
