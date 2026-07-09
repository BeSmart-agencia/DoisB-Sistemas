"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Send, CheckCircle2 } from "lucide-react"
import { event as pixelEvent } from "@/app/components/MetaPixel"

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  telefone: z.string().min(10, "Informe um WhatsApp válido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  empresa: z.string().min(2, "Informe o nome da empresa"),
  setor: z.string().min(2, "Informe o setor"),
  tamanho_equipe: z.string().min(1, "Selecione o tamanho da equipe"),
  processo: z.string().min(10, "Descreva o processo em pelo menos uma frase"),
  website: z.string().max(0).optional().or(z.literal("")),
})

type FormData = z.infer<typeof schema>

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function SobMedidaForm() {
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setErro(null)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, linha: "sob_medida", origem: "lp:sob-medida" }),
      })
      if (!res.ok) {
        const corpo = await res.json().catch(() => null)
        const mensagem = corpo?.error ?? "Erro ao enviar. Tente de novo ou chame a gente no WhatsApp."
        setErro(mensagem)
        toast.error(mensagem)
        return
      }
      // Pixel só dispara em sucesso real (lead gravado no banco)
      pixelEvent("Lead", { linha: "sob_medida", origem: "lp:sob-medida" })
      setEnviado(true)
    } catch {
      const mensagem = "Erro de conexão. Tente de novo ou chame a gente no WhatsApp."
      setErro(mensagem)
      toast.error(mensagem)
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-black text-slate-950">Briefing recebido!</h3>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Vamos analisar o seu processo e chamar você no WhatsApp para agendar o
          diagnóstico — uma conversa de 20 minutos, sem compromisso.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* honeypot — invisível para humanos */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Seu nome *" error={errors.nome?.message}>
          <input className={inputClass} placeholder="Ex: João da Silva" {...register("nome")} />
        </Field>
        <Field label="WhatsApp *" error={errors.telefone?.message}>
          <input className={inputClass} placeholder="(51) 99999-9999" {...register("telefone")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Empresa *" error={errors.empresa?.message}>
          <input className={inputClass} placeholder="Nome da empresa" {...register("empresa")} />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <input className={inputClass} type="email" placeholder="voce@empresa.com.br (opcional)" {...register("email")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Setor *" error={errors.setor?.message}>
          <input className={inputClass} placeholder="Ex: transportadora, clínica, indústria..." {...register("setor")} />
        </Field>
        <Field label="Tamanho da equipe *" error={errors.tamanho_equipe?.message}>
          <select className={inputClass} defaultValue="" {...register("tamanho_equipe")}>
            <option value="" disabled>
              Selecione...
            </option>
            <option value="so_eu">Só eu</option>
            <option value="2_5">2 a 5 pessoas</option>
            <option value="6_15">6 a 15 pessoas</option>
            <option value="16_50">16 a 50 pessoas</option>
            <option value="50_mais">Mais de 50</option>
          </select>
        </Field>
      </div>

      <Field label="Descreva o processo que dói *" error={errors.processo?.message}>
        <textarea
          rows={5}
          className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
          placeholder="Ex: hoje o agendamento é numa planilha que só a Maria sabe mexer. Quando ela falta, ninguém consegue confirmar horário, e todo fim de mês a gente perde um dia inteiro fechando as contas na mão..."
          {...register("processo")}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-blue-900 text-white font-bold text-base shadow-lg shadow-blue-900/20 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Pedir diagnóstico gratuito
          </>
        )}
      </button>
      {erro && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-red-700">{erro}</p>
          <a
            href="https://wa.me/5551998518895"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm font-bold text-red-700 underline underline-offset-2"
          >
            Chamar no WhatsApp
          </a>
        </div>
      )}
      <p className="text-center text-xs text-slate-400">
        Sem compromisso. A primeira conversa é para entender o seu processo, não para vender.
      </p>
    </form>
  )
}
