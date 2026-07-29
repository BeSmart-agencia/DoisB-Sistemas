-- ============================================================
-- DoisB — Portal do vendedor (acesso sem senha via token secreto)
-- Execute no Supabase Dashboard → SQL Editor → New query.
-- Alimenta /vendedor/<portal_token>.
--
-- portal_token é um segredo por vendedor, separado do "codigo" público
-- (o codigo aparece no link de venda /?v=codigo; o token não deve vazar,
-- é o que dá acesso ao portal com as vendas e comissões dele).
-- ============================================================

alter table vendedores
  add column if not exists portal_token uuid not null default gen_random_uuid();

create unique index if not exists vendedores_portal_token_idx on vendedores (portal_token);
