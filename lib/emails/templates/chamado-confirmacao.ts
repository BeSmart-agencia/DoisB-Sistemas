export function templateChamadoConfirmacao(
  nome: string,
  numeroChamado: number,
  assunto: string
): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr><td style="background:#1472B5;padding:28px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">DoisB Sistemas</h1>
          <p style="margin:4px 0 0;color:#bfdbfe;font-size:12px;">Suporte Técnico</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="font-size:28px;margin:0 0 12px;">🎫</p>
          <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">Chamado aberto!</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px;">Recebemos sua solicitação e entraremos em contato em breve.</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:10px;">
                    <p style="margin:0 0 2px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Número do chamado</p>
                    <p style="margin:0;color:#1472B5;font-size:20px;font-weight:700;">#${numeroChamado}</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #e2e8f0;padding-top:10px;">
                    <p style="margin:0 0 2px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Assunto</p>
                    <p style="margin:0;color:#0f172a;font-size:14px;font-weight:500;">${assunto}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;">
            Olá, <strong>${nome}</strong>! Nosso time analisará seu chamado em breve.
            Para agilizar o atendimento, guarde o número <strong>#${numeroChamado}</strong> para referência futura.
          </p>
          <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">
            Precisa de suporte urgente? Entre em contato pelo WhatsApp.
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;">DoisB Sistemas — Suporte Técnico ZWeb</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
