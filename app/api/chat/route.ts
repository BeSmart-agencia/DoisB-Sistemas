import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { buscarChunksRelevantes } from '@/lib/rag/buscar-chunks'
import { createAdminClient } from '@/lib/supabase/admin'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const schema = z.object({
  mensagens: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() }))
    .min(1),
  sessao_id: z.string().uuid(),
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return new Response('Requisição inválida', { status: 400 })

  const parsed = schema.safeParse(body)
  if (!parsed.success) return new Response('Dados inválidos', { status: 422 })

  const { mensagens, sessao_id } = parsed.data
  const ultima = mensagens[mensagens.length - 1]

  if (ultima.role !== 'user') {
    return new Response('Última mensagem deve ser do usuário', { status: 400 })
  }

  const pergunta = ultima.content

  // ── 1. Busca vetorial ────────────────────────────────────────────────────
  const chunks = await buscarChunksRelevantes(pergunta, 5)
  const semResposta = chunks.length === 0

  // ── 2. Contexto para o prompt ────────────────────────────────────────────
  const contexto =
    chunks.length > 0
      ? chunks.map((c, i) => `[Fonte ${i + 1}]\n${c.conteudo}`).join('\n\n---\n\n')
      : 'Nenhum trecho relevante encontrado na base de conhecimento.'

  const systemPrompt = `Você é o assistente da DoisB Sistemas, revenda autorizada do ZWeb (sistema de gestão da Zucchetti).

Responda com base no CONTEXTO abaixo, extraído dos manuais oficiais do ZWeb. O contexto pode conter ruídos como URLs, datas e números de página — ignore-os e extraia apenas o conteúdo relevante.

Regras:
- Se o contexto contiver a informação (mesmo que parcial), responda com base nela
- Só diga que não encontrou se o contexto for completamente irrelevante para a pergunta
- Se precisar de mais detalhes, sugira abrir chamado em /suporte
- Tom: profissional, didático, amigável. Português brasileiro
- Use bullets quando ajudar
- Cite o nome das funcionalidades como aparecem no sistema

CONTEXTO:
${contexto}`

  // ── 3. Stream via TransformStream ────────────────────────────────────────
  const encoder = new TextEncoder()
  let respostaCompleta = ''

  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  // Inicia o stream da Anthropic de forma desacoplada
  ;(async () => {
    try {
      const stream = anthropic.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: mensagens.map((m) => ({ role: m.role, content: m.content })),
      })

      stream.on('text', (text) => {
        respostaCompleta += text
        writer.write(encoder.encode(text))
      })

      await stream.finalMessage()
    } catch (err) {
      console.error('[chat] Erro no streaming:', err)
      writer.write(
        encoder.encode('\n\n_Erro ao processar sua pergunta. Por favor, tente novamente._')
      )
    } finally {
      writer.close()

      // Salvar conversa (fire-and-forget)
      const supabase = createAdminClient()
      supabase
        .from('conversas_ia')
        .insert({
          sessao_id,
          pergunta,
          resposta: respostaCompleta,
          chunks_ids: chunks.map((c) => c.id),
          sem_resposta: semResposta,
        })
        .then(({ error }) => {
          if (error) console.error('[chat] Erro ao salvar conversa:', error.message)
        })
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
      'X-Accel-Buffering': 'no',
      'Connection': 'keep-alive',
    },
  })
}
