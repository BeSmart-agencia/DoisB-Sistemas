# DoisB Sistemas — Visão Geral Completa

> Documento-mestre sobre a empresa, produtos, modelo de negócio, tecnologia e operação.
> Última atualização: **23/11/2026**. Serve também como base de conhecimento para o Chat IA.

---

## 1. Quem é a DoisB

A **DoisB Sistemas** é uma **software house familiar** do **Rio Grande do Sul**. Une duas frentes: **desenvolve seus próprios sistemas** e é **revenda oficial** de plataformas consolidadas de gestão. A promessa é entregar *tecnologia de nível mundial com atendimento de vizinho* — de quem chama o cliente pelo nome.

- **Tagline:** `<Venda. Controle. Cresça.>` (sempre em fonte mono, com os sinais `< >` literais)
- **Site:** https://www.doisbsistemas.com.br
- **WhatsApp:** (51) 99262-2787
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

**Posicionamento:** acessível, "feito pra vender", **ativa na hora** (self-service, link de ativação, trial 5 dias). É o herói da marca e o produto de volume.

**Planos:**
| Plano | Mensal | Anual (−10%) | Trial | Inclui |
|---|---|---|---|---|
| **Essencial** | R$ 129,90 | R$ 1.402,92 | 5 dias | ERP fiscal completo (vendas, estoque, financeiro, fiscal, plataforma) |
| **Standard** | R$ 189,90 | R$ 2.050,92 | 5 dias | Tudo do Essencial **+ Módulo de Serviços + adicionais inclusos**: CRM, Food service, PDV Offline, Catálogo Digital, Delivery, Condicional de mercadorias, Transporte/MDF-e, WhatsApp, IA e agendamentos |

Prints reais do sistema em `public/produtos/doisb/` (recortados dos screenshots em `docs/Nova fase/NUTS/`).

### 3.2. ZWeb — varejo completo (revenda Zucchetti)
Sistema de gestão da **Zucchetti** (grupo italiano, ~700 mil clientes no mundo). Revenda **oficial** da DoisB.

- **Landing:** `/zweb`
- **Público:** varejo completo e exigente, com e-commerce. Público premium/nicho (não é o foco de volume).
- **Posicionamento:** premium, robusto, venda mais **consultiva** (ativação acompanhada). O Premium tem o diferencial do **app ZWeb** ("do orçamento à nota fiscal, no celular e na maquininha").
- **Destaques:** PDV com retaguarda **offline**, e-commerce, NF-e/NFC-e/NFS-e, estoque, financeiro, ordens de serviço, fiscal adequado à Reforma Tributária.
- **Planos:** Essencial R$ 199,90 · Standard R$ 249,90 · Premium R$ 299,90 (mensal).

### 3.3. GWeb — mini-mercados (revenda Gdoor) · ⚠️ oculto
White-label do **Gdoor** (Zucchetti) para o varejo alimentar pequeno. Versão simples, "o essencial bem feito". **Omitido das vitrines públicas** desde out/2026 (não vendido no momento, marcado `oculto: true` no catálogo) — a landing, o checkout e os dados de clientes GWeb continuam existindo.

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
| **DoisB Web** | Essencial | R$ 129,90 | R$ 1.402,92 (−10%) | 5 dias grátis |
| **DoisB Web** | Standard | R$ 189,90 | R$ 2.050,92 (−10%) | 5 dias grátis; adicionais inclusos |
| **ZWeb** | Essencial | R$ 199,90 | — | |
| **ZWeb** | Standard | R$ 249,90 | — | |
| **ZWeb** | Premium | R$ 299,90 | — | inclui app ZWeb |
| **GWeb** | único | R$ 159,90 | — | mini-mercados (oculto das vitrines) |
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
`/` (home) · `/produtos` · `/doisb-web` · `/zweb` · `/gweb` · `/sob-medida` · `/sobre` · `/cadastro` · `/tutoriais` · `/suporte` · `/chat-suporte` · `/contato` · `/calculadora-reforma` (lead magnet da Reforma Tributária)

---

## 9. Pagamentos (Stripe)

- Conta Stripe **LIVE** — **conta nova** (migrada em 16/11/2026; substituiu a antiga "BeSmart"). Produtos, preços e webhook recriados via `scripts/setup-stripe.js`.
- **Formas:** Cartão (assinatura recorrente), Boleto (acesso após compensação 1–3 dias), **PIX habilitado** em todos os produtos (QR mensal via cron `pix-billing`). No PIX não há trial; DoisB Web via PIX é self-service.
- ⚠️ **Webhook DEVE apontar para `www.doisbsistemas.com.br`** — o apex redireciona 307→www e o Stripe não segue redirect, então a entrega falha silenciosamente (o pagamento cai mas o cliente fica "aguardando").
- **CNPJ é único por produto** (`clientes`): o mesmo CNPJ pode assinar DoisB Web **e** ZWeb, mas não dois do mesmo produto.
- **Checkout:** `app/api/checkout/route.ts` (cartão/boleto) e `app/api/checkout/pix/route.ts` (PIX). Todos registram em `clientes`. **DoisB Web = self-service** (acesso automático + e-mail com link de ativação); **ZWeb/GWeb = ativação manual** pela equipe.
- **Webhook:** `app/api/webhooks/stripe/route.ts` (idempotência via `stripe_events`). O provisionamento do cliente DoisB Web no painel Nuts ainda é **manual** — passo a passo em `docs/CHECKLIST-ONBOARDING-DOISB-WEB.md`.

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
- **Dashboard** — métricas + "precisa da sua atenção" (ativações pendentes, PIX vencendo) + meta do mês vs. realizado.
- **Clientes**, **chamados/suporte**, **tutoriais**, **base de conhecimento (RAG)**, **chat IA**
- **Prospecção** — funil kanban como tela principal + busca Google Places. *(Leads inbound de marketing ficam em Marketing OS → Leads.)*
- **Vendedores** (comissões, portal)
- **Sob Medida** (projetos + mensalidade recorrente)
- **Metas e Finanças** — simulador/planejamento Ano 1 projetando **DoisB Web + ZWeb + sob medida** (o antigo "Financeiro" foi fundido aqui).
- **Marketing** (Marketing OS)

---

## 12. Estado atual e roadmap

### Já concluído
- **Reestruturação** (set/2026): 4 produtos com DoisB Web como carro-chefe, checkout multi-produto.
- **Pós-pagamento, Chat IA por produto e Tutoriais por produto** — as 3 fases planejadas foram entregues (ZWeb, GWeb e DoisB Web têm chat + tutoriais próprios).
- **Reposicionamento** (out/2026): DoisB Web acessível/volume × ZWeb premium/nicho; preços novos; GWeb oculto das vitrines.
- **Migração da conta Stripe** (16/11) + **PIX habilitado** (17/11) — testados em produção (todos os 9 combos de checkout com preço correto).
- **Calculadora da Reforma Tributária** (`/calculadora-reforma`, 19/11): lead magnet que estima CBS/IBS e capta o contato no funil (`marketing_leads` + SDR). Banner na home.
- **Limpeza do painel admin** (11/2026): Metas reorientado pro DoisB Web, Financeiro fundido no Metas, Prospecção (funil principal), dashboard acionável, rota órfã `/start` removida.
- **Resend** com remetente próprio `noreply@doisbsistemas.com.br` (envios funcionando).

### Primeiro cliente real
**Lena Modas** (Taquara/RS) — DoisB Web Standard via PIX, ativo. Serviu de base para o checklist de onboarding (`docs/CHECKLIST-ONBOARDING-DOISB-WEB.md`).

### Em aberto / avaliar
- **Provisionamento automático na Nuts** — o cadastro do cliente DoisB Web no painel Nuts hoje é **manual**; automatizar depende de a Nuts expor uma API (a confirmar). O padrão já existe no código (ver AgendaB).
- DoisB Web (Nuts): validar experiência do **cliente final** (não deve ver marca "Nuts"); definir responsável pelo onboarding fiscal.
- **Calculadora da reforma — fase 2 (cálculo oficial) descartada:** a API oficial da Receita calcula **por nota fiscal** (não por faturamento), então não encaixa num chamariz de massa. Mantida a estimativa própria, bem disclaimerizada.
- `.gitignore` para vídeos/planilhas pesadas em `docs/` (hoje travam commits que usam `git add -A`).

---

*Documento mantido pela DoisB. Para detalhes técnicos de cada módulo, ver os arquivos em `docs/` e o código em `lib/` e `app/`.*
