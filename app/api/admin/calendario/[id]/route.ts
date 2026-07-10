import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  status: z.enum(['ideia', 'roteiro_pronto', 'gravado', 'publicado']),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
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
  if (!parsed.success) return NextResponse.json({ error: 'Status inválido' }, { status: 422 })

  const db = createAdminClient()
  const { error } = await db
    .from('content_calendar')
    .update({ status: parsed.data.status })
    .eq('id', params.id)

  if (error) {
    console.error('[calendario] Erro ao atualizar status:', error.message)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const db = createAdminClient()
  const { error } = await db.from('content_calendar').delete().eq('id', params.id)

  if (error) {
    console.error('[calendario] Erro ao excluir item:', error.message)
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
