import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import {
  enviarEmailConfirmacaoChamado,
  enviarEmailInternoNovoChamado,
} from "@/lib/emails"
import { PRODUTO_NOME } from "@/lib/planos"

function validarCNPJ(cnpj: string): boolean {
  const n = cnpj.replace(/\D/g, "")
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const calc = (size: number) => {
    let soma = 0, peso = size - 7
    for (let i = size; i >= 1; i--) {
      soma += parseInt(n[size - i]) * peso--
      if (peso < 2) peso = 9
    }
    const r = soma % 11; return r < 2 ? 0 : 11 - r
  }
  return calc(12) === parseInt(n[12]) && calc(13) === parseInt(n[13])
}

const schema = z.object({
  cnpj: z.string().min(14).refine(validarCNPJ, "CNPJ inválido"),
  produto: z.string().min(1).max(60).optional(),
  assunto: z.string().min(3).max(200),
  descricao: z.string().min(10).max(4000),
  email: z.string().email(),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", detalhes: parsed.error.flatten() }, { status: 422 })
  }

  const { cnpj, produto, assunto, descricao, email } = parsed.data
  const cnpjLimpo = cnpj.replace(/\D/g, "")
  const db = createAdminClient()

  // Buscar cliente vinculado ao CNPJ. Um CNPJ pode ter um cliente por produto;
  // o form envia o nome de exibição ("DoisB Web") e `clientes.produto` guarda
  // o slug ("doisb-web") — quando der para mapear, filtra pelo produto certo.
  const slugProduto = Object.entries(PRODUTO_NOME).find(([, nome]) => nome === produto)?.[0]
  let buscaCliente = db
    .from("clientes")
    .select("id, nome_empresa, nome_responsavel")
    .eq("cnpj", cnpjLimpo)
  if (slugProduto) buscaCliente = buscaCliente.eq("produto", slugProduto)
  const { data: clientes } = await buscaCliente.limit(1)
  const cliente = clientes?.[0] ?? null

  // Criar chamado — usa supabase anon client para respeitar a policy de INSERT público
  const anonClient = await createClient()
  const { data: chamado, error } = await anonClient
    .from("chamados")
    .insert({
      cliente_id: cliente?.id ?? null,
      cnpj_informado: cnpjLimpo,
      email_retorno: email,
      produto: produto ?? null,
      assunto,
      descricao,
      status: "a_atender",
      prioridade: "media",
    })
    .select("id")
    .single()

  if (error || !chamado) {
    console.error("[suporte] Erro ao criar chamado:", error)
    return NextResponse.json({ error: "Erro ao abrir chamado. Tente novamente." }, { status: 500 })
  }

  const nomeContato = cliente?.nome_responsavel ?? "Cliente"
  const nomeEmpresa = cliente?.nome_empresa

  await Promise.allSettled([
    enviarEmailConfirmacaoChamado(email, nomeContato, chamado.id, assunto),
    enviarEmailInternoNovoChamado({
      numeroChamado: chamado.id,
      assunto,
      descricao,
      cnpj: cnpjLimpo,
      email,
      nomeEmpresa,
      produto: produto ?? undefined,
    }),
  ])

  return NextResponse.json({ id: chamado.id })
}
