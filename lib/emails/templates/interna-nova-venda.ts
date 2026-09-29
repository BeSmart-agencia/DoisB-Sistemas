import { PLANO_LABEL, PLANO_PRECO, PRODUTO_NOME, BRL } from "@/lib/planos"

export interface DadosNovaVenda {
  nome_empresa: string
  cnpj: string
  email: string
  telefone: string
  nome_responsavel: string
  plano: string
  stripe_customer_id?: string
  produto?: string
}

export function templateInternaNovaVenda(dados: DadosNovaVenda): string {
  const nomeProduto = PRODUTO_NOME[dados.produto ?? "zweb"] ?? "ZWeb"
  const planoNome = PLANO_LABEL[dados.plano] ?? (dados.plano.charAt(0).toUpperCase() + dados.plano.slice(1))
  const precoStr = PLANO_PRECO[dados.plano] ? `${BRL.format(PLANO_PRECO[dados.plano])}/mês` : '-'
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr>
          <td style="background:#0f172a;padding:28px 40px;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">DoisB Sistemas — Notificação interna</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;">🎉 Nova venda confirmada!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;text-align:center;">
                <p style="margin:0;color:#166534;font-size:18px;font-weight:700;">${nomeProduto} · ${planoNome} — ${precoStr}</p>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              ${[
                ['Produto', nomeProduto],
                ['Empresa', dados.nome_empresa],
                ['CNPJ', dados.cnpj],
                ['Responsável', dados.nome_responsavel],
                ['E-mail', dados.email],
                ['Telefone', dados.telefone],
                ['Plano', planoNome],
                ['Stripe Customer', dados.stripe_customer_id ?? '-'],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:12px 20px;color:#64748b;font-size:13px;font-weight:600;width:40%;border-bottom:1px solid #f1f5f9;">${label}</td>
                <td style="padding:12px 20px;color:#0f172a;font-size:13px;border-bottom:1px solid #f1f5f9;">${value}</td>
              </tr>`).join('')}
            </table>
            <p style="margin:24px 0 0;color:#64748b;font-size:13px;text-align:center;">
              Lembre-se de liberar o acesso em até 1 dia útil após esta notificação.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">Mensagem automática — DoisB Sistemas</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
