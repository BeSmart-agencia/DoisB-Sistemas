import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { processarLeadMarketing } from '@/lib/agents/sdr'

// Entrada pública de leads das LPs (spec Marketing OS, seção 4).
// Fase atual: form de briefing da linha sob_medida (/sob-medida).

const schema = z.object({
  nome: z.string().min(2).max(120),
  telefone: z.string().min(10).max(20),
  email: z.string().email().max(160).optional().or(z.literal('')),
  empresa: z.string().min(2).max(160),
  setor: z.string().min(2).max(120),
  tamanho_equipe: z.string().min(1).max(60),
  processo: z.string().min(10).max(4000),
  linha: z.enum(['zweb', 'sob_medida']),
  origem: z.string().min(2).max(80),
  // honeypot anti-bot: humanos não preenchem
  website: z.string().max(0).optional().or(z.literal('')),
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 422 })
  }

  const { nome, telefone, email, empresa, setor, tamanho_equipe, processo, linha, origem } = parsed.data

  const supabase = createAdminClient()
  const { data: lead, error } = await supabase
    .from('marketing_leads')
    .insert({
      nome,
      telefone,
      email: email || null,
      empresa,
      segmento: setor,
      origem,
      linha,
      estagio: 'novo',
      notas: { processo, tamanho_equipe },
    })
    .select('id')
    .single()

  if (error) {
    console.error('[leads] Erro ao inserir lead:', error.message)
    return NextResponse.json({ error: 'Erro ao registrar. Tente pelo WhatsApp.' }, { status: 500 })
  }

  // SDR roda depois da resposta (roteamento + scoring + script + e-mail interno).
  // Falha do agente não pode quebrar o form: o lead já está salvo.
  waitUntil(
    processarLeadMarketing(lead.id).catch((err) => {
      console.error(`[leads] SDR falhou para o lead ${lead.id}:`, err)
    })
  )

  return NextResponse.json({ ok: true })
}
