import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { DoisbWebLanding } from "@/components/site/doisb-web-landing"

export const metadata: Metadata = {
  title: "DoisB Web — ERP completo | DoisB Sistemas",
  description:
    "O DoisB Web é o ERP completo da DoisB: vendas, NF-e/NFC-e, estoque, financeiro, serviços, food service, CRM, catálogo digital e multiempresa. 5 dias grátis, a partir de R$ 149,90/mês.",
  keywords:
    "DoisB Web, ERP completo, sistema de gestão, NF-e, NFC-e, PDV offline, food service, CRM, multiempresa, cardápio digital, catálogo digital, sistema para restaurante, sistema para varejo",
  alternates: { canonical: "/doisb-web" },
  openGraph: {
    title: "DoisB Web — o ERP completo da DoisB",
    description:
      "Vendas, fiscal, estoque, financeiro, food, CRM e multiempresa num sistema só. 5 dias grátis.",
    type: "website",
    locale: "pt_BR",
    siteName: "DoisB Sistemas",
    url: "/doisb-web",
  },
  robots: { index: true, follow: true },
}

export default function DoisbWebPage() {
  return (
    <>
      <Header />
      <main>
        <DoisbWebLanding />
      </main>
      <Footer />
    </>
  )
}
