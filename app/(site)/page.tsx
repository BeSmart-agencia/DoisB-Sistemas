import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { HomeInstitucional } from "@/components/site/home-institucional"
import { Footer } from "@/components/site/footer"

export const metadata: Metadata = {
  title: "DoisB Sistemas | Software House — ZWeb e Sistemas Sob Medida",
  description:
    "Software house familiar do RS. Sistema de gestão ZWeb para o varejo (revenda autorizada Zucchetti) e desenvolvimento de sistemas sob medida e automação de processos para PMEs. Venda. Controle. Cresça.",
  keywords:
    "software house, desenvolvimento de sistemas, automação de processos, sistema sob medida, sistema personalizado para empresa, ZWeb, Zucchetti, sistema de gestão, ERP varejo, DoisB Sistemas",
  authors: [{ name: "DoisB Sistemas" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "DoisB Sistemas | Software House",
    description:
      "O sistema certo para cada negócio: ZWeb para o varejo, sob medida para o seu processo. Tecnologia de nível mundial, atendimento de vizinho.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoisB Sistemas | Software House",
    description:
      "O sistema certo para cada negócio: ZWeb para o varejo, sob medida para o seu processo.",
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
