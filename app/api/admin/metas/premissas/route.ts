import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  zweb_vendedora: z.number().int().min(0).max(999),
  zweb_socios_m1: z.number().int().min(0).max(999),
  zweb_socios: z.number().int().min(0).max(999),
  sob_medida_mes: z.number().int().min(0).max(99),
  mix_essencial: z.number().int().min(0).max(100),
  mix_standard: z.number().int().min(0).max(100),
  mix_premium: z.number().int().min(0).max(100),
  dev_sm: z.number().min(0).max(1_000_000),
  mens_sm: z.number().min(0).max(1_000_000),
  pro_labore_pct: z.number().int().min(0).max(100),
  outros_custos: z.number().min(0).max(1_000_000),
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

  const db = createAdminClient()
  const { error } = await db
    .from('metas_premissas')
    .upsert(
      { id: 1, ...parsed.data, atualizado_em: new Date().toISOString(), atualizado_por: admin.nome },
      { onConflict: 'id' }
    )

  if (error) {
    console.error('[metas] Erro ao salvar premissas:', error.message)
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
