export function templateChamadoResposta(
  nome: string,
  numeroChamado: number,
  assunto: string,
  mensagem: string,
  atendenteNome: string
): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr><td style="background:#1472B5;padding:28px 40px;">
          <p style="margin:0 0 4px;color:#bfdbfe;font-size:12px;">Chamado #${numeroChamado}</p>
          <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Nova resposta da equipe DoisB</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#475569;font-size:14px;margin:0 0 8px;">Olá, <strong>${nome}</strong>!</p>
          <p style="color:#475569;font-size:14px;margin:0 0 24px;">
            <strong>${atendenteNome}</strong> respondeu ao seu chamado referente a: <em>${assunto}</em>
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:8px;border-left:4px solid #1472B5;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 8px;color:#1e3a5f;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Resposta</p>
              <p style="margin:0;color:#1e293b;font-size:14px;line-height:1.7;white-space:pre-wrap;">${mensagem}</p>
            </td></tr>
          </table>

          <p style="color:#94a3b8;font-size:13px;margin:0;">
            Caso precise de mais informações, responda este e-mail ou abra um novo chamado.
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
