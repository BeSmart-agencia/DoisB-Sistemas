export interface DadosLeadMarketing {
  nome: string
  empresa: string
  segmento: string
  tamanho_equipe: string | null
  processo: string | null
  telefone: string | null
  email: string | null
  origem: string
  linha: string
  score: number | null
  score_motivo: string | null
  script_whatsapp: string | null
}

function escapeHtml(texto: string): string {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

// Monta o link wa.me com o script pré-preenchido. Telefone BR: garante o DDI 55.
export function linkWhatsApp(telefone: string, script: string): string {
  let digitos = telefone.replace(/\D/g, '')
  if (!digitos.startsWith('55')) digitos = `55${digitos}`
  return `https://wa.me/${digitos}?text=${encodeURIComponent(script)}`
}

function corDoScore(score: number): { bg: string; borda: string; texto: string; rotulo: string } {
  if (score >= 70) return { bg: '#f0fdf4', borda: '#bbf7d0', texto: '#166534', rotulo: 'QUENTE — contato em até 2h' }
  if (score >= 40) return { bg: '#fffbeb', borda: '#fde68a', texto: '#92400e', rotulo: 'MORNO — contato no dia' }
  return { bg: '#f8fafc', borda: '#e2e8f0', texto: '#475569', rotulo: 'FRIO — nutrição, sem prioridade' }
}

export function templateInternaLeadMarketing(dados: DadosLeadMarketing): string {
  const linhaNome = dados.linha === 'sob_medida' ? 'Sob medida' : 'ZWeb'
  const temScore = dados.score !== null
  const cor = corDoScore(dados.score ?? 0)
  const script = dados.script_whatsapp?.trim() ?? null

  const blocoScore = temScore
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:${cor.bg};border-radius:8px;border:1px solid ${cor.borda};margin-bottom:24px;">
        <tr><td style="padding:16px 20px;text-align:center;">
          <p style="margin:0;color:${cor.texto};font-size:22px;font-weight:700;">Score ${dados.score}/100</p>
          <p style="margin:6px 0 0;color:${cor.texto};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${cor.rotulo}</p>
          ${dados.score_motivo ? `<p style="margin:10px 0 0;color:#334155;font-size:13px;">${escapeHtml(dados.score_motivo)}</p>` : ''}
        </td></tr>
      </table>`
    : `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-radius:8px;border:1px solid #fecaca;margin-bottom:24px;">
        <tr><td style="padding:16px 20px;text-align:center;">
          <p style="margin:0;color:#991b1b;font-size:13px;font-weight:600;">O agente SDR não conseguiu pontuar este lead — qualifique manualmente no painel.</p>
        </td></tr>
      </table>`

  const blocoScript = script
    ? `<p style="margin:24px 0 8px;color:#0f172a;font-size:14px;font-weight:700;">Script pronto para o WhatsApp:</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0;color:#0c4a6e;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(script)}</p>
        </td></tr>
      </table>
      ${
        dados.telefone
          ? `<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:20px 0 0;text-align:center;">
              <a href="${linkWhatsApp(dados.telefone, script)}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;">Abrir conversa no WhatsApp →</a>
            </td></tr></table>`
          : `<p style="margin:16px 0 0;color:#92400e;font-size:13px;text-align:center;">Lead sem telefone — copie o script acima e envie manualmente quando conseguir o contato.</p>`
      }`
    : ''

  const linhas: [string, string][] = [
    ['Nome', dados.nome],
    ['Empresa', dados.empresa],
    ['Segmento', dados.segmento],
    ['Equipe', dados.tamanho_equipe ?? '-'],
    ['Telefone', dados.telefone ?? '-'],
    ['E-mail', dados.email ?? '-'],
    ['Origem', dados.origem],
    ['Linha', linhaNome],
  ]

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:580px;">
        <tr>
          <td style="background:#0f172a;padding:28px 40px;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">DoisB Sistemas — Lead qualificado pelo SDR</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;">📥 Lead novo — ${escapeHtml(dados.empresa)} (${linhaNome})</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            ${blocoScore}
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              ${linhas
                .map(
                  ([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding:12px 20px;color:#64748b;font-size:13px;font-weight:600;width:35%;border-bottom:1px solid #f1f5f9;">${label}</td>
                <td style="padding:12px 20px;color:#0f172a;font-size:13px;border-bottom:1px solid #f1f5f9;">${escapeHtml(value)}</td>
              </tr>`
                )
                .join('')}
            </table>
            ${
              dados.processo
                ? `<p style="margin:24px 0 8px;color:#0f172a;font-size:14px;font-weight:700;">O que o lead contou:</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
                    <tr><td style="padding:16px 20px;">
                      <p style="margin:0;color:#334155;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(dados.processo)}</p>
                    </td></tr>
                  </table>`
                : ''
            }
            ${blocoScript}
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">Mensagem automática — agente SDR do Marketing OS</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
