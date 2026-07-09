import { Separator } from "@/components/ui/separator"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

const NAV = [
  { label: "ZWeb", href: "/zweb" },
  { label: "Sistemas sob medida", href: "/sob-medida" },
  { label: "Planos ZWeb", href: "/zweb#planos" },
  { label: "Tutoriais", href: "/tutoriais" },
  { label: "Suporte", href: "/suporte" },
  { label: "Chat IA", href: "/chat-suporte" },
  { label: "Contato", href: "/contato" },
]

const LEGAL = [
  { label: "Termos de Uso", href: "/termos-de-uso" },
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "LGPD", href: "/lgpd" },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1: Marca */}
          <div className="space-y-5 lg:col-span-1">
            <a href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/doisb-color.png"
                alt="DoisB Sistemas"
                className="h-12 w-auto object-contain"
              />
            </a>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">revenda oficial</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/zweb-color.png"
                alt="ZWeb"
                className="h-5 w-auto object-contain"
              />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Tecnologia italiana.
              <br />
              Atendimento brasileiro.
            </p>
            <p className="font-mono text-xs text-slate-400 tracking-wide">
              &lt;Venda. Controle. Cresça.&gt;
            </p>
          </div>

          {/* Col 2: Navegação */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm">Navegação</h4>
            <ul className="space-y-2.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-slate-500 hover:text-blue-800 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-slate-500 hover:text-blue-800 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm">Contato</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a
                  href="mailto:contato@doisbsistemas.com.br"
                  className="hover:text-blue-800 transition-colors flex items-center gap-2"
                >
                  <span className="text-base">📧</span>
                  contato@doisbsistemas.com.br
                </a>
              </li>
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors flex items-center gap-2"
                >
                  <span className="text-base">💬</span>
                  (51) 99851-8895
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">📍</span>
                Rio Grande do Sul – Brasil
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(37,211,102,0.1)",
                border: "1px solid rgba(37,211,102,0.3)",
                color: "#16a34a",
              }}
            >
              <span className="text-sm">💬</span>
              Falar agora no WhatsApp
            </a>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} DoisB Sistemas. Todos os direitos reservados. Revenda autorizada Zucchetti.
          </p>
          <p className="text-xs text-slate-400">
            CNPJ: 54.052.940/0001-00
          </p>
        </div>
      </div>
    </footer>
  )
}
