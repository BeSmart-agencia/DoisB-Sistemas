import { PLANO_LABEL } from "@/lib/planos"

const LINK_ATIVACAO = "https://sistema.doisbsistemas.com.br/#/login"

export function templateDoisbWebAtivacao(nome: string, plano: string): string {
  const planoNome = PLANO_LABEL[plano] ?? (plano.charAt(0).toUpperCase() + plano.slice(1))
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr>
          <td style="background:#059669;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">DoisB Web</h1>
            <p style="margin:6px 0 0;color:#d1fae5;font-size:13px;">Seu ERP completo — pela DoisB Sistemas</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:32px;margin:0 0 12px;">🚀</p>
            <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:700;">Pagamento confirmado — ative agora!</h2>
            <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Olá, <strong style="color:#0f172a;">${nome}</strong>!<br/>
              Sua assinatura do <strong style="color:#059669;">DoisB Web — Plano ${planoNome}</strong> foi confirmada.
              É só criar o seu acesso e começar a usar — você mesmo faz a ativação em poucos minutos.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td align="center">
                <a href="${LINK_ATIVACAO}"
                   style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;padding:16px 44px;border-radius:8px;font-weight:700;font-size:16px;">
                  Ativar meu DoisB Web
                </a>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border-radius:8px;border-left:4px solid #059669;margin-bottom:24px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 12px;color:#065f46;font-size:14px;font-weight:700;">Como ativar</p>
                <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">1️⃣ Acesse o link acima e crie o seu login</p>
                <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">2️⃣ Configure os dados da sua empresa</p>
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">3️⃣ Pronto! Comece a vender, controlar e crescer</p>
              </td></tr>
            </table>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 8px;">
              Link de ativação: <a href="${LINK_ATIVACAO}" style="color:#059669;">${LINK_ATIVACAO}</a>
            </p>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
              Precisa de ajuda? Fale com a gente no WhatsApp
              <a href="https://wa.me/5551992726289?text=Ol%C3%A1!%20Assinei%20o%20DoisB%20Web%20e%20preciso%20de%20ajuda%20na%20ativa%C3%A7%C3%A3o." style="color:#059669;">(51) 99272-6289</a>.
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
