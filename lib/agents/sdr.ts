import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { AGENTS_CONFIG, COMMON_CONTEXT } from '@/lib/agents/prompts'
import { buildAgentContext, renderPrompt } from '@/lib/agents/context'
import { getToolsForAgent, executeTool } from '@/lib/agents/tools'
import { enviarEmailInternoLeadMarketing } from '@/lib/emails'
import type { DadosLeadMarketing } from '@/lib/emails/templates/interna-lead-marketing'

const MODEL = 'claude-sonnet-5'
const MAX_TOOL_ITERATIONS = 8

type LeadRow = {
  id: string
  nome: string | null
  telefone: string | null
  email: string | null
  empresa: string | null
  segmento: string | null
  cidade: string | null
  origem: string | null
  score: number | null
  score_motivo: string | null
  estagio: string
  script_whatsapp: string | null
  notas: unknown
  linha: string
}

function notasCampo(notas: unknown, campo: string): string | null {
  if (notas && typeof notas === 'object' && campo in notas) {
    const valor = (notas as Record<string, unknown>)[campo]
    return valor == null ? null : String(valor)
  }
  return null
}

function leadParaEmail(lead: LeadRow): DadosLeadMarketing {
  return {
    nome: lead.nome ?? '-',
    empresa: lead.empresa ?? '-',
    segmento: lead.segmento ?? '-',
    tamanho_equipe: notasCampo(lead.notas, 'tamanho_equipe'),
    processo: notasCampo(lead.notas, 'processo'),
    telefone: lead.telefone,
    email: lead.email,
    origem: lead.origem ?? '-',
    linha: lead.linha,
    score: lead.score,
    score_motivo: lead.score_motivo,
    script_whatsapp: lead.script_whatsapp,
  }
}

async function carregarLead(leadId: string): Promise<LeadRow | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('marketing_leads')
    .select('id, nome, telefone, email, empresa, segmento, cidade, origem, score, score_motivo, estagio, script_whatsapp, notas, linha')
    .eq('id', leadId)
    .maybeSingle()
  if (error) throw new Error(`Erro ao carregar lead ${leadId}: ${error.message}`)
  return data
}

// Roda o agente SDR sobre um lead recém-gravado: roteamento de linha, scoring
// e script de WhatsApp (tudo salvo via tools), depois notifica Abel e Laisa
// por e-mail. Chamado via waitUntil no POST /api/leads — qualquer erro aqui
// não afeta o form (o chamador loga e segue).
export async function processarLeadMarketing(leadId: string): Promise<void> {
  const lead = await carregarLead(leadId)
  if (!lead) throw new Error(`Lead ${leadId} não encontrado.`)

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  const config = AGENTS_CONFIG.sdr

  const contexto = await buildAgentContext('sdr', {
    LEAD_DATA: JSON.stringify(lead, null, 2),
    LEAD_ORIGEM: lead.origem ?? '(origem não informada)',
    LEAD_ESTAGIO: lead.estagio,
  })
  const systemPrompt = renderPrompt(
    config.prompt.replace('{{COMMON_CONTEXT}}', COMMON_CONTEXT),
    contexto
  )
  const tools = getToolsForAgent(config.tools)

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content:
        `Lead novo acabou de entrar (id: ${lead.id}). Processe-o agora:\n` +
        `1. Roteamento de linha pela regra de ouro.\n` +
        `2. Scoring honesto com justificativa (salve via score_lead).\n` +
        `3. Script de WhatsApp pronto para o Abel (salve via generate_whatsapp_script).\n` +
        `Os dados completos do lead já estão no seu contexto. Ao final, resuma em 2-3 linhas o que decidiu.`,
    },
  ]

  for (let iteracao = 0; iteracao < MAX_TOOL_ITERATIONS; iteracao++) {
    const resposta = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    })

    if (resposta.stop_reason !== 'tool_use') break

    const toolUses = resposta.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    )
    messages.push({ role: 'assistant', content: resposta.content })

    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const toolUse of toolUses) {
      let resultado: string
      try {
        resultado = await executeTool('sdr', toolUse.name, toolUse.input as Record<string, unknown>)
      } catch (err) {
        console.error(`[sdr] Erro na tool ${toolUse.name}:`, err)
        resultado = `Erro interno ao executar ${toolUse.name}.`
      }
      toolResults.push({ type: 'tool_result', tool_use_id: toolUse.id, content: resultado })
    }
    messages.push({ role: 'user', content: toolResults })
  }

  // Recarrega o lead com o que o agente gravou e notifica a equipe.
  const leadFinal = (await carregarLead(leadId)) ?? lead
  await enviarEmailInternoLeadMarketing(leadParaEmail(leadFinal))
}
