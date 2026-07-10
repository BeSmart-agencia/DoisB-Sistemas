import { runAgent, appendToConversation } from '@/lib/agents/run'
import { enviarEmailResumoSemanal } from '@/lib/emails'

// Rotina semanal do Marketing OS (cron de segunda de manhã):
// 1. Tendências pesquisa a web e salva o briefing (save_trend_brief)
// 2. Estrategista gera o relatório semanal (update_plan) — roda DEPOIS,
//    para o {{TREND_BRIEFS}} dele já incluir o briefing novo.
// As duas etapas falham de forma independente; o chamador loga.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.doisbsistemas.com.br'

const PEDIDO_TENDENCIAS = `Rode o briefing semanal completo conforme o seu escopo de pesquisa:
pesquise na web o que está funcionando AGORA (formatos/ganchos B2B Brasil, movimentos
de concorrentes de ERP varejo e de desenvolvimento sob medida, prazos da Reforma
Tributária, datas comerciais das próximas 6 semanas, mudanças em Meta/Google Ads).
Ao final, salve via save_trend_brief com resumo, até 5 achados (tema/evidência/
recomendação/para_quem) e as fontes, e apresente o briefing completo.`

const PEDIDO_ESTRATEGISTA = `Acionamento do cron semanal: gere o relatório da semana no formato
da sua seção <relatorio_semanal> (números vs. semana anterior, o que funcionou,
o que não funcionou, 3 prioridades da próxima semana, decisões pendentes de
aprovação). Considere o briefing de tendências mais recente do contexto.
Salve o plano/prioridades via update_plan e apresente o relatório completo.`

export async function rodarBriefingTendencias(opts: { enviarEmail?: boolean } = {}): Promise<string> {
  const texto = await runAgent('tendencias', PEDIDO_TENDENCIAS)
  await appendToConversation('tendencias', PEDIDO_TENDENCIAS, texto)

  if (opts.enviarEmail !== false) {
    await enviarEmailResumoSemanal('🔎 Briefing de tendências da semana — Marketing OS', {
      titulo: 'Briefing de tendências da semana',
      intro:
        'O Analista de Tendências pesquisou a web e salvou o briefing desta semana. Os achados já estão no contexto do Copywriter, do Social e do Estrategista.',
      corpo: texto,
      linkUrl: `${APP_URL}/admin/marketing/briefings`,
      linkLabel: 'Abrir briefings no painel',
    })
  }
  return texto
}

export async function rodarRelatorioEstrategista(opts: { enviarEmail?: boolean } = {}): Promise<string> {
  const texto = await runAgent('estrategista', PEDIDO_ESTRATEGISTA)
  await appendToConversation('estrategista', PEDIDO_ESTRATEGISTA, texto)

  if (opts.enviarEmail !== false) {
    await enviarEmailResumoSemanal('📊 Relatório semanal do Estrategista — Marketing OS', {
      titulo: 'Relatório semanal do Estrategista',
      intro: 'Relatório gerado na segunda de manhã com as prioridades da semana. A conversa completa está no chat do Estrategista.',
      corpo: texto,
      linkUrl: `${APP_URL}/admin/marketing`,
      linkLabel: 'Abrir o Marketing OS',
    })
  }
  return texto
}
