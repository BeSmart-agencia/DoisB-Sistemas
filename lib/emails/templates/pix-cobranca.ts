export function templatePixCobranca(
  nome: string,
  plano: string,
  vencimento: string,
  linkPagamento: string,
  diasRestantes: number,
): string {
  const planoNome = plano.charAt(0).toUpperCase() + plano.slice(1)
  const urgente = diasRestantes <= 1
  const headerBg = urgente ? "#dc2626" : "#1472B5"
  const badgeText = urgente
    ? "⚠️ ÚLTIMO DIA — pague hoje para não perder o acesso"
    : `📅 Vencimento em ${diasRestantes} dia${diasRestantes === 1 ? "" : "s"}`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr>
          <td style="background:${headerBg};padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">DoisB Sistemas</h1>
            <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Parceiro Autorizado Zucchetti ZWeb</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:32px;margin:0 0 12px;">🏦</p>
            <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Sua cobrança mensal está disponível</h2>
            <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
              Olá, <strong style="color:#0f172a;">${nome}</strong>!<br/>
              O QR Code PIX da sua assinatura <strong style="color:#1472B5;">Plano ${planoNome}</strong> está pronto.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:8px;border-left:4px solid #1472B5;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0;color:#1e3a5f;font-size:14px;font-weight:700;">${badgeText}</p>
                <p style="margin:6px 0 0;color:#374151;font-size:13px;">Vencimento: <strong>${vencimento}</strong></p>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td align="center">
                <a href="${linkPagamento}"
                   style="display:inline-block;background:#1472B5;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;">
                  Ver QR Code e pagar
                </a>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9e7;border-radius:8px;border-left:4px solid #f59e0b;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 8px;color:#78350f;font-size:13px;font-weight:700;">Atenção</p>
                <p style="margin:0;color:#374151;font-size:13px;line-height:1.6;">Após 3 dias sem pagamento seu acesso ao ZWeb será suspenso automaticamente. Para reativar, basta efetuar o pagamento.</p>
              </td></tr>
            </table>

            <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0;">
              Dúvidas? Fale no WhatsApp:
              <a href="https://wa.me/5551998518895" style="color:#1472B5;">(51) 99851-8895</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">DoisB Sistemas — Venda. Controle. Cresça.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
