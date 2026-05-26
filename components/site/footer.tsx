import { Separator } from "@/components/ui/separator"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Marca */}
          <div className="space-y-4 lg:col-span-1">
            <div className="font-bold text-xl text-blue-800">
              DoisB{" "}
              <span className="font-mono text-slate-400 text-sm font-normal">
                &lt;Sistemas&gt;
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Revenda autorizada Zucchetti.
              <br />
              Tecnologia italiana. Atendimento brasileiro.
            </p>
            <p className="font-mono text-xs text-slate-400 tracking-wide">
              &lt;Venda. Controle. Cresça.&gt;
            </p>
          </div>

          {/* Col 2: Navegação */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm">Navegação</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Planos", href: "#planos" },
                { label: "Tutoriais", href: "/tutoriais" },
                { label: "Suporte", href: "/suporte" },
                { label: "Chat IA", href: "/chat-suporte" },
                { label: "Contato", href: "/contato" },
                { label: "Sobre nós", href: "/sobre" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-slate-500 hover:text-blue-800 transition-colors"
                  >
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
              {[
                { label: "Termos de Uso", href: "/termos-de-uso" },
                { label: "Política de Privacidade", href: "/politica-de-privacidade" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-slate-500 hover:text-blue-800 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 text-sm">Contato</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <a
                  href="mailto:contato@doisbsistemas.com.br"
                  className="hover:text-blue-800 transition-colors flex items-center gap-2"
                >
                  📧 contato@doisbsistemas.com.br
                </a>
              </li>
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors flex items-center gap-2"
                >
                  💬 WhatsApp: (51) 99851-8895
                </a>
              </li>
              <li className="flex items-center gap-2">📍 Rio Grande do Sul – Brasil</li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} DoisB Sistemas. Todos os direitos reservados. Revenda
          autorizada Zucchetti.
        </p>
      </div>
    </footer>
  )
}
