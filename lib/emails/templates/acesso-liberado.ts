export function templateAcessoLiberado(
  nome: string,
  credenciais: { usuario: string; senha: string; url: string }
): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr>
          <td style="background:#1472B5;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">DoisB Sistemas</h1>
            <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Parceiro Autorizado Zucchetti ZWeb</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:32px;margin:0 0 12px;">🚀</p>
            <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Seu acesso está liberado!</h2>
            <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Olá, <strong style="color:#0f172a;">${nome}</strong>!<br/>
              Tudo pronto. Aqui estão suas credenciais de acesso ao ZWeb:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:32px;">
              <tr><td style="padding:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;">
                      <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">URL de acesso</p>
                      <a href="${credenciais.url}" style="color:#1472B5;font-size:15px;font-weight:600;text-decoration:none;">${credenciais.url}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;border-top:1px solid #e2e8f0;padding-top:12px;">
                      <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Usuário</p>
                      <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;font-family:monospace;">${credenciais.usuario}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top:1px solid #e2e8f0;padding-top:12px;">
                      <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Senha provisória</p>
                      <p style="margin:0;color:#0f172a;font-size:15px;font-weight:600;font-family:monospace;">${credenciais.senha}</p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border-radius:8px;border-left:4px solid #eab308;margin-bottom:32px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0;color:#713f12;font-size:14px;">⚠️ Por segurança, <strong>altere sua senha</strong> no primeiro acesso.</p>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${credenciais.url}"
                   style="display:inline-block;background:#1472B5;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px;">
                  Acessar o ZWeb agora
                </a>
              </td></tr>
            </table>
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
