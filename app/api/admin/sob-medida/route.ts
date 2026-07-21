import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin/require-admin"

const schema = z.object({
  cliente_id: z.string().uuid().nullable().optional(),
  cliente_nome: z.string().min(1, "Informe o cliente"),
  cliente_doc: z.string().optional().nullable(),
  cliente_email: z.string().email().optional().or(z.literal("")).nullable(),
  cliente_telefone: z.string().optional().nullable(),
  nome_projeto: z.string().min(1, "Informe o nome do projeto"),
  descricao: z.string().optional().nullable(),
  tipo_sistema: z.string().optional().nullable(),
  status: z.enum(["proposta", "em_desenvolvimento", "entregue", "manutencao", "cancelado"]).default("proposta"),
  responsavel: z.string().optional().nullable(),
  tecnologias: z.string().optional().nullable(),
  repo_url: z.string().optional().nullable(),
  deploy_url: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  data_inicio: z.string().optional().nullable(),
  previsao_entrega: z.string().optional().nullable(),
  data_entrega: z.string().optional().nullable(),
  valor_desenvolvimento: z.number().min(0).default(0),
  valor_recebido: z.number().min(0).default(0),
  mensalidade_valor: z.number().min(0).default(0),
  mensalidade_dia: z.number().int().min(1).max(28).optional().nullable(),
  mensalidade_inicio: z.string().optional().nullable(),
})

function limpar<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj }
  for (const k of Object.keys(out)) {
    if (out[k] === "") (out as Record<string, unknown>)[k] = null
  }
  return out
}

export async function POST(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", detalhes: parsed.error.flatten() }, { status: 422 })
  }

  const { data, error } = await supabase!
    .from("sob_medida_projetos")
    .insert(limpar(parsed.data))
    .select("id")
    .single()

  if (error || !data) {
    console.error("[sob-medida] Erro ao criar projeto:", error?.message)
    return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 })
  }
  return NextResponse.json({ ok: true, id: data.id })
}
