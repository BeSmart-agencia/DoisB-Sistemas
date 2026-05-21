export interface Template {
  id: number
  nome: string
  texto: string
}

export const TEMPLATES: Template[] = [
  {
    id: 1,
    nome: "Primeira abordagem",
    texto: `Olá [Nome]! Aqui é [Seu nome] da DoisB Sistemas.
Vimos que você tem uma [segmento] aí em [cidade] e queríamos te apresentar o ZWeb, o sistema de gestão da Zucchetti — a maior software house italiana, com mais de 700 mil clientes no mundo.
Posso te mandar uma demonstração rápida?`,
  },
  {
    id: 2,
    nome: "Segunda mensagem",
    texto: `Oi [Nome], tudo bem? Passando pra saber se viu nossa mensagem sobre o ZWeb.
Temos planos a partir de R$ 99,90/mês com tudo que você precisa pra gerir sua [segmento].
Posso te enviar mais detalhes?`,
  },
  {
    id: 3,
    nome: "Terceira mensagem",
    texto: `Oi [Nome]! Última tentativa por aqui 😊 Caso tenha interesse em conhecer o ZWeb, é só responder. Estamos à disposição!`,
  },
]

export function aplicarVariaveis(texto: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((t, [k, v]) => t.replaceAll(`[${k}]`, v), texto)
}

export function templateParaStatus(status: string): Template | null {
  const map: Record<string, number> = { a_enviar: 1, "1_msg": 2, "2_msg": 3 }
  const id = map[status]
  return id != null ? (TEMPLATES.find((t) => t.id === id) ?? null) : null
}

export function proximoStatus(status: string): string | null {
  const map: Record<string, string> = {
    a_enviar: "1_msg",
    "1_msg": "2_msg",
    "2_msg": "3_msg",
  }
  return map[status] ?? null
}
