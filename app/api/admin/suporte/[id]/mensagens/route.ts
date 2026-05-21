import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin/require-admin"
import { enviarEmailRespostaChamado } from "@/lib/emails"

const schema = z.object({
  conteudo: z.string().min(1).max(4000),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { admin, supabase, response } = await requireAdmin()
  if (response) return response

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Conteúdo inválido" }, { status: 422 })

  // Buscar dados do chamado para o e-mail
  const { data: chamado } = await supabase!
    .from("chamados")
    .select("assunto, email_retorno")
    .eq("id", id)
    .maybeSingle()

  if (!chamado) return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 })

  const { data: msg, error } = await supabase!
    .from("chamado_mensagens")
    .insert({
      chamado_id: id,
      autor: "equipe",
      autor_nome: admin!.nome,
      conteudo: parsed.data.conteudo,
    })
    .select("*")
    .single()

  if (error || !msg) return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })

  // Atualizar atualizado_em do chamado + status pra em_andamento se estava a_atender
  await supabase!
    .from("chamados")
    .update({
      atualizado_em: new Date().toISOString(),
      ...(await supabase!.from("chamados").select("status").eq("id", id).maybeSingle()
        .then(r => (r.data as { status?: string })?.status === "a_atender" ? { status: "em_andamento" } : {})),
    })
    .eq("id", id)

  // E-mail pro cliente
  enviarEmailRespostaChamado(
    chamado.email_retorno,
    "Cliente",
    id,
    chamado.assunto,
    parsed.data.conteudo,
    admin!.nome
  ).catch(console.error)

  return NextResponse.json({ mensagem: msg })
}
