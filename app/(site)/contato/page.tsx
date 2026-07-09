"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react'
import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  nome: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  assunto: z.string().min(3, 'Informe o assunto'),
  mensagem: z.string().min(10, 'Escreva sua mensagem com mais detalhes').max(4000),
})

type FormData = z.infer<typeof schema>

const WA_LINK = 'https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb'

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      toast.error('Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.')
      return
    }

    setEnviado(true)
    reset()
    toast.success('Mensagem enviada! Retornaremos em breve.')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide mb-4">
              FALE CONOSCO
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Entre em contato</h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Tire suas dúvidas, solicite uma demonstração ou fale com nossa equipe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Canais de contato */}
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  icon: MessageSquare,
                  label: 'WhatsApp',
                  value: '(51) 99851-8895',
                  href: WA_LINK,
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                },
                {
                  icon: Mail,
                  label: 'E-mail',
                  value: 'contato@doisbsistemas.com.br',
                  href: 'mailto:contato@doisbsistemas.com.br',
                  color: 'text-blue-800',
                  bg: 'bg-blue-50',
                },
                {
                  icon: Phone,
                  label: 'Horário de atendimento',
                  value: 'Segunda a sexta, 8h às 18h',
                  href: null,
                  color: 'text-slate-600',
                  bg: 'bg-slate-100',
                },
                {
                  icon: MapPin,
                  label: 'Localização',
                  value: 'Rio Grande do Sul – Brasil',
                  href: null,
                  color: 'text-slate-600',
                  bg: 'bg-slate-100',
                },
              ].map(({ icon: Icon, label, value, href, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 shadow-sm">
                  <div className={`${bg} rounded-xl p-3 shrink-0`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`text-sm font-medium ${color} hover:underline`}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-700">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Formulário */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              {enviado ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Mensagem enviada!</h2>
                  <p className="text-slate-500 mb-6">Retornaremos em breve pelo e-mail informado.</p>
                  <button onClick={() => setEnviado(false)} className="text-sm text-blue-800 hover:underline font-medium">
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input id="nome" placeholder="Seu nome" {...register('nome')} />
                      {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="assunto">Assunto *</Label>
                    <Input id="assunto" placeholder="Ex: Quero conhecer os planos" {...register('assunto')} />
                    {errors.assunto && <p className="text-xs text-red-500">{errors.assunto.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mensagem">Mensagem *</Label>
                    <Textarea
                      id="mensagem"
                      placeholder="Descreva como podemos ajudar..."
                      rows={5}
                      {...register('mensagem')}
                    />
                    {errors.mensagem && <p className="text-xs text-red-500">{errors.mensagem.message}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-blue-800 hover:bg-blue-900" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enviando...</> : 'Enviar mensagem'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
