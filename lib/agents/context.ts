import { createAdminClient } from '@/lib/supabase/admin'
import { AGENTS_CONFIG, type AgentId } from '@/lib/agents/prompts'

const SEM_DADOS = '(sem dados ainda)'

function json(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

// Monta os valores dos placeholders {{CHAVE}} que o prompt do agente espera,
// consultando a memória compartilhada no Supabase (ver AGENTS_CONFIG.context).
export async function buildAgentContext(agentId: AgentId): Promise<Record<string, string>> {
  const supabase = createAdminClient()
  const keys = AGENTS_CONFIG[agentId].context as readonly string[]
  const ctx: Record<string, string> = {}

  await Promise.all(
    keys.map(async (key) => {
      switch (key) {
        case 'BRAND_KIT': {
          const { data } = await supabase.from('brand_kit').select('key, value')
          ctx[key] = data?.length
            ? json(Object.fromEntries(data.map((r) => [r.key, r.value])))
            : SEM_DADOS
          break
        }
        case 'ICP': {
          const { data } = await supabase
            .from('icp')
            .select('nome, segmento, dores, objecoes, gatilhos')
            .eq('ativo', true)
          ctx[key] = data?.length ? json(data) : SEM_DADOS
          break
        }
        case 'OFERTA_ATUAL': {
          const { data } = await supabase
            .from('brand_kit')
            .select('value')
            .eq('key', 'oferta_atual')
            .maybeSingle()
          ctx[key] = data ? json(data.value) : SEM_DADOS
          break
        }
        case 'PLANO_MES': {
          const { data } = await supabase
            .from('marketing_plans')
            .select('mes, objetivos, alocacao_orcamento, hipoteses, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          ctx[key] = data ? json(data) : 'Nenhum plano cadastrado ainda — este é o primeiro ciclo.'
          break
        }
        case 'METRICS':
        case 'METRICS_30D': {
          const desde = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10)
          const [{ data: campanhas }, { data: metricas }] = await Promise.all([
            supabase.from('campaigns').select('id, plataforma, nome, objetivo, orcamento_diario, status'),
            supabase
              .from('ad_metrics')
              .select('ad_id, data, impressoes, cliques, gasto, ctr, cpm, cpl, leads, conversas_whatsapp, compras')
              .gte('data', desde)
              .order('data', { ascending: false })
              .limit(200),
          ])
          ctx[key] =
            campanhas?.length || metricas?.length
              ? json({ campanhas: campanhas ?? [], metricas_ultimos_30d: metricas ?? [] })
              : 'Nenhuma campanha rodando ainda — sem métricas.'
          break
        }
        case 'EXPERIMENTS': {
          const { data } = await supabase
            .from('experiments')
            .select('nome, metrica_alvo, inicio, fim, vencedora, resultado')
            .is('vencedora', null)
          ctx[key] = data?.length ? json(data) : 'Nenhum experimento ativo.'
          break
        }
        case 'PIPELINE': {
          const { data } = await supabase.from('marketing_leads').select('estagio')
          if (!data?.length) {
            ctx[key] = 'Pipeline vazio — nenhum lead de marketing registrado ainda.'
            break
          }
          const porEstagio: Record<string, number> = {}
          for (const l of data) porEstagio[l.estagio] = (porEstagio[l.estagio] ?? 0) + 1
          ctx[key] = json({ total: data.length, por_estagio: porEstagio })
          break
        }
        case 'TREND_BRIEFS': {
          const { data } = await supabase
            .from('trend_briefs')
            .select('semana, resumo, achados')
            .order('semana', { ascending: false })
            .limit(3)
          ctx[key] = data?.length ? json(data) : 'Nenhum briefing de tendências ainda (agente de Tendências entra na Fase 4).'
          break
        }
        case 'TOP_COPIES':
        case 'TOP_COPIES_ORGANICO':
        case 'COPIES_APROVADAS': {
          let query = supabase
            .from('copy_library')
            .select('canal, formato, angulo, categoria, titulo, corpo, status, performance')
            .in('status', ['aprovada', 'no_ar'])
            .order('created_at', { ascending: false })
            .limit(10)
          if (key === 'TOP_COPIES_ORGANICO') query = query.eq('canal', 'organico')
          const { data } = await query
          ctx[key] = data?.length ? json(data) : 'Biblioteca de copies ainda vazia.'
          break
        }
        case 'ORCAMENTO_MES': {
          const { data } = await supabase
            .from('marketing_plans')
            .select('alocacao_orcamento')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          ctx[key] = data?.alocacao_orcamento ? json(data.alocacao_orcamento) : 'R$ 1.000'
          break
        }
        case 'CALENDARIO': {
          const { data } = await supabase
            .from('content_calendar')
            .select('data_prevista, pilar, formato, plataforma, status')
            .order('data_prevista', { ascending: true })
            .limit(40)
          ctx[key] = data?.length ? json(data) : 'Calendário vazio.'
          break
        }
        case 'ACOES_PENDENTES': {
          const { data } = await supabase
            .from('campaign_actions')
            .select('agent, acao, payload, created_at')
            .eq('status', 'pendente')
            .order('created_at', { ascending: false })
            .limit(20)
          ctx[key] = data?.length ? json(data) : 'Nenhuma ação pendente de aprovação.'
          break
        }
        default:
          // LEAD_DATA / LEAD_ORIGEM / LEAD_ESTAGIO etc. — preenchidos por
          // fluxos específicos (SDR, Fase 4+); no chat genérico ficam vazios.
          ctx[key] = SEM_DADOS
      }
    })
  )

  return ctx
}

// Substitui todos os {{PLACEHOLDERS}} de um prompt pelos valores do contexto.
export function renderPrompt(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, chave: string) => values[chave] ?? SEM_DADOS)
}
