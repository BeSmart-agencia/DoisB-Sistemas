-- ============================================================
-- DoisB Marketing OS — Correção pós marketing_os_full_v2.sql
-- Execute no Supabase Dashboard → SQL Editor → New query
-- Idempotente: pode re-rodar sem risco.
--
-- Contexto: o consolidado v2 usava "create table if not exists leads",
-- mas a tabela leads JÁ EXISTIA (prospecção via Google Places, usada
-- pelo /admin/leads) — então a tabela do pipeline de marketing nunca
-- foi criada. O código usa o nome marketing_leads exatamente para não
-- colidir com essa tabela. Este script cria o que faltou:
--
--   1. marketing_leads (pipeline inbound do Marketing OS, com linha)
--   2. lp_variants.linha (faltou no consolidado)
--   3. unique(agent) em agent_conversations — SEM isso o upsert do
--      chat dos agentes falha e o histórico não é salvo (bug ativo)
-- ============================================================

-- 1. Pipeline de leads do marketing (inbound: LPs, anúncios, WhatsApp)
create table if not exists marketing_leads (
  id uuid primary key default gen_random_uuid(),
  nome text, telefone text, email text,
  empresa text, segmento text, cidade text,
  origem text,                       -- 'lp:sob-medida' | 'meta_ad:id' | 'whatsapp' | 'gmb' | 'organico'
  linha text not null default 'zweb',-- 'zweb' | 'sob_medida'
  score int,                         -- 0-100, calculado pelo agente SDR
  score_motivo text,
  estagio text default 'novo',       -- novo | contatado | demo | proposta | fechado | perdido
  script_whatsapp text,              -- gerado pelo SDR para o Abel
  notas jsonb,
  created_at timestamptz default now()
);

create index if not exists marketing_leads_linha_idx on marketing_leads (linha, estagio);
create index if not exists marketing_leads_estagio_idx on marketing_leads (estagio);

-- 2. Linha nas LPs (faltou no consolidado)
alter table lp_variants add column if not exists linha text not null default 'zweb';

-- 3. Unicidade por agente nas conversas (necessária para o upsert do chat)
--    A tabela está vazia hoje; o dedupe abaixo é só proteção caso re-rode
--    depois de já haver dados duplicados.
delete from agent_conversations a
  using agent_conversations b
  where a.agent = b.agent and a.updated_at < b.updated_at;

create unique index if not exists agent_conversations_agent_key
  on agent_conversations (agent);

-- 4. Índice de copies por linha (caso o consolidado não tenha criado)
create index if not exists copy_library_linha_idx on copy_library (linha, status);
