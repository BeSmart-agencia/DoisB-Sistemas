import Link from "next/link"
import { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import {
  BookOpen, Users, ShoppingCart, FileText, DollarSign,
  Wrench, Package, Zap, Settings, Rocket,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import TutoriaisSearch from "./_components/tutoriais-search"

export const metadata: Metadata = {
  title: "Central de Ajuda — DoisB Sistemas",
  description: "Tutoriais e guias para o sistema ZWeb. Encontre respostas rápidas para suas dúvidas.",
}

const CATEGORIAS = [
  { key: "primeiros_passos", label: "Primeiros passos",        icon: Rocket,       cor: "text-green-600",   corBg: "bg-green-50 border-green-200" },
  { key: "cadastros",        label: "Cadastros",               icon: Users,        cor: "text-blue-600",    corBg: "bg-blue-50 border-blue-200" },
  { key: "vendas",           label: "Vendas",                  icon: ShoppingCart, cor: "text-violet-600",  corBg: "bg-violet-50 border-violet-200" },
  { key: "fiscal",           label: "Fiscal",                  icon: FileText,     cor: "text-amber-600",   corBg: "bg-amber-50 border-amber-200" },
  { key: "financeiro",       label: "Financeiro",              icon: DollarSign,   cor: "text-emerald-600", corBg: "bg-emerald-50 border-emerald-200" },
  { key: "ordens_servico",   label: "Ordens de Serviço",       icon: Wrench,       cor: "text-orange-600",  corBg: "bg-orange-50 border-orange-200" },
  { key: "estoque_compras",  label: "Estoque e Compras",       icon: Package,      cor: "text-cyan-600",    corBg: "bg-cyan-50 border-cyan-200" },
  { key: "integracoes",      label: "Integrações",             icon: Zap,          cor: "text-purple-600",  corBg: "bg-purple-50 border-purple-200" },
  { key: "configuracoes",    label: "Configurações avançadas", icon: Settings,     cor: "text-slate-600",   corBg: "bg-slate-100 border-slate-200" },
] as const

export default async function TutoriaisPage() {
  const supabase = await createClient()

  const { data: tutoriais } = await supabase
    .from("tutoriais")
    .select("id, titulo, slug, categoria, resumo")
    .eq("status", "publicado")
    .order("ordem", { ascending: true })
    .order("titulo", { ascending: true })

  const porCategoria: Record<string, typeof tutoriais> = {}
  for (const cat of CATEGORIAS) {
    porCategoria[cat.key] = (tutoriais ?? []).filter((t) => t.categoria === cat.key)
  }

  const total = tutoriais?.length ?? 0
  const todasChaves = CATEGORIAS.filter((c) => (porCategoria[c.key]?.length ?? 0) > 0).map((c) => c.key)

  return (
    <div className="min-h-screen app-soft-bg">
      <Header />
      {/* Hero */}
      <div className="bg-slate-950 text-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6 ring-1 ring-white/15">
            <BookOpen className="h-4 w-4" />
            {total} tutoriais disponíveis
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Central de Ajuda DoisB Sistemas</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Guias passo a passo para aproveitar ao máximo o ZWeb — o sistema de gestão da Zucchetti.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Search */}
        <TutoriaisSearch
          tutoriais={tutoriais ?? []}
          categorias={CATEGORIAS.map(({ key, label }) => ({ key, label }))}
        />

        {/* Categories */}
        <Accordion defaultValue={todasChaves} multiple>
          {CATEGORIAS.map((cat) => {
            const lista = porCategoria[cat.key] ?? []
            if (lista.length === 0) return null
            const Icon = cat.icon
            return (
              <AccordionItem key={cat.key} value={cat.key}>
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`p-2 rounded-lg border ${cat.corBg}`}>
                      <Icon className={`h-4 w-4 ${cat.cor}`} />
                    </div>
                    <span className="font-semibold text-slate-800">{cat.label}</span>
                    <span className="text-xs text-slate-400 font-normal">({lista.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 [&_a]:no-underline">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {lista.map((t) => (
                      <Link key={t.id} href={`/tutoriais/${t.slug}`} className="no-underline">
                        <div className="group bg-white/90 rounded-xl border border-slate-200 p-4 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer h-full">
                          <p className="font-medium text-slate-900 text-sm group-hover:text-blue-700 transition-colors leading-snug">
                            {t.titulo}
                          </p>
                          {t.resumo && (
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                              {t.resumo}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {/* Dúvidas */}
        <div className="admin-panel-strong p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Não encontrou o que precisa?</h3>
          <p className="text-blue-700 text-sm mb-4">
            Nossa equipe está pronta para ajudar. Abra um chamado de suporte.
          </p>
          <Link
            href="/suporte"
            className="inline-flex items-center gap-2 bg-slate-950 hover:bg-blue-900 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Abrir chamado de suporte
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
