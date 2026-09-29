// =============================================================================
// Catálogo de produtos e planos da DoisB Sistemas
// =============================================================================
//
// LEGADO (ZWeb) — mantido: usado no cálculo de comissão do vendedor
// (comissão = 100% da primeira mensalidade), captação e Meta CAPI.
export const PLANO_PRECO: Record<string, number> = {
  essencial: 129.9,
  standard: 199.9,
  premium: 249.9,
  unico: 159.9, // GWeb — plano único
}

export const PLANO_LABEL: Record<string, string> = {
  essencial: "Essencial",
  standard: "Standard",
  premium: "Premium",
  unico: "Plano único",
}

/** Nome de exibição do produto a partir do id salvo em `clientes.produto`. */
export const PRODUTO_NOME: Record<string, string> = {
  "zweb": "ZWeb",
  "gweb": "GWeb",
  "doisb-web": "DoisB Web",
}

// =============================================================================
// NOVO — Catálogo multi-produto (carro-chefe: DoisB Web)
// =============================================================================

export type ProdutoId = "doisb-web" | "zweb" | "gweb" | "sob-medida"
export type IntervaloCobranca = "mensal" | "anual"
export type CorProduto = "verde" | "azul" | "laranja" | "roxo"

export interface PlanoCatalogo {
  /** slug usado na URL de cadastro (?plano=) */
  key: string
  nome: string
  /** preço mensal no plano mensal (R$) */
  precoMensal: number
  /** preço total do plano anual, já com desconto (R$) */
  precoAnual?: number
  descricao: string
  features: string[]
  destaque?: boolean
  trialDias?: number
  /** nome da env var com o price id do Stripe (mensal) */
  priceEnvMensal?: string
  /** nome da env var com o price id do Stripe (anual) */
  priceEnvAnual?: string
}

export interface ProdutoCatalogo {
  id: ProdutoId
  nome: string
  tagline: string
  descricaoCurta: string
  cor: CorProduto
  href: string
  /** carro-chefe */
  destaque?: boolean
  /** possui checkout direto (assinar) */
  assinavel: boolean
  /** rótulo curto do público-alvo */
  publico: string
  planos: PlanoCatalogo[]
}

/** Desconto do plano anual (10%). */
export const DESCONTO_ANUAL = 0.1

// -- DoisB Web (white-label Nuts) — carro-chefe ------------------------------
const DOISB_ESSENCIAL_FEATURES = [
  "Emissão fiscal: NF-e, NFC-e, pré-venda e faturamento",
  "Compras com importação de XML e Monitor NF-e",
  "Estoque com lotes, validade, variações, kits e inventário",
  "Financeiro completo: caixa, contas a pagar/receber e DRE",
  "Conciliação bancária, Pix, boleto e links de pagamento",
  "Fiscal e contábil: SPED, Sintegra e envio para a contabilidade",
  "Multiempresa, usuários, perfis e permissões",
  "Etiquetas configuráveis e integração com balanças",
  "Dashboard com indicadores e relatórios",
]

const DOISB_STANDARD_FEATURES = [
  "Tudo do Essencial, mais os módulos abaixo inclusos:",
  "Módulo de Serviços: OS completa, NFS-e, contratos e técnicos",
  "CRM com funil de oportunidades e automações",
  "Food service: salão, comandas, cozinha e cardápio digital",
  "PDV Offline (vende mesmo sem internet)",
  "Catálogo Digital (vitrine online dos seus produtos)",
  "Delivery e self-pedido",
  "Condicional de mercadorias",
  "Transporte, veículos, motoristas e MDF-e",
  "WhatsApp, Inteligência Artificial e agendamentos",
]

const doisbWeb: ProdutoCatalogo = {
  id: "doisb-web",
  nome: "DoisB Web",
  tagline: "O ERP completo da DoisB",
  descricaoCurta:
    "Nosso sistema carro-chefe: vendas, fiscal, estoque, financeiro, CRM, food e multiempresa — tudo online, com a cara da sua empresa.",
  cor: "verde",
  href: "/doisb-web",
  destaque: true,
  assinavel: true,
  publico: "Para quem quer um sistema completo",
  planos: [
    {
      key: "essencial",
      nome: "Essencial",
      precoMensal: 149.9,
      precoAnual: 1618.92,
      descricao: "O ERP fiscal completo para vender, controlar e crescer.",
      features: DOISB_ESSENCIAL_FEATURES,
      trialDias: 5,
      priceEnvMensal: "STRIPE_PRICE_DOISB_ESSENCIAL_MENSAL",
      priceEnvAnual: "STRIPE_PRICE_DOISB_ESSENCIAL_ANUAL",
    },
    {
      key: "standard",
      nome: "Standard",
      precoMensal: 249.9,
      precoAnual: 2698.92,
      descricao: "Tudo, com os adicionais inclusos: serviços, CRM, food e mais.",
      features: DOISB_STANDARD_FEATURES,
      destaque: true,
      trialDias: 5,
      priceEnvMensal: "STRIPE_PRICE_DOISB_STANDARD_MENSAL",
      priceEnvAnual: "STRIPE_PRICE_DOISB_STANDARD_ANUAL",
    },
  ],
}

// -- ZWeb (revenda Zucchetti) ------------------------------------------------
const zweb: ProdutoCatalogo = {
  id: "zweb",
  nome: "ZWeb",
  tagline: "Gestão para o varejo",
  descricaoCurta:
    "O sistema da Zucchetti para o varejo: PDV com retaguarda offline, e-commerce, NF-e/NFC-e, estoque e financeiro.",
  cor: "azul",
  href: "/zweb",
  assinavel: true,
  publico: "Para varejo completo, com e-commerce",
  planos: [
    { key: "essencial", nome: "Essencial", precoMensal: 129.9, descricao: "Para começar a vender com nota.", features: [], priceEnvMensal: "STRIPE_PRICE_ESSENCIAL" },
    { key: "standard", nome: "Standard", precoMensal: 199.9, descricao: "A escolha da maioria dos lojistas.", features: [], destaque: true, priceEnvMensal: "STRIPE_PRICE_STANDARD" },
    { key: "premium", nome: "Premium", precoMensal: 249.9, descricao: "Solução completa para escalar.", features: [], priceEnvMensal: "STRIPE_PRICE_PREMIUM" },
  ],
}

// -- GWeb (white-label Gdoor) — mini-mercados --------------------------------
const gweb: ProdutoCatalogo = {
  id: "gweb",
  nome: "GWeb",
  tagline: "Simples para mini-mercados",
  descricaoCurta:
    "O essencial para o mini-mercado: emissão de NF-e/NFC-e, PDV que funciona offline e etiquetas. Sem complicação.",
  cor: "laranja",
  href: "/gweb",
  assinavel: true,
  publico: "Para mini-mercados e mercearias",
  planos: [
    {
      key: "unico",
      nome: "GWeb",
      precoMensal: 159.9,
      descricao: "Plano único, tudo o que o mini-mercado precisa.",
      features: [
        "Emissão de NF-e e NFC-e",
        "PDV híbrido com operação offline",
        "Etiquetas de gôndola e de produtos",
        "Controle de estoque e financeiro",
      ],
      priceEnvMensal: "STRIPE_PRICE_GWEB_MENSAL",
    },
  ],
}

// -- Sistema Sob Medida ------------------------------------------------------
const sobMedida: ProdutoCatalogo = {
  id: "sob-medida",
  nome: "Sistema Sob Medida",
  tagline: "Feito para o seu processo",
  descricaoCurta:
    "Um sistema (não fiscal) desenvolvido sob medida para otimizar o processo específico da sua empresa.",
  cor: "roxo",
  href: "/sob-medida",
  assinavel: false,
  publico: "Para processos que sistema pronto não resolve",
  planos: [],
}

export const PRODUTOS: ProdutoCatalogo[] = [doisbWeb, zweb, gweb, sobMedida]

export function getProduto(id: ProdutoId): ProdutoCatalogo | undefined {
  return PRODUTOS.find((p) => p.id === id)
}

export function getPlano(produtoId: ProdutoId, planoKey: string): PlanoCatalogo | undefined {
  return getProduto(produtoId)?.planos.find((p) => p.key === planoKey)
}

/**
 * Resolve o price id do Stripe (server-side) para um produto/plano/intervalo.
 * Lê a env var cujo nome está no catálogo. Retorna undefined se não existir.
 */
export function resolverPriceId(
  produtoId: ProdutoId,
  planoKey: string,
  intervalo: IntervaloCobranca = "mensal"
): string | undefined {
  const plano = getPlano(produtoId, planoKey)
  if (!plano) return undefined
  const envKey = intervalo === "anual" ? plano.priceEnvAnual : plano.priceEnvMensal
  return envKey ? process.env[envKey] : undefined
}

/** Preço mensal equivalente quando pago no anual (para exibição). */
export function precoMensalNoAnual(plano: PlanoCatalogo): number | undefined {
  return plano.precoAnual ? plano.precoAnual / 12 : undefined
}

/**
 * Preço mensal de tabela por produto+plano — usado em comissão e Meta CAPI.
 * O mesmo `plano` (ex.: "essencial") tem preço diferente por produto
 * (ZWeb 129,90 vs DoisB Web 149,90), por isso não basta olhar só o plano.
 */
export function precoMensalDe(produtoId: string, planoKey: string): number {
  const plano = getPlano(produtoId as ProdutoId, planoKey)
  return plano?.precoMensal ?? PLANO_PRECO[planoKey] ?? 0
}

export const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
