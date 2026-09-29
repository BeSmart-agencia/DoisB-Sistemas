-- =============================================================================
-- GWeb no mesmo fluxo do ZWeb (tabela `clientes`)
-- Rodar no Supabase → SQL Editor.
-- =============================================================================
--
-- IMPORTANTE: se der erro de "ALTER TYPE ... ADD VALUE cannot run inside a
-- transaction block", rode as DUAS instruções SEPARADAS (uma de cada vez).

-- 1) Identifica o produto do cliente (zweb, gweb, doisb-web).
--    Clientes existentes viram 'zweb' automaticamente (default).
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS produto text NOT NULL DEFAULT 'zweb';

-- 2) Plano único do GWeb no enum de planos (o tipo se chama `plano_tipo`).
ALTER TYPE plano_tipo ADD VALUE IF NOT EXISTS 'unico';
