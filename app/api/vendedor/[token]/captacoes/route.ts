import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Database, Json } from "@/types/database"
import {
  recomendar,
  STATUS_MANUAIS,
  CHECKBOXES_OPERACAO,
  CHECKBOXES_SOB_MEDIDA,
  REGIME_OPCOES,
  USUARIOS_OPCOES,
  type Respostas,
  type StatusCaptacao,
} from "@/lib/captacao"

// Dados de funil em tempo real — nunca cachear.
export const dynamic = "force-dynamic"

function tokenValido(t: string) {
  return /^[0-9a-f-]{36}$/i.test(t)
}

// Resolve o portal_token para o vendedor. Retorna null se inválido/inexistente.
async function resolverVendedor(token: string) {
  if (!tokenValido(token)) return null
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("vendedores")
    .select("id, ativo")
    .eq("portal_token", token)
    .maybeSingle()
  if (!data) return null
  return { supabase, vendedor: data }
}

const CHAVES_BOOL = [...CHECKBOXES_OPERACAO, ...CHECKBOXES_SOB_MEDIDA].map((c) => c.chave)
const REGIMES = REGIME_OPCOES.map((o) => o.valor) as string[]
const USUARIOS = USUARIOS_OPCOES.map((o) => o.valor) as string[]

// Mantém só chaves conhecidas do questionário — nunca confia no payload cru.
function sanitizarRespostas(input: unknown): Respostas {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>
  const out: Respostas = {}
  if (typeof src.regime === "string" && REGIMES.includes(src.regime)) out.regime = src.regime as Respostas["regime"]
  if (typeof src.usuarios === "string" && USUARIOS.includes(src.usuarios)) out.usuarios = src.usuarios as Respostas["usuarios"]
  for (const chave of CHAVES_BOOL) {
    if (src[chave] === true) out[chave] = true
  }
  return out
}

// Respostas tem chaves fixas (sem index signature), então precisa de cast
// explícito para o tipo Json da coluna jsonb.
const asJson = (r: Respostas): Json => r as unknown as Json

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const ctx = await resolverVendedor(params.token)
  if (!ctx) return NextResponse.json({ error: "Acesso inválido" }, { status: 404 })

  const { data, error } = await ctx.supabase
    .from("captacoes")
    .select("*")
    .eq("vendedor_id", ctx.vendedor.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ captacoes: data ?? [] })
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const ctx = await resolverVendedor(params.token)
  if (!ctx) return NextResponse.json({ error: "Acesso inválido" }, { status: 404 })
  if (!ctx.vendedor.ativo)
    return NextResponse.json({ error: "Cadastro inativo" }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })

  const tipo = body.tipo === "online" ? "online" : body.tipo === "fisica" ? "fisica" : null
  if (!tipo) return NextResponse.json({ error: "Selecione visita física ou online" }, { status: 422 })

  const nome_cliente = String(body.nome_cliente ?? "").trim()
  if (nome_cliente.length < 2) return NextResponse.json({ error: "Informe o nome do cliente" }, { status: 422 })

  const whatsapp = body.whatsapp ? String(body.whatsapp).trim().slice(0, 30) : null

  const { data, error } = await ctx.supabase
    .from("captacoes")
    .insert({
      vendedor_id: ctx.vendedor.id,
      tipo,
      nome_cliente,
      whatsapp,
      respostas: asJson(sanitizarRespostas(body.respostas)),
      status: "iniciada",
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: Request, { params }: { params: { token: string } }) {
  const ctx = await resolverVendedor(params.token)
  if (!ctx) return NextResponse.json({ error: "Acesso inválido" }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: "Captação não informada" }, { status: 400 })
  const id = String(body.id)

  // Confirma que a captação é deste vendedor antes de qualquer alteração.
  const { data: alvo } = await ctx.supabase
    .from("captacoes")
    .select("id")
    .eq("id", id)
    .eq("vendedor_id", ctx.vendedor.id)
    .maybeSingle()
  if (!alvo) return NextResponse.json({ error: "Captação não encontrada" }, { status: 404 })

  const patch: Database["public"]["Tables"]["captacoes"]["Update"] = {
    atualizado_em: new Date().toISOString(),
  }

  if (body.acao === "finalizar") {
    // Salva as respostas, calcula a recomendação e marca como finalizada.
    const respostas = sanitizarRespostas(body.respostas)
    const rec = recomendar(respostas)
    patch.respostas = asJson(respostas)
    patch.plano_recomendado = rec.plano
    patch.motivo_recomendacao = rec.motivos
    patch.status = "finalizada"
  } else if (body.acao === "respostas") {
    // Autosave parcial, sem finalizar.
    patch.respostas = asJson(sanitizarRespostas(body.respostas))
  } else if (body.acao === "status") {
    const novo = String(body.status) as StatusCaptacao
    if (!STATUS_MANUAIS.includes(novo))
      return NextResponse.json({ error: "Status inválido" }, { status: 422 })
    patch.status = novo
    patch.motivo_perda =
      novo === "venda_negada" && body.motivo_perda
        ? String(body.motivo_perda).trim().slice(0, 300)
        : null
  } else {
    return NextResponse.json({ error: "Ação inválida" }, { status: 422 })
  }

  const { data, error } = await ctx.supabase
    .from("captacoes")
    .update(patch)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
