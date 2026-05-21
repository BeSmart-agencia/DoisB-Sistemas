import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { enviarEmailAcessoLiberado } from "@/lib/emails"

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: cliente, error: fetchError } = await supabase!
    .from("clientes")
    .select("email, nome_responsavel, acesso_liberado")
    .eq("id", params.id)
    .maybeSingle()

  if (fetchError || !cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  if (cliente.acesso_liberado) {
    return NextResponse.json({ error: "Acesso já foi liberado" }, { status: 409 })
  }

  const { error: updateError } = await supabase!
    .from("clientes")
    .update({ acesso_liberado: true })
    .eq("id", params.id)

  if (updateError) {
    return NextResponse.json({ error: "Erro ao liberar acesso" }, { status: 500 })
  }

  // Disparar e-mail com credenciais provisórias
  // Adapte usuario/senha/url conforme seu sistema de licenças ZWeb
  await enviarEmailAcessoLiberado(
    cliente.email,
    cliente.nome_responsavel,
    {
      usuario: cliente.email,
      senha: "Alterar123!",
      url: "https://app.zweb.com.br",
    }
  ).catch((err) => console.error("[liberar] Erro e-mail acesso:", err))

  return NextResponse.json({ ok: true })
}
