// Preços de tabela dos planos ZWeb (em reais).
// Fonte única de verdade — usado no cálculo da comissão do vendedor
// (comissão = 100% da primeira mensalidade do plano vendido).
export const PLANO_PRECO: Record<string, number> = {
  essencial: 129.9,
  standard: 199.9,
  premium: 249.9,
}

export const PLANO_LABEL: Record<string, string> = {
  essencial: "Essencial",
  standard: "Standard",
  premium: "Premium",
}
