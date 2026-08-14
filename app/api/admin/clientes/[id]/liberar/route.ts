import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { data: cliente, error: fetchError } = await supabase!
    .from("clientes")
    .select("acesso_liberado")
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

  // A ativação no ZWeb é feita manualmente e o próprio ZWeb envia o e-mail
  // de acesso ao cliente. Aqui só marcamos como liberado, sem disparar e-mail.

  return NextResponse.json({ ok: true })
}
