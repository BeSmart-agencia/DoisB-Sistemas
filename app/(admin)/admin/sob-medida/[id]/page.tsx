import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Wallet } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"
import { ProjetoForm, type ProjetoData } from "../_components/projeto-form"
import { MensalidadeCard } from "../_components/mensalidade-card"
import { STATUS_PROJETO, brl } from "../_components/labels"

export const metadata = { title: "Projeto | Sob Medida" }
export const dynamic = "force-dynamic"

export default async function ProjetoPage({ params }: { params: { id: string } }) {
  const db = createAdminClient()
  const { data: p } = await db
    .from("sob_medida_projetos")
    .select("*")
    .eq("id", params.id)
    .maybeSingle()

  if (!p) notFound()

  const st = STATUS_PROJETO[p.status] ?? STATUS_PROJETO.proposta
  const aReceber = Number(p.valor_desenvolvimento) - Number(p.valor_recebido)

  const projetoData: ProjetoData = {
    id: p.id,
    cliente_id: p.cliente_id,
    cliente_nome: p.cliente_nome,
    cliente_doc: p.cliente_doc,
    cliente_email: p.cliente_email,
    cliente_telefone: p.cliente_telefone,
    nome_projeto: p.nome_projeto,
    descricao: p.descricao,
    tipo_sistema: p.tipo_sistema,
    status: p.status,
    responsavel: p.responsavel,
    tecnologias: p.tecnologias,
    repo_url: p.repo_url,
    deploy_url: p.deploy_url,
    observacoes: p.observacoes,
    data_inicio: p.data_inicio,
    previsao_entrega: p.previsao_entrega,
    data_entrega: p.data_entrega,
    valor_desenvolvimento: Number(p.valor_desenvolvimento),
    valor_recebido: Number(p.valor_recebido),
    mensalidade_valor: Number(p.mensalidade_valor),
    mensalidade_dia: p.mensalidade_dia,
    mensalidade_inicio: p.mensalidade_inicio,
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/admin/sob-medida" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Sob Medida
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-slate-950">{p.nome_projeto}</h1>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${st.badge}`}>{st.label}</span>
        </div>
        <p className="text-sm text-slate-700 mt-1">{p.cliente_nome}</p>
      </div>

      {/* Financeiro do projeto */}
      <div className="admin-panel p-5">
        <div className="flex items-center gap-2 text-blue-900 mb-3">
          <Wallet className="h-4 w-4" />
          <h2 className="text-sm font-bold uppercase tracking-wide">Financeiro do projeto</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-600">Desenvolvimento</p>
            <p className="text-lg font-black text-slate-950">{brl(p.valor_desenvolvimento)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Recebido</p>
            <p className="text-lg font-black text-emerald-700">{brl(p.valor_recebido)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">A receber</p>
            <p className={`text-lg font-black ${aReceber > 0 ? "text-amber-700" : "text-slate-950"}`}>{brl(aReceber)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Mensalidade</p>
            <p className="text-lg font-black text-slate-950">{brl(p.mensalidade_valor)}</p>
          </div>
        </div>
      </div>

      {/* Mensalidade Stripe */}
      <MensalidadeCard
        id={p.id}
        mensalidadeValor={Number(p.mensalidade_valor)}
        mensalidadeStatus={p.mensalidade_status}
        mensalidadeDia={p.mensalidade_dia}
        checkoutUrl={p.stripe_checkout_url}
        clienteEmail={p.cliente_email}
      />

      {/* Edição */}
      <div>
        <h2 className="text-lg font-bold text-slate-950 mb-3">Editar projeto</h2>
        <ProjetoForm projeto={projetoData} />
      </div>
    </div>
  )
}
