export interface DadosResumoSemanal {
  titulo: string
  intro: string
  corpo: string
  linkUrl: string
  linkLabel: string
}

function escapeHtml(texto: string): string {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function templateInternaResumoSemanal(dados: DadosResumoSemanal): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:640px;">
        <tr>
          <td style="background:#0f172a;padding:28px 40px;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">DoisB Marketing OS — rotina semanal</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;">${escapeHtml(dados.titulo)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">${escapeHtml(dados.intro)}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0;color:#0f172a;font-size:13px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(dados.corpo)}</p>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 0 0;text-align:center;">
              <a href="${dados.linkUrl}" style="display:inline-block;background:#1472B5;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;">${escapeHtml(dados.linkLabel)}</a>
            </td></tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">Mensagem automática — cron semanal do Marketing OS</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
