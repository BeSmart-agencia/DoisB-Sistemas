import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin/require-admin"

const schema = z.object({
  observacoes: z.string().max(2000),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 422 })
  }

  const { error } = await supabase!
    .from("clientes")
    .update({ observacoes: parsed.data.observacoes })
    .eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: "Erro ao salvar observações" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
