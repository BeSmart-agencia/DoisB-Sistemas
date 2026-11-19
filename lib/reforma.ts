// =============================================================================
// Estimativa simplificada da Reforma Tributária do Consumo (CBS + IBS)
// =============================================================================
// ATENÇÃO: isto é uma ESTIMATIVA ILUSTRATIVA para o chamariz (lead magnet),
// não um cálculo fiscal oficial. Usa a alíquota de referência divulgada
// (~26,5%) e cargas médias por setor. A carga real depende de créditos,
// NCM, margem e da transição (2029→2033). O cálculo oficial da Receita
// Federal (repos RTC, licença MIT) entra numa fase seguinte.

export type Regime = "mei" | "simples" | "regular"
export type Setor = "comercio" | "servicos" | "industria"

export interface EntradaReforma {
  regime: Regime
  setor: Setor
  faturamentoMensal: number
}

export interface ResultadoReforma {
  impactoNivel: "baixo" | "medio" | "alto"
  impactoLabel: string
  resumo: string
  impostoAtual: number // R$/mês estimado no modelo de hoje
  impostoNovoMin: number // R$/mês estimado no novo modelo (com créditos)
  impostoNovoMax: number // R$/mês estimado no novo modelo (teto, sem créditos)
  aliquotaReferencia: number // 0,265
  pontos: string[]
}

// Alíquota de referência total CBS + IBS (valor amplamente divulgado).
export const ALIQUOTA_REFERENCIA = 0.265

// Carga efetiva estimada (sobre o faturamento) hoje, por setor.
const CARGA_REGULAR_ATUAL: Record<Setor, number> = { comercio: 0.22, servicos: 0.135, industria: 0.25 }
const CARGA_SIMPLES_ATUAL: Record<Setor, number> = { comercio: 0.08, servicos: 0.14, industria: 0.09 }
const DAS_MEI = 76 // DAS fixo mensal aproximado do MEI

const SETOR_LABEL: Record<Setor, string> = {
  comercio: "comércio",
  servicos: "serviços",
  industria: "indústria",
}

export function estimarReforma({ regime, setor, faturamentoMensal }: EntradaReforma): ResultadoReforma {
  const f = Math.max(0, faturamentoMensal || 0)
  const setorNome = SETOR_LABEL[setor]

  if (regime === "mei") {
    return {
      impactoNivel: "baixo",
      impactoLabel: "Impacto baixo",
      resumo:
        "O MEI foi mantido na reforma. Você continua recolhendo o valor fixo mensal (DAS), sem entrar na complexidade do novo IVA.",
      impostoAtual: DAS_MEI,
      impostoNovoMin: DAS_MEI,
      impostoNovoMax: DAS_MEI,
      aliquotaReferencia: ALIQUOTA_REFERENCIA,
      pontos: [
        "Seu DAS fixo mensal continua — a reforma preserva o MEI.",
        "Atenção ao crédito: empresas que compram de MEI aproveitam menos crédito. Se você vende para outras empresas (PJ), isso pode pesar na negociação.",
        "Se o B2B for importante pra você, dá pra avaliar recolher CBS/IBS por fora para dar crédito cheio ao cliente.",
      ],
    }
  }

  if (regime === "simples") {
    const atual = f * CARGA_SIMPLES_ATUAL[setor]
    return {
      impactoNivel: "medio",
      impactoLabel: "Impacto médio",
      resumo:
        `Você pode continuar no Simples Nacional, e o seu imposto fica parecido com o de hoje. O ponto-chave no ${setorNome} é o crédito: clientes PJ vão querer a nota com CBS/IBS destacado para se creditarem.`,
      impostoAtual: atual,
      impostoNovoMin: atual * 0.95,
      impostoNovoMax: atual * 1.1,
      aliquotaReferencia: ALIQUOTA_REFERENCIA,
      pontos: [
        "Você pode permanecer no Simples (recolhimento unificado no DAS).",
        "Avalie o modelo híbrido: recolher CBS/IBS 'por fora' para dar crédito cheio aos clientes PJ e não perder vendas B2B.",
        "A transição é gradual (fase de testes a partir de 2026/2027, cheia até 2033) — dá tempo de se organizar.",
      ],
    }
  }

  // Regime regular (Lucro Presumido / Real)
  const atual = f * CARGA_REGULAR_ATUAL[setor]
  const novoMax = f * ALIQUOTA_REFERENCIA // sem créditos (teto ilustrativo)
  const novoMin = f * ALIQUOTA_REFERENCIA * 0.5 // com créditos relevantes (piso ilustrativo)
  return {
    impactoNivel: "alto",
    impactoLabel: "Impacto alto",
    resumo:
      `No regime regular, PIS/COFINS/ICMS/ISS dão lugar à CBS + IBS (alíquota de referência de ~26,5%). No ${setorNome}, a sua carga real vai depender muito dos créditos que você conseguir aproveitar.`,
    impostoAtual: atual,
    impostoNovoMin: novoMin,
    impostoNovoMax: novoMax,
    aliquotaReferencia: ALIQUOTA_REFERENCIA,
    pontos: [
      "O novo IVA é não-cumulativo: tudo que você compra com nota vira crédito. Organizar as compras passa a valer dinheiro.",
      setor === "servicos"
        ? "Serviços tendem a sentir mais: hoje o ISS é baixo e usa poucos insumos para creditar."
        : "Comércio e indústria costumam ter mais créditos de insumos — o que ajuda a reduzir a carga efetiva.",
      "Na transição (2029→2033) os tributos antigos e novos convivem — o acompanhamento mês a mês é essencial.",
    ],
  }
}

export const BRL_REFORMA = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
