# DoisB Marketing OS — Especificação Técnica

Sistema interno multi-agente de marketing e vendas para a DoisB Sistemas (revenda ZWeb/Zucchetti).
Substitui a contratação de agência: estratégia, copy, anúncios, LPs de teste e qualificação de leads em um só lugar.

**Stack existente (reutilizar):** Next.js 14 (App Router), Supabase (Postgres + pgvector), Stripe, Resend, Vercel, Meta Pixel já instalado, RAG existente (embeddings OpenAI + respostas Claude) no chat de suporte.

**Onde vive:** área `/admin/marketing` dentro do app atual do doisbsistemas.com.br, protegida por auth do Supabase (role `admin`). Não é um app separado.

---

## 1. Conceito central

Seis agentes Claude, cada um com prompt de sistema especializado, operando sobre uma **memória compartilhada** no Supabase. Nenhum agente é um chatbot solto: todos leem o mesmo estado (brand kit, ICP, campanhas ativas, métricas, biblioteca de copies) e gravam suas saídas de volta como dados estruturados, não só texto.

```
┌─────────────────────────────────────────────────────┐
│                UI /admin/marketing                   │
│  Dashboard │ Chat com agentes │ Campanhas │ Copies  │
│  Calendário │ Leads (kanban) │ LPs/Experimentos     │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   Orquestrador (API)    │  /api/agents/[agent]
        │  monta contexto + tools │
        └────────────┬────────────┘
                     │ Anthropic API (claude-sonnet-4-6)
   ┌────────┬────────┼────────┬─────────┬────────┐
   │Estrateg│ Copy   │Tráfego │Tendênc. │ Social │ SDR
   └────┬───┴───┬────┴───┬────┴────┬────┴───┬────┴──┬──
        │       │        │         │        │       │
        ▼       ▼        ▼         ▼        ▼       ▼
┌─────────────────────────────────────────────────────┐
│              Supabase (memória compartilhada)        │
│ brand_kit │ icp │ campaigns │ ads │ ad_metrics      │
│ copy_library │ content_calendar │ leads │ lp_variants│
│ experiments │ agent_conversations │ zweb_kb (pgvector)│
└─────────────────────────────────────────────────────┘
        │                          │
        ▼                          ▼
  Meta Marketing API        Web Search (tool da
  (publicar campanhas,      API Anthropic, para o
  ler métricas)             agente de Tendências)
```

---

## 2. Os agentes

Todos usam a Anthropic API. Cada agente = prompt de sistema + conjunto de tools (function calling) + contexto injetado do Supabase. Um endpoint genérico `/api/agents/[agentId]` recebe a mensagem, monta o contexto e faz o loop de tool use.

### 2.1 Estrategista (orquestrador)
- **Papel:** CMO virtual. Define/revisa o plano mensal, funil, alocação do orçamento (R$1.000/mês), metas (16 clientes até o mês 3 conservador / 25 otimista). Gera relatório semanal automático lendo métricas reais das campanhas.
- **Contexto injetado:** brand_kit, icp, resumo de campaigns + ad_metrics dos últimos 30 dias, experiments ativos, pipeline de leads.
- **Tools:** `read_metrics`, `create_task`, `update_plan`, `delegate_to_agent` (enfileira pedido para outro agente).
- **Saída estruturada:** grava em `marketing_plans` (JSON com objetivos, alocação, hipóteses do mês).

### 2.2 Copywriter
- **Papel:** todas as copies — anúncios Meta/Google, headlines e seções de LP, e-mails (Resend), scripts de WhatsApp. Domina o tom da marca: "O sistema mundial. Com o atendimento do seu vizinho" / "Venda. Controle. Cresça." / estrutura antes-depois (Sem ZWeb vs. Com ZWeb) nas 6 categorias (Vendas, Estoque, Financeiro, Fiscal, OS, Gestão).
- **Contexto injetado:** brand_kit completo, ICP, copies com melhor performance (`copy_library` ordenada por CTR/conversão), **RAG da base de conhecimento ZWeb** (mesmos PDFs do suporte — argumentos técnicos reais: retaguarda offline, integração Vero/Stone/PagSeguro, boletos Inter/Sicredi/Sicoob/Santander, ZPOS, MDF-e, SPED, Reforma Tributária, e-commerce/Mercado Livre).
- **Tools:** `search_zweb_kb` (pgvector), `save_copy` (grava em copy_library com tags: canal, formato, ângulo, categoria), `get_top_copies`.
- **Regra de ouro no prompt:** toda copy nasce com 3 variações de ângulo (dor / prova / oferta) e hook nos primeiros 3s ou primeira linha.

### 2.3 Gestor de Tráfego
- **Papel:** estrutura campanhas (objetivo, conjuntos, segmentação 28–58 varejistas RS, orçamentos, dark posts), publica na Meta via API, gera arquivo de importação para Google Ads Editor, diagnostica métricas (CPM, CTR, CPL, frequência) e recomenda ajustes.
- **Contexto:** campanhas ativas + métricas 7/30 dias, copies aprovadas, plano do Estrategista.
- **Tools:** `meta_create_campaign`, `meta_create_adset`, `meta_create_ad` (dark post), `meta_get_insights`, `generate_google_ads_csv`, `pause_ad`.
- **Guardrail obrigatório:** o agente NUNCA publica nem altera orçamento sem aprovação explícita na UI. Fluxo: agente propõe → card de aprovação na UI → clique em "Aprovar e publicar" → aí sim a chamada à Meta API acontece. Toda ação fica logada em `campaign_actions`.

### 2.4 Analista de Tendências
- **Papel:** pesquisa o que está performando agora — formatos de Reels/TikTok para B2B local, criativos de concorrentes (Bling, Tiny, Omie, ContaAzul), sazonalidade do varejo (datas comerciais RS/BR), ganchos da Reforma Tributária. Alimenta Copywriter e Social com briefings.
- **Tools:** `web_search` (tool nativa da API Anthropic — ver seção 5), `save_trend_brief` (grava em `trend_briefs`).
- **Cadência:** roda 1x/semana via cron (Vercel Cron → endpoint) e gera briefing automático.

### 2.5 Social (conteúdo orgânico)
- **Papel:** mantém o calendário de 30 dias vivo dentro dos 5 pilares (dores do varejo, tutoriais rápidos, Reforma Tributária, bastidores, prova social). Gera SOMENTE roteiro + copy + hashtags + CTA — a Laisa grava/produz. Formatos já validados: "fake live lendo comentários" (TikTok), "5 sinais de que seu sistema está te atrasando" (Reel).
- **Tools:** `get_calendar`, `create_calendar_item`, `search_zweb_kb`, `get_trend_briefs`.
- **Saída:** itens em `content_calendar` com status (ideia → roteiro pronto → gravado → publicado).

### 2.6 SDR (qualificação e vendas)
- **Papel:** faz scoring de cada lead que entra (formulário do site, WhatsApp, anúncio), classifica por fit (segmento atendido pelo ZWeb: assistência técnica, vestuário/calçados, oficina, mercado, prestador, empório/padaria) e urgência, e gera o script de abordagem personalizado para o Abel mandar no WhatsApp.
- **Tools:** `score_lead`, `generate_whatsapp_script`, `update_lead_stage`, `search_zweb_kb` (para responder objeções técnicas com precisão).
- **Trigger:** webhook — lead novo no Supabase dispara o scoring automaticamente e envia notificação por e-mail (Resend) para o Abel com o script pronto.

---

## 3. Schema do banco (Supabase)

```sql
-- Identidade e estratégia
create table brand_kit (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,        -- 'tagline', 'tom_de_voz', 'cores', 'fontes', 'posicionamento', 'oferta_atual'
  value jsonb not null,
  updated_at timestamptz default now()
);

create table icp (
  id uuid primary key default gen_random_uuid(),
  nome text not null,              -- ex.: 'Dono de assistência técnica RS'
  segmento text not null,
  dores jsonb,                     -- array de dores
  objecoes jsonb,
  gatilhos jsonb,
  ativo boolean default true
);

create table marketing_plans (
  id uuid primary key default gen_random_uuid(),
  mes date not null,
  objetivos jsonb,
  alocacao_orcamento jsonb,        -- {"meta": 400, "google": 600}
  hipoteses jsonb,
  created_by text default 'estrategista',
  created_at timestamptz default now()
);

-- Copies e conteúdo
create table copy_library (
  id uuid primary key default gen_random_uuid(),
  canal text not null,             -- 'meta_ad' | 'google_ad' | 'lp' | 'email' | 'whatsapp' | 'organico'
  formato text,                    -- 'reel' | 'carrossel' | 'search_rsa' | 'headline' ...
  angulo text,                     -- 'dor' | 'prova' | 'oferta'
  categoria text,                  -- 'vendas' | 'estoque' | 'financeiro' | 'fiscal' | 'os' | 'gestao'
  titulo text,
  corpo text not null,
  status text default 'rascunho',  -- rascunho | aprovada | no_ar | arquivada
  performance jsonb,               -- preenchido depois com CTR/CPL do anúncio que a usou
  created_at timestamptz default now()
);

create table content_calendar (
  id uuid primary key default gen_random_uuid(),
  data_prevista date,
  pilar text not null,
  formato text,
  plataforma text,                 -- 'instagram' | 'tiktok'
  roteiro text,
  copy_legenda text,
  hashtags text,
  status text default 'ideia',     -- ideia | roteiro_pronto | gravado | publicado
  copy_id uuid references copy_library(id)
);

create table trend_briefs (
  id uuid primary key default gen_random_uuid(),
  semana date not null,
  resumo text,
  achados jsonb,                   -- [{tema, evidencia, recomendacao}]
  fontes jsonb,
  created_at timestamptz default now()
);

-- Campanhas e métricas
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  plataforma text not null,        -- 'meta' | 'google'
  external_id text,                -- id retornado pela Meta API
  nome text not null,
  objetivo text,                   -- 'mensagens_whatsapp' | 'conversoes_site'
  orcamento_diario numeric,
  status text default 'proposta',  -- proposta | aprovada | ativa | pausada | encerrada
  estrutura jsonb,                 -- adsets, segmentação, placements
  created_at timestamptz default now()
);

create table ads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id),
  external_id text,
  copy_id uuid references copy_library(id),
  criativo_url text,
  status text default 'proposta'
);

create table ad_metrics (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid references ads(id),
  data date not null,
  impressoes int, cliques int, gasto numeric,
  ctr numeric, cpm numeric, cpl numeric,
  leads int, conversas_whatsapp int, compras int,
  raw jsonb,
  unique (ad_id, data)
);

create table campaign_actions (      -- log de auditoria de tudo que os agentes propõem/executam
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  acao text not null,
  payload jsonb,
  status text default 'pendente',    -- pendente | aprovada | executada | rejeitada
  approved_at timestamptz,
  created_at timestamptz default now()
);

-- LPs e experimentos
create table lp_variants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,         -- /lp/[slug]
  hipotese text,
  config jsonb not null,             -- {headline, subhead, hero_cta, secoes[], oferta, cores?}
  peso int default 50,               -- % do tráfego no split
  status text default 'rascunho',
  copy_id uuid references copy_library(id)
);

create table experiments (
  id uuid primary key default gen_random_uuid(),
  nome text,
  variant_a uuid references lp_variants(id),
  variant_b uuid references lp_variants(id),
  metrica_alvo text default 'lead', -- 'lead' | 'compra'
  inicio date, fim date,
  vencedora uuid,
  resultado jsonb
);

-- Leads e pipeline do MARKETING (inbound: LPs, anúncios, WhatsApp, GMB).
-- ATENÇÃO: a tabela chama-se marketing_leads, NUNCA "leads" — já existe uma
-- tabela `leads` no banco que pertence à prospecção outbound via Google Places
-- (/admin/leads, /api/admin/leads, lead_interacoes). São features distintas.
-- Schema real criado por supabase/migrations/marketing_os_fix_v2.sql.
create table marketing_leads (
  id uuid primary key default gen_random_uuid(),
  nome text, telefone text, email text,
  empresa text, segmento text, cidade text,
  origem text,                       -- 'lp:slug' | 'meta_ad:id' | 'whatsapp' | 'gmb' | 'organico'
  linha text not null default 'zweb',-- 'zweb' | 'sob_medida'
  score int,                         -- 0-100, calculado pelo agente SDR
  score_motivo text,
  estagio text default 'novo',       -- novo | contatado | demo | proposta | fechado | perdido
  script_whatsapp text,              -- gerado pelo SDR para o Abel
  notas jsonb,
  created_at timestamptz default now()
);

-- Conversas com agentes (histórico por agente)
create table agent_conversations (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  messages jsonb not null default '[]',
  updated_at timestamptz default now()
);

-- Base de conhecimento ZWeb: reutilizar a tabela pgvector existente do chat de suporte.
```

---

## 4. Endpoints (App Router)

```
POST /api/agents/[agentId]        -- chat com agente (loop de tool use, streaming)
POST /api/agents/cron/weekly      -- Vercel Cron: Tendências roda briefing + Estrategista gera relatório semanal
POST /api/leads                   -- entrada de lead (form das LPs) → insert + trigger SDR
POST /api/meta/publish            -- executa campaign_action aprovada na Meta API
GET  /api/meta/sync-insights      -- Vercel Cron diário: puxa insights e grava em ad_metrics
POST /api/google/export           -- gera CSV p/ Google Ads Editor a partir de campaign proposta
GET  /lp/[slug]                   -- LP dinâmica renderizada a partir de lp_variants.config
middleware.ts                     -- split A/B por cookie nos experiments ativos
```

**Loop de agente (padrão para todos):**
1. Carrega prompt de sistema do agente + contexto (queries no Supabase conforme seção 2).
2. Chama `claude-sonnet-4-6` com `tools` do agente.
3. Se resposta contém `tool_use` → executa a função no servidor → devolve `tool_result` → repete até resposta final.
4. Persiste em `agent_conversations`. Saídas estruturadas vão para as tabelas próprias via tools, nunca só no texto.

---

## 5. Integrações externas

### Meta Marketing API (Fase 3)
- Criar app em developers.facebook.com → produto Marketing API → token de sistema com `ads_management`, `ads_read` vinculado ao Business Manager da DoisB.
- Endpoints usados: `POST /act_{ad_account_id}/campaigns`, `/adsets`, `/adcreatives` (dark post via `object_story_spec`), `/ads`, e `GET /{ad_id}/insights` para métricas.
- Env vars: `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_PAGE_ID`.
- Publicação SEMPRE via fluxo de aprovação (campaign_actions), nunca direto.

### Google Ads (Fase 3, via export; API só na Fase 5)
- A Google Ads API exige developer token com aprovação — burocracia e prazo. Não bloquear o projeto por isso.
- Solução: o Gestor de Tráfego gera CSV no formato do **Google Ads Editor** (campanhas Search com RSAs: 15 headlines / 4 descriptions por grupo, keywords por tema: "sistema para loja", "sistema pdv", "emissor nfce", "sistema para assistência técnica" etc.). Importação manual leva minutos.
- Fase 5 (opcional): pedir developer token e automatizar.

### Web search para o agente de Tendências
- Usar a tool nativa de web search da Anthropic API: `tools: [{"type": "web_search_20250305", "name": "web_search"}]`. Sem necessidade de SERP API paga.

### WhatsApp (notificação ao Abel)
- Fase 1–3: e-mail via Resend com o script pronto + link `wa.me/{telefone_lead}?text={script urlencoded}` — um clique e o Abel já está na conversa. Zero custo, zero API não-oficial.
- Fase 5 (opcional): Evolution API ou WhatsApp Cloud API se quiser automação real de envio.

---

## 6. LPs dinâmicas e experimentos

- `/lp/[slug]/page.tsx` renderiza a partir de `lp_variants.config` (JSON): headline, subhead, seções antes/depois nas 6 categorias, prova social, oferta (promo primeiro mês p/ CNPJ novo), form de lead.
- `middleware.ts`: para experiments ativos, sorteia variante conforme `peso`, grava cookie `lp_variant`, para consistência entre visitas.
- Pixel: `PageView` + `Lead` com `custom_data: {variant: slug}`; `Purchase` já existente no checkout permanece.
- O Copywriter cria variantes gravando direto em `lp_variants` (status rascunho) → aprovação na UI → status ativo → LP no ar **sem deploy**.

---

## 7. UI (/admin/marketing)

Manter a identidade DoisB (azul #1472B5, Bungee / Press Start 2P / JetBrains Mono, estética terminal retrô-futurista).

- **Dashboard:** gasto do mês vs. R$1.000, CPL por plataforma, leads por estágio, experimento ativo, últimas recomendações do Estrategista.
- **Agentes:** chat por agente (sidebar com os 6), com histórico. Respostas com ações estruturadas viram cards ("Salvar na biblioteca", "Aprovar campanha").
- **Campanhas:** lista + cards de aprovação pendente (campaign_actions) com diff claro do que será publicado.
- **Biblioteca de copies:** filtros por canal/ângulo/categoria/status; performance visível quando existir.
- **Calendário:** visão mensal do content_calendar com status.
- **Leads:** kanban por estágio; card mostra score, motivo e botão "Abrir WhatsApp com script".
- **LPs:** lista de variantes, preview, editor JSON do config, experimentos.

---

## 8. Fases de implementação (ordem para o Claude Code)

**Fase 1 — Fundação (comece aqui):**
Migrations do schema completo → seed do brand_kit e ICPs → endpoint genérico `/api/agents/[agentId]` com loop de tool use e streaming → UI de chat com os agentes → agentes Estrategista e Copywriter funcionando com contexto + RAG na base ZWeb existente.

**Fase 2 — Fábrica de copy + LPs:**
copy_library com UI → lp_variants + rota `/lp/[slug]` + middleware de split + Pixel por variante → agente Social + content_calendar com UI.

**Fase 3 — Tráfego:**
Integração Meta Marketing API (criar + insights) com fluxo de aprovação → cron diário de sync de métricas → export CSV Google Ads Editor → agente Gestor de Tráfego completo.

**Fase 4 — Inteligência:**
Agente de Tendências com web search + cron semanal → relatório semanal automático do Estrategista (lê ad_metrics, leads, experiments) enviado por e-mail via Resend → performance retroalimentando copy_library.

**Fase 5 — Opcional:**
Google Ads API oficial, WhatsApp Cloud API, scoring com histórico de conversão.

---

## 9. Regras de segurança dos agentes (incluir em todos os prompts de sistema)

1. Nenhuma ação com dinheiro (publicar, alterar orçamento, pausar campanha ativa) sem aprovação humana registrada em campaign_actions.
2. Nunca inventar funcionalidades do ZWeb — afirmações técnicas só com base no RAG da base de conhecimento; se não encontrar, dizer que precisa confirmar.
3. Copies sempre em pt-BR, respeitando o brand_kit; nunca prometer preço/condição fora da oferta vigente cadastrada.
4. Dados de leads são sensíveis: nunca incluir telefone/e-mail de leads em prompts de agentes que não precisam deles.

---

## 10. Custo estimado

- Anthropic API (Sonnet): uso diário realista de todos os agentes ≈ R$50–200/mês.
- Supabase/Vercel: dentro dos planos atuais.
- Meta/Google APIs: gratuitas (paga-se só a mídia, que já está no orçamento de R$1.000).

Total da "agência": ~R$100–200/mês de API vs. R$3.000–6.000/mês do fornecedor externo.
