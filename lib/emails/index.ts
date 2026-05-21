import { Resend } from 'resend'
import { templatePosCadastro } from './templates/pos-cadastro'
import { templateAcessoLiberado } from './templates/acesso-liberado'
import { templateInternaNovaVenda, type DadosNovaVenda } from './templates/interna-nova-venda'
import { templatePagamentoFalho } from './templates/pagamento-falho'
import { templateChamadoConfirmacao } from './templates/chamado-confirmacao'
import { templateChamadoResposta } from './templates/chamado-resposta'
import { templateChamadoResolvido } from './templates/chamado-resolvido'
import { templateInternaNewChamado, type DadosNovoChamado } from './templates/interna-novo-chamado'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const EMAIL_INTERNO = process.env.EMAIL_INTERNO!

// ─── Pagamento ────────────────────────────────────────────────────────────────

export async function enviarEmailPosCadastro(email: string, nome: string, plano: string) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: '✅ Pagamento confirmado — Bem-vindo ao ZWeb!',
    html: templatePosCadastro(nome, plano),
  })
}

export async function enviarEmailAcessoLiberado(
  email: string, nome: string,
  credenciais: { usuario: string; senha: string; url: string }
) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: '🚀 Seu acesso ao ZWeb está liberado!',
    html: templateAcessoLiberado(nome, credenciais),
  })
}

export async function enviarEmailInternoNovaVenda(dados: DadosNovaVenda) {
  await resend.emails.send({
    from: FROM, to: EMAIL_INTERNO,
    subject: `🎉 Nova venda — ${dados.nome_empresa} (Plano ${dados.plano})`,
    html: templateInternaNovaVenda(dados),
  })
}

export async function enviarEmailPagamentoFalho(email: string, nome: string) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: '⚠️ Problema no pagamento da sua assinatura ZWeb',
    html: templatePagamentoFalho(nome),
  })
}

// ─── Suporte ──────────────────────────────────────────────────────────────────

export async function enviarEmailConfirmacaoChamado(
  email: string, nome: string, numeroChamado: number, assunto: string
) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: `🎫 Chamado #${numeroChamado} aberto — DoisB Sistemas`,
    html: templateChamadoConfirmacao(nome, numeroChamado, assunto),
  })
}

export async function enviarEmailRespostaChamado(
  email: string, nome: string, numeroChamado: number, assunto: string,
  mensagem: string, atendenteNome: string
) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: `💬 Resposta ao chamado #${numeroChamado} — DoisB Sistemas`,
    html: templateChamadoResposta(nome, numeroChamado, assunto, mensagem, atendenteNome),
  })
}

export async function enviarEmailChamadoResolvido(
  email: string, nome: string, numeroChamado: number, assunto: string
) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: `✅ Chamado #${numeroChamado} resolvido — DoisB Sistemas`,
    html: templateChamadoResolvido(nome, numeroChamado, assunto),
  })
}

export async function enviarEmailInternoNovoChamado(dados: DadosNovoChamado) {
  await resend.emails.send({
    from: FROM, to: EMAIL_INTERNO,
    subject: `🎫 Novo chamado #${dados.numeroChamado} — ${dados.assunto}`,
    html: templateInternaNewChamado(dados),
  })
}
