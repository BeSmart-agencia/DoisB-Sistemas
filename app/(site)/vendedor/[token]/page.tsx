import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { listarComissoes } from "@/lib/comissoes"
import { PortalClient } from "./portal-client"

export const metadata: Metadata = {
  title: "Portal do Vendedor — DoisB Sistemas",
  robots: { index: false, follow: false },
}

// Sempre dinâmico: dados de vendas/comissão em tempo real.
export const dynamic = "force-dynamic"

function tokenValido(t: string) {
  return /^[0-9a-f-]{36}$/i.test(t)
}

export default async function PortalVendedorPage({
  params,
}: {
  params: { token: string }
}) {
  if (!tokenValido(params.token)) notFound()

  const supabase = createAdminClient()

  const { data: vendedor } = await supabase
    .from("vendedores")
    .select("id, nome, codigo, ativo, chave_pix")
    .eq("portal_token", params.token)
    .maybeSingle()

  if (!vendedor) notFound()

  const comissoes = await listarComissoes(supabase, vendedor.id)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.doisbsistemas.com.br"

  return (
    <PortalClient
      nome={vendedor.nome}
      ativo={vendedor.ativo}
      chavePix={vendedor.chave_pix}
      linkVenda={`${appUrl}/?v=${vendedor.codigo}`}
      comissoes={comissoes}
    />
  )
}
