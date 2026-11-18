-- ============================================================
-- Metas — adiciona o DoisB Web ao planejamento (carro-chefe)
-- Execute no Supabase Dashboard → SQL Editor. Idempotente.
--
-- O planner passa a projetar DOIS produtos: DoisB Web (volume) e
-- ZWeb (nicho). As colunas zweb_* / mix_* existentes continuam sendo
-- do ZWeb; abaixo entram as do DoisB Web.
--
-- Custo do DoisB Web = FIXO mensal (pacote de licenças da Nuts),
-- não por cliente. Editável na tela.
-- ============================================================

alter table metas_premissas
  add column if not exists doisb_vendedora   int     not null default 8,    -- DoisB Web da vendedora / mês (carro-chefe = volume)
  add column if not exists doisb_socios_m1   int     not null default 3,    -- DoisB Web dos sócios no 1º mês
  add column if not exists doisb_socios      int     not null default 12,   -- DoisB Web dos sócios nos demais meses
  add column if not exists doisb_mix_essencial int   not null default 60,   -- % do mix DoisB Web
  add column if not exists doisb_mix_standard  int   not null default 40,
  add column if not exists doisb_custo_fixo  numeric not null default 1199.90; -- custo fixo mensal da plataforma (Nuts)
