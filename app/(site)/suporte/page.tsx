"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, CheckCircle, ArrowLeft, LifeBuoy, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

function validarCNPJ(cnpj: string): boolean {
  const n = cnpj.replace(/\D/g, "")
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const calc = (size: number) => {
    let soma = 0, peso = size - 7
    for (let i = size; i >= 1; i--) {
      soma += parseInt(n[size - i]) * peso--
      if (peso < 2) peso = 9
    }
    const r = soma % 11; return r < 2 ? 0 : 11 - r
  }
  return calc(12) === parseInt(n[12]) && calc(13) === parseInt(n[13])
}

function maskCNPJ(v: string) {
  return v.replace(/\D/g, "").slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

const schema = z.object({
  cnpj: z.string().min(14, "CNPJ inválido").refine(validarCNPJ, "CNPJ inválido"),
  assunto: z.string().min(3, "Informe o assunto").max(200),
  descricao: z.string().min(10, "Descreva o problema com mais detalhes").max(4000),
  email: z.string().email("E-mail inválido"),
})

type FormData = z.infer<typeof schema>

export default function SuportePage() {
  const [loading, setLoading] = useState(false)
  const [chamadoCriado, setChamadoCriado] = useState<number | null>(null)
  const [buscandoCliente, setBuscandoCliente] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const cnpjValue = watch("cnpj")

  useEffect(() => {
    const cnpjLimpo = (cnpjValue ?? "").replace(/\D/g, "")
    if (cnpjLimpo.length !== 14 || !validarCNPJ(cnpjValue ?? "")) return

    setBuscandoCliente(true)
    fetch(`/api/suporte/cliente?cnpj=${cnpjLimpo}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.found && data.email) {
          setValue("email", data.email, { shouldValidate: false })
        }
      })
      .catch(() => {})
      .finally(() => setBuscandoCliente(false))
  }, [cnpjValue, setValue])

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch("/api/suporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? "Erro ao abrir chamado"); return }
      setChamadoCriado(json.id)
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (chamadoCriado) {
    return (
      <div className="min-h-screen app-soft-bg flex items-center justify-center px-4">
        <div className="admin-panel max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Chamado aberto!</h1>
          <p className="text-3xl font-extrabold text-blue-700 mb-4">#{chamadoCriado}</p>
          <p className="text-slate-500 mb-8">
            Recebemos sua solicitação. Retornaremos em breve no e-mail informado.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-700 font-medium hover:underline text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen app-soft-bg">
      <header className="border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-700 text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </a>
          <span className="font-black tracking-tight text-slate-950 text-lg">DoisB Sistemas</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 lg:py-14">
        <div className="mb-8 text-center">
          <span className="section-kicker mx-auto">
            <LifeBuoy className="h-3.5 w-3.5" />
            Suporte técnico
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Abrir chamado de suporte</h1>
          <p className="mx-auto max-w-2xl text-slate-500 mt-2 text-sm">
            Descreva o problema e nossa equipe entrará em contato em breve.
          </p>
        </div>

        <div className="admin-panel p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Dados do atendimento</h2>
              <p className="text-sm text-slate-500">Quanto mais detalhes, mais rápido conseguimos ajudar.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field label="CNPJ da empresa *" error={errors.cnpj?.message}>
              <div className="relative">
                <Input
                  placeholder="00.000.000/0000-00"
                  aria-invalid={!!errors.cnpj}
                  {...register("cnpj")}
                  onChange={(e) => {
                    const masked = maskCNPJ(e.target.value)
                    e.target.value = masked
                    setValue("cnpj", masked, { shouldValidate: false })
                  }}
                />
                {buscandoCliente && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
                )}
              </div>
            </Field>

            <Field label="E-mail para retorno *" error={errors.email?.message}>
              <Input
                type="email"
                placeholder="seu@email.com.br"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </Field>

            <Field label="Assunto *" error={errors.assunto?.message}>
              <Input
                placeholder="Ex: Erro ao emitir NF-e, PDV não abre..."
                aria-invalid={!!errors.assunto}
                {...register("assunto")}
              />
            </Field>

            <Field label="Descrição do problema *" error={errors.descricao?.message}>
              <Textarea
                placeholder="Descreva o problema com detalhes: o que aconteceu, quando começou, mensagem de erro se houver..."
                aria-invalid={!!errors.descricao}
                className="min-h-[140px] resize-none text-sm"
                {...register("descricao")}
              />
            </Field>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-slate-950 hover:bg-blue-900 text-white font-bold rounded-xl"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enviando...</> : "Abrir chamado"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-700 font-medium text-sm">{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
