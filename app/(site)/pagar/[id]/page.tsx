import { createAdminClient } from "@/lib/supabase/admin"
import { stripe } from "@/lib/stripe/client"
import { notFound } from "next/navigation"
import PagarPixClient from "./pagar-pix-client"

export const dynamic = "force-dynamic"

export default async function PagarPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()

  const { data: cliente } = await supabase
    .from("clientes")
    .select("id, nome_responsavel, plano, pix_charge_id, pix_vencimento, status_pagamento, forma_pagamento")
    .eq("id", params.id)
    .maybeSingle()

  if (!cliente || cliente.forma_pagamento !== "pix" || !cliente.pix_charge_id) {
    notFound()
  }

  let qrImage: string | null = null
  let qrCode: string | null = null

  try {
    const intent = await stripe.paymentIntents.retrieve(cliente.pix_charge_id)
    // Se já foi pago, mostrar confirmação
    if (intent.status === "succeeded") {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
            <p className="text-5xl mb-4">✅</p>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Pagamento já confirmado!</h1>
            <p className="text-slate-500">Este PIX já foi processado. Seu acesso está ativo.</p>
          </div>
        </div>
      )
    }
    const pix = intent.next_action?.pix_display_qr_code
    qrImage = pix?.image_url_png ?? null
    qrCode = pix?.data ?? null
  } catch (err) {
    console.error("[pagar] Erro ao buscar PaymentIntent:", err)
  }

  if (!qrImage || !qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-slate-900 mb-3">QR Code indisponível</h1>
          <p className="text-slate-500 mb-6">O QR Code desta cobrança expirou ou não está disponível.</p>
          <a
            href="https://wa.me/5551998518895"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-3 rounded-xl font-semibold text-white text-sm"
            style={{ background: "#25d366" }}
          >
            Falar no WhatsApp para segunda via
          </a>
        </div>
      </div>
    )
  }

  return (
    <PagarPixClient
      intentId={cliente.pix_charge_id}
      plano={cliente.plano}
      vencimento={cliente.pix_vencimento ?? ""}
      qrImage={qrImage}
      qrCode={qrCode}
    />
  )
}
