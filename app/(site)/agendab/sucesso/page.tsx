import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { MailCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Assinatura confirmada — AgendaB | DoisB Sistemas",
  robots: { index: false },
}

export default function AgendabSucessoPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-[70vh] flex items-center justify-center px-4 py-32">
        <div className="max-w-lg w-full rounded-3xl bg-white border border-slate-200 p-10 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <MailCheck className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-950">
            Assinatura confirmada! 🎉
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Enviamos para o seu e-mail o link para <strong>criar a sua
            clínica</strong> no AgendaB. Abra a caixa de entrada (confira
            também o spam) e siga o passo a passo — leva menos de um minuto.
          </p>
          <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-5 text-left">
            <p className="text-sm font-bold text-slate-900 mb-2">Próximos passos</p>
            <ol className="space-y-1.5 text-sm text-slate-600 list-decimal list-inside">
              <li>Abra o e-mail &quot;Seu AgendaB está pronto&quot;</li>
              <li>Clique em <em>Criar minha clínica</em></li>
              <li>Cadastre seu login e comece a usar</li>
            </ol>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Não recebeu em alguns minutos? Fale com a gente pelo{" "}
            <a
              href="https://wa.me/5551998518895?text=Assinei%20o%20AgendaB%20e%20n%C3%A3o%20recebi%20o%20e-mail%20de%20acesso."
              className="font-semibold text-[#0169b2] hover:underline"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
