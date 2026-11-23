"use client"

import { useEffect } from "react"

/**
 * Rastreia o GCLID (Google Click ID) dos anúncios do Google Ads.
 * Quando alguém chega pelo anúncio, a URL traz ?gclid=... — gravamos num
 * cookie de 90 dias (janela de conversão do Google). Assim o clique
 * sobrevive à navegação até o pagamento.
 *
 * O GCLID é lido no formulário de cadastro e enviado ao checkout, que
 * grava clientes.gclid. No webhook (pagamento confirmado) ele é usado para
 * enviar a conversão offline ao Google Ads — medindo venda REAL, inclusive
 * boleto/PIX que não são instantâneos.
 */
export function GclidTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const gclid = params.get("gclid")?.trim()
    if (!gclid) return
    if (!/^[\w.-]{10,200}$/.test(gclid)) return
    const noventaDias = 60 * 60 * 24 * 90
    document.cookie = `gclid=${encodeURIComponent(gclid)}; path=/; max-age=${noventaDias}; SameSite=Lax`
  }, [])

  return null
}
