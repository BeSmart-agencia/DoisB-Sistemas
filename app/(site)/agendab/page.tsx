import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import {
  CalendarDays,
  Users,
  FileText,
  Wallet,
  Smartphone,
  ShieldCheck,
  Check,
  Printer,
  Paperclip,
  Clock,
} from "lucide-react"
import { AssinarButton } from "./assinar-button"

export const metadata: Metadata = {
  title: "AgendaB — Sistema de gestão para clínicas | DoisB Sistemas",
  description:
    "Agenda, pacientes, prontuário eletrônico e financeiro da sua clínica em um só lugar. Simples, moderno, funciona no celular. R$ 175/mês, sem fidelidade.",
  alternates: { canonical: "/agendab" },
  openGraph: {
    title: "AgendaB — Gestão para clínicas",
    description:
      "Agenda, pacientes, prontuário e financeiro em um sistema leve e fácil de usar. R$ 175/mês.",
    type: "website",
    locale: "pt_BR",
  },
}

const AGENDAB_URL = "https://agendab.doisbsistemas.com.br"

const MODULOS = [
  {
    icon: CalendarDays,
    titulo: "Agenda inteligente",
    desc: "Marcação em segundos, bloqueio automático de conflito de horário, expediente configurável e status de cada consulta (confirmado, atendido, faltou…).",
  },
  {
    icon: Users,
    titulo: "Pacientes",
    desc: "Cadastro completo com busca por nome, celular ou CPF. A ficha do paciente reúne tudo em uma tela só.",
  },
  {
    icon: FileText,
    titulo: "Prontuário eletrônico",
    desc: "Linha do tempo com todas as consultas datadas. Abra a ficha em 2026 e veja o que foi escrito em 2022.",
  },
  {
    icon: Paperclip,
    titulo: "Exames anexados",
    desc: "Envie raio-x, exames de laboratório e documentos (foto ou PDF) direto na ficha — para abrir depois é um clique.",
  },
  {
    icon: Printer,
    titulo: "Receitas e atestados",
    desc: "Gere receitas, atestados, laudos e solicitações com modelos prontos e impressão em papel timbrado da clínica.",
  },
  {
    icon: Wallet,
    titulo: "Financeiro simples",
    desc: "Entradas, saídas e saldo do mês, direto ao ponto. Sem contabilidade complicada.",
  },
  {
    icon: Smartphone,
    titulo: "Funciona no celular",
    desc: "Adicione à tela inicial do iPhone ou Android e use como um aplicativo, em tela cheia.",
  },
  {
    icon: ShieldCheck,
    titulo: "Dados protegidos",
    desc: "Cada clínica tem seus dados totalmente isolados, com criptografia e backup automático na nuvem.",
  },
  {
    icon: Clock,
    titulo: "Pronto em minutos",
    desc: "Sem instalação e sem treinamento demorado: guia ilustrado passo a passo dentro do próprio sistema.",
  },
]

const INCLUSO = [
  "Todos os módulos: agenda, pacientes, prontuário, documentos e financeiro",
  "Até 5 usuários com login próprio",
  "Pacientes e agendamentos ilimitados",
  "Anexo de exames e documentos (fotos e PDF)",
  "Computador, tablet e celular",
  "Atualizações e suporte incluídos",
]

const FAQ = [
  {
    p: "Preciso instalar alguma coisa?",
    r: "Não. O AgendaB funciona direto no navegador, em qualquer computador ou celular. No celular, você pode adicionar à tela inicial e usar como um app.",
  },
  {
    p: "Quantas pessoas podem usar?",
    r: "Até 5 usuários por clínica, cada um com seu próprio login e senha.",
  },
  {
    p: "Funciona para a minha especialidade?",
    r: "Sim — odontologia, medicina, psicologia, fisioterapia, estética e outras. Procedimentos, especialidades e modelos de documentos são configuráveis.",
  },
  {
    p: "Como recebo o acesso depois de assinar?",
    r: "Na hora: assim que o pagamento é confirmado, você recebe por e-mail o link para criar a conta da sua clínica.",
  },
  {
    p: "Posso cancelar quando quiser?",
    r: "Sim. A assinatura é mensal, sem fidelidade e sem multa.",
  },
]

export default function AgendabPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-slate-950 pt-36 pb-24 px-4 sm:px-6 lg:px-8">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(1,105,178,0.45), transparent)",
            }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-300 mb-6">
              <CalendarDays className="h-3.5 w-3.5" /> AgendaB
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
              A gestão da sua clínica,
              <br />
              <span className="text-blue-400">simples e moderna.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Agenda, pacientes, prontuário eletrônico e financeiro em um só
              lugar — leve, bonito e fácil de usar, direto do navegador.
            </p>
            <div className="mt-10 flex justify-center">
              <AssinarButton />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              R$ 175/mês · sem fidelidade · acesso na hora
            </p>
          </div>
        </section>

        {/* Screenshot */}
        <section className="bg-white pt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${AGENDAB_URL}/guia/dashboard.webp`}
              alt="Painel do AgendaB com agenda do dia e resumo da clínica"
              className="w-full rounded-2xl border border-slate-200 shadow-2xl shadow-blue-100/60"
              loading="lazy"
            />
          </div>
        </section>

        {/* Módulos */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Tudo que a clínica precisa. Nada que atrapalhe.
              </h2>
              <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                Para clínicas e consultórios de qualquer especialidade que
                querem largar o papel sem complicação.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MODULOS.map((m) => (
                <div
                  key={m.titulo}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0169b2] text-white mb-4">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-950">{m.titulo}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prontuário em destaque */}
        <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
                O prontuário que conta a história do paciente.
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Cada evolução, exame anexado e documento fica registrado com
                data e profissional, numa linha do tempo única. Receitas e
                atestados saem com modelos prontos e impressão em papel
                timbrado — em segundos.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Histórico completo de todos os anos",
                  "Exames em foto ou PDF com acesso em um clique",
                  "Receita, atestado, laudo e solicitação de exame",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${AGENDAB_URL}/guia/prontuario.webp`}
              alt="Prontuário do AgendaB com linha do tempo de evoluções, exames e documentos"
              className="w-full rounded-2xl border border-slate-200 shadow-xl"
              loading="lazy"
            />
          </div>
        </section>

        {/* Preço */}
        <section id="assinar" className="bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <div className="rounded-3xl bg-white p-8 sm:p-10 text-center shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#0169b2]">
                Plano único
              </p>
              <div className="mt-4 flex items-end justify-center gap-1">
                <span className="text-xl font-bold text-slate-500 mb-2">R$</span>
                <span className="text-6xl font-black text-slate-950 tracking-tight">175</span>
                <span className="text-slate-500 mb-2">/mês</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Sem taxa de adesão. Sem fidelidade. Cancele quando quiser.
              </p>
              <ul className="mt-8 space-y-3 text-left">
                {INCLUSO.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex justify-center">
                <AssinarButton />
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Pagamento seguro via Stripe · acesso liberado na hora
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-slate-950 tracking-tight text-center mb-12">
              Perguntas frequentes
            </h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <details
                  key={f.p}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-6"
                >
                  <summary className="cursor-pointer list-none font-bold text-slate-900 flex items-center justify-between">
                    {f.p}
                    <span className="text-slate-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.r}</p>
                </details>
              ))}
            </div>
            <div className="mt-14 text-center">
              <p className="text-slate-600 mb-6">
                Pronto para organizar a sua clínica?
              </p>
              <div className="flex justify-center">
                <AssinarButton />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
