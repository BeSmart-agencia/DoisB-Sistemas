import type { DadosNovaVenda } from './templates/interna-nova-venda'
import type { DadosNovoChamado } from './templates/interna-novo-chamado'

// Envio de e-mail desativado temporariamente
const noop = () => Promise.resolve()

export const enviarEmailPosCadastro = noop
export const enviarEmailAcessoLiberado = noop
export const enviarEmailInternoNovaVenda: (dados: DadosNovaVenda) => Promise<void> = () => Promise.resolve()
export const enviarEmailPagamentoFalho = noop
export const enviarEmailConfirmacaoChamado = noop
export const enviarEmailRespostaChamado = noop
export const enviarEmailChamadoResolvido = noop
export const enviarEmailInternoNovoChamado: (dados: DadosNovoChamado) => Promise<void> = () => Promise.resolve()
