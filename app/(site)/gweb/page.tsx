import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { GwebLanding } from "@/components/site/gweb-landing"

export const metadata: Metadata = {
  title: "GWeb — Sistema para mini-mercados | DoisB Sistemas",
  description:
    "O GWeb é o sistema simples para mini-mercados e mercearias: NF-e/NFC-e, PDV que funciona offline e etiquetas de gôndola. Plano único de R$ 159,90/mês, sem fidelidade.",
  keywords:
    "GWeb, sistema para mini-mercado, sistema para mercearia, PDV offline, NFC-e, etiqueta de gôndola, sistema para hortifruti, sistema para padaria, frente de caixa",
  alternates: { canonical: "/gweb" },
  openGraph: {
    title: "GWeb — o sistema do seu mini-mercado",
    description:
      "Nota fiscal, PDV offline e etiqueta. Simples, rápido e barato. R$ 159,90/mês.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/gweb",
  },
  robots: { index: true, follow: true },
}

export default function GwebPage() {
  return (
    <>
      <Header />
      <main>
        <GwebLanding />
      </main>
      <Footer />
    </>
  )
}
