-- ============================================================
-- DoisB — Módulo Sob Medida (desenvolvimento de sistemas)
-- Execute no Supabase Dashboard → SQL Editor → New query.
-- Alimenta a tela /admin/sob-medida.
-- ============================================================

create table if not exists sob_medida_projetos (
  id uuid primary key default gen_random_uuid(),

  -- Vínculo com cliente (opcional): projeto pode ser de um cliente ZWeb
  -- existente OU de um cliente avulso (só sob medida). Guardamos um
  -- snapshot dos dados para a lista funcionar nos dois casos.
  cliente_id uuid references clientes(id) on delete set null,
  cliente_nome text not null,          -- empresa / nome
  cliente_doc text,                    -- CNPJ ou CPF
  cliente_email text,
  cliente_telefone text,

  -- Projeto
  nome_projeto text not null,
  descricao text,
  tipo_sistema text,                   -- 'web' | 'app' | 'integracao' | 'automacao' | 'outro'
  status text default 'proposta',      -- proposta | em_desenvolvimento | entregue | manutencao | cancelado
  responsavel text,                    -- 'Laisa' | 'Douglas' ...
  tecnologias text,
  repo_url text,
  deploy_url text,
  observacoes text,

  data_inicio date,
  previsao_entrega date,
  data_entrega date,

  -- Financeiro do desenvolvimento
  valor_desenvolvimento numeric default 0,
  valor_recebido numeric default 0,

  -- Mensalidade recorrente (cobrada automaticamente via Stripe)
  mensalidade_valor numeric default 0,
  mensalidade_dia int,                 -- dia do vencimento (1-28)
  mensalidade_inicio date,
  mensalidade_status text default 'inativa', -- inativa | pendente | ativa | pausada | cancelada
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_checkout_url text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists sob_medida_cliente_idx on sob_medida_projetos (cliente_id);
create index if not exists sob_medida_status_idx on sob_medida_projetos (status);
create index if not exists sob_medida_mensalidade_idx on sob_medida_projetos (mensalidade_status);
