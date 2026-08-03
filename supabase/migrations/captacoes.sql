-- ============================================================
-- DoisB — Captação de leads pelo vendedor (funil / CRM)
-- Execute no Supabase Dashboard → SQL Editor → New query.
-- Alimenta a aba "Captações" em /vendedor/<portal_token>.
--
-- IMPORTANTE: esta tabela é SÓ controle de funil, auto-declarado
-- pelo vendedor. Não tem relação com venda/comissão reais — essas
-- continuam saindo do pagamento confirmado (clientes / sob_medida_projetos).
--
-- Fluxo de status:
--   iniciada  -> (finaliza o questionário) -> finalizada  [automático]
--   depois o vendedor troca manual entre:
--     em_negociacao | venda_realizada | venda_negada
-- ============================================================

create table if not exists captacoes (
  id uuid primary key default gen_random_uuid(),

  vendedor_id uuid not null references vendedores(id) on delete cascade,

  -- Como o contato aconteceu
  tipo text not null check (tipo in ('fisica', 'online')),

  nome_cliente text not null,
  whatsapp text,

  -- Marcações do questionário (chaves definidas em lib/captacao.ts)
  respostas jsonb not null default '{}'::jsonb,

  -- Resultado do motor de recomendação (preenchido ao finalizar)
  plano_recomendado text
    check (plano_recomendado in
      ('essencial','standard','premium','zweb_sob_medida','sistema_sob_medida','indefinido')),
  motivo_recomendacao jsonb,  -- lista dos gatilhos que levaram à indicação

  status text not null default 'iniciada'
    check (status in
      ('iniciada','finalizada','em_negociacao','venda_realizada','venda_negada')),

  motivo_perda text,          -- só quando status = 'venda_negada'

  created_at timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists captacoes_vendedor_idx on captacoes (vendedor_id);
create index if not exists captacoes_status_idx on captacoes (status);
create index if not exists captacoes_created_idx on captacoes (created_at desc);
