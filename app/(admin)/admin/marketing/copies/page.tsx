import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { CopiesList } from "./_components/copies-list"

export const metadata = { title: "Biblioteca de Copies | DoisB Admin" }
export const dynamic = "force-dynamic"

export default async function CopiesPage() {
  const db = createAdminClient()
  const { data: copies } = await db
    .from("copy_library")
    .select("id, linha, canal, formato, angulo, categoria, titulo, corpo, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Biblioteca de copies</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tudo o que o Copywriter salvou. Aprovar uma copy a coloca no repertório dos
            agentes (get_top_copies) e na fila de uso em anúncios.
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
      <CopiesList copies={copies ?? []} />
    </div>
  )
}
