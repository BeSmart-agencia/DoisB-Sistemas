import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { SobreNos } from "@/components/site/sobre-nos"

export const metadata: Metadata = {
  title: "Sobre nós — DoisB Sistemas",
  description:
    "A DoisB é uma software house familiar do Rio Grande do Sul, fundada por Laisa e Abel Barth. Tecnologia de nível mundial com atendimento humano — do DoisB Web ao sistema sob medida.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Sobre a DoisB Sistemas",
    description: "Software house familiar do RS. Sistema de gente grande, atendimento de vizinho.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/sobre",
  },
  robots: { index: true, follow: true },
}

export default function SobrePage() {
  return (
    <>
      <Header />
      <main>
        <SobreNos />
      </main>
      <Footer />
    </>
  )
}
