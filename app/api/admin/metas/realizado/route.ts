import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const METRICAS = ['zweb_vendedora', 'zweb_socios', 'sob_medida'] as const

const schema = z.object({
  mes: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'mes deve ser YYYY-MM-DD'),
  metrica: z.enum(METRICAS),
  valor: z.number().min(0).max(9999),
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

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Payload inválido' }, { status: 422 })

  const { mes, metrica, valor } = parsed.data
  const db = createAdminClient()
  const { error } = await db
    .from('metas_realizado')
    .upsert(
      { mes, metrica, valor, atualizado_em: new Date().toISOString(), atualizado_por: admin.nome },
      { onConflict: 'mes,metrica' }
    )

  if (error) {
    console.error('[metas] Erro ao salvar realizado:', error.message)
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
