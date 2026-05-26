import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email(),
  assunto: z.string().min(3).max(200),
  mensagem: z.string().min(10).max(4000),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 422 })

  const { nome, email, assunto, mensagem } = parsed.data
  console.log('[contato]', { nome, email, assunto, mensagem })

  return NextResponse.json({ ok: true })
}
