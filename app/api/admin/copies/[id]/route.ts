import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  status: z.enum(['rascunho', 'aprovada', 'no_ar', 'arquivada']),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .eq('ativo', true)
    .maybeSingle()
  if (!admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Status inválido' }, { status: 422 })

  const db = createAdminClient()
  const { error } = await db
    .from('copy_library')
    .update({ status: parsed.data.status })
    .eq('id', params.id)

  if (error) {
    console.error('[copies] Erro ao atualizar status:', error.message)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
