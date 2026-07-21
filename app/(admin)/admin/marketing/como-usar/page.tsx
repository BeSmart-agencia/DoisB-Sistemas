import Link from "next/link"
import {
  TrendingUp,
  Compass,
  CalendarDays,
  Pencil,
  MessageSquare,
  Megaphone,
} from "lucide-react"

export const metadata = { title: "Como usar os agentes | DoisB Admin" }

const PASSOS = [
  {
    n: 1,
    id: "tendencias",
    nome: "Tendências",
    papel: "Começa a semana",
    icon: TrendingUp,
    ativo: true,
    itens: [
      'Abra o agente Tendências e peça: "Rode o briefing desta semana".',
      "Ele pesquisa a web e salva os achados, que viram contexto de todos os outros agentes.",
      "Já roda sozinho toda segunda 06:00 (BRT) e entrega o briefing ao Estrategista — faça manual só quando quiser um briefing fora de hora.",
      "Confira o resultado na tela Briefings.",
    ],
  },
  {
    n: 2,
    id: "estrategista",
    nome: "Estrategista",
    papel: "Define o plano",
    icon: Compass,
    ativo: true,
    itens: [
      "É o CMO virtual. Já vem com o briefing da semana no contexto.",
      'Peça: "Monte o plano deste mês com o orçamento de R$ 1.000" ou "Quais as 3 prioridades da semana?".',
      "Ele grava o plano do mês e registra tarefas. É daqui que sai a direção para os demais agentes.",
    ],
  },
  {
    n: 3,
    id: "social",
    nome: "Social",
    papel: "Calendário editorial",
    icon: CalendarDays,
    ativo: true,
    itens: [
      'Peça: "Monte a próxima semana com 3 conteúdos, alternando pilares".',
      "Cada roteiro sai pronto para gravar em menos de 30 minutos.",
      "Veja, edite ou exclua os itens na tela Calendário (dá para editar direto pela UI, não só pelo chat).",
    ],
  },
  {
    n: 4,
    id: "copywriter",
    nome: "Copywriter",
    papel: "As peças",
    icon: Pencil,
    ativo: true,
    itens: [
      "Anúncios, landing pages, e-mails e WhatsApp.",
      'Ex.: "Escreva um anúncio de Meta para mercados, ângulo retaguarda offline". Ele confirma tudo na base de conhecimento ZWeb antes de escrever.',
      "As copies aprovadas ficam salvas na Biblioteca de copies para reuso.",
    ],
  },
  {
    n: 5,
    id: "sdr",
    nome: "SDR",
    papel: "Trabalha os leads que chegam",
    icon: MessageSquare,
    ativo: true,
    itens: [
      "Reativo: pontua automaticamente todo lead que preenche o formulário do site.",
      'No chat: "Mostre os leads mais recentes" ou "Refaça o score do lead da Transportadora X" (busca por nome/empresa).',
      "Gera scripts de WhatsApp e atualiza o estágio do lead. Acompanhe tudo na tela Leads.",
    ],
  },
  {
    n: 6,
    id: "trafego",
    nome: "Gestor de Tráfego",
    papel: "Em breve — Fase 3",
    icon: Megaphone,
    ativo: false,
    itens: [
      "Meta e Google Ads ainda não estão ativos. O card fica desabilitado na lista de agentes.",
    ],
  },
]

export default function ComoUsarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Como usar os agentes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Passo a passo na ordem que faz sentido. Todos os agentes compartilham a mesma memória
            da DoisB, então a ordem importa: quem roda antes alimenta quem vem depois.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/marketing"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ← Chat dos agentes
          </Link>
        </div>
      </div>

      {/* Fluxo resumido */}
      <div className="admin-panel p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Fluxo resumido
        </p>
        <p className="text-sm font-medium text-slate-700">
          Tendências → Estrategista → Social → Copywriter{" "}
          <span className="text-slate-400">(SDR trabalha os leads em paralelo)</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Ou seja: pesquisa → estratégia → pauta → peça → venda.
        </p>
      </div>

      {/* Passos */}
      <div className="space-y-4">
        {PASSOS.map((p) => (
          <div key={p.id} className="admin-panel p-5">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={
                    "flex h-10 w-10 items-center justify-center rounded-lg " +
                    (p.ativo ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400")
                  }
                >
                  <p.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-300">{p.n}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-950">{p.nome}</h2>
                  {!p.ativo && (
                    <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
                      em breve
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{p.papel}</p>
                <ul className="mt-3 space-y-1.5">
                  {p.itens.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700 leading-snug">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dicas de operação */}
      <div className="admin-panel p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Dicas de operação
        </p>
        <ul className="space-y-1.5">
          {[
            "Trocar de agente = clicar no card à esquerda. Cada um tem histórico próprio e persistente.",
            '"Limpar" (canto superior direito do chat) apaga o histórico daquele agente — use com cuidado, não tem desfazer.',
            "As telas do topo (Leads, Copies, Calendário, Briefings) são a visão de dados do que os agentes produzem; o chat é onde você manda fazer.",
            "Enter envia; Shift+Enter quebra linha.",
          ].map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700 leading-snug">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
