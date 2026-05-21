export function templateChamadoResolvido(
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
        </td></tr>
        <tr><td style="padding:40px;text-align:center;">
          <p style="font-size:40px;margin:0 0 12px;">✅</p>
          <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">Chamado resolvido!</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 28px;">Seu chamado #${numeroChamado} foi marcado como resolvido.</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;margin-bottom:28px;text-align:left;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0 0 2px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;">Assunto resolvido</p>
              <p style="margin:0;color:#0f172a;font-size:14px;font-weight:500;">${assunto}</p>
            </td></tr>
          </table>

          <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 8px;text-align:left;">
            Olá, <strong>${nome}</strong>! Ficamos felizes em poder ajudar.
            Se o problema persistir ou se tiver outra dúvida, pode abrir um novo chamado a qualquer momento.
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
