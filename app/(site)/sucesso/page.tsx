import type { Metadata } from "next"
import { CheckCircle, Clock, BookOpen, ArrowLeft, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Pagamento confirmado — DoisB Sistemas",
  robots: { index: false, follow: false },
}

export default function SucessoPage() {
  return (
    <div className="min-h-screen app-soft-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-700 text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Página inicial
          </a>
          <span className="font-black tracking-tight text-slate-950 text-lg">DoisB Sistemas</span>
          <div className="w-20" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="admin-panel max-w-xl w-full p-8 text-center">
          <span className="section-kicker mx-auto mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Tudo certo
          </span>
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-green-100 flex items-center justify-center shadow-lg shadow-green-900/10">
              <CheckCircle className="h-10 w-10 text-green-600" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Pagamento confirmado!
          </h1>
          <p className="text-slate-500 text-lg mb-10">
            Obrigado por assinar o ZWeb. Estamos preparando tudo pra você.
          </p>

          {/* Cards informativos */}
          <div className="space-y-4 mb-10 text-left">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-5 flex gap-4 items-start shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Acesso em até 24 horas úteis</p>
                <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                  Nossa equipe irá configurar o seu sistema e enviar as credenciais de acesso por e-mail.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/80 p-5 flex gap-4 items-start shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Enquanto isso, conheça o ZWeb</p>
                <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                  Explore nossos tutoriais e vídeos para se preparar para o primeiro acesso.
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/tutoriais"
              className="inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <BookOpen className="h-4 w-4" />
              Ver tutoriais
            </a>
            <a
              href="https://wa.me/5551998518895?text=Olá!%20Acabei%20de%20assinar%20o%20ZWeb%20e%20quero%20acompanhar%20meu%20acesso."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
