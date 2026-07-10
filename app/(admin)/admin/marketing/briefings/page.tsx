import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { BriefingsList } from "./_components/briefings-list"

export const metadata = { title: "Briefings de Tendências | DoisB Admin" }
export const dynamic = "force-dynamic"

export default async function BriefingsPage() {
  const db = createAdminClient()
  const { data: briefings } = await db
    .from("trend_briefs")
    .select("id, semana, resumo, achados, fontes, created_at")
    .order("semana", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Briefings de tendências</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pesquisa semanal do Analista de Tendências (toda segunda de manhã, automático).
            Os achados entram no contexto do Copywriter, do Social e do Estrategista.
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
      <BriefingsList briefings={briefings ?? []} />
    </div>
  )
}
