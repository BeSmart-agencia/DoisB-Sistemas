import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { LeadsList } from "./_components/leads-list"

// Pipeline inbound do Marketing OS (tabela marketing_leads) — tela distinta
// de /admin/leads, que é a prospecção outbound via Google Places (tabela leads).
// Ver docs/Marketing/DIRECIONAMENTO.md seção 6.1.

export const metadata = { title: "Leads de Marketing | DoisB Admin" }
export const dynamic = "force-dynamic"

export default async function MarketingLeadsPage() {
  const db = createAdminClient()
  const { data: leads } = await db
    .from("marketing_leads")
    .select("id, nome, telefone, email, empresa, segmento, cidade, origem, linha, score, score_motivo, estagio, script_whatsapp, notas, created_at")
    .order("created_at", { ascending: false })
    .limit(500)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Leads de marketing</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pipeline inbound das LPs e anúncios, qualificado pelo agente SDR. A prospecção
            de rua (Google Places) continua em Leads, no menu principal.
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
      <LeadsList leads={leads ?? []} />
    </div>
  )
}
