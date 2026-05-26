import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-blue-800 text-sm font-semibold tracking-widest mb-4">ERRO 404</p>
      <h1 className="text-5xl font-bold text-slate-900 mb-4">Página não encontrada</h1>
      <p className="text-slate-500 text-lg mb-10 max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors"
        >
          Voltar ao início
        </Link>
        <Link
          href="/suporte"
          className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-white transition-colors"
        >
          Abrir chamado
        </Link>
      </div>
      <p className="mt-16 font-mono text-xs text-slate-300">&lt;Venda. Controle. Cresça.&gt;</p>
    </div>
  )
}
