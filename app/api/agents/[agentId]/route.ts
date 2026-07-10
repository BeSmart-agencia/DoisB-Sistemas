import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AGENTS_CONFIG, COMMON_CONTEXT, type AgentId } from '@/lib/agents/prompts'
import { buildAgentContext, renderPrompt } from '@/lib/agents/context'
import { getToolsForAgent, executeTool } from '@/lib/agents/tools'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const MODEL = 'claude-sonnet-5'
const MAX_TOOL_ITERATIONS = 8
const MAX_HISTORY_MESSAGES = 30

// Agentes funcionais; os demais entram nas Fases 2–4.
const AGENTES_ATIVOS: AgentId[] = ['estrategista', 'copywriter', 'sdr', 'social']

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const bodySchema = z.object({
  message: z.string().min(1).max(8000),
})

type StoredMessage = {
  role: 'user' | 'assistant'
  content: string
}

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

function parseAgentId(raw: string): AgentId | null {
  return raw in AGENTS_CONFIG ? (raw as AgentId) : null
}

// ── GET: histórico da conversa do agente ────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: { agentId: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const agentId = parseAgentId(params.agentId)
  if (!agentId) return NextResponse.json({ error: 'Agente desconhecido' }, { status: 404 })

  const db = createAdminClient()
  const { data } = await db
    .from('agent_conversations')
    .select('messages, updated_at')
    .eq('agent', agentId)
    .maybeSingle()

  return NextResponse.json({
    messages: (data?.messages as StoredMessage[] | null) ?? [],
    updated_at: data?.updated_at ?? null,
  })
}

// ── DELETE: limpa a conversa do agente ──────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: { params: { agentId: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const agentId = parseAgentId(params.agentId)
  if (!agentId) return NextResponse.json({ error: 'Agente desconhecido' }, { status: 404 })

  const db = createAdminClient()
  await db.from('agent_conversations').delete().eq('agent', agentId)
  return NextResponse.json({ ok: true })
}

// ── POST: chat com loop de tool use + streaming NDJSON ──────────────────────
// Eventos emitidos (um JSON por linha):
//   {type:'text',  text}   — trecho de texto do agente
//   {type:'tool',  name}   — agente executou uma tool no servidor
//   {type:'error', message}
//   {type:'done'}
export async function POST(req: NextRequest, { params }: { params: { agentId: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const agentId = parseAgentId(params.agentId)
  if (!agentId) return NextResponse.json({ error: 'Agente desconhecido' }, { status: 404 })

  if (!AGENTES_ATIVOS.includes(agentId)) {
    return NextResponse.json(
      { error: `O agente ${agentId} entra em uma fase futura. Disponíveis agora: ${AGENTES_ATIVOS.join(', ')}.` },
      { status: 501 }
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 422 })

  const userMessage = parsed.data.message
  const db = createAdminClient()

  // Contexto + prompt de sistema
  const contexto = await buildAgentContext(agentId)
  const config = AGENTS_CONFIG[agentId]
  const systemPrompt = renderPrompt(
    config.prompt.replace('{{COMMON_CONTEXT}}', COMMON_CONTEXT),
    contexto
  )
  const tools = getToolsForAgent(config.tools)

  // Histórico persistido (só texto user/assistant; o loop de tools é efêmero)
  const { data: conversa } = await db
    .from('agent_conversations')
    .select('messages')
    .eq('agent', agentId)
    .maybeSingle()
  const historico = ((conversa?.messages as StoredMessage[] | null) ?? []).slice(-MAX_HISTORY_MESSAGES)

  const messages: Anthropic.MessageParam[] = [
    ...historico.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userMessage },
  ]

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const emit = (event: Record<string, unknown>) =>
    writer.write(encoder.encode(JSON.stringify(event) + '\n'))

  ;(async () => {
    let respostaCompleta = ''
    try {
      for (let iteracao = 0; iteracao < MAX_TOOL_ITERATIONS; iteracao++) {
        const stream = anthropic.messages.stream({
          model: MODEL,
          // 16k: pedidos de lote (ex.: semana inteira de roteiros) estouram 8k
          max_tokens: 16384,
          system: systemPrompt,
          tools,
          messages,
        })

        stream.on('text', (text) => {
          respostaCompleta += text
          emit({ type: 'text', text })
        })

        const final = await stream.finalMessage()

        if (final.stop_reason !== 'tool_use') break

        const toolUses = final.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
        )
        messages.push({ role: 'assistant', content: final.content })

        const toolResults: Anthropic.ToolResultBlockParam[] = []
        for (const toolUse of toolUses) {
          emit({ type: 'tool', name: toolUse.name })
          let resultado: string
          try {
            resultado = await executeTool(agentId, toolUse.name, toolUse.input as Record<string, unknown>)
          } catch (err) {
            console.error(`[agents/${agentId}] Erro na tool ${toolUse.name}:`, err)
            resultado = `Erro interno ao executar ${toolUse.name}.`
          }
          toolResults.push({ type: 'tool_result', tool_use_id: toolUse.id, content: resultado })
        }
        messages.push({ role: 'user', content: toolResults })
        respostaCompleta += '\n\n'
      }

      emit({ type: 'done' })
    } catch (err) {
      console.error(`[agents/${agentId}] Erro no streaming:`, err)
      emit({ type: 'error', message: 'Erro ao processar. Tente novamente.' })
    } finally {
      writer.close()

      // Persiste user + resposta final (fire-and-forget)
      if (respostaCompleta.trim()) {
        const novasMensagens: StoredMessage[] = [
          ...historico,
          { role: 'user' as const, content: userMessage },
          { role: 'assistant' as const, content: respostaCompleta.trim() },
        ].slice(-MAX_HISTORY_MESSAGES)

        db.from('agent_conversations')
          .upsert(
            { agent: agentId, messages: novasMensagens, updated_at: new Date().toISOString() },
            { onConflict: 'agent' }
          )
          .then(({ error }) => {
            if (error) console.error(`[agents/${agentId}] Erro ao salvar conversa:`, error.message)
          })
      }
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
      'X-Accel-Buffering': 'no',
    },
  })
}
