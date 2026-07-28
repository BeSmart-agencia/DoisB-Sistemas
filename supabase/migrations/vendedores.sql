-- ============================================================
-- DoisB — Vendedores externos + atribuição de vendas / comissão
-- Execute no Supabase Dashboard → SQL Editor → New query.
-- Alimenta a tela /admin/vendedores.
--
-- Regra de comissão: 100% da PRIMEIRA mensalidade do plano vendido.
-- O valor é calculado no app a partir do plano (não é gravado aqui),
-- então uma eventual mudança de preço não reescreve o histórico —
-- a comissão fica registrada como "paga" e o valor mostrado é o do
-- plano na data da venda.
-- ============================================================

create table if not exists vendedores (
  id uuid primary key default gen_random_uuid(),

  nome text not null,
  email text,
  telefone text,
  chave_pix text,                 -- pra você pagar a comissão

  -- Código do link exclusivo: doisbsistemas.com.br/?v=<codigo>
  -- Sempre minúsculo, sem espaços/acentos (validado no app).
  codigo text not null unique,

  ativo boolean not null default true,
  observacoes text,

  created_at timestamptz default now()
);

create index if not exists vendedores_codigo_idx on vendedores (lower(codigo));
create index if not exists vendedores_ativo_idx on vendedores (ativo);

-- Atribuição da venda ao vendedor + controle de pagamento da comissão.
alter table clientes
  add column if not exists vendedor_id uuid references vendedores(id) on delete set null,
  add column if not exists comissao_paga boolean not null default false,
  add column if not exists comissao_paga_em timestamptz;

create index if not exists clientes_vendedor_idx on clientes (vendedor_id);
