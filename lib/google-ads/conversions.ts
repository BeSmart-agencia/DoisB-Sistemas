import { precoMensalDe } from "@/lib/planos"

// Google Ads — Offline Conversion Import (server-side).
// Envia a conversão direto ao Google Ads quando o pagamento é CONFIRMADO
// (webhook do Stripe), usando o GCLID capturado no clique do anúncio.
// É o equivalente do Meta CAPI para o Google — mede venda REAL, inclusive
// boleto/PIX que não são instantâneos (a página /sucesso não serve pra isso).
//
// Variáveis de ambiente (preencher na Vercel quando a conta estiver pronta):
//   GOOGLE_ADS_DEVELOPER_TOKEN      — token do API Center do Google Ads
//   GOOGLE_ADS_CLIENT_ID            — OAuth2 (Google Cloud Console)
//   GOOGLE_ADS_CLIENT_SECRET        — OAuth2
//   GOOGLE_ADS_REFRESH_TOKEN        — gerado uma vez no fluxo OAuth
//   GOOGLE_ADS_CUSTOMER_ID          — id da conta de anúncios, só dígitos (sem traços)
//   GOOGLE_ADS_CONVERSION_ACTION_ID — id numérico da ação de conversão (tipo "Importar")
// Opcional:
//   GOOGLE_ADS_LOGIN_CUSTOMER_ID    — id da MCC (só dígitos), se a conta estiver sob uma gestora
//
// Se faltar qualquer credencial ou o gclid, a função vira no-op (não quebra o webhook).

const API_VERSION = "v18"

export interface ConversaoGoogleInput {
  gclid?: string | null
  clienteId: string
  plano: string
  produto?: string
  /** Valor da conversão; se omitido, usa o preço de tabela do produto+plano. */
  valor?: number
}

/** Data/hora no formato exigido pelo Google Ads: "yyyy-MM-dd HH:mm:ss+|-HH:mm" (horário de Brasília). */
function agoraBRT(): string {
  const d = new Date()
  // Brasília é UTC-3 (sem horário de verão desde 2019).
  const brt = new Date(d.getTime() - 3 * 60 * 60 * 1000)
  const p = (n: number) => String(n).padStart(2, "0")
  return (
    `${brt.getUTCFullYear()}-${p(brt.getUTCMonth() + 1)}-${p(brt.getUTCDate())} ` +
    `${p(brt.getUTCHours())}:${p(brt.getUTCMinutes())}:${p(brt.getUTCSeconds())}-03:00`
  )
}

async function obterAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })
    if (!res.ok) {
      console.error("[google-ads] OAuth falhou", res.status, await res.text().catch(() => ""))
      return null
    }
    const json = (await res.json()) as { access_token?: string }
    return json.access_token ?? null
  } catch (err) {
    console.error("[google-ads] Erro no OAuth:", err)
    return null
  }
}

/**
 * Envia uma conversão offline ao Google Ads. Nunca lança — em caso de erro,
 * apenas loga. Retorna true se enviada.
 */
export async function enviarConversaoGoogleAds(input: ConversaoGoogleInput): Promise<boolean> {
  const dev = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID
  const actionId = process.env.GOOGLE_ADS_CONVERSION_ACTION_ID
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID

  if (!input.gclid) {
    // Cliente não veio de um clique do Google Ads — nada a enviar.
    return false
  }
  if (!dev || !clientId || !clientSecret || !refreshToken || !customerId || !actionId) {
    console.warn("[google-ads] Credenciais incompletas — conversão não enviada.")
    return false
  }

  const valor = input.valor ?? precoMensalDe(input.produto ?? "zweb", input.plano)

  const accessToken = await obterAccessToken(clientId, clientSecret, refreshToken)
  if (!accessToken) return false

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": dev,
    "Content-Type": "application/json",
  }
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId

  const body = {
    conversions: [
      {
        gclid: input.gclid,
        conversionAction: `customers/${customerId}/conversionActions/${actionId}`,
        conversionDateTime: agoraBRT(),
        conversionValue: Number(valor.toFixed(2)),
        currencyCode: "BRL",
        orderId: `cliente_${input.clienteId}`, // deduplicação
      },
    ],
    partialFailure: true,
  }

  try {
    const res = await fetch(
      `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}:uploadClickConversions`,
      { method: "POST", headers, body: JSON.stringify(body) }
    )
    const texto = await res.text().catch(() => "")
    if (!res.ok) {
      console.error("[google-ads] Falha no upload", res.status, texto)
      return false
    }
    // partialFailure vem no corpo mesmo com 200 — logar pra diagnóstico.
    if (texto.includes("partialFailureError")) {
      console.error("[google-ads] partialFailure:", texto)
      return false
    }
    console.log(`[google-ads] Conversão enviada (cliente ${input.clienteId}, R$ ${valor})`)
    return true
  } catch (err) {
    console.error("[google-ads] Erro ao enviar conversão:", err)
    return false
  }
}
