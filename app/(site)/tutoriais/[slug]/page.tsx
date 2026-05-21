import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { ChevronRight, BookOpen, ArrowLeft, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { addHeadingIds, extractHeadings } from "@/lib/tutoriais"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("tutoriais")
    .select("titulo, resumo")
    .eq("slug", params.slug)
    .eq("status", "publicado")
    .single()

  if (!data) return { title: "Tutorial não encontrado — DoisB Sistemas" }
  return {
    title: `${data.titulo} — DoisB Sistemas`,
    description: data.resumo ?? undefined,
  }
}

const CAT_LABEL: Record<string, string> = {
  primeiros_passos: "Primeiros passos",
  cadastros: "Cadastros",
  vendas: "Vendas",
  fiscal: "Fiscal",
  financeiro: "Financeiro",
  ordens_servico: "Ordens de Serviço",
  estoque_compras: "Estoque e Compras",
  integracoes: "Integrações",
  configuracoes: "Configurações avançadas",
}

export default async function TutorialPage({ params }: Props) {
  const supabase = await createClient()

  const { data: tutorial } = await supabase
    .from("tutoriais")
    .select("id, titulo, slug, categoria, resumo, conteudo_html, atualizado_em")
    .eq("slug", params.slug)
    .eq("status", "publicado")
    .single()

  if (!tutorial) notFound()

  const conteudoHtml = tutorial.conteudo_html ? addHeadingIds(tutorial.conteudo_html) : ""
  const headings = conteudoHtml ? extractHeadings(conteudoHtml) : []

  const { data: relacionados } = await supabase
    .from("tutoriais")
    .select("id, titulo, slug, resumo")
    .eq("categoria", tutorial.categoria)
    .eq("status", "publicado")
    .neq("id", tutorial.id)
    .order("ordem", { ascending: true })
    .limit(5)

  const atualizadoEm = new Date(tutorial.atualizado_em).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  })

  return (
    <div className="min-h-screen app-soft-bg">
      {/* Breadcrumb */}
      <div className="border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/tutoriais" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Central de Ajuda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <Link href="/tutoriais" className="hover:text-blue-600 transition-colors">
              {CAT_LABEL[tutorial.categoria] ?? tutorial.categoria}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-700 line-clamp-1">{tutorial.titulo}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="admin-panel overflow-hidden">
              {/* Header */}
              <div className="px-8 py-8 border-b border-slate-100 bg-white/60">
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-3">
                  <BookOpen className="h-3.5 w-3.5" />
                  {CAT_LABEL[tutorial.categoria] ?? tutorial.categoria}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-3">
                  {tutorial.titulo}
                </h1>
                {tutorial.resumo && (
                  <p className="text-slate-600 text-base leading-relaxed">{tutorial.resumo}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
                  <Clock className="h-3.5 w-3.5" />
                  Atualizado em {atualizadoEm}
                </div>
              </div>

              {/* Body */}
              {conteudoHtml ? (
                <div
                  className="tutorial-content px-8 py-8 prose prose-slate prose-headings:scroll-mt-24 prose-a:text-blue-700 prose-img:rounded-xl prose-img:shadow-sm prose-code:text-blue-800 prose-code:bg-blue-50 prose-code:rounded prose-code:px-1 prose-pre:bg-slate-900 max-w-none"
                  dangerouslySetInnerHTML={{ __html: conteudoHtml }}
                />
              ) : (
                <div className="px-8 py-16 text-center text-slate-400">
                  Conteúdo em breve.
                </div>
              )}
            </div>

            <div className="mt-6">
              <Link
                href="/tutoriais"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Central de Ajuda
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0 space-y-5">
            {/* TOC */}
            {headings.length > 1 && (
              <div className="admin-panel p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Neste tutorial
                </p>
                <nav className="space-y-1">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm text-slate-600 hover:text-blue-600 transition-colors leading-snug py-0.5 ${h.level === 3 ? "pl-3 text-xs" : ""}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Related */}
            {(relacionados ?? []).length > 0 && (
              <div className="admin-panel p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Tutoriais relacionados
                </p>
                <div className="space-y-2">
                  {(relacionados ?? []).map((r) => (
                    <Link
                      key={r.id}
                      href={`/tutoriais/${r.slug}`}
                      className="block text-sm text-slate-700 hover:text-blue-600 transition-colors leading-snug"
                    >
                      {r.titulo}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Help CTA */}
            <div className="admin-panel-strong p-5 text-center">
              <p className="text-sm font-semibold text-blue-900 mb-1">Ficou com dúvida?</p>
              <p className="text-xs text-blue-700 mb-3">Nossa equipe está pronta para ajudar.</p>
              <Link
                href="/suporte"
                className="inline-block bg-slate-950 hover:bg-blue-900 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Abrir chamado
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
