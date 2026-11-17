// =============================================================================
// Setup de uma conta Stripe nova para a DoisB Sistemas
// =============================================================================
//
// Cria todos os produtos, preços e o webhook endpoint que o site usa, e
// imprime no final o bloco de env vars pronto para colar na Vercel/.env.local.
//
// Uso:
//   node scripts/setup-stripe.js sk_live_xxx [url-do-site]
//
//   - 1º argumento: secret key da conta NOVA (sk_live_... ou sk_test_...)
//   - 2º argumento (opcional): URL do site para o webhook
//     (padrão: https://www.doisbsistemas.com.br — precisa ser o host SEM
//      redirect; o apex doisbsistemas.com.br responde 307→www e o Stripe
//      não segue redirect em webhook, então a entrega falharia)
//
// Rodar UMA vez por conta — o script não verifica duplicados.
// Depois: colar as env vars na Vercel (Production) e fazer redeploy.
// Lembrete: ativar boleto e Pix em Settings → Payment methods (exige aprovação).

const Stripe = require("stripe")

const CATALOGO = [
  {
    produto: "DoisB Web — Essencial",
    precos: [
      { env: "STRIPE_PRICE_DOISB_ESSENCIAL_MENSAL", centavos: 12990, intervalo: "month" },
      { env: "STRIPE_PRICE_DOISB_ESSENCIAL_ANUAL", centavos: 140292, intervalo: "year" },
    ],
  },
  {
    produto: "DoisB Web — Standard",
    precos: [
      { env: "STRIPE_PRICE_DOISB_STANDARD_MENSAL", centavos: 18990, intervalo: "month" },
      { env: "STRIPE_PRICE_DOISB_STANDARD_ANUAL", centavos: 205092, intervalo: "year" },
    ],
  },
  {
    produto: "ZWeb — Essencial",
    precos: [{ env: "STRIPE_PRICE_ESSENCIAL", centavos: 19990, intervalo: "month" }],
  },
  {
    produto: "ZWeb — Standard",
    precos: [{ env: "STRIPE_PRICE_STANDARD", centavos: 24990, intervalo: "month" }],
  },
  {
    produto: "ZWeb — Premium",
    precos: [{ env: "STRIPE_PRICE_PREMIUM", centavos: 29990, intervalo: "month" }],
  },
  {
    produto: "GWeb",
    precos: [{ env: "STRIPE_PRICE_GWEB_MENSAL", centavos: 15990, intervalo: "month" }],
  },
  {
    produto: "AgendaB",
    precos: [{ env: "STRIPE_PRICE_AGENDAB", centavos: 24900, intervalo: "month" }],
  },
]

// Eventos que app/api/webhooks/stripe/route.ts processa
const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_intent.succeeded",
  "invoice.payment_failed",
]

async function main() {
  const key = process.argv[2]
  const siteUrl = (process.argv[3] || "https://www.doisbsistemas.com.br").replace(/\/$/, "")

  if (!key || !key.startsWith("sk_")) {
    console.error("Uso: node scripts/setup-stripe.js sk_live_xxx [url-do-site]")
    process.exit(1)
  }
  if (key.startsWith("sk_test_")) {
    console.warn("⚠ Chave de TESTE — os preços criados só valem no modo teste.\n")
  }

  const stripe = new Stripe(key)
  const envVars = {
    STRIPE_SECRET_KEY: key,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_..._PEGAR_NO_DASHBOARD",
  }

  for (const item of CATALOGO) {
    const produto = await stripe.products.create({ name: item.produto })
    for (const p of item.precos) {
      const price = await stripe.prices.create({
        product: produto.id,
        currency: "brl",
        unit_amount: p.centavos,
        recurring: { interval: p.intervalo },
        nickname: p.env,
      })
      envVars[p.env] = price.id
      console.log(`✔ ${item.produto} — ${(p.centavos / 100).toFixed(2)}/${p.intervalo} → ${price.id}`)
    }
  }

  const webhook = await stripe.webhookEndpoints.create({
    url: `${siteUrl}/api/webhooks/stripe`,
    enabled_events: WEBHOOK_EVENTS,
    description: "DoisB Sistemas — site (criado por scripts/setup-stripe.js)",
  })
  envVars.STRIPE_WEBHOOK_SECRET = webhook.secret
  console.log(`✔ Webhook criado: ${webhook.url}`)

  console.log("\n================ ENV VARS (colar na Vercel e no .env.local) ================\n")
  for (const [k, v] of Object.entries(envVars)) console.log(`${k}=${v}`)
  console.log("\nFalta manualmente:")
  console.log("  1. Publishable key (pk_live_...) em Developers → API keys")
  console.log("  2. Ativar boleto e Pix em Settings → Payment methods")
  console.log("  3. Redeploy na Vercel após salvar as env vars")
}

main().catch((err) => {
  console.error("Erro:", err.message)
  process.exit(1)
})
