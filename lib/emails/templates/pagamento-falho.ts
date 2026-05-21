export function templatePagamentoFalho(nome: string): string {
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
            <p style="font-size:32px;margin:0 0 12px;">⚠️</p>
            <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Problema no pagamento</h2>
            <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Olá, <strong style="color:#0f172a;">${nome}</strong>.<br/>
              Não conseguimos processar o pagamento da sua assinatura ZWeb. Para evitar a interrupção do serviço, por favor atualize sua forma de pagamento.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-radius:8px;border-left:4px solid #ef4444;margin-bottom:32px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 10px;color:#7f1d1d;font-size:14px;font-weight:700;">O que pode ter acontecido?</p>
                <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">• Cartão com saldo insuficiente</p>
                <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">• Cartão vencido ou bloqueado</p>
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">• Dados do cartão desatualizados</p>
              </td></tr>
            </table>
            <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;">
              Se precisar de ajuda, entre em contato conosco pelo WhatsApp. Estamos aqui para resolver!
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://wa.me/5551998518895?text=Olá!%20Tive%20um%20problema%20no%20pagamento%20da%20minha%20assinatura%20ZWeb."
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
