-- ============================================================
-- DoisB Marketing OS — Duas linhas de negócio (zweb | sob_medida)
-- Execute no Supabase Dashboard → SQL Editor → New query
-- (após marketing_os_schema.sql; idempotente, pode re-rodar)
--
-- Regra inviolável 7 dos agentes: toda copy, campanha, item de
-- calendário, LP e lead pertence a UMA linha.
-- ============================================================

alter table copy_library     add column if not exists linha text not null default 'zweb';
alter table campaigns        add column if not exists linha text not null default 'zweb';
alter table content_calendar add column if not exists linha text not null default 'zweb';
alter table marketing_leads  add column if not exists linha text not null default 'zweb';
alter table lp_variants      add column if not exists linha text not null default 'zweb';

-- Índice para o kanban/filtros por linha
create index if not exists marketing_leads_linha_idx on marketing_leads (linha, estagio);
create index if not exists copy_library_linha_idx on copy_library (linha, status);
