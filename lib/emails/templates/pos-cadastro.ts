import { PLANO_LABEL, PRODUTO_NOME } from "@/lib/planos"

export function templatePosCadastro(nome: string, plano: string, produto: string = "zweb"): string {
  const planoNome = PLANO_LABEL[plano] ?? (plano.charAt(0).toUpperCase() + plano.slice(1))
  const nomeProduto = PRODUTO_NOME[produto] ?? "sistema"
  const subHeader = produto === "zweb" ? "Parceiro Autorizado Zucchetti ZWeb" : `Sistema ${nomeProduto}`
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
            <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">${subHeader}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:32px;margin:0 0 12px;">✅</p>
            <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Pagamento confirmado!</h2>
            <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Olá, <strong style="color:#0f172a;">${nome}</strong>!<br/>
              Sua assinatura do <strong style="color:#1472B5;">${nomeProduto} — Plano ${planoNome}</strong> foi confirmada com sucesso.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:8px;border-left:4px solid #1472B5;margin-bottom:32px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 12px;color:#1e3a5f;font-size:14px;font-weight:700;">O que acontece agora?</p>
                <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">📋 Nossa equipe irá configurar o seu acesso ao ${nomeProduto}</p>
                <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">📧 Seu sistema será ativado em <strong>até 1 dia útil</strong> e você receberá tudo por e-mail</p>
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">📞 Entraremos em contato para dar todo o suporte inicial</p>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://wa.me/5551992726289?text=Ol%C3%A1!%20Acabei%20de%20assinar%20e%20quero%20acompanhar%20meu%20acesso."
                   style="display:inline-block;background:#1472B5;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px;">
                  Falar no WhatsApp
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
