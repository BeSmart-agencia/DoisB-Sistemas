-- ============================================================
-- DoisB — Planner de Metas (simulador + acompanhamento)
-- Execute no Supabase Dashboard → SQL Editor → New query.
-- Alimenta a tela /admin/metas (novo formato: premissas + progresso).
-- Seguro rodar de novo (idempotente).
--
-- Início do plano: AGOSTO/2026 (julho fica de fora — começamos em agosto).
-- ============================================================

-- ------------------------------------------------------------
-- 1) Premissas: linha única (id = 1) com as metas/parâmetros
--    que ambos os sócios editam e enxergam igual.
-- ------------------------------------------------------------
create table if not exists metas_premissas (
  id              int primary key default 1,
  zweb_vendedora  int     not null default 5,   -- ZWeb da vendedora externa / mês
  zweb_socios_m1  int     not null default 2,   -- ZWeb dos sócios no 1º mês (agosto)
  zweb_socios     int     not null default 10,  -- ZWeb dos sócios nos demais meses
  sob_medida_mes  int     not null default 1,   -- projetos sob medida entregues / mês
  mix_essencial   int     not null default 70,  -- % do mix de planos
  mix_standard    int     not null default 20,
  mix_premium     int     not null default 10,
  dev_sm          numeric not null default 2000, -- valor do projeto sob medida (dev)
  mens_sm         numeric not null default 350,  -- mensalidade sob medida (acumula)
  pro_labore_pct  int     not null default 70,   -- % do lucro que vira pró-labore
  outros_custos   numeric not null default 80,   -- imposto MEI (DAS) + outros / mês
  atualizado_em   timestamptz default now(),
  atualizado_por  text,
  constraint metas_premissas_single_row check (id = 1)
);

-- Semeia a linha única de premissas (só se ainda não existir).
insert into metas_premissas (id) values (1)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2) Realizado: quanto de cada meta já foi cumprido em cada mês.
--    metrica: 'zweb_vendedora' | 'zweb_socios' | 'sob_medida'
-- ------------------------------------------------------------
create table if not exists metas_realizado (
  id             uuid primary key default gen_random_uuid(),
  mes            date not null,           -- primeiro dia do mês (ex.: 2026-08-01)
  metrica        text not null,           -- ver acima
  valor          numeric not null default 0,
  atualizado_em  timestamptz default now(),
  atualizado_por text,
  created_at     timestamptz default now(),
  unique (mes, metrica)
);

create index if not exists metas_realizado_mes_idx on metas_realizado (mes);
