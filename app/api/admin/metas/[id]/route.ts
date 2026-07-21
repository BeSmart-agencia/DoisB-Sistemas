import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  concluido: z.boolean(),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: admin } = await supabase
    .from('admins')
    .select('id, nome')
    .eq('id', user.id)
    .eq('ativo', true)
    .maybeSingle()
  return admin
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Payload inválido' }, { status: 422 })

  const { concluido } = parsed.data
  const db = createAdminClient()
  const { error } = await db
    .from('metas_checklist')
    .update({
      concluido,
      concluido_em: concluido ? new Date().toISOString() : null,
      concluido_por: concluido ? admin.nome : null,
    })
    .eq('id', params.id)

  if (error) {
    console.error('[metas] Erro ao atualizar tarefa:', error.message)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
