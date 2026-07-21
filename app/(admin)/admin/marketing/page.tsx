import Link from "next/link"
import { BookOpen, CalendarDays, Library, TrendingUp, Users } from "lucide-react"
import { MarketingChat } from "./_components/marketing-chat"

export const metadata = { title: "Marketing OS | DoisB Admin" }

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Marketing OS</h1>
          <p className="text-sm text-slate-500 mt-1">
            Seus agentes de marketing e vendas. Estratégia, copy e execução sobre a memória compartilhada da DoisB.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/marketing/como-usar"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Como usar os agentes
          </Link>
          <Link
            href="/admin/marketing/leads"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Users className="h-4 w-4" />
            Leads
          </Link>
          <Link
            href="/admin/marketing/copies"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Library className="h-4 w-4" />
            Biblioteca de copies
          </Link>
          <Link
            href="/admin/marketing/calendario"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            Calendário
          </Link>
          <Link
            href="/admin/marketing/briefings"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Briefings
          </Link>
        </div>
      </div>
      <MarketingChat />
    </div>
  )
}
