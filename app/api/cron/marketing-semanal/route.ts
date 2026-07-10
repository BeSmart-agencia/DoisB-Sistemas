import { NextResponse } from 'next/server'
import { rodarBriefingTendencias, rodarRelatorioEstrategista } from '@/lib/agents/semanal'

// Cron semanal do Marketing OS (segunda 06:00 BRT / 09:00 UTC — ver vercel.json):
// briefing de tendências primeiro, relatório do Estrategista depois (para o
// {{TREND_BRIEFS}} dele já incluir o briefing novo). Falhas independentes.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const resultado: Record<string, string> = {}

  try {
    await rodarBriefingTendencias()
    resultado.tendencias = 'ok'
  } catch (err) {
    console.error('[cron/marketing-semanal] Tendências falhou:', err)
    resultado.tendencias = 'erro'
  }

  try {
    await rodarRelatorioEstrategista()
    resultado.estrategista = 'ok'
  } catch (err) {
    console.error('[cron/marketing-semanal] Estrategista falhou:', err)
    resultado.estrategista = 'erro'
  }

  const status = Object.values(resultado).includes('erro') ? 207 : 200
  return NextResponse.json(resultado, { status })
}
