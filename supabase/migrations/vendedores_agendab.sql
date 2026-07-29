-- ============================================================
-- DoisB — Atribuição de vendas do AgendaB a vendedores + comissão
-- Execute no Supabase Dashboard → SQL Editor → New query.
--
-- Vendas do AgendaB viram uma linha em sob_medida_projetos (criada pelo
-- webhook do Stripe). Aqui adicionamos a atribuição ao vendedor e o
-- controle de comissão, no mesmo padrão da tabela clientes (ZWeb).
-- Comissão do AgendaB = 100% da 1ª mensalidade (mensalidade_valor, R$175).
-- ============================================================

alter table sob_medida_projetos
  add column if not exists vendedor_id uuid references vendedores(id) on delete set null,
  add column if not exists comissao_paga boolean not null default false,
  add column if not exists comissao_paga_em timestamptz;

create index if not exists sob_medida_vendedor_idx on sob_medida_projetos (vendedor_id);
