import Anthropic from '@anthropic-ai/sdk'
import { AGENTS_CONFIG, COMMON_CONTEXT, type AgentId } from '@/lib/agents/prompts'
import { buildAgentContext, renderPrompt } from '@/lib/agents/context'
import { getToolsForAgent, executeTool } from '@/lib/agents/tools'
import { createAdminClient } from '@/lib/supabase/admin'

const MODEL = 'claude-sonnet-5'
const MAX_TOOL_ITERATIONS = 12
const MAX_HISTORY_MESSAGES = 30

// Executa um agente de ponta a ponta (sem streaming): monta contexto, roda o
// loop de tools e retorna o texto final. Usado pelos fluxos automáticos
// (SDR no POST /api/leads, cron semanal); o chat da UI usa o route handler
// com streaming.
export async function runAgent(
  agentId: AgentId,
  userMessage: string,
  opts: { contextOverrides?: Record<string, string>; maxTokens?: number } = {}
): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  const config = AGENTS_CONFIG[agentId]

  const contexto = await buildAgentContext(agentId, opts.contextOverrides ?? {})
  const systemPrompt = renderPrompt(
    config.prompt.replace('{{COMMON_CONTEXT}}', COMMON_CONTEXT),
    contexto
  )
  const tools = getToolsForAgent(config.tools)

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userMessage }]
  let textoFinal = ''

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const resposta = await anthropic.messages.create({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 16384,
      system: systemPrompt,
      tools,
      messages,
    })

    for (const bloco of resposta.content) {
      if (bloco.type === 'text') textoFinal += bloco.text
    }

    if (resposta.stop_reason === 'max_tokens') {
      throw new Error(`[agents/${agentId}] resposta truncada por max_tokens`)
    }
    // Tools de servidor (web_search) são executadas pela própria API e não
    // geram stop_reason tool_use — só as tools de cliente chegam aqui.
    if (resposta.stop_reason !== 'tool_use') break

    const toolUses = resposta.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    )
    messages.push({ role: 'assistant', content: resposta.content })

    const results: Anthropic.ToolResultBlockParam[] = []
    for (const tu of toolUses) {
      let r: string
      try {
        r = await executeTool(agentId, tu.name, tu.input as Record<string, unknown>)
      } catch (err) {
        console.error(`[agents/${agentId}] Erro na tool ${tu.name}:`, err)
        r = `Erro interno ao executar ${tu.name}.`
      }
      results.push({ type: 'tool_result', tool_use_id: tu.id, content: r })
    }
    messages.push({ role: 'user', content: results })
    textoFinal += '\n\n'
  }

  return textoFinal.trim()
}

// Anexa um par user/assistant ao histórico do chat do agente, para a conversa
// dos fluxos automáticos aparecer na UI de /admin/marketing.
export async function appendToConversation(
  agentId: AgentId,
  userMessage: string,
  assistantMessage: string
): Promise<void> {
  const db = createAdminClient()
  const { data } = await db
    .from('agent_conversations')
    .select('messages')
    .eq('agent', agentId)
    .maybeSingle()
  const historico = (data?.messages as { role: string; content: string }[] | null) ?? []
  const { error } = await db.from('agent_conversations').upsert(
    {
      agent: agentId,
      messages: [
        ...historico,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ].slice(-MAX_HISTORY_MESSAGES),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'agent' }
  )
  if (error) console.error(`[agents/${agentId}] Erro ao salvar conversa:`, error.message)
}
