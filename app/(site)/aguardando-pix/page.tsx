"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Loader2, CheckCircle2, Clock, Copy, Check } from "lucide-react"

type Status = "pending" | "processing" | "succeeded" | "error" | "loading"

export default function AguardandoPix() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>}>
      <AguardandoPixContent />
    </Suspense>
  )
}

function AguardandoPixContent() {
  const params = useSearchParams()
  const intentId = params.get("intent_id")
  const qrImage = params.get("qr_image")
  const qrCode = params.get("qr_code")

  const [status, setStatus] = useState<Status>("pending")
  const [copied, setCopied] = useState(false)

  const poll = useCallback(async () => {
    if (!intentId || status === "succeeded") return
    try {
      const res = await fetch(`/api/pix/status?intent_id=${intentId}`)
      const data = await res.json()
      if (data.status === "succeeded") setStatus("succeeded")
      else if (data.status === "processing") setStatus("processing")
    } catch {
      // silent — keep polling
    }
  }, [intentId, status])

  useEffect(() => {
    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [poll])

  async function copiar() {
    if (!qrCode) return
    await navigator.clipboard.writeText(qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (!intentId || !qrImage || !qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Link inválido. Volte ao cadastro.</p>
      </div>
    )
  }

  if (status === "succeeded") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Pagamento confirmado!</h1>
          <p className="text-slate-500 leading-relaxed mb-6">
            Recebemos seu PIX. Nossa equipe vai configurar seu acesso ao ZWeb e entrar em contato em
            até <strong>24 horas úteis</strong>.
          </p>
          <a
            href="https://wa.me/5551998518895?text=Ol%C3%A1!%20Acabei%20de%20pagar%20o%20PIX%20e%20quero%20acompanhar%20meu%20acesso."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white text-sm"
            style={{ background: "#25d366" }}
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(20,114,181,0.08)", color: "#1472B5" }}>
            <Clock className="h-3.5 w-3.5" />
            Aguardando pagamento
          </div>
          <h1 className="text-xl font-bold text-slate-900">Escaneie o QR Code PIX</h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Abra o app do seu banco, escolha Pix e escaneie o código abaixo.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-5">
          <div className="p-3 border-2 border-slate-100 rounded-2xl">
            <Image
              src={qrImage}
              alt="QR Code PIX"
              width={220}
              height={220}
              className="rounded-xl"
              unoptimized
            />
          </div>
        </div>

        {/* Copia e cola */}
        <div className="mb-5">
          <p className="text-xs text-slate-500 mb-1.5 font-medium">Ou use o código Copia e Cola:</p>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="flex-1 text-xs text-slate-600 font-mono break-all line-clamp-3">
              {qrCode}
            </p>
            <button
              onClick={copiar}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={copied
                ? { background: "rgba(16,185,129,0.1)", color: "#059669" }
                : { background: "rgba(20,114,181,0.1)", color: "#1472B5" }
              }
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Aguardando confirmação do pagamento…
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          O QR Code expira em 24 horas · Valor de 1 mês da assinatura
        </p>
      </div>
    </div>
  )
}
