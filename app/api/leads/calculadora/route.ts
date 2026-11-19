import { NextRequest, NextResponse } from "next/server"
import { waitUntil } from "@vercel/functions"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { processarLeadMarketing } from "@/lib/agents/sdr"

// Lead do chamariz "Calculadora da Reforma Tributária".
// Cai em marketing_leads (origem=calculadora-reforma) e dispara o SDR,
// igual ao /api/leads das LPs.

const schema = z.object({
  nome: z.string().min(2).max(120),
  email: z.string().email().max(160),
  telefone: z.string().min(10).max(20),
  empresa: z.string().max(160).optional().or(z.literal("")),
  regime: z.enum(["mei", "simples", "regular"]),
  setor: z.enum(["comercio", "servicos", "industria"]),
  faturamento_mensal: z.number().min(0).max(100_000_000),
  // honeypot anti-bot
  website: z.string().max(0).optional().or(z.literal("")),
})

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SETOR_LABEL: Record<string, string> = {
  comercio: "Comércio",
  servicos: "Serviços",
  industria: "Indústria",
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 422 })
  }

  const { nome, email, telefone, empresa, regime, setor, faturamento_mensal } = parsed.data

  const supabase = createAdminClient()
  const { data: lead, error } = await supabase
    .from("marketing_leads")
    .insert({
      nome,
      email,
      telefone,
      empresa: empresa || null,
      segmento: SETOR_LABEL[setor] ?? setor,
      origem: "calculadora-reforma",
      linha: "doisb_web",
      estagio: "novo",
      notas: { fonte: "Calculadora da Reforma", regime, setor, faturamento_mensal },
    })
    .select("id")
    .single()

  if (error) {
    console.error("[calculadora] Erro ao inserir lead:", error.message)
    return NextResponse.json({ error: "Erro ao registrar. Tente pelo WhatsApp." }, { status: 500 })
  }

  // SDR roda após a resposta (não pode quebrar o form — o lead já está salvo).
  waitUntil(
    processarLeadMarketing(lead.id).catch((err) => {
      console.error(`[calculadora] SDR falhou para o lead ${lead.id}:`, err)
    })
  )

  return NextResponse.json({ ok: true })
}
