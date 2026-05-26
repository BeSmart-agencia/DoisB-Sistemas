"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Check, ArrowLeft, ShieldCheck, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PLANOS = {
  essencial: { nome: "Essencial", preco: "R$ 129,90", desc: "Tudo o que você precisa pra começar" },
  standard: { nome: "Standard", preco: "R$ 199,90", desc: "A escolha de 8 em cada 10 lojistas" },
  premium: { nome: "Premium", preco: "R$ 249,90", desc: "Solução completa pra escalar" },
} as const

type PlanoKey = keyof typeof PLANOS

function validarCNPJ(cnpj: string): boolean {
  const n = cnpj.replace(/\D/g, "")
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const calc = (size: number) => {
    let soma = 0
    let peso = size - 7
    for (let i = size; i >= 1; i--) {
      soma += parseInt(n[size - i]) * peso--
      if (peso < 2) peso = 9
    }
    const r = soma % 11
    return r < 2 ? 0 : 11 - r
  }
  return calc(12) === parseInt(n[12]) && calc(13) === parseInt(n[13])
}

function maskCNPJ(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}

const schema = z.object({
  nome_empresa: z.string().min(2, "Informe o nome da empresa"),
  cnpj: z
    .string()
    .min(14, "CNPJ inválido")
    .refine(validarCNPJ, "CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
  nome_responsavel: z.string().min(2, "Informe o nome do responsável"),
  termos: z.boolean().refine((v) => v === true, "Você precisa aceitar os termos de uso"),
})

type FormData = z.infer<typeof schema>

export function CadastroForm({ plano, erro }: { plano: PlanoKey; erro?: string }) {
  const info = PLANOS[plano] ?? PLANOS.standard
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (erro === "cancelado") toast.error("Pagamento cancelado. Você pode tentar novamente.")
  }, [erro])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome_empresa: "",
      cnpj: "",
      email: "",
      telefone: "",
      nome_responsavel: "",
      termos: false,
    },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, plano }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? "Erro ao processar cadastro")
        return
      }

      window.location.href = json.url
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen app-soft-bg">
      {/* Header */}
      <header className="border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-700 text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </a>
          <span className="font-black tracking-tight text-slate-950 text-lg">DoisB Sistemas</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 lg:py-14">
        <div className="mb-8 text-center">
          <span className="section-kicker mx-auto">
            <ShieldCheck className="h-3.5 w-3.5" />
            Cadastro seguro
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Comece sua operação com o ZWeb</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
            Preencha os dados da empresa para seguir ao pagamento e iniciar a liberação do ambiente.
          </p>
        </div>
        {/* Plano selecionado */}
        <div className={cn(
          "rounded-2xl p-6 mb-8 border shadow-xl shadow-slate-900/5",
          plano === "standard"
            ? "bg-slate-950 border-blue-900 text-white"
            : "bg-white/90 border-slate-200"
        )}>
          <div className="flex items-start justify-between">
            <div>
              <p className={cn("text-sm font-medium mb-1", plano === "standard" ? "text-blue-200" : "text-slate-500")}>
                Plano selecionado
              </p>
              <h2 className={cn("text-2xl font-bold", plano === "standard" ? "text-white" : "text-slate-900")}>
                {info.nome}
              </h2>
              <p className={cn("text-sm mt-1", plano === "standard" ? "text-blue-200" : "text-slate-500")}>
                {info.desc}
              </p>
            </div>
            <div className="text-right">
              <p className={cn("text-3xl font-extrabold", plano === "standard" ? "text-white" : "text-blue-800")}>
                {info.preco}
              </p>
              <p className={cn("text-sm", plano === "standard" ? "text-blue-200" : "text-slate-400")}>/mês</p>
            </div>
          </div>
          <a
            href="/#planos"
            className={cn(
              "inline-block mt-4 text-xs font-medium underline underline-offset-2",
              plano === "standard" ? "text-blue-200 hover:text-white" : "text-blue-700 hover:text-blue-900"
            )}
          >
            Trocar de plano
          </a>
        </div>

        {/* Formulário */}
        <div className="admin-panel p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Dados da empresa</h2>
              <p className="text-sm text-slate-500">Usaremos essas informações para criar seu cadastro.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field label="Nome da empresa *" error={errors.nome_empresa?.message}>
              <Input
                placeholder="Ex: Comércio Silva Ltda"
                aria-invalid={!!errors.nome_empresa}
                {...register("nome_empresa")}
              />
            </Field>

            <Field label="CNPJ *" error={errors.cnpj?.message}>
              <Input
                placeholder="00.000.000/0000-00"
                aria-invalid={!!errors.cnpj}
                {...register("cnpj", {
                  onChange: (e) => {
                    e.target.value = maskCNPJ(e.target.value)
                  },
                })}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="E-mail *" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="contato@empresa.com.br"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </Field>

              <Field label="WhatsApp / Telefone *" error={errors.telefone?.message}>
                <Input
                  placeholder="(00) 00000-0000"
                  aria-invalid={!!errors.telefone}
                  {...register("telefone", {
                    onChange: (e) => {
                      e.target.value = maskPhone(e.target.value)
                    },
                  })}
                />
              </Field>
            </div>

            <Field label="Nome do responsável *" error={errors.nome_responsavel?.message}>
              <Input
                placeholder="Nome completo"
                aria-invalid={!!errors.nome_responsavel}
                {...register("nome_responsavel")}
              />
            </Field>

            {/* Termos */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-blue-700 cursor-pointer"
                  {...register("termos")}
                />
                <span className="text-sm text-slate-600 leading-relaxed">
                  Li e aceito os{" "}
                  <a href="/termos" target="_blank" className="text-blue-700 font-medium hover:underline">
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a href="/privacidade" target="_blank" className="text-blue-700 font-medium hover:underline">
                    Política de Privacidade
                  </a>
                  .
                </span>
              </label>
              {errors.termos && (
                <p className="mt-1.5 text-sm text-red-600 ml-7">{errors.termos.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-950 hover:bg-blue-900 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-900/20 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Continuar para pagamento
                </>
              )}
            </Button>

            <p className="text-center text-xs text-slate-400 pt-1">
              🔒 Pagamento 100% seguro via Stripe. Não armazenamos dados do cartão.
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-700 font-medium text-sm">{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
