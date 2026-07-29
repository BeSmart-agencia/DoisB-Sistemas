import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { PortalClient, type VendaPortal } from "./portal-client"

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

  const { data: vendas } = await supabase
    .from("clientes")
    .select("id, nome_empresa, cidade, estado, plano, status_pagamento, data_assinatura, created_at, comissao_paga")
    .eq("vendedor_id", vendedor.id)
    .order("created_at", { ascending: false })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.doisbsistemas.com.br"

  return (
    <PortalClient
      nome={vendedor.nome}
      ativo={vendedor.ativo}
      chavePix={vendedor.chave_pix}
      linkVenda={`${appUrl}/?v=${vendedor.codigo}`}
      vendas={(vendas ?? []) as VendaPortal[]}
    />
  )
}
