import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  // Verificar autenticação admin
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

  const db = createAdminClient()

  const [
    { count: totalConversas },
    { count: semResposta },
    { data: conversas },
    { data: semRespostaLista },
  ] = await Promise.all([
    db.from('conversas_ia').select('*', { count: 'exact', head: true }),
    db.from('conversas_ia').select('*', { count: 'exact', head: true }).eq('sem_resposta', true),
    db
      .from('conversas_ia')
      .select('id, sessao_id, pergunta, resposta, sem_resposta, chunks_ids, criado_em')
      .order('criado_em', { ascending: false })
      .limit(100),
    db
      .from('conversas_ia')
      .select('id, pergunta, criado_em')
      .eq('sem_resposta', true)
      .order('criado_em', { ascending: false })
      .limit(50),
  ])

  return NextResponse.json({
    totalConversas: totalConversas ?? 0,
    semResposta: semResposta ?? 0,
    conversas: conversas ?? [],
    semRespostaLista: semRespostaLista ?? [],
  })
}
