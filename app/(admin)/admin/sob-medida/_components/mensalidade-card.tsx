"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CreditCard, Copy, Loader2, Ban, Link2 } from "lucide-react"
import { STATUS_MENSALIDADE, brl } from "./labels"

interface Props {
  id: string
  mensalidadeValor: number
  mensalidadeStatus: string
  mensalidadeDia: number | null
  checkoutUrl: string | null
  clienteEmail: string | null
}

export function MensalidadeCard({ id, mensalidadeValor, mensalidadeStatus, mensalidadeDia, checkoutUrl, clienteEmail }: Props) {
  const router = useRouter()
  const [carregando, setCarregando] = useState(false)
  const [url, setUrl] = useState<string | null>(checkoutUrl)
  const st = STATUS_MENSALIDADE[mensalidadeStatus] ?? STATUS_MENSALIDADE.inativa
  const temValor = Number(mensalidadeValor) > 0

  async function gerar() {
    setCarregando(true)
    try {
      const res = await fetch(`/api/admin/sob-medida/${id}/mensalidade`, { method: "POST" })
      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error ?? "Erro")
      setUrl(j.url)
      toast.success("Link de cobrança gerado. Envie ao cliente para ativar.")
      router.refresh()
    } catch (e) {
      toast.error((e as Error).message || "Erro ao gerar cobrança.")
    } finally {
      setCarregando(false)
    }
  }

  async function cancelar() {
    if (!confirm("Cancelar a mensalidade recorrente deste projeto no Stripe?")) return
    setCarregando(true)
    try {
      const res = await fetch(`/api/admin/sob-medida/${id}/mensalidade`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setUrl(null)
      toast.success("Mensalidade cancelada.")
      router.refresh()
    } catch {
      toast.error("Erro ao cancelar.")
    } finally {
      setCarregando(false)
    }
  }

  function copiar() {
    if (!url) return
    navigator.clipboard.writeText(url)
    toast.success("Link copiado.")
  }

  return (
    <div className="admin-panel p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-900">
          <CreditCard className="h-4 w-4" />
          <h2 className="text-sm font-bold uppercase tracking-wide">Mensalidade recorrente (Stripe)</h2>
        </div>
        <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", st.badge)}>{st.label}</span>
      </div>

      {!temValor ? (
        <p className="text-sm text-slate-600 mt-3">
          Defina um valor de mensalidade no formulário abaixo e salve para poder gerar a cobrança automática.
        </p>
      ) : (
        <>
          <p className="text-2xl font-black text-slate-950 mt-3">
            {brl(mensalidadeValor)}<span className="text-sm font-semibold text-slate-600">/mês{mensalidadeDia ? ` · vence dia ${mensalidadeDia}` : ""}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(mensalidadeStatus === "inativa" || mensalidadeStatus === "cancelada") && (
              <button onClick={gerar} disabled={carregando} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                Gerar cobrança automática
              </button>
            )}
            {url && mensalidadeStatus === "pendente" && (
              <>
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100">
                  <Link2 className="h-4 w-4" /> Abrir checkout
                </a>
                <button onClick={copiar} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Copy className="h-4 w-4" /> Copiar link
                </button>
              </>
            )}
            {["ativa", "pausada", "pendente"].includes(mensalidadeStatus) && (
              <button onClick={cancelar} disabled={carregando} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                <Ban className="h-4 w-4" /> Cancelar mensalidade
              </button>
            )}
          </div>

          {mensalidadeStatus === "pendente" && (
            <p className="text-xs text-slate-600 mt-3">
              Envie o link de checkout para {clienteEmail ?? "o cliente"} autorizar o pagamento. A mensalidade fica “Ativa” automaticamente após a confirmação.
            </p>
          )}
        </>
      )}
    </div>
  )
}
