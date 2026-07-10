import type Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { buscarChunksRelevantes } from '@/lib/rag/buscar-chunks'
import type { AgentId } from '@/lib/agents/prompts'
import type { Database, Json } from '@/types/database'

// -----------------------------------------------------------------------------
// Definições (schemas enviados à Anthropic API)
// -----------------------------------------------------------------------------

const TOOL_DEFINITIONS: Record<string, Anthropic.Tool> = {
  search_zweb_kb: {
    name: 'search_zweb_kb',
    description:
      'Busca semântica na base de conhecimento oficial do ZWeb (manuais em PDF). Use SEMPRE antes de afirmar qualquer funcionalidade, integração ou condição técnica do produto.',
    input_schema: {
      type: 'object',
      properties: {
        consulta: { type: 'string', description: 'Pergunta ou termo a buscar, em pt-BR' },
        limite: { type: 'number', description: 'Quantidade de trechos (padrão 5, máx 10)' },
      },
      required: ['consulta'],
    },
  },
  save_copy: {
    name: 'save_copy',
    description:
      'Salva uma copy na biblioteca (copy_library) com status rascunho. Salve cada variação aprovável — nunca deixe copy só no texto da conversa.',
    input_schema: {
      type: 'object',
      properties: {
        linha: { type: 'string', enum: ['zweb', 'sob_medida'], description: 'Linha de negócio da copy — obrigatório, nunca misture as duas' },
        canal: { type: 'string', enum: ['meta_ad', 'google_ad', 'lp', 'email', 'whatsapp', 'organico'] },
        formato: { type: 'string', description: "Ex.: 'reel', 'carrossel', 'search_rsa', 'headline'" },
        angulo: { type: 'string', enum: ['dor', 'prova', 'oferta'] },
        categoria: { type: 'string', enum: ['vendas', 'estoque', 'financeiro', 'fiscal', 'os', 'gestao'] },
        titulo: { type: 'string' },
        corpo: { type: 'string', description: 'Texto completo da copy' },
      },
      required: ['linha', 'canal', 'angulo', 'corpo'],
    },
  },
  get_top_copies: {
    name: 'get_top_copies',
    description: 'Lista as copies aprovadas/no ar mais recentes da biblioteca, opcionalmente filtradas por canal e linha.',
    input_schema: {
      type: 'object',
      properties: {
        canal: { type: 'string', enum: ['meta_ad', 'google_ad', 'lp', 'email', 'whatsapp', 'organico'] },
        linha: { type: 'string', enum: ['zweb', 'sob_medida'] },
        limite: { type: 'number', description: 'Padrão 10' },
      },
      required: [],
    },
  },
  read_metrics: {
    name: 'read_metrics',
    description: 'Lê campanhas e métricas de anúncios (ad_metrics) dos últimos N dias direto do banco.',
    input_schema: {
      type: 'object',
      properties: {
        periodo_dias: { type: 'number', description: 'Janela em dias (padrão 30)' },
      },
      required: [],
    },
  },
  update_plan: {
    name: 'update_plan',
    description:
      'Grava o plano do mês em marketing_plans (objetivos, alocação de orçamento e hipóteses). Use ao fechar um plano ou relatório com o usuário.',
    input_schema: {
      type: 'object',
      properties: {
        mes: { type: 'string', description: "Primeiro dia do mês, formato 'YYYY-MM-01'" },
        objetivos: { type: 'array', items: { type: 'string' } },
        alocacao_orcamento: {
          type: 'object',
          description: 'Ex.: {"meta": 400, "google": 600}',
          additionalProperties: { type: 'number' },
        },
        hipoteses: { type: 'array', items: { type: 'string' } },
      },
      required: ['mes', 'objetivos'],
    },
  },
  create_task: {
    name: 'create_task',
    description:
      'Registra uma tarefa/prioridade da semana para a Laisa ou o Abel (fica em campaign_actions como pendente, visível na UI).',
    input_schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string' },
        responsavel: { type: 'string', enum: ['laisa', 'abel'] },
        descricao: { type: 'string' },
        prazo: { type: 'string', description: 'Data alvo, formato YYYY-MM-DD (opcional)' },
      },
      required: ['titulo', 'responsavel'],
    },
  },
  save_trend_brief: {
    name: 'save_trend_brief',
    description:
      'Salva o briefing semanal de tendências em trend_briefs. Use ao finalizar a pesquisa — o briefing vira contexto dos outros agentes ({{TREND_BRIEFS}}).',
    input_schema: {
      type: 'object',
      properties: {
        semana: { type: 'string', description: 'Segunda-feira da semana do briefing (YYYY-MM-DD). Se omitido, usa a semana atual.' },
        resumo: { type: 'string', description: 'Resumo em até 3 linhas: o que importa esta semana' },
        achados: {
          type: 'array',
          description: 'Até 5 achados acionáveis',
          items: {
            type: 'object',
            properties: {
              tema: { type: 'string' },
              evidencia: { type: 'string', description: 'Fato verificado, com referência à fonte' },
              recomendacao: { type: 'string', description: 'Ação concreta recomendada' },
              para_quem: { type: 'string', enum: ['copywriter', 'social', 'trafego', 'estrategista'] },
            },
            required: ['tema', 'evidencia', 'recomendacao', 'para_quem'],
          },
        },
        fontes: {
          type: 'array',
          description: 'Fontes consultadas',
          items: {
            type: 'object',
            properties: {
              titulo: { type: 'string' },
              url: { type: 'string' },
            },
            required: ['url'],
          },
        },
      },
      required: ['resumo', 'achados'],
    },
  },
  get_calendar: {
    name: 'get_calendar',
    description:
      'Lê o calendário editorial (content_calendar) com filtros opcionais de período, status e linha. Use antes de planejar novos conteúdos para não repetir pilar/formato em sequência.',
    input_schema: {
      type: 'object',
      properties: {
        data_inicio: { type: 'string', description: 'Filtra itens a partir desta data (YYYY-MM-DD)' },
        data_fim: { type: 'string', description: 'Filtra itens até esta data (YYYY-MM-DD)' },
        status: { type: 'string', enum: ['ideia', 'roteiro_pronto', 'gravado', 'publicado'] },
        linha: { type: 'string', enum: ['zweb', 'sob_medida'] },
        limite: { type: 'number', description: 'Padrão 30, máx 60' },
      },
      required: [],
    },
  },
  create_calendar_item: {
    name: 'create_calendar_item',
    description:
      'Grava um item completo no calendário editorial (content_calendar). Salve TODO conteúdo entregue — roteiro, legenda e hashtags nunca ficam só no texto da conversa.',
    input_schema: {
      type: 'object',
      properties: {
        linha: { type: 'string', enum: ['zweb', 'sob_medida'], description: 'Linha de negócio — obrigatório, nunca misture as duas' },
        data_prevista: { type: 'string', description: 'Data planejada de publicação (YYYY-MM-DD)' },
        pilar: { type: 'string', description: 'Um dos 6 pilares (ex.: dores_varejo, tutorial, reforma_tributaria, bastidores, prova_social, automacao_processos)' },
        formato: { type: 'string', description: "Ex.: 'reel', 'carrossel', 'fake_live', 'stories'" },
        plataforma: { type: 'string', description: "Ex.: 'instagram', 'tiktok', 'instagram+tiktok'" },
        roteiro: { type: 'string', description: 'Roteiro com marcação de cena: [FALA], [TEXTO NA TELA], [AÇÃO/ENQUADRAMENTO]' },
        copy_legenda: { type: 'string', description: 'Legenda com gancho na primeira linha + CTA' },
        hashtags: { type: 'string', description: '5 a 8 hashtags separadas por espaço' },
        status: { type: 'string', enum: ['ideia', 'roteiro_pronto', 'gravado', 'publicado'], description: "Padrão 'roteiro_pronto' quando o roteiro está completo; 'ideia' se for só pauta" },
        copy_id: { type: 'string', description: 'id da copy da biblioteca que originou este conteúdo, quando houver' },
      },
      required: ['linha', 'pilar'],
    },
  },
  update_calendar_item: {
    name: 'update_calendar_item',
    description:
      'Edita campos de um item existente do calendário editorial (content_calendar) pelo id. Envie apenas os campos que devem mudar. Use get_calendar antes para confirmar o id.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'id do item (uuid)' },
        linha: { type: 'string', enum: ['zweb', 'sob_medida'] },
        data_prevista: { type: 'string', description: 'YYYY-MM-DD' },
        pilar: { type: 'string' },
        formato: { type: 'string' },
        plataforma: { type: 'string' },
        roteiro: { type: 'string' },
        copy_legenda: { type: 'string' },
        hashtags: { type: 'string' },
        status: { type: 'string', enum: ['ideia', 'roteiro_pronto', 'gravado', 'publicado'] },
        copy_id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  delete_calendar_item: {
    name: 'delete_calendar_item',
    description:
      'Exclui um item do calendário editorial pelo id. IRREVERSÍVEL: só chame depois de o usuário confirmar explicitamente a exclusão na conversa — descreva o item (data, pilar, formato) e pergunte antes.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'id do item (uuid)' },
        confirmado_pelo_usuario: {
          type: 'boolean',
          description: 'true SOMENTE se o usuário confirmou a exclusão deste item nesta conversa',
        },
      },
      required: ['id', 'confirmado_pelo_usuario'],
    },
  },
  get_trend_briefs: {
    name: 'get_trend_briefs',
    description: 'Lê os briefings semanais mais recentes do Analista de Tendências (trend_briefs). Pode estar vazio enquanto esse agente não roda.',
    input_schema: {
      type: 'object',
      properties: {
        limite: { type: 'number', description: 'Padrão 2, máx 5' },
      },
      required: [],
    },
  },
  get_lead: {
    name: 'get_lead',
    description:
      'Busca leads de marketing no banco: por id, por texto (nome, empresa ou telefone) ou lista os mais recentes. Use para carregar o contexto de um lead que o usuário mencionar na conversa.',
    input_schema: {
      type: 'object',
      properties: {
        lead_id: { type: 'string', description: 'id exato do lead (uuid), se conhecido' },
        busca: { type: 'string', description: 'Trecho do nome, empresa ou telefone' },
        limite: { type: 'number', description: 'Quantidade ao listar (padrão 10)' },
      },
      required: [],
    },
  },
  score_lead: {
    name: 'score_lead',
    description:
      'Grava o score (0-100), a justificativa e a linha de negócio no registro do lead. Use após o roteamento e o scoring — sempre com justificativa honesta em 1-2 linhas.',
    input_schema: {
      type: 'object',
      properties: {
        lead_id: { type: 'string', description: 'id do lead (uuid)' },
        score: { type: 'number', description: 'Score 0-100' },
        motivo: { type: 'string', description: 'Justificativa do score em 1-2 linhas' },
        linha: { type: 'string', enum: ['zweb', 'sob_medida'], description: 'Linha após o roteamento (regra de ouro)' },
      },
      required: ['lead_id', 'score', 'motivo', 'linha'],
    },
  },
  generate_whatsapp_script: {
    name: 'generate_whatsapp_script',
    description:
      'Grava o script de WhatsApp pronto para o Abel no registro do lead (máx. 4 linhas, tom de vizinho). O texto que você passar aqui é o que o Abel vai enviar — capriche.',
    input_schema: {
      type: 'object',
      properties: {
        lead_id: { type: 'string', description: 'id do lead (uuid)' },
        script: { type: 'string', description: 'Texto final da mensagem, pronto para enviar' },
      },
      required: ['lead_id', 'script'],
    },
  },
  update_lead_stage: {
    name: 'update_lead_stage',
    description:
      'Atualiza o estágio do lead no pipeline (novo | contatado | demo | proposta | fechado | perdido) e, opcionalmente, a linha de negócio.',
    input_schema: {
      type: 'object',
      properties: {
        lead_id: { type: 'string', description: 'id do lead (uuid)' },
        estagio: { type: 'string', enum: ['novo', 'contatado', 'demo', 'proposta', 'fechado', 'perdido'] },
        linha: { type: 'string', enum: ['zweb', 'sob_medida'] },
      },
      required: ['lead_id', 'estagio'],
    },
  },
  delegate_to_agent: {
    name: 'delegate_to_agent',
    description:
      'Enfileira um briefing para outro agente (copywriter, trafego, tendencias, social, sdr). Na Fase 1 o pedido fica registrado como pendente para o usuário levar ao agente na UI.',
    input_schema: {
      type: 'object',
      properties: {
        agente: { type: 'string', enum: ['copywriter', 'trafego', 'tendencias', 'social', 'sdr'] },
        briefing: { type: 'string', description: 'Objetivo, ângulo, canal e prazo — claro e completo' },
      },
      required: ['agente', 'briefing'],
    },
  },
}

// Tool de servidor da Anthropic API: a pesquisa roda do lado da API, sem
// executor local (nunca chega ao executeTool).
const WEB_SEARCH_TOOL: Anthropic.ToolUnion = {
  type: 'web_search_20250305',
  name: 'web_search',
  max_uses: 8,
}

export function getToolsForAgent(toolNames: readonly string[]): Anthropic.ToolUnion[] {
  return toolNames
    .map((name) => (name === 'web_search' ? WEB_SEARCH_TOOL : TOOL_DEFINITIONS[name]))
    .filter((t): t is Anthropic.ToolUnion => Boolean(t))
}

// -----------------------------------------------------------------------------
// Executores (rodam no servidor a cada tool_use)
// -----------------------------------------------------------------------------

type ToolInput = Record<string, unknown>

export async function executeTool(agentId: AgentId, name: string, input: ToolInput): Promise<string> {
  const supabase = createAdminClient()

  switch (name) {
    case 'search_zweb_kb': {
      const consulta = String(input.consulta ?? '')
      const limite = Math.min(Number(input.limite) || 5, 10)
      const chunks = await buscarChunksRelevantes(consulta, limite)
      if (!chunks.length) {
        return 'Nenhum trecho relevante encontrado na base de conhecimento. NÃO afirme essa funcionalidade — diga que precisa confirmar.'
      }
      return chunks.map((c, i) => `[Fonte ${i + 1} | similaridade ${c.similarity.toFixed(2)}]\n${c.conteudo}`).join('\n\n---\n\n')
    }

    case 'save_copy': {
      const linha = String(input.linha ?? '')
      if (linha !== 'zweb' && linha !== 'sob_medida') {
        return "Erro: informe a linha da copy ('zweb' ou 'sob_medida') — regra inviolável 7."
      }
      const { data, error } = await supabase
        .from('copy_library')
        .insert({
          linha,
          canal: String(input.canal),
          formato: input.formato ? String(input.formato) : null,
          angulo: String(input.angulo),
          categoria: input.categoria ? String(input.categoria) : null,
          titulo: input.titulo ? String(input.titulo) : null,
          corpo: String(input.corpo),
          status: 'rascunho',
        })
        .select('id')
        .single()
      if (error) return `Erro ao salvar copy: ${error.message}`
      return `Copy salva na biblioteca com id ${data.id} (linha: ${linha}, status: rascunho).`
    }

    case 'get_top_copies': {
      let query = supabase
        .from('copy_library')
        .select('id, linha, canal, formato, angulo, categoria, titulo, corpo, status, performance')
        .in('status', ['aprovada', 'no_ar'])
        .order('created_at', { ascending: false })
        .limit(Math.min(Number(input.limite) || 10, 20))
      if (input.canal) query = query.eq('canal', String(input.canal))
      if (input.linha) query = query.eq('linha', String(input.linha))
      const { data, error } = await query
      if (error) return `Erro ao buscar copies: ${error.message}`
      return data.length ? JSON.stringify(data, null, 2) : 'Nenhuma copy aprovada na biblioteca ainda.'
    }

    case 'read_metrics': {
      const dias = Math.min(Number(input.periodo_dias) || 30, 90)
      const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      const [{ data: campanhas }, { data: metricas, error }] = await Promise.all([
        supabase.from('campaigns').select('id, plataforma, nome, objetivo, orcamento_diario, status'),
        supabase
          .from('ad_metrics')
          .select('ad_id, data, impressoes, cliques, gasto, ctr, cpm, cpl, leads, conversas_whatsapp, compras')
          .gte('data', desde)
          .order('data', { ascending: false })
          .limit(300),
      ])
      if (error) return `Erro ao ler métricas: ${error.message}`
      if (!campanhas?.length && !metricas?.length) {
        return `Nenhuma campanha ou métrica registrada nos últimos ${dias} dias. As integrações de tráfego entram na Fase 3.`
      }
      return JSON.stringify({ campanhas: campanhas ?? [], metricas: metricas ?? [] }, null, 2)
    }

    case 'update_plan': {
      const { error } = await supabase.from('marketing_plans').insert({
        mes: String(input.mes),
        objetivos: (input.objetivos ?? null) as Json,
        alocacao_orcamento: (input.alocacao_orcamento ?? null) as Json,
        hipoteses: (input.hipoteses ?? null) as Json,
        created_by: agentId,
      })
      if (error) return `Erro ao gravar plano: ${error.message}`
      return `Plano de ${input.mes} gravado em marketing_plans.`
    }

    case 'create_task': {
      const { error } = await supabase.from('campaign_actions').insert({
        agent: agentId,
        acao: 'task',
        payload: {
          titulo: String(input.titulo),
          responsavel: String(input.responsavel),
          descricao: input.descricao ? String(input.descricao) : null,
          prazo: input.prazo ? String(input.prazo) : null,
        },
      })
      if (error) return `Erro ao criar tarefa: ${error.message}`
      return `Tarefa registrada para ${input.responsavel} (pendente de aprovação na UI).`
    }

    case 'save_trend_brief': {
      // Segunda-feira da semana corrente como padrão
      const hoje = new Date()
      hoje.setDate(hoje.getDate() - ((hoje.getDay() + 6) % 7))
      const semanaPadrao = hoje.toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('trend_briefs')
        .insert({
          semana: input.semana ? String(input.semana) : semanaPadrao,
          resumo: String(input.resumo ?? ''),
          achados: (input.achados ?? []) as Json,
          fontes: (input.fontes ?? []) as Json,
        })
        .select('id, semana')
        .single()
      if (error) return `Erro ao salvar briefing: ${error.message}`
      return `Briefing da semana ${data.semana} salvo com id ${data.id}. Ele já entra no contexto {{TREND_BRIEFS}} dos outros agentes.`
    }

    case 'get_calendar': {
      let query = supabase
        .from('content_calendar')
        .select('id, linha, data_prevista, pilar, formato, plataforma, roteiro, copy_legenda, hashtags, status, copy_id')
        .order('data_prevista', { ascending: true })
        .limit(Math.min(Number(input.limite) || 30, 60))
      if (input.data_inicio) query = query.gte('data_prevista', String(input.data_inicio))
      if (input.data_fim) query = query.lte('data_prevista', String(input.data_fim))
      if (input.status) query = query.eq('status', String(input.status))
      if (input.linha) query = query.eq('linha', String(input.linha))
      const { data, error } = await query
      if (error) return `Erro ao ler calendário: ${error.message}`
      return data.length ? JSON.stringify(data, null, 2) : 'Nenhum item no calendário para esses filtros.'
    }

    case 'create_calendar_item': {
      const linha = String(input.linha ?? '')
      if (linha !== 'zweb' && linha !== 'sob_medida') {
        return "Erro: informe a linha do conteúdo ('zweb' ou 'sob_medida') — regra inviolável 7."
      }
      const status = String(input.status ?? 'roteiro_pronto')
      if (!['ideia', 'roteiro_pronto', 'gravado', 'publicado'].includes(status)) {
        return "Erro: status deve ser 'ideia', 'roteiro_pronto', 'gravado' ou 'publicado'."
      }
      const { data, error } = await supabase
        .from('content_calendar')
        .insert({
          linha,
          data_prevista: input.data_prevista ? String(input.data_prevista) : null,
          pilar: String(input.pilar),
          formato: input.formato ? String(input.formato) : null,
          plataforma: input.plataforma ? String(input.plataforma) : null,
          roteiro: input.roteiro ? String(input.roteiro) : null,
          copy_legenda: input.copy_legenda ? String(input.copy_legenda) : null,
          hashtags: input.hashtags ? String(input.hashtags) : null,
          status,
          copy_id: input.copy_id ? String(input.copy_id) : null,
        })
        .select('id')
        .single()
      if (error) return `Erro ao gravar item no calendário: ${error.message}`
      return `Item gravado no calendário com id ${data.id} (${linha}, ${input.data_prevista ?? 'sem data'}, status: ${status}).`
    }

    case 'update_calendar_item': {
      const id = String(input.id ?? '')
      if (!id) return 'Erro: informe o id do item.'
      const update: Database['public']['Tables']['content_calendar']['Update'] = {}
      if (input.data_prevista !== undefined) update.data_prevista = input.data_prevista == null ? null : String(input.data_prevista)
      if (input.pilar !== undefined) update.pilar = String(input.pilar)
      if (input.formato !== undefined) update.formato = input.formato == null ? null : String(input.formato)
      if (input.plataforma !== undefined) update.plataforma = input.plataforma == null ? null : String(input.plataforma)
      if (input.roteiro !== undefined) update.roteiro = input.roteiro == null ? null : String(input.roteiro)
      if (input.copy_legenda !== undefined) update.copy_legenda = input.copy_legenda == null ? null : String(input.copy_legenda)
      if (input.hashtags !== undefined) update.hashtags = input.hashtags == null ? null : String(input.hashtags)
      if (input.copy_id !== undefined) update.copy_id = input.copy_id == null ? null : String(input.copy_id)
      if (input.linha !== undefined) {
        if (input.linha !== 'zweb' && input.linha !== 'sob_medida') return "Erro: linha deve ser 'zweb' ou 'sob_medida'."
        update.linha = input.linha
      }
      if (input.status !== undefined) {
        if (!['ideia', 'roteiro_pronto', 'gravado', 'publicado'].includes(String(input.status))) {
          return "Erro: status deve ser 'ideia', 'roteiro_pronto', 'gravado' ou 'publicado'."
        }
        update.status = String(input.status)
      }
      if (Object.keys(update).length === 0) return 'Erro: nenhum campo para atualizar foi enviado.'
      const { data, error } = await supabase
        .from('content_calendar')
        .update(update)
        .eq('id', id)
        .select('id')
        .maybeSingle()
      if (error) return `Erro ao atualizar item: ${error.message}`
      if (!data) return `Nenhum item com id ${id}.`
      return `Item ${id} atualizado (campos: ${Object.keys(update).join(', ')}).`
    }

    case 'delete_calendar_item': {
      if (input.confirmado_pelo_usuario !== true) {
        return 'BLOQUEADO: exclusão não confirmada. Descreva o item ao usuário (data, pilar, formato) e peça confirmação explícita antes de chamar de novo com confirmado_pelo_usuario=true.'
      }
      const { data, error } = await supabase
        .from('content_calendar')
        .delete()
        .eq('id', String(input.id))
        .select('id, data_prevista, pilar, formato')
        .maybeSingle()
      if (error) return `Erro ao excluir item: ${error.message}`
      if (!data) return `Nenhum item com id ${input.id}.`
      return `Item excluído: ${data.pilar}${data.formato ? ` (${data.formato})` : ''} de ${data.data_prevista ?? 'sem data'}.`
    }

    case 'get_trend_briefs': {
      const { data, error } = await supabase
        .from('trend_briefs')
        .select('semana, resumo, achados')
        .order('semana', { ascending: false })
        .limit(Math.min(Number(input.limite) || 2, 5))
      if (error) return `Erro ao ler briefings: ${error.message}`
      return data.length
        ? JSON.stringify(data, null, 2)
        : 'Nenhum briefing de tendências ainda — o agente de Tendências entra na Fase 4. Siga com os pilares e formatos já validados.'
    }

    case 'get_lead': {
      const campos = 'id, nome, telefone, email, empresa, segmento, cidade, origem, score, score_motivo, estagio, script_whatsapp, notas, linha, created_at'
      if (input.lead_id) {
        const { data, error } = await supabase
          .from('marketing_leads')
          .select(campos)
          .eq('id', String(input.lead_id))
          .maybeSingle()
        if (error) return `Erro ao buscar lead: ${error.message}`
        return data ? JSON.stringify(data, null, 2) : `Nenhum lead com id ${input.lead_id}.`
      }
      let query = supabase
        .from('marketing_leads')
        .select(campos)
        .order('created_at', { ascending: false })
        .limit(Math.min(Number(input.limite) || 10, 20))
      if (input.busca) {
        const termo = String(input.busca).replaceAll(',', ' ').trim()
        query = query.or(`nome.ilike.%${termo}%,empresa.ilike.%${termo}%,telefone.ilike.%${termo}%`)
      }
      const { data, error } = await query
      if (error) return `Erro ao buscar leads: ${error.message}`
      return data.length ? JSON.stringify(data, null, 2) : 'Nenhum lead encontrado.'
    }

    case 'score_lead': {
      const linha = String(input.linha ?? '')
      if (linha !== 'zweb' && linha !== 'sob_medida') {
        return "Erro: informe a linha do lead ('zweb' ou 'sob_medida') — faça o roteamento antes do scoring."
      }
      const score = Math.max(0, Math.min(100, Math.round(Number(input.score))))
      const { error } = await supabase
        .from('marketing_leads')
        .update({ score, score_motivo: String(input.motivo), linha })
        .eq('id', String(input.lead_id))
      if (error) return `Erro ao gravar score: ${error.message}`
      return `Score ${score} (linha: ${linha}) gravado no lead ${input.lead_id}.`
    }

    case 'generate_whatsapp_script': {
      const script = String(input.script ?? '').trim()
      if (!script) return 'Erro: script vazio.'
      const { error } = await supabase
        .from('marketing_leads')
        .update({ script_whatsapp: script })
        .eq('id', String(input.lead_id))
      if (error) return `Erro ao gravar script: ${error.message}`
      return `Script de WhatsApp gravado no lead ${input.lead_id}.`
    }

    case 'update_lead_stage': {
      const update: { estagio: string; linha?: string } = { estagio: String(input.estagio) }
      if (input.linha === 'zweb' || input.linha === 'sob_medida') update.linha = input.linha
      const { error } = await supabase
        .from('marketing_leads')
        .update(update)
        .eq('id', String(input.lead_id))
      if (error) return `Erro ao atualizar estágio: ${error.message}`
      return `Lead ${input.lead_id} atualizado para estágio '${update.estagio}'${update.linha ? ` (linha: ${update.linha})` : ''}.`
    }

    case 'delegate_to_agent': {
      const { error } = await supabase.from('campaign_actions').insert({
        agent: agentId,
        acao: 'delegacao',
        payload: { agente: String(input.agente), briefing: String(input.briefing) },
      })
      if (error) return `Erro ao delegar: ${error.message}`
      return `Briefing enfileirado para o agente ${input.agente}. Na Fase 1 a fila é manual: avise o usuário para abrir o chat do ${input.agente} e colar o briefing.`
    }

    default:
      return `Tool ${name} ainda não implementada nesta fase.`
  }
}
