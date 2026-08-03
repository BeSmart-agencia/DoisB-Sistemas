// ============================================================
// Captação de leads — fonte única do questionário + motor de recomendação.
// Usado na aba "Captações" do portal do vendedor e na rota de API.
//
// A recomendação é CONSULTIVA (o vendedor decide o que vender). Ela mapeia
// as marcações do questionário para o plano ZWeb ideal — ou para sob medida —
// com base nas features de cada plano (ver components/site/planos.tsx).
// ============================================================

import { PLANO_PRECO } from "@/lib/planos"

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export type TipoCaptacao = "fisica" | "online"

export type StatusCaptacao =
  | "iniciada"
  | "finalizada"
  | "em_negociacao"
  | "venda_realizada"
  | "venda_negada"

export type PlanoRecomendado =
  | "essencial"
  | "standard"
  | "premium"
  | "zweb_sob_medida"
  | "sistema_sob_medida"
  | "indefinido"

export type Regime = "mei" | "simples" | "geral" | "nao_sei"
export type FaixaUsuarios = "1" | "2a3" | "4mais"

// Marcações do questionário. Tudo opcional — o vendedor preenche o que descobre.
export interface Respostas {
  regime?: Regime
  usuarios?: FaixaUsuarios
  // Checkboxes de operação
  nfe?: boolean
  pdv?: boolean
  boleto_maquininha?: boolean
  financeiro?: boolean
  grade?: boolean
  marketplace?: boolean
  ordem_servico?: boolean
  multi_loja?: boolean
  sped?: boolean
  tabela_preco?: boolean
  // Sinais de "sob medida"
  processo_proprio?: boolean
  sem_nota?: boolean
}

export type ChaveBooleana = Exclude<keyof Respostas, "regime" | "usuarios">

// ---------- Definição das perguntas (renderização genérica na UI) ----------

export const REGIME_OPCOES: { valor: Regime; label: string }[] = [
  { valor: "mei", label: "MEI" },
  { valor: "simples", label: "Simples Nacional" },
  { valor: "geral", label: "Lucro Presumido/Real" },
  { valor: "nao_sei", label: "Não sei" },
]

export const USUARIOS_OPCOES: { valor: FaixaUsuarios; label: string }[] = [
  { valor: "1", label: "1" },
  { valor: "2a3", label: "2 a 3" },
  { valor: "4mais", label: "Mais de 3" },
]

export const CHECKBOXES_OPERACAO: { chave: ChaveBooleana; label: string }[] = [
  { chave: "nfe", label: "Precisa emitir nota fiscal (NF-e)" },
  { chave: "pdv", label: "Tem loja física com balcão/caixa (PDV)" },
  { chave: "boleto_maquininha", label: "Boleto e/ou maquininha de cartão integrada" },
  { chave: "financeiro", label: "Controle financeiro (contas a pagar/receber, fluxo de caixa)" },
  { chave: "grade", label: "Vende roupa ou calçado (grade: tamanho/cor)" },
  { chave: "marketplace", label: "Vende em marketplace ou e-commerce (Mercado Livre, Shopee, loja online)" },
  { chave: "ordem_servico", label: "Faz ordens de serviço (assistência, oficina, conserto)" },
  { chave: "multi_loja", label: "Tem mais de uma loja / precisa de retaguarda offline" },
  { chave: "sped", label: "Precisa de SPED Fiscal / Sintegra" },
  { chave: "tabela_preco", label: "Precisa de tabela de preço diferente por cliente" },
]

export const CHECKBOXES_SOB_MEDIDA: { chave: ChaveBooleana; label: string }[] = [
  { chave: "processo_proprio", label: "O problema é um processo próprio que hoje vive em planilha/papel/WhatsApp e não tem sistema pronto" },
  { chave: "sem_nota", label: "O que ele precisa não envolve nota fiscal — é organizar um fluxo interno" },
]

// ---------- Motor de recomendação ----------

export interface Recomendacao {
  plano: PlanoRecomendado
  motivos: string[] // por quê — mostrado ao vendedor
}

/**
 * Ordem de decisão:
 *  1. Sinais de sob medida (não fiscal) — precisa dos dois marcados.
 *  2. Regime geral (lucro real/presumido) → orçamento ZWeb sob medida.
 *  3. Maior nível de feature disparado: Premium > Standard > Essencial.
 *  4. Nada suficiente → indefinido.
 */
export function recomendar(r: Respostas): Recomendacao {
  // 1. Sistema sob medida (não fiscal)
  if (r.processo_proprio && r.sem_nota) {
    return {
      plano: "sistema_sob_medida",
      motivos: [
        "Processo próprio sem sistema pronto no mercado",
        "A necessidade não envolve nota fiscal",
      ],
    }
  }

  // 2. Regime geral — fora da tabela MEI/Simples
  if (r.regime === "geral") {
    return {
      plano: "zweb_sob_medida",
      motivos: ["Regime geral (lucro real/presumido) — recebe orçamento sob medida"],
    }
  }

  // 3. Nível ZWeb pelo maior gatilho
  const premium: [boolean, string][] = [
    [!!r.grade, "Vende roupa/calçado com grade (tamanho/cor)"],
    [!!r.marketplace, "Vende em marketplace / e-commerce"],
    [!!r.multi_loja, "Mais de uma loja / retaguarda offline"],
    [!!r.ordem_servico, "Trabalha com ordens de serviço"],
    [!!r.sped, "Precisa de SPED Fiscal / Sintegra"],
    [!!r.tabela_preco, "Tabela de preço por cliente"],
    [r.usuarios === "4mais", "Mais de 3 usuários"],
  ]
  const standard: [boolean, string][] = [
    [!!r.pdv, "Loja física com balcão/caixa (PDV)"],
    [!!r.boleto_maquininha, "Boleto e/ou maquininha integrada"],
    [!!r.financeiro, "Controle financeiro (contas, fluxo de caixa)"],
    [r.usuarios === "2a3", "2 a 3 usuários"],
  ]

  const gatPremium = premium.filter(([on]) => on).map(([, l]) => l)
  if (gatPremium.length) return { plano: "premium", motivos: gatPremium }

  const gatStandard = standard.filter(([on]) => on).map(([, l]) => l)
  if (gatStandard.length) return { plano: "standard", motivos: gatStandard }

  // Essencial: só precisa de nota/cadastro, uso enxuto
  if (r.nfe || r.regime === "mei" || r.regime === "simples") {
    const m: string[] = []
    if (r.nfe) m.push("Precisa emitir nota fiscal (NF-e)")
    if (r.usuarios === "1") m.push("Uso individual (1 usuário)")
    m.push("Sem PDV, financeiro ou varejo avançado")
    return { plano: "essencial", motivos: m }
  }

  return {
    plano: "indefinido",
    motivos: ["Poucas respostas para indicar — preencha mais ou fale com a DoisB"],
  }
}

// ---------- Metadados para exibição ----------

export const RECOMENDACAO_INFO: Record<
  PlanoRecomendado,
  { label: string; sub: string; acao: string }
> = {
  essencial: {
    label: "ZWeb Essencial",
    sub: `${BRL.format(PLANO_PRECO.essencial)}/mês`,
    acao: "Feche pelo seu link de venda.",
  },
  standard: {
    label: "ZWeb Standard",
    sub: `${BRL.format(PLANO_PRECO.standard)}/mês`,
    acao: "Feche pelo seu link de venda.",
  },
  premium: {
    label: "ZWeb Premium",
    sub: `${BRL.format(PLANO_PRECO.premium)}/mês`,
    acao: "Feche pelo seu link de venda.",
  },
  zweb_sob_medida: {
    label: "ZWeb sob medida",
    sub: "Orçamento personalizado",
    acao: "Regime geral: encaminhe pra DoisB montar o orçamento.",
  },
  sistema_sob_medida: {
    label: "Sistema sob medida (não fiscal)",
    sub: "Desenvolvimento sob demanda",
    acao: "Encaminhe pra DoisB fazer o diagnóstico gratuito.",
  },
  indefinido: {
    label: "Ainda indefinido",
    sub: "",
    acao: "Preencha mais respostas ou fale com a DoisB.",
  },
}

export const STATUS_CAPTACAO_INFO: Record<
  StatusCaptacao,
  { label: string; cls: string }
> = {
  iniciada: { label: "Captação iniciada", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  finalizada: { label: "Captação finalizada", cls: "bg-violet-50 text-violet-700 border-violet-200" },
  em_negociacao: { label: "Em negociação", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  venda_realizada: { label: "Venda realizada", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  venda_negada: { label: "Venda negada", cls: "bg-slate-100 text-slate-500 border-slate-200" },
}

// Status que o vendedor pode escolher manualmente depois de finalizar.
export const STATUS_MANUAIS: StatusCaptacao[] = [
  "em_negociacao",
  "venda_realizada",
  "venda_negada",
]
