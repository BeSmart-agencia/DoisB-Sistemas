import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import { PLANO_PRECO, PLANO_LABEL } from "@/lib/planos"

export type StatusComissao = "aguardando" | "ativo" | "atrasado" | "cancelado"

// Entrada de comissão normalizada — unifica venda ZWeb (clientes) e
// AgendaB (sob_medida_projetos) numa forma só para admin e portal.
export interface ComissaoEntry {
  id: string
  tipo: "zweb" | "agendab"
  vendedor_id: string
  cliente: string
  local: string | null
  produto: string
  valor: number // comissão = 100% da 1ª mensalidade
  status: StatusComissao
  convertido: boolean // 1º pagamento confirmado → comissão devida
  data: string // created_at
  comissao_paga: boolean
}

// AgendaB: a linha só existe porque o pagamento foi confirmado no webhook,
// então a comissão sempre já está "convertida". O status vem da mensalidade.
const STATUS_AGENDAB: Record<string, StatusComissao> = {
  ativa: "ativo",
  pendente: "atrasado",
  pausada: "atrasado",
  cancelada: "cancelado",
  inativa: "aguardando",
}

/**
 * Lista as comissões atribuídas a vendedores. Se `vendedorId` for informado,
 * traz só as daquele vendedor (uso no portal); senão traz todas as atribuídas
 * (uso no admin). Ordenadas da mais recente para a mais antiga.
 */
export async function listarComissoes(
  supabase: SupabaseClient<Database>,
  vendedorId?: string
): Promise<ComissaoEntry[]> {
  let zwebQuery = supabase
    .from("clientes")
    .select("id, nome_empresa, cidade, estado, plano, status_pagamento, data_assinatura, created_at, comissao_paga, vendedor_id")
  zwebQuery = vendedorId
    ? zwebQuery.eq("vendedor_id", vendedorId)
    : zwebQuery.not("vendedor_id", "is", null)

  let agendabQuery = supabase
    .from("sob_medida_projetos")
    .select("id, cliente_nome, nome_projeto, mensalidade_valor, mensalidade_status, created_at, comissao_paga, vendedor_id")
  agendabQuery = vendedorId
    ? agendabQuery.eq("vendedor_id", vendedorId)
    : agendabQuery.not("vendedor_id", "is", null)

  const [{ data: zweb }, { data: agendab }] = await Promise.all([zwebQuery, agendabQuery])

  const entriesZweb: ComissaoEntry[] = (zweb ?? []).map((c) => ({
    id: c.id,
    tipo: "zweb",
    vendedor_id: c.vendedor_id as string,
    cliente: c.nome_empresa,
    local: [c.cidade, c.estado].filter(Boolean).join("/") || null,
    produto: `ZWeb ${PLANO_LABEL[c.plano] ?? c.plano}`,
    valor: PLANO_PRECO[c.plano] ?? 0,
    status: (c.status_pagamento as StatusComissao) ?? "aguardando",
    convertido: !!c.data_assinatura,
    data: c.created_at,
    comissao_paga: c.comissao_paga,
  }))

  const entriesAgendab: ComissaoEntry[] = (agendab ?? []).map((p) => ({
    id: p.id,
    tipo: "agendab",
    vendedor_id: p.vendedor_id as string,
    cliente: p.cliente_nome,
    local: null,
    produto: p.nome_projeto?.startsWith("AgendaB") ? "AgendaB" : p.nome_projeto,
    valor: p.mensalidade_valor ?? 0,
    status: STATUS_AGENDAB[p.mensalidade_status] ?? "ativo",
    convertido: true,
    data: p.created_at,
    comissao_paga: p.comissao_paga,
  }))

  return [...entriesZweb, ...entriesAgendab].sort((a, b) => (a.data < b.data ? 1 : -1))
}
