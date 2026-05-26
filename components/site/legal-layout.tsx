import Link from 'next/link'
import { Header } from './header'
import { Footer } from './footer'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title: string
  updated: string
  children: React.ReactNode
}

export function LegalLayout({ title, updated, children }: Props) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-8 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-800 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar ao início
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-sm text-slate-400 mb-10">Última atualização: {updated}</p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-blue-800">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
