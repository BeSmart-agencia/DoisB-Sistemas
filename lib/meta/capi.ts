import crypto from "crypto"
import { PLANO_PRECO } from "@/lib/planos"

// Meta Conversions API (server-side). Dispara o evento `Purchase` direto do
// servidor quando o pagamento é CONFIRMADO (webhook do Stripe), em vez de
// depender de um pixel no navegador — mais preciso para boleto/PIX, que não
// são instantâneos.
//
// Requer duas variáveis de ambiente:
//   NEXT_PUBLIC_FACEBOOK_PIXEL_ID    (já usado pelo pixel do navegador)
//   FACEBOOK_CONVERSIONS_API_TOKEN   (token do System User / Conversions API)
// Opcional:
//   META_CAPI_TEST_EVENT_CODE        (para testar no Events Manager)
//
// Se faltar pixel ou token, a função vira no-op (não quebra o webhook).

const GRAPH_VERSION = "v21.0"

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex")
}

/** Normaliza e-mail (trim + minúsculo) antes do hash. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Normaliza telefone para o formato esperado pela Meta: só dígitos, com código
 * do país. Números BR são guardados como "(51) 99999-9999" (DDD + número);
 * prefixamos 55 quando não houver código de país.
 */
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "")
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith("55")) {
    digits = "55" + digits
  }
  return digits
}

export interface PurchaseInput {
  clienteId: string
  email: string
  telefone?: string | null
  plano: string
  /** Valor da conversão; se omitido, usa o preço de tabela do plano. */
  valor?: number
  /** URL de origem (ex.: página de sucesso). Opcional. */
  eventSourceUrl?: string
}

/**
 * Envia um evento `Purchase` para a Conversions API da Meta.
 * Nunca lança — em caso de erro, apenas loga. Retorna true se enviado.
 */
export async function enviarPurchaseMeta(input: PurchaseInput): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  const token = process.env.FACEBOOK_CONVERSIONS_API_TOKEN

  if (!pixelId || !token) {
    console.warn("[meta-capi] Pixel ID ou token ausente — Purchase não enviado.")
    return false
  }

  const valor = input.valor ?? PLANO_PRECO[input.plano] ?? 0

  const userData: Record<string, unknown> = {
    em: [sha256(normalizeEmail(input.email))],
    external_id: [sha256(input.clienteId)],
  }
  if (input.telefone) {
    userData.ph = [sha256(normalizePhone(input.telefone))]
  }

  const eventData: Record<string, unknown> = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    // Deduplicação: se um dia adicionarmos um Purchase no navegador, o mesmo
    // event_id evita contagem dobrada.
    event_id: `purchase_${input.clienteId}`,
    action_source: "website",
    user_data: userData,
    custom_data: {
      currency: "BRL",
      value: Number(valor.toFixed(2)),
      content_name: input.plano,
      content_type: "product",
    },
  }
  if (input.eventSourceUrl) eventData.event_source_url = input.eventSourceUrl

  const payload: Record<string, unknown> = { data: [eventData] }
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE
  if (testCode) payload.test_event_code = testCode

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      console.error("[meta-capi] Falha", res.status, await res.text().catch(() => ""))
      return false
    }
    console.log(`[meta-capi] Purchase enviado (cliente ${input.clienteId}, R$ ${valor})`)
    return true
  } catch (err) {
    console.error("[meta-capi] Erro ao enviar Purchase:", err)
    return false
  }
}
