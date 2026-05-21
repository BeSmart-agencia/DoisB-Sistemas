"use client"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"

interface Tutorial {
  id: string
  titulo: string
  slug: string
  categoria: string
  resumo: string | null
}

interface Categoria {
  key: string
  label: string
}

interface Props {
  tutoriais: Tutorial[]
  categorias: readonly Categoria[]
}

export default function TutoriaisSearch({ tutoriais, categorias }: Props) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const catMap = useMemo(
    () => Object.fromEntries(categorias.map((c) => [c.key, c.label])),
    [categorias]
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return tutoriais.filter(
      (t) =>
        t.titulo.toLowerCase().includes(q) ||
        (t.resumo ?? "").toLowerCase().includes(q)
    ).slice(0, 12)
  }, [query, tutoriais])

  const active = query.trim().length > 0

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar tutoriais…"
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {active && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus() }}
            className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {active && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-500 text-center">
              Nenhum tutorial encontrado para <strong>&ldquo;{query}&rdquo;</strong>
            </p>
          ) : (
            <ul>
              {results.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tutoriais/${t.slug}`}
                    onClick={() => setQuery("")}
                    className="flex flex-col px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-slate-900 leading-snug">{t.titulo}</span>
                    <span className="text-xs text-blue-600 mt-0.5">{catMap[t.categoria] ?? t.categoria}</span>
                    {t.resumo && (
                      <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.resumo}</span>
                    )}
                  </Link>
                </li>
              ))}
              {tutoriais.filter((t) => {
                const q = query.trim().toLowerCase()
                return t.titulo.toLowerCase().includes(q) || (t.resumo ?? "").toLowerCase().includes(q)
              }).length > 12 && (
                <li className="px-4 py-2.5 text-xs text-slate-400 text-center border-t border-slate-100">
                  Mostrando 12 de {tutoriais.filter((t) => {
                    const q = query.trim().toLowerCase()
                    return t.titulo.toLowerCase().includes(q) || (t.resumo ?? "").toLowerCase().includes(q)
                  }).length} resultados — refine sua busca
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
