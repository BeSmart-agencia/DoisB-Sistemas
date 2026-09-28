import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ProdutosGrid } from "@/components/site/produtos-grid"

export const metadata: Metadata = {
  title: "Produtos — DoisB Sistemas | DoisB Web, ZWeb, GWeb e Sob Medida",
  description:
    "Conheça os sistemas da DoisB: o DoisB Web (ERP completo — carro-chefe), o ZWeb para o varejo, o GWeb para mini-mercados e sistemas sob medida. Saiba mais ou assine.",
  alternates: { canonical: "/produtos" },
  openGraph: {
    title: "Produtos — DoisB Sistemas",
    description: "DoisB Web, ZWeb, GWeb e Sistemas Sob Medida. O sistema certo para cada negócio.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/produtos",
  },
  robots: { index: true, follow: true },
}

export default function ProdutosPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProdutosGrid />
      </main>
      <Footer />
    </>
  )
}
