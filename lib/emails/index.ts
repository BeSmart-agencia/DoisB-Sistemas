import { Resend } from "resend"
import type { DadosNovaVenda } from "./templates/interna-nova-venda"
import type { DadosNovoChamado } from "./templates/interna-novo-chamado"
import type { DadosAtivacaoPendente } from "./templates/interna-ativacao-pendente"
import { templatePosCadastro } from "./templates/pos-cadastro"
import { templateAcessoLiberado } from "./templates/acesso-liberado"
import { templatePagamentoFalho } from "./templates/pagamento-falho"
import { templateChamadoConfirmacao } from "./templates/chamado-confirmacao"
import { templateChamadoResposta } from "./templates/chamado-resposta"
import { templateChamadoResolvido } from "./templates/chamado-resolvido"
import { templateInternaNovaVenda } from "./templates/interna-nova-venda"
import { templateInternaNewChamado } from "./templates/interna-novo-chamado"
import { templatePixCobranca } from "./templates/pix-cobranca"
import { templateInternaAtivacaoPendente } from "./templates/interna-ativacao-pendente"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = "DoisB Sistemas <noreply@doisbsistemas.com.br>"
const INTERNO = ["barthlaisa@gmail.com", "laisabarth@doisbsistemas.com.br", "abelbarth@doisbsistemas.com.br"]

export async function enviarEmailPosCadastro(email: string, nome: string, plano: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Bem-vindo à DoisB Sistemas — pagamento confirmado!",
    html: templatePosCadastro(nome, plano),
  })
}

export async function enviarEmailAcessoLiberado(
  email: string,
  nome: string,
  credenciais: { usuario: string; senha: string; url: string }
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Seu acesso ao ZWeb está liberado!",
    html: templateAcessoLiberado(nome, credenciais),
  })
}

export async function enviarEmailPagamentoFalho(email: string, nome: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Problema com seu pagamento — DoisB Sistemas",
    html: templatePagamentoFalho(nome),
  })
}

export async function enviarEmailConfirmacaoChamado(email: string, nome: string, protocolo: number, assunto: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Chamado #${protocolo} recebido — DoisB Sistemas`,
    html: templateChamadoConfirmacao(nome, protocolo, assunto),
  })
}

export async function enviarEmailRespostaChamado(email: string, nome: string, protocolo: number, assunto: string, mensagem: string, atendenteNome: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Resposta ao chamado #${protocolo} — DoisB Sistemas`,
    html: templateChamadoResposta(nome, protocolo, assunto, mensagem, atendenteNome),
  })
}

export async function enviarEmailChamadoResolvido(email: string, nome: string, protocolo: number, assunto: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Chamado #${protocolo} resolvido — DoisB Sistemas`,
    html: templateChamadoResolvido(nome, protocolo, assunto),
  })
}

export async function enviarEmailInternoNovaVenda(dados: DadosNovaVenda) {
  await resend.emails.send({
    from: FROM,
    to: INTERNO,
    subject: `🎉 Nova venda — ${dados.nome_empresa} (${dados.plano})`,
    html: templateInternaNovaVenda(dados),
  })
}

export async function enviarEmailInternoNovoChamado(dados: DadosNovoChamado) {
  await resend.emails.send({
    from: FROM,
    to: INTERNO,
    subject: `🎫 Novo chamado — ${dados.assunto}`,
    html: templateInternaNewChamado(dados),
  })
}

export async function enviarEmailInternoAtivacaoPendente(dados: DadosAtivacaoPendente) {
  await resend.emails.send({
    from: FROM,
    to: INTERNO,
    subject: `⚡ Ativar no ZWeb — ${dados.nome_empresa} (${dados.plano})`,
    html: templateInternaAtivacaoPendente(dados),
  })
}

export async function enviarEmailPixCobranca(
  email: string,
  nome: string,
  plano: string,
  vencimento: string,
  linkPagamento: string,
  diasRestantes: number,
) {
  const urgente = diasRestantes <= 1
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: urgente
      ? "⚠️ Último dia — pague seu PIX hoje para não perder o acesso"
      : `PIX vence em ${diasRestantes} dias — DoisB Sistemas`,
    html: templatePixCobranca(nome, plano, vencimento, linkPagamento, diasRestantes),
  })
}
