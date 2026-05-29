"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Loader2, CheckCircle2, Copy, Check } from "lucide-react"

type Props = {
  intentId: string
  nome: string
  plano: string
  vencimento: string
  qrImage: string
  qrCode: string
}

function formatarData(iso: string) {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

export default function PagarPixClient({ intentId, nome, plano, vencimento, qrImage, qrCode }: Props) {
  const [succeeded, setSucceeded] = useState(false)
  const [copied, setCopied] = useState(false)
  const planoNome = plano.charAt(0).toUpperCase() + plano.slice(1)

  const poll = useCallback(async () => {
    if (succeeded) return
    try {
      const res = await fetch(`/api/pix/status?intent_id=${intentId}`)
      const data = await res.json()
      if (data.status === "succeeded") setSucceeded(true)
    } catch {
      // silent
    }
  }, [intentId, succeeded])

  useEffect(() => {
    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [poll])

  async function copiar() {
    await navigator.clipboard.writeText(qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (succeeded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Pagamento confirmado!</h1>
          <p className="text-slate-500 leading-relaxed mb-6">
            PIX recebido. Seu acesso ao ZWeb será mantido por mais 30 dias.
          </p>
          <a
            href="https://wa.me/5551998518895"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-3.5 rounded-xl font-semibold text-white text-sm"
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
          <p className="text-sm font-semibold text-slate-500 mb-1">Renovação — Plano {planoNome}</p>
          <h1 className="text-xl font-bold text-slate-900">Pague o PIX para renovar</h1>
          {vencimento && (
            <p className="text-sm text-slate-400 mt-1">
              Vencimento: <strong className="text-slate-600">{formatarData(vencimento)}</strong>
            </p>
          )}
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
        <div className="mb-6">
          <p className="text-xs text-slate-500 mb-1.5 font-medium">Código Copia e Cola:</p>
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
          Aguardando confirmação…
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 mb-2">Problema com o pagamento?</p>
          <a
            href="https://wa.me/5551998518895"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold"
            style={{ color: "#25d366" }}
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
