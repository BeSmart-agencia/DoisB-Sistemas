'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center font-sans">
        <p className="font-mono text-red-500 text-sm font-semibold tracking-widest mb-4">ERRO INESPERADO</p>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Algo deu errado</h1>
        <p className="text-slate-500 text-lg mb-10 max-w-md">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-white transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </body>
    </html>
  )
}
