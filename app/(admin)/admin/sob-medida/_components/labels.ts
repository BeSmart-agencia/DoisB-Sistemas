export const STATUS_PROJETO: Record<string, { label: string; badge: string }> = {
  proposta: { label: "Proposta", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  em_desenvolvimento: { label: "Em desenvolvimento", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  entregue: { label: "Entregue", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  manutencao: { label: "Manutenção", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  cancelado: { label: "Cancelado", badge: "bg-slate-100 text-slate-500 border-slate-200" },
}

export const STATUS_MENSALIDADE: Record<string, { label: string; badge: string }> = {
  inativa: { label: "Sem mensalidade", badge: "bg-slate-100 text-slate-600 border-slate-200" },
  pendente: { label: "Aguardando cliente", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  ativa: { label: "Ativa", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pausada: { label: "Pausada", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  cancelada: { label: "Cancelada", badge: "bg-red-50 text-red-700 border-red-200" },
}

export const TIPO_LABEL: Record<string, string> = {
  web: "Sistema web",
  app: "Aplicativo",
  integracao: "Integração",
  automacao: "Automação",
  outro: "Outro",
}

export function brl(v: number | null | undefined): string {
  return (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function dataBR(iso: string | null): string {
  if (!iso) return "—"
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR")
}
