"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart, Package, Wallet, FileText, Wrench, BarChart3,
  X, Check, ArrowRight, MessageCircle,
} from "lucide-react"

const WA_LINK =
  "https://wa.me/5551998518895?text=Olá!%20Vim%20pelo%20site%20e%20quero%20conhecer%20o%20ZWeb"

type Item = { before: string; after: string }
type Category = { id: string; label: string; emoji: string; Icon: React.ElementType; items: Item[] }

const CATEGORIES: Category[] = [
  {
    id: "vendas", label: "Vendas e Atendimento", emoji: "🏪", Icon: ShoppingCart,
    items: [
      { before: "Internet cai e o caixa para de funcionar", after: "Vende offline e sincroniza tudo quando a internet volta" },
      { before: "Calculadora na mão pra somar troco e desconto", after: "PDV calcula tudo automaticamente, sem erro" },
      { before: "Maquininha de um lado, caderno do outro, dupla digitação", after: "Integração direta com Vero, Stone, PagSeguro, Cielo e Rede" },
      { before: "Fila no caixa porque o sistema travou", after: "PDV ágil e leve, otimizado pra vender rápido" },
      { before: "Vendedor não sabe o preço, precisa ir conferir", after: "Tabela de preços por cliente, região ou condição" },
      { before: "Cliente pede orçamento e você esquece de dar retorno", after: "Orçamentos salvos, com data de validade e conversão em pedido" },
    ],
  },
  {
    id: "estoque", label: "Estoque e Compras", emoji: "📦", Icon: Package,
    items: [
      { before: "Vende produto que não tem em estoque", after: "Controle de estoque em tempo real, com alerta de mínimo" },
      { before: "Compra repetida porque ninguém anotou", after: "Ordem de compra organizada e histórico de fornecedores" },
      { before: "Inventário só de 6 em 6 meses, com surpresa ruim", after: "Inventário contínuo, com ajuste automático após vendas" },
      { before: "Não sabe quanto custa cada produto pra cobrar certo", after: "Custo médio, última compra e margem calculados na hora" },
      { before: "Roupa e calçado vira bagunça, sem controle por tamanho ou cor", after: "Cadastro de grades — controle por variação de produto" },
    ],
  },
  {
    id: "financeiro", label: "Financeiro", emoji: "💰", Icon: Wallet,
    items: [
      { before: "Não sabe quanto entra nem quanto sai no mês", after: "Controle completo de contas a pagar e a receber" },
      { before: "Boleto manual, planilha de cobrança, atraso de cliente", after: "Boletos automáticos via banco Inter, Sicoob, Sicredi e Santander" },
      { before: "Cheque no caderninho, fiado sem controle", after: "Formas de pagamento cadastradas, com vencimento e juros" },
      { before: "Fluxo de caixa só na cabeça", after: "Plano de Contas e DRE em tempo real" },
      { before: "Esquece de pagar fornecedor e leva juros", after: "Alertas de vencimento + agenda financeira integrada" },
    ],
  },
  {
    id: "fiscal", label: "Fiscal e Legal", emoji: "📑", Icon: FileText,
    items: [
      { before: "Emite nota fiscal em site da prefeitura, lento e travado", after: "NF-e, NFC-e, NFS-e e MDF-e em poucos cliques" },
      { before: "Erro de tributação gera autuação", after: "CFOP, CST, NCM e benefícios fiscais configurados corretamente" },
      { before: "Contador pede arquivo SPED e você não sabe o que é", after: "SPED Fiscal e Sintegra gerados automaticamente" },
      { before: "Reforma tributária? Pânico.", after: "ZWeb já está adaptado pra todas as mudanças" },
      { before: "Devolução de mercadoria vira dor de cabeça", after: "Devolução de NF-e de venda e compra em poucos cliques" },
    ],
  },
  {
    id: "os", label: "Ordens de Serviço", emoji: "🛠️", Icon: Wrench,
    items: [
      { before: "OS em bloco de papel, ilegível, perdida", after: "OS digital com objeto, identificador, situação e prazo" },
      { before: "Cliente cobra garantia e ninguém lembra do prazo", after: "Controle automático de garantia por data" },
      { before: "OS aprovada não vira nota fiscal automaticamente", after: "OS converte em NF-e, NFC-e ou NFS-e com 1 clique" },
      { before: "Não sabe quanto demora pra entregar cada serviço", after: "Acompanhamento de etapas: aberta, em andamento, pronta, entregue" },
      { before: "Atendente do balcão precisa abrir o computador", after: "OS pelo celular ou maquininha com o AppsCloud" },
    ],
  },
  {
    id: "gestao", label: "Escala e Gestão", emoji: "🌐", Icon: BarChart3,
    items: [
      { before: "Não sabe quais produtos vendem mais", after: "Relatórios de vendas por produto, vendedor, período" },
      { before: "Funcionário vende com desconto sem autorização", after: "Permissões por usuário e controle de descontos" },
      { before: "Cada filial tem o seu jeito, nada padroniza", after: "Sistema único, mesmo padrão em todas as unidades" },
      { before: "E-commerce e loja física com estoques diferentes", after: "Integração com e-commerce e marketplaces (incluindo Mercado Livre)" },
      { before: "Crescimento sem controle vira caos", after: "Estrutura preparada pra escalar, do PDV ao multi-empresa" },
    ],
  },
]

export function Problemas() {
  const [active, setActive] = useState("vendas")
  const current = CATEGORIES.find((c) => c.id === active)!

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #060e1a 0%, #0a1628 100%)" }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "4rem 4rem" }} />
      </div>

      <div className="relative max-w-5xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "rgba(252,165,165,0.9)" }}
          >
            A diferença é gritante
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Veja como é o dia a dia{" "}
            <span style={{ color: "#1472B5" }}>com e sem o ZWeb</span>
          </h2>
          <p className="text-lg mt-3 max-w-xl mx-auto" style={{ color: "rgba(148,163,184,0.75)" }}>
            Clique em cada categoria e compare a realidade do varejista.
          </p>
        </motion.div>

        {/* ── Tab bar ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === active
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 focus:outline-none"
                style={
                  isActive
                    ? { background: "rgba(20,114,181,0.2)", border: "1px solid rgba(20,114,181,0.5)", color: "rgba(147,197,253,0.95)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(148,163,184,0.7)" }
                }
              >
                <span className="text-base">{cat.emoji}</span>
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
              </button>
            )
          })}
        </div>

        {/* ── Comparison table ── */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-2">
            <div
              className="flex items-center gap-2 px-5 py-3 border-r border-b"
              style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <X className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">Sem ZWeb</span>
            </div>
            <div
              className="flex items-center gap-2 px-5 py-3 border-b"
              style={{ background: "rgba(20,114,181,0.1)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Com ZWeb</span>
            </div>
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {current.items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2"
                  style={{ borderBottom: i < current.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  {/* Before */}
                  <div
                    className="flex items-start gap-3 px-5 py-4 sm:border-r border-b sm:border-b-0"
                    style={{
                      background: i % 2 === 0 ? "rgba(239,68,68,0.04)" : "transparent",
                      borderColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <X className="h-4 w-4 text-red-400/70 mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(203,213,225,0.7)" }}>{item.before}</p>
                  </div>
                  {/* After */}
                  <div
                    className="flex items-start gap-3 px-5 py-4"
                    style={{ background: i % 2 === 0 ? "rgba(20,114,181,0.07)" : "rgba(20,114,181,0.03)" }}
                  >
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed text-slate-200">{item.after}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Closing block ── */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center space-y-3"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            Sem o ZWeb, você{" "}
            <span style={{ color: "rgba(248,113,113,0.95)" }}>reage.</span>
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            Com o ZWeb, você{" "}
            <span style={{ color: "#1472B5" }}>comanda.</span>
          </p>
          <p className="text-base pt-1" style={{ color: "rgba(148,163,184,0.65)" }}>
            Mais de 700 mil empresas no mundo já decidiram. Agora é a sua vez.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href="#planos"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(145deg, #1472B5 0%, #0e3a6e 100%)", boxShadow: "0 8px 24px rgba(20,114,181,0.35)" }}
            >
              Ver planos <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "rgba(74,222,128,0.95)" }}
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
