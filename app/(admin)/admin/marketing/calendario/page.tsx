import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { CalendarioList } from "./_components/calendario-list"

export const metadata = { title: "Calendário Editorial | DoisB Admin" }
export const dynamic = "force-dynamic"

export default async function CalendarioPage() {
  const db = createAdminClient()
  const { data: itens } = await db
    .from("content_calendar")
    .select("id, linha, data_prevista, pilar, formato, plataforma, roteiro, copy_legenda, hashtags, status, copy_id")
    .order("data_prevista", { ascending: true, nullsFirst: false })
    .limit(300)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Calendário editorial</h1>
          <p className="text-sm text-slate-500 mt-1">
            Conteúdo orgânico planejado pelo agente Social — roteiros prontos para gravar,
            agrupados por semana.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/marketing"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Chat dos agentes
          </Link>
        </div>
      </div>
      <CalendarioList itens={itens ?? []} />
    </div>
  )
}
