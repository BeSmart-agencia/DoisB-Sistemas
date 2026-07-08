-- ============================================================
-- DoisB Marketing OS — Schema (Fase 1)
-- Execute no Supabase Dashboard → SQL Editor → New query
-- Depois execute supabase/seed/marketing_os_seed.sql
--
-- Nota: a tabela de pipeline chama-se marketing_leads para não
-- conflitar com a tabela leads existente (prospecção Google Places).
-- ============================================================

-- ------------------------------------------------------------
-- Identidade e estratégia
-- ------------------------------------------------------------
create table if not exists brand_kit (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,        -- 'tagline', 'tom_de_voz', 'cores', 'fontes', 'posicionamento', 'oferta_atual'
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists icp (
  id uuid primary key default gen_random_uuid(),
  nome text not null,              -- ex.: 'Dono de assistência técnica RS'
  segmento text not null,
  dores jsonb,                     -- array de dores
  objecoes jsonb,
  gatilhos jsonb,
  ativo boolean default true
);

create table if not exists marketing_plans (
  id uuid primary key default gen_random_uuid(),
  mes date not null,
  objetivos jsonb,
  alocacao_orcamento jsonb,        -- {"meta": 400, "google": 600}
  hipoteses jsonb,
  created_by text default 'estrategista',
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Copies e conteúdo
-- ------------------------------------------------------------
create table if not exists copy_library (
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

create table if not exists content_calendar (
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

create table if not exists trend_briefs (
  id uuid primary key default gen_random_uuid(),
  semana date not null,
  resumo text,
  achados jsonb,                   -- [{tema, evidencia, recomendacao}]
  fontes jsonb,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Campanhas e métricas
-- ------------------------------------------------------------
create table if not exists campaigns (
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

create table if not exists ads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id),
  external_id text,
  copy_id uuid references copy_library(id),
  criativo_url text,
  status text default 'proposta'
);

create table if not exists ad_metrics (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid references ads(id),
  data date not null,
  impressoes int, cliques int, gasto numeric,
  ctr numeric, cpm numeric, cpl numeric,
  leads int, conversas_whatsapp int, compras int,
  raw jsonb,
  unique (ad_id, data)
);

-- Log de auditoria de tudo que os agentes propõem/executam
create table if not exists campaign_actions (
  id uuid primary key default gen_random_uuid(),
  agent text not null,
  acao text not null,
  payload jsonb,
  status text default 'pendente',    -- pendente | aprovada | executada | rejeitada
  approved_at timestamptz,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- LPs e experimentos
-- ------------------------------------------------------------
create table if not exists lp_variants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,         -- /lp/[slug]
  hipotese text,
  config jsonb not null,             -- {headline, subhead, hero_cta, secoes[], oferta, cores?}
  peso int default 50,               -- % do tráfego no split
  status text default 'rascunho',
  copy_id uuid references copy_library(id)
);

create table if not exists experiments (
  id uuid primary key default gen_random_uuid(),
  nome text,
  variant_a uuid references lp_variants(id),
  variant_b uuid references lp_variants(id),
  metrica_alvo text default 'lead',  -- 'lead' | 'compra'
  inicio date, fim date,
  vencedora uuid,
  resultado jsonb
);

-- ------------------------------------------------------------
-- Pipeline de leads do marketing (inbound)
-- Renomeada de "leads" (spec) para não conflitar com a tabela
-- leads existente de prospecção via Google Places.
-- ------------------------------------------------------------
create table if not exists marketing_leads (
  id uuid primary key default gen_random_uuid(),
  nome text, telefone text, email text,
  empresa text, segmento text, cidade text,
  origem text,                       -- 'lp:slug' | 'meta_ad:id' | 'whatsapp' | 'gmb' | 'organico'
  score int,                         -- 0-100, calculado pelo agente SDR
  score_motivo text,
  estagio text default 'novo',       -- novo | contatado | demo | proposta | fechado | perdido
  script_whatsapp text,              -- gerado pelo SDR para o Abel
  notas jsonb,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Conversas com agentes (uma conversa por agente)
-- ------------------------------------------------------------
create table if not exists agent_conversations (
  id uuid primary key default gen_random_uuid(),
  agent text unique not null,
  messages jsonb not null default '[]',
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------
create index if not exists copy_library_status_idx on copy_library (status, canal);
create index if not exists ad_metrics_data_idx on ad_metrics (data desc);
create index if not exists campaign_actions_status_idx on campaign_actions (status) where status = 'pendente';
create index if not exists marketing_leads_estagio_idx on marketing_leads (estagio);
create index if not exists trend_briefs_semana_idx on trend_briefs (semana desc);

-- Base de conhecimento ZWeb: reutiliza a tabela pgvector existente
-- (documento_chunks + função match_documents, já criadas em rag_chat.sql).
