import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Pipeline inbound do Marketing OS (marketing_leads) — NÃO confundir com
// /api/admin/leads, que é a prospecção outbound (tabela leads).
// Ver docs/Marketing/DIRECIONAMENTO.md seção 6.1.

const schema = z.object({
  estagio: z.enum(['novo', 'contatado', 'demo', 'proposta', 'fechado', 'perdido']),
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
  if (!parsed.success) return NextResponse.json({ error: 'Estágio inválido' }, { status: 422 })

  const db = createAdminClient()
  const { error } = await db
    .from('marketing_leads')
    .update({ estagio: parsed.data.estagio })
    .eq('id', params.id)

  if (error) {
    console.error('[marketing-leads] Erro ao atualizar estágio:', error.message)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
