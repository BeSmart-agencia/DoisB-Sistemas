import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"

/**
 * Ativação manual de um cliente cujo pagamento foi feito por fora do sistema
 * (ex.: PIX anual cobrado direto, boleto avulso). Marca a conta como ativa,
 * libera o acesso e define o próximo vencimento do PIX conforme a duração:
 *   - "anual"  → hoje + 1 ano   (o cron só gera nova cobrança 5 dias antes)
 *   - "mensal" → hoje + 1 mês
 *
 * O `forma_pagamento` é forçado para "pix" para que o cron de renovação
 * (que só processa clientes PIX) assuma a próxima cobrança no vencimento.
 *
 * Body: { duracao: "anual" | "mensal" }
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const body = await request.json().catch(() => null)
  const duracao = body?.duracao === "mensal" ? "mensal" : "anual"

  const { data: cliente, error: fetchError } = await supabase!
    .from("clientes")
    .select("status_pagamento, acesso_liberado, data_assinatura")
    .eq("id", params.id)
    .maybeSingle()

  if (fetchError || !cliente) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
  }

  if (cliente.status_pagamento === "cancelado") {
    return NextResponse.json({ error: "Cliente cancelado — reative pelo fluxo normal." }, { status: 409 })
  }

  // Vencimento do PIX no formato YYYY-MM-DD (o cron interpreta assim).
  const venc = new Date()
  if (duracao === "anual") venc.setFullYear(venc.getFullYear() + 1)
  else venc.setMonth(venc.getMonth() + 1)
  const pixVencimento = venc.toISOString().slice(0, 10)

  const { error: updateError } = await supabase!
    .from("clientes")
    .update({
      status_pagamento: "ativo",
      acesso_liberado: true,
      forma_pagamento: "pix",
      pix_vencimento: pixVencimento,
      // Preserva a data de assinatura original, se já existir.
      data_assinatura: cliente.data_assinatura ?? new Date().toISOString(),
    })
    .eq("id", params.id)

  if (updateError) {
    console.error("[ativar-manual] Erro ao ativar:", updateError)
    return NextResponse.json({ error: "Erro ao ativar cliente" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, duracao, pix_vencimento: pixVencimento })
}
