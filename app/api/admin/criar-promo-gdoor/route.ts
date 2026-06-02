import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { stripe } from "@/lib/stripe/client"

// Cria os cupons de promoção Gdoor uma única vez no Stripe
// Cupom: duration=once, amount_off = (preço normal - 19,90) em centavos
// Acesse /api/admin/criar-promo-gdoor uma vez para criar os cupons
const CUPONS = [
  { id: "GDOOR_JUN26_ESSENCIAL", amount_off: 11000, nome: "Essencial", label: "Gdoor Jun26 Essencial" },
  { id: "GDOOR_JUN26_STANDARD",  amount_off: 18000, nome: "Standard",  label: "Gdoor Jun26 Standard"  },
  { id: "GDOOR_JUN26_PREMIUM",   amount_off: 23000, nome: "Premium",   label: "Gdoor Jun26 Premium"   },
]

export async function GET() {
  const { response } = await requireAdmin()
  if (response) return response

  const resultados: Record<string, string> = {}

  for (const c of CUPONS) {
    try {
      const cupom = await stripe.coupons.create({
        id: c.id,
        name: c.label,
        amount_off: c.amount_off,
        currency: "brl",
        duration: "once",
        redeem_by: Math.floor(new Date("2026-06-09T20:00:00Z").getTime() / 1000), // 17h BRT
        max_redemptions: 500,
        metadata: { promo: "gdoor_jun26" },
      })
      resultados[c.nome] = cupom.id
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes("already exists")) {
        resultados[c.nome] = `${c.id} (já existia)`
      } else {
        resultados[c.nome] = `ERRO: ${msg}`
      }
    }
  }

  return NextResponse.json({ criados: resultados })
}
