"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Check, ArrowLeft, ShieldCheck, Building2, CreditCard, QrCode, FileText, MapPin, Receipt, AlertCircle, Mail, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PLANOS = {
  essencial: { nome: "Essencial", preco: "R$ 129,90", desc: "Tudo o que você precisa pra começar" },
  standard: { nome: "Standard", preco: "R$ 199,90", desc: "A escolha de 8 em cada 10 lojistas" },
  premium: { nome: "Premium", preco: "R$ 249,90", desc: "Solução completa pra escalar" },
} as const

const WA_ORCAMENTO_LINK =
  "https://wa.me/5551998518895?text=Ol%C3%A1!%20Vim%20pelo%20cadastro%20do%20ZWeb%20e%20minha%20empresa%20%C3%A9%20do%20regime%20geral%20%28lucro%20real%20ou%20presumido%29.%20Quero%20solicitar%20um%20or%C3%A7amento%20sob%20medida."

type PlanoKey = keyof typeof PLANOS

const CRT_OPTIONS = [
  { value: "1", label: "Simples Nacional" },
  { value: "2", label: "Simples Nacional – Excesso de Sublimite" },
  { value: "3", label: "Regime Normal" },
]

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
  return v.replace(/\D/g, "").slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

function maskPhone(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}

function maskCEP(v: string) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2")
}

const schema = z.object({
  nome_empresa: z.string().min(2, "Informe a razão social"),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().min(14, "CNPJ inválido").refine(validarCNPJ, "CNPJ inválido"),
  ie: z.string().min(1, "Informe a IE ou 'ISENTO'"),
  im: z.string().optional(),
  crt: z.string().min(1, "Selecione o regime tributário"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  nome_responsavel: z.string().min(2, "Informe o nome do responsável"),
  cep: z.string().min(8, "CEP inválido"),
  logradouro: z.string().min(1, "Informe o logradouro"),
  numero: z.string().min(1, "Informe o número"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Informe o bairro"),
  cidade: z.string().min(1, "Informe a cidade"),
  estado: z.string().length(2, "UF inválida"),
  termos: z.boolean().refine((v) => v === true, "Você precisa aceitar os termos de uso"),
})

type FormData = z.infer<typeof schema>
type FormaPagamento = "cartao" | "boleto" | "pix"

export function CadastroForm({ plano, erro }: { plano: PlanoKey; erro?: string }) {
  const info = PLANOS[plano] ?? PLANOS.standard
  const [loading, setLoading] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("cartao")
  const [buscandoCep, setBuscandoCep] = useState(false)

  useEffect(() => {
    if (erro === "cancelado") toast.error("Pagamento cancelado. Você pode tentar novamente.")
  }, [erro])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome_empresa: "", nome_fantasia: "", cnpj: "", ie: "", im: "", crt: "",
      email: "", telefone: "", nome_responsavel: "",
      cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
      termos: false,
    },
  })
  const regimeNormalSelecionado = watch("crt") === "3"

  async function buscarCEP(cep: string) {
    const digits = cep.replace(/\D/g, "")
    if (digits.length !== 8) return
    setBuscandoCep(true)
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await r.json()
      if (data.erro) { toast.error("CEP não encontrado"); return }
      setValue("logradouro", data.logradouro ?? "")
      setValue("bairro", data.bairro ?? "")
      setValue("cidade", data.localidade ?? "")
      setValue("estado", data.uf ?? "")
    } catch {
      toast.error("Erro ao buscar CEP")
    } finally {
      setBuscandoCep(false)
    }
  }

  async function onSubmit(data: FormData) {
    if (data.crt === "3") {
      window.location.href = WA_ORCAMENTO_LINK
      return
    }

    setLoading(true)
    try {
      if (formaPagamento === "pix") {
        const res = await fetch("/api/checkout/pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, plano }),
        })
        const json = await res.json()
        if (!res.ok) { toast.error(json.error ?? "Erro ao processar cadastro"); return }
        const params = new URLSearchParams({
          intent_id: json.intentId,
          qr_image: json.qrImage ?? "",
          qr_code: json.qrCode ?? "",
        })
        window.location.href = `/aguardando-pix?${params.toString()}`
      } else {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, plano, forma_pagamento: formaPagamento }),
        })
        const json = await res.json()
        if (!res.ok) { toast.error(json.error ?? "Erro ao processar cadastro"); return }
        window.location.href = json.url
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen app-soft-bg">
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
          plano === "standard" ? "bg-slate-950 border-blue-900 text-white" : "bg-white/90 border-slate-200"
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
          <a href="/#planos" className={cn("inline-block mt-4 text-xs font-medium underline underline-offset-2", plano === "standard" ? "text-blue-200 hover:text-white" : "text-blue-700 hover:text-blue-900")}>
            Trocar de plano
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          {/* Dados da empresa */}
          <div className="admin-panel p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">Dados da empresa</h2>
                <p className="text-sm text-slate-500">Informações do cadastro.</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Razão Social *" error={errors.nome_empresa?.message}>
                  <Input placeholder="Ex: Comércio Silva Ltda" {...register("nome_empresa")} />
                </Field>
                <Field label="Nome Fantasia" error={errors.nome_fantasia?.message}>
                  <Input placeholder="Ex: Mercado Silva" {...register("nome_fantasia")} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="CNPJ *" error={errors.cnpj?.message}>
                  <Input placeholder="00.000.000/0000-00" {...register("cnpj", { onChange: (e) => { e.target.value = maskCNPJ(e.target.value) } })} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="E-mail *" error={errors.email?.message}>
                    <Input type="email" placeholder="contato@empresa.com.br" {...register("email")} />
                    <p className="flex items-start gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-2 text-xs leading-relaxed text-blue-800">
                      <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Confira com atenção: toda a ativação do sistema e os dados de acesso serão enviados para este e-mail.
                    </p>
                  </Field>
                  <Field label="WhatsApp *" error={errors.telefone?.message}>
                    <Input placeholder="(00) 00000-0000" {...register("telefone", { onChange: (e) => { e.target.value = maskPhone(e.target.value) } })} />
                  </Field>
                </div>
              </div>

              <Field label="Nome do responsável *" error={errors.nome_responsavel?.message}>
                <Input placeholder="Nome completo" {...register("nome_responsavel")} />
              </Field>
            </div>
          </div>

          {/* Dados fiscais */}
          <div className="admin-panel p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">Dados fiscais</h2>
                <p className="text-sm text-slate-500">Necessários para configurar o sistema.</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Inscrição Estadual (IE) *" error={errors.ie?.message}>
                  <Input placeholder="Ex: 123456789 ou ISENTO" {...register("ie")} />
                </Field>
                <Field label="Inscrição Municipal (IM)" error={errors.im?.message}>
                  <Input placeholder="Ex: 12345 (opcional)" {...register("im")} />
                </Field>
                <Field label="Regime Tributário (CRT) *" error={errors.crt?.message}>
                  <select
                    {...register("crt")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-slate-700"
                  >
                    <option value="">Selecione...</option>
                    {CRT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </div>
              {regimeNormalSelecionado && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                    <div className="space-y-3">
                      <p className="font-semibold">Empresas do regime normal precisam de orçamento sob medida.</p>
                      <p className="leading-relaxed text-amber-800">
                        Os planos desta página são para MEI e Simples Nacional. Para lucro real ou lucro presumido,
                        fale com a gente no WhatsApp para avaliarmos a melhor configuração do ZWeb.
                      </p>
                      <a
                        href={WA_ORCAMENTO_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Solicitar orçamento sob medida
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="admin-panel p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">Endereço</h2>
                <p className="text-sm text-slate-500">Digite o CEP para preenchimento automático.</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="CEP *" error={errors.cep?.message}>
                  <div className="relative">
                    <Input
                      placeholder="00000-000"
                      {...register("cep", {
                        onChange: (e) => {
                          e.target.value = maskCEP(e.target.value)
                          if (e.target.value.replace(/\D/g, "").length === 8) buscarCEP(e.target.value)
                        },
                      })}
                    />
                    {buscandoCep && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />}
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Logradouro *" error={errors.logradouro?.message}>
                    <Input placeholder="Rua, Av., Travessa..." {...register("logradouro")} />
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <Field label="Número *" error={errors.numero?.message}>
                  <Input placeholder="Ex: 123" {...register("numero")} />
                </Field>
                <div className="sm:col-span-3">
                  <Field label="Complemento" error={errors.complemento?.message}>
                    <Input placeholder="Sala, Andar, Bloco... (opcional)" {...register("complemento")} />
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Bairro *" error={errors.bairro?.message}>
                  <Input placeholder="Bairro" {...register("bairro")} />
                </Field>
                <Field label="Cidade *" error={errors.cidade?.message}>
                  <Input placeholder="Cidade" {...register("cidade")} />
                </Field>
                <Field label="Estado (UF) *" error={errors.estado?.message}>
                  <Input placeholder="RS" maxLength={2} {...register("estado", { onChange: (e) => { e.target.value = e.target.value.toUpperCase() } })} />
                </Field>
              </div>
            </div>
          </div>

          {/* Forma de pagamento */}
          <div className="admin-panel p-6 sm:p-8">
            <div className="mb-5">
              <Label className="text-slate-700 font-medium text-sm mb-2 block">Forma de pagamento *</Label>
              <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={() => setFormaPagamento("cartao")}
                  className={cn("flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all",
                    formaPagamento === "cartao" ? "border-blue-700 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                  )}>
                  <CreditCard className={cn("h-5 w-5", formaPagamento === "cartao" ? "text-blue-700" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-sm font-semibold", formaPagamento === "cartao" ? "text-blue-900" : "text-slate-700")}>Cartão</p>
                    <p className="text-xs text-slate-500 mt-0.5">Recorrente automático</p>
                  </div>
                </button>

                <button type="button" onClick={() => setFormaPagamento("boleto")}
                  className={cn("flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all",
                    formaPagamento === "boleto" ? "border-blue-700 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                  )}>
                  <FileText className={cn("h-5 w-5", formaPagamento === "boleto" ? "text-blue-700" : "text-slate-400")} />
                  <div>
                    <p className={cn("text-sm font-semibold", formaPagamento === "boleto" ? "text-blue-900" : "text-slate-700")}>Boleto</p>
                    <p className="text-xs text-slate-500 mt-0.5">Compensa em 1-3 dias</p>
                  </div>
                </button>

                <div className="relative flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed select-none">
                  <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">EM BREVE</span>
                  <QrCode className="h-5 w-5 text-slate-300" />
                  <div>
                    <p className="text-sm font-semibold text-slate-400">PIX</p>
                    <p className="text-xs text-slate-400 mt-0.5">Pagamento mensal</p>
                  </div>
                </div>
              </div>

              {formaPagamento === "boleto" && (
                <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mt-2">
                  Você será redirecionado ao Stripe para gerar o boleto. O acesso é liberado após a compensação (1-3 dias úteis).
                </p>
              )}
            </div>

            {/* Termos */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-blue-700 cursor-pointer" {...register("termos")} />
                <span className="text-sm text-slate-600 leading-relaxed">
                  Li e aceito os{" "}
                  <a href="/termos" target="_blank" className="text-blue-700 font-medium hover:underline">Termos de Uso</a>{" "}
                  e a{" "}
                  <a href="/privacidade" target="_blank" className="text-blue-700 font-medium hover:underline">Política de Privacidade</a>.
                </span>
              </label>
              {errors.termos && <p className="mt-1.5 text-sm text-red-600 ml-7">{errors.termos.message}</p>}
            </div>

            {regimeNormalSelecionado ? (
              <a
                href={WA_ORCAMENTO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                Solicitar orçamento sob medida
              </a>
            ) : (
              <Button type="submit" disabled={loading}
                className="w-full h-12 bg-slate-950 hover:bg-blue-900 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-900/20 mt-5">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processando...</>
                ) : (
                  <><Check className="h-4 w-4 mr-2" />{formaPagamento === "pix" ? "Gerar QR Code PIX" : "Continuar para pagamento"}</>
                )}
              </Button>
            )}

            <p className="text-center text-xs text-slate-400 pt-3">
              🔒 Pagamento 100% seguro via Stripe. Não armazenamos dados de pagamento.
            </p>
          </div>
        </form>
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
