"use client"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

export function AssinarButton({ className }: { className?: string }) {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")

  async function assinar() {
    setErro("")
    setCarregando(true)
    try {
      const res = await fetch("/api/checkout/agendab", { method: "POST" })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Erro ao iniciar o pagamento.")
      }
      window.location.href = data.url
    } catch (e) {
      setErro((e as Error).message)
      setCarregando(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={assinar}
        disabled={carregando}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-full bg-[#0169b2] hover:bg-[#015d9e] px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-950/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none"
        }
      >
        {carregando ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Abrindo pagamento…
          </>
        ) : (
          <>
            Assinar por R$ 175/mês
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </div>
  )
}
