export interface DadosNovoChamado {
  numeroChamado: number
  assunto: string
  descricao: string
  cnpj: string
  email: string
  nomeEmpresa?: string
}

export function templateInternaNewChamado(dados: DadosNovoChamado): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr><td style="background:#0f172a;padding:24px 40px;">
          <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;">DoisB — Notificação Interna</p>
          <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">🎫 Novo chamado #${dados.numeroChamado}</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border-radius:8px;border-left:4px solid #eab308;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0;color:#713f12;font-size:14px;font-weight:700;">Assunto: ${dados.assunto}</p>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
            ${[
              ["Nº Chamado", `#${dados.numeroChamado}`],
              ["Empresa", dados.nomeEmpresa ?? "Não identificada"],
              ["CNPJ", dados.cnpj],
              ["E-mail", dados.email],
            ].map(([label, value], i) => `
            <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f8fafc"};">
              <td style="padding:10px 16px;color:#64748b;font-size:12px;font-weight:600;width:35%;border-bottom:1px solid #f1f5f9;">${label}</td>
              <td style="padding:10px 16px;color:#0f172a;font-size:13px;border-bottom:1px solid #f1f5f9;">${value}</td>
            </tr>`).join("")}
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0 0 8px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Descrição do problema</p>
              <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.7;white-space:pre-wrap;">${dados.descricao}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;">Mensagem automática — DoisB Sistemas</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
