"use client"

import { useEffect } from "react"

/**
 * Rastreia o código do vendedor externo.
 * Quando alguém abre o site por um link exclusivo (ex: /?v=joao),
 * grava o código num cookie de 30 dias. Assim a atribuição sobrevive
 * à navegação (home → planos → cadastro), mesmo em dias diferentes.
 *
 * O código é lido no formulário de cadastro e enviado ao checkout,
 * que grava clientes.vendedor_id na venda.
 */
export function VendorTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const codigo = params.get("v")?.trim().toLowerCase()
    if (!codigo) return
    // valida formato básico (mesma regra do cadastro do vendedor)
    if (!/^[a-z0-9._-]{2,40}$/.test(codigo)) return
    const trintaDias = 60 * 60 * 24 * 30
    document.cookie = `vend_ref=${encodeURIComponent(codigo)}; path=/; max-age=${trintaDias}; SameSite=Lax`
  }, [])

  return null
}
