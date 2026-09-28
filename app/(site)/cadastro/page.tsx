import type { Metadata } from "next"
import { CadastroForm } from "./cadastro-form"
import { getProduto, type ProdutoId, type IntervaloCobranca } from "@/lib/planos"

export const metadata: Metadata = {
  title: "Cadastro — DoisB Sistemas",
  description: "Assine e comece a vender, controlar e crescer.",
  robots: { index: false, follow: false },
}

const produtosValidos: ProdutoId[] = ["doisb-web", "zweb", "gweb"]

export default function CadastroPage({
  searchParams,
}: {
  searchParams: { produto?: string; plano?: string; intervalo?: string; erro?: string }
}) {
  const produto: ProdutoId = produtosValidos.includes(searchParams.produto as ProdutoId)
    ? (searchParams.produto as ProdutoId)
    : "zweb"

  const produtoCat = getProduto(produto)
  const planosValidos = produtoCat?.planos.map((p) => p.key) ?? []
  const planoDefault = produtoCat?.planos.find((p) => p.destaque)?.key ?? produtoCat?.planos[0]?.key ?? "standard"
  const plano = planosValidos.includes(searchParams.plano ?? "")
    ? (searchParams.plano as string)
    : planoDefault

  const intervalo: IntervaloCobranca = searchParams.intervalo === "anual" ? "anual" : "mensal"

  return <CadastroForm produto={produto} plano={plano} intervalo={intervalo} erro={searchParams.erro} />
}
