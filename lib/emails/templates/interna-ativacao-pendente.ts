export interface DadosAtivacaoPendente {
  nome_empresa: string
  nome_responsavel: string
  email: string
  telefone: string
  plano: string
  forma_pagamento: string
}

export function templateInternaAtivacaoPendente(dados: DadosAtivacaoPendente): string {
  const planoNome = dados.plano.charAt(0).toUpperCase() + dados.plano.slice(1)
  const precos: Record<string, string> = {
    essencial: 'R$ 129,90/mês',
    standard: 'R$ 199,90/mês',
    premium: 'R$ 249,90/mês',
  }
  const checklist = [
    'Acessar o painel ZWeb',
    'Localizar ou criar o cliente com os dados abaixo',
    'Ativar o sistema para o cliente',
    `Enviar as credenciais de acesso por e-mail (${dados.email})`,
    'Marcar como "Acesso liberado" no painel DoisB',
  ]
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr>
          <td style="background:#0169b2;padding:28px 40px;">
            <p style="margin:0;color:#bfdbfe;font-size:12px;text-transform:uppercase;letter-spacing:1px;">DoisB Sistemas — Ação necessária</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;">⚡ Novo cliente — ativar no ZWeb</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;text-align:center;">
                <p style="margin:0;color:#1e40af;font-size:18px;font-weight:700;">Plano ${planoNome} — ${precos[dados.plano] ?? '-'}</p>
                <p style="margin:4px 0 0;color:#3b82f6;font-size:13px;">Pagamento via ${dados.forma_pagamento} confirmado</p>
              </td></tr>
            </table>

            <h2 style="margin:0 0 12px;color:#0f172a;font-size:15px;font-weight:700;">Dados do cliente</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              ${[
                ['Empresa', dados.nome_empresa],
                ['Responsável', dados.nome_responsavel],
                ['E-mail', dados.email],
                ['Telefone', dados.telefone],
                ['Plano', `${planoNome} (${precos[dados.plano] ?? '-'})`],
                ['Forma de pagamento', dados.forma_pagamento],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:12px 20px;color:#64748b;font-size:13px;font-weight:600;width:40%;border-bottom:1px solid #f1f5f9;">${label}</td>
                <td style="padding:12px 20px;color:#0f172a;font-size:13px;border-bottom:1px solid #f1f5f9;">${value}</td>
              </tr>`).join('')}
            </table>

            <h2 style="margin:0 0 12px;color:#0f172a;font-size:15px;font-weight:700;">Checklist de ativação</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              ${checklist.map((item, i) => `
              <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:12px 20px;font-size:13px;color:#0f172a;border-bottom:1px solid #f1f5f9;">
                  <span style="display:inline-block;width:22px;height:22px;background:#e2e8f0;border-radius:4px;text-align:center;line-height:22px;font-weight:700;color:#64748b;margin-right:10px;font-size:12px;">${i + 1}</span>
                  ${item}
                </td>
              </tr>`).join('')}
            </table>
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
