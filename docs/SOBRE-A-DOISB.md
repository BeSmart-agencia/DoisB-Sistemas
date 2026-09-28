# DoisB Sistemas — Visão Geral Completa

> Documento-mestre sobre a empresa, produtos, modelo de negócio, tecnologia e operação.
> Última atualização: **28/09/2026**. Serve também como base de conhecimento para o Chat IA.

---

## 1. Quem é a DoisB

A **DoisB Sistemas** é uma **software house familiar** do **Rio Grande do Sul**. Une duas frentes: **desenvolve seus próprios sistemas** e é **revenda oficial** de plataformas consolidadas de gestão. A promessa é entregar *tecnologia de nível mundial com atendimento de vizinho* — de quem chama o cliente pelo nome.

- **Tagline:** `<Venda. Controle. Cresça.>` (sempre em fonte mono, com os sinais `< >` literais)
- **Site:** https://www.doisbsistemas.com.br
- **Base:** Rio Grande do Sul — atende o Brasil todo (com visita presencial na região)
- **CNPJ:** 54.052.940/0001-00

### Sócios
- **Laisa Barth** — desenvolvimento, marketing e operação técnica.
- **Abel Barth** — prospecção e relacionamento.
- Pai e filha, **sócios em partes iguais**. "Dois B" = Dois Barth.

### Cultura / valores
- **Empresa familiar** — o nome da empresa é o sobrenome dos donos.
- **Honestidade técnica** — sistema pronto quando serve; sob medida quando não.
- **Quem atende, resolve** — sem fila de chamado: quem configura o sistema é quem atende depois.
- **Compromisso de longo prazo** — cresce junto com o cliente.

---

## 2. Identidade visual

- **Cor primária da marca:** `#1472B5` (azul do logo). **Não** usar `#1E40AF`.
- **Cor do carro-chefe (DoisB Web):** **verde/emerald** (destaque do produto principal).
- Preto `#000000`, Branco `#FFFFFF`.
- **Logos** em `public/logos/`: `doisb-color.png`, `doisb-blue.png`, `doisb-black.png`, `zweb-color.png`, `zweb-branco.png`.
- **Fontes:** "DOISB" sans bold arredondada; "<SISTEMAS>" pixel/monospace; tagline em Geist Mono.

---

## 3. Portfólio de produtos

A DoisB trabalha com **o sistema certo para cada negócio**. Catálogo central no código em `lib/planos.ts` (`PRODUTOS`).

### 3.1. DoisB Web — 🟢 carro-chefe (ERP completo)
Sistema **próprio** da DoisB (white-label do ERP da **Nuts** — ver §4). É o produto de destaque, apresentado em verde.

- **Landing:** `/doisb-web`
- **Público:** quem quer um sistema completo (varejo, serviços, food, multiempresa)
- **Módulos:** Vendas e faturamento (NF-e, NFC-e, pré-venda, orçamentos, pedidos, terminais), Estoque e produção (lotes, validade, variações, kits, inventário, ordem de produção), Financeiro (caixa, contas a pagar/receber, DRE, conciliação bancária OFX, conta digital, Pix/boleto/links), Fiscal e contábil (SPED, Sintegra, perfis tributários, envio à contabilidade), Serviços/OS (NFS-e, contratos, técnicos), **Food service** (salão, mesas, comandas, cozinha, cardápio digital, self-pedido), **CRM** (funil de oportunidades, automações), **Catálogo digital** (vitrine online), **Multiempresa**, etiquetas configuráveis, integração com balanças, dashboard com indicadores.

**Planos:**
| Plano | Mensal | Anual (−10%) | Trial | Inclui |
|---|---|---|---|---|
| **Essencial** | R$ 149,90 | R$ 1.618,92 | 5 dias | ERP fiscal completo (vendas, estoque, financeiro, fiscal, plataforma) |
| **Standard** | R$ 249,90 | R$ 2.698,92 | 5 dias | Tudo do Essencial **+ Módulo de Serviços + adicionais inclusos**: CRM, Food service, PDV Offline, Catálogo Digital, Delivery, Condicional de mercadorias, Transporte/MDF-e, WhatsApp, IA e agendamentos |

Prints reais do sistema em `public/produtos/doisb/` (recortados dos screenshots em `docs/Nova fase/NUTS/`).

### 3.2. ZWeb — varejo completo (revenda Zucchetti)
Sistema de gestão da **Zucchetti** (grupo italiano, ~700 mil clientes no mundo). Revenda **oficial** da DoisB.

- **Landing:** `/zweb`
- **Público:** varejo completo, com e-commerce
- **Destaques:** PDV com retaguarda **offline**, e-commerce, NF-e/NFC-e/NFS-e, estoque, financeiro, ordens de serviço, fiscal adequado à Reforma Tributária.
- **Planos:** Essencial R$ 129,90 · Standard R$ 199,90 · Premium R$ 249,90 (mensal).

### 3.3. GWeb — mini-mercados (revenda Gdoor)
White-label do **Gdoor** (Zucchetti) para o varejo alimentar pequeno. Versão simples, "o essencial bem feito".

- **Landing:** `/gweb`
- **Público:** mini-mercados, mercearias, hortifrúti, padarias
- **Foco (3 diferenciais):** emissão de **NF-e/NFC-e**, **PDV que funciona offline**, **etiquetas** de gôndola/produto. Sem e-commerce, sem complexidade.
- **Plano único:** R$ 159,90/mês.

### 3.4. Sistema Sob Medida — desenvolvimento personalizado
Desenvolvimento de um sistema **(não fiscal)** feito sob medida para otimizar o processo específico da empresa.

- **Landing:** `/sob-medida` (não é assinável — CTA leva ao contato/diagnóstico)
- **Público:** processos que sistema pronto não resolve (planilha, papel, WhatsApp)
- **Modelo comercial (decidido):** piso **R$ 3.000**, faixa **R$ 3–7 mil**, pagamento **40/30/30**, manutenção **R$ 450/mês** (mín. 12 meses), diagnóstico de **20 min grátis**.

### 3.5. AgendaB — gestão para clínicas (produto próprio)
Sistema próprio para clínicas/consultórios (agenda, pacientes, prontuário eletrônico, financeiro). Cobrado via Stripe.

- **Preço:** R$ 249/mês (até 5 usuários, sem fidelidade).
- **Status:** existe (`/agendab`) mas **saiu do menu principal** na reestruturação de set/2026. Não foi removido (pode ter assinantes ativos).

---

## 4. Modelo de negócio e parcerias

A DoisB combina **produto próprio + revenda white-label**:

| Fornecedor | Produto DoisB | Relação |
|---|---|---|
| **Nuts** | DoisB Web | White-label (motor Nuts, marca DoisB). ≠ ZWeb. |
| **Zucchetti** | ZWeb | Revenda oficial |
| **Gdoor** (Zucchetti) | GWeb | White-label |
| — | AgendaB / Sob Medida | Desenvolvimento próprio |

### Detalhes da revenda Nuts (DoisB Web)
- Conta de **revenda** (CNPJ DoisB) no painel Nuts, plano **R$ 1.199,90 válido até 15/09/2027**. Suporte Nuts: (49) 3550-0600.
- **36 licenças** disponíveis (acesso base dos clientes) + **saldo de apps R$ 11.000** (carteira pré-paga para módulos extras, creditado de cortesia).
- Sistema do cliente roda em `sistema.doisbsistemas.com.br`. Versão 2026.8.x, atualizações semanais.
- **Gargalo conhecido:** onboarding fiscal do cliente (certificado digital, emitente, tributação) — definir se DoisB ou Nuts configura por cliente.
- Análise completa em `docs/Nova fase/NUTS/ANALISE-SISTEMA-WHITELABEL.md`.

---

## 5. Preços consolidados

| Produto | Plano | Mensal | Anual | Observação |
|---|---|---|---|---|
| **DoisB Web** | Essencial | R$ 149,90 | R$ 1.618,92 (−10%) | 5 dias grátis |
| **DoisB Web** | Standard | R$ 249,90 | R$ 2.698,92 (−10%) | 5 dias grátis; adicionais inclusos |
| **ZWeb** | Essencial | R$ 129,90 | — | |
| **ZWeb** | Standard | R$ 199,90 | — | |
| **ZWeb** | Premium | R$ 249,90 | — | |
| **GWeb** | único | R$ 159,90 | — | mini-mercados |
| **AgendaB** | único | R$ 249,00 | — | clínicas, até 5 usuários |
| **Sob Medida** | projeto | R$ 3–7 mil + R$ 450/mês | — | 40/30/30 |

---

## 6. Vendas e vendedores

- **Vendedores externos** (`/admin/vendedores`): cada um tem um **código** → link exclusivo `doisbsistemas.com.br/?v=<codigo>`. Atribuição via cookie `vend_ref` (30 dias) gravado no checkout (`clientes.vendedor_id`).
- **Comissão = 100% da 1ª mensalidade** do plano vendido (base de preços em `lib/planos.ts`). Vira comissão quando o pagamento é confirmado no webhook. Controle de paga/a receber em `clientes.comissao_paga`.
- **Portal do vendedor** (`/vendedor/<portal_token>`, sem senha): vendas dele + comissões + **roteiros de venda** (WhatsApp × presencial), **captações (CRM/funil interno)** e **treinamentos**.
- **Técnicas de venda** aplicadas: Framework **3A** de reenquadramento, **vetores de valor** (mais rápido/menos arriscado/mais fácil) — fontes em `docs/Vendas/*.md`, código em `lib/roteiros.ts`, `lib/treinamentos.ts`, `lib/captacao.ts`.

---

## 7. Marketing OS

Sistema **multi-agente** (Claude `claude-sonnet-5`) em `/admin/marketing` para operar o marketing da empresa.

- **Agentes ativos:** Estrategista, Copywriter, SDR, Social, Tendências. **Falta:** Tráfego (depende de Meta/Google Ads API).
- **SDR automático:** todo lead do formulário dispara roteamento de linha, pontuação, script e e-mail interno com link `wa.me` pronto.
- **Cron semanal** (segunda 06:00 BRT): Tendências pesquisa a web → Estrategista gera relatório semanal.
- **Telas:** chat de marketing, `/leads` (pipeline), `/copies`, `/calendario`, `/briefings`.
- **Duas tabelas de leads distintas:** `marketing_leads` (inbound do OS) ≠ `leads` (prospecção outbound via Google Places).

---

## 8. Site e stack técnico

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind + componentes próprios + framer-motion
- **Backend/dados:** Supabase (Postgres + RLS)
- **Pagamentos:** Stripe (LIVE)
- **E-mail transacional:** Resend
- **IA:** Anthropic Claude (chat/suporte + Marketing OS); OpenAI para embeddings (pgvector/RAG)
- **APIs externas:** Google Places (captação de leads), IBGE (autocomplete de cidades), Meta Pixel + Conversions API
- **Estrutura do site:** grupo de rotas `app/(site)` (público) e `app/(admin)` (operacional)

### Menu público (set/2026)
Home · Sobre nós · Produtos · Chat IA · Tutoriais · Suporte

### Páginas-chave
`/` (home) · `/produtos` · `/doisb-web` · `/zweb` · `/gweb` · `/sob-medida` · `/sobre` · `/cadastro` · `/tutoriais` · `/suporte` · `/chat-suporte` · `/contato`

---

## 9. Pagamentos (Stripe)

- Conta Stripe **LIVE**: "BeSmart Agência de Ideias" (cobranças reais).
- **Formas:** Cartão (assinatura recorrente), Boleto (acesso após compensação 1–3 dias), PIX (mensal via cron — habilitado conforme histórico da conta).
- **Checkout:** `app/api/checkout/route.ts`. Aceita `produto` + `plano` + `intervalo`. DoisB Web e GWeb usam um branch genérico (customer + subscription session + metadata); DoisB Web aplica **trial de 5 dias**. Fluxo ZWeb permanece com registro em `clientes`, comissão e promoções.
- **Webhook:** `app/api/webhooks/stripe/route.ts` (idempotência via `stripe_events`).
- **Price IDs (DoisB Web / GWeb) criados em 28/09/2026** e cadastrados no `.env.local` e na Vercel.
- **Provisionamento pós-pagamento** (ativação/liberação de acesso dos produtos novos): **próxima fase** (ver §12).

---

## 10. Infraestrutura

### Domínio — `doisbsistemas.com.br` (Registro.br, DNSSEC)
| Registro | Tipo | Aponta para | Onde |
|---|---|---|---|
| `@` (raiz) | A | `76.76.21.21` | Vercel (site) |
| `www` | CNAME | `cname.vercel-dns.com` | Vercel (site) |
| `sistema` | A | `200.125.129.60` | Servidor do white-label (DoisB Web / Nuts) |

### Deploy — Vercel
- Projeto correto: **`dois-b-sistemas`** (org `be-smart-agencia`). *(Existe um `doisb-sistemas` criado por engano — pode ser deletado.)*
- **Framework Preset: Next.js** (crítico — "Other" quebra tudo com 404).
- Branch de produção: **`main`** → push dispara deploy automático.
- Repo GitHub: `BeSmart-agencia/DoisB-Sistemas`.

### E-mail do domínio — Zoho Mail
- Caixas humanas `@doisbsistemas.com.br` no **Zoho Mail** (painel `mailadmin.zoho.com`). SMTP `smtp.zoho.com` (465/587).
- E-mail transacional do sistema sai pelo **Resend** (não pelo Zoho).

### Banco — Supabase
- Projeto: `xpxwcocnizdklnaegdvq.supabase.co`. RLS ativo.
- Tabelas principais: `clientes`, `stripe_events`, `leads`/`lead_interacoes`, `marketing_leads`, `sob_medida_projetos`, `captacoes`, `vendedores`, `metas_checklist`.

---

## 11. Admin / operação

Painel em `app/(admin)/admin/`:
- **Clientes**, **chamados/suporte**, **tutoriais**, **documentos (RAG)**, **chat IA**
- **Leads** (captação Google Places + funil kanban)
- **Vendedores** (comissões, portal)
- **Sob Medida** (projetos + mensalidade recorrente)
- **Metas** (Metas Ano 1 + checklist Laisa/Abel)
- **Marketing** (Marketing OS)

---

## 12. Estado atual e roadmap

### Reestruturação concluída (28/09/2026)
Site reorganizado em **4 produtos** com **DoisB Web como carro-chefe** (verde): menu novo, home, `/produtos`, landings `/doisb-web` e `/gweb`, página `/sobre`, catálogo em `lib/planos.ts`, Stripe configurado, checkout multi-produto. Publicado no `main`.

### Próximas fases (ordem definida pela DoisB)
1. **Pós-pagamento das licenças** — o que acontece após o pagamento no Stripe (provisionamento/ativação do acesso do cliente, integração com o painel Nuts/Gdoor).
2. **Chat IA por produto** — atualizar o assistente para responder por produto.
3. **Tutoriais por produto** — organizar tutoriais por sistema.

### Pendências históricas a verificar (podem já estar resolvidas)
- Migrations a confirmar no Supabase: `sob_medida.sql`, `metas_checklist.sql`, `vendedores_portal.sql`, `vendedores_agendab.sql`.
- Bug relatado (mai/2026): `POST /api/admin/leads` retornando 500 — confirmar se persiste.
- Resend: migrar `FROM` de `onboarding@resend.dev` para `noreply@doisbsistemas.com.br` quando o domínio verificar.
- DoisB Web (Nuts): validar experiência do **cliente final** (não deve ver marca "Nuts"); definir responsável pelo onboarding fiscal.

---

*Documento mantido pela DoisB. Para detalhes técnicos de cada módulo, ver os arquivos em `docs/` e o código em `lib/` e `app/`.*
