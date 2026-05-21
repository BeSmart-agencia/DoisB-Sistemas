import type { Metadata } from "next"
import { CadastroForm } from "./cadastro-form"

export const metadata: Metadata = {
  title: "Cadastro — DoisB Sistemas",
  description: "Assine o ZWeb e comece a vender, controlar e crescer.",
  robots: { index: false, follow: false },
}

const planosValidos = ["essencial", "standard", "premium"] as const
type PlanoKey = (typeof planosValidos)[number]

export default function CadastroPage({
  searchParams,
}: {
  searchParams: { plano?: string; erro?: string }
}) {
  const plano: PlanoKey = planosValidos.includes(searchParams.plano as PlanoKey)
    ? (searchParams.plano as PlanoKey)
    : "standard"

  return <CadastroForm plano={plano} erro={searchParams.erro} />
}
