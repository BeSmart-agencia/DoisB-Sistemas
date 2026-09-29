-- =============================================================================
-- Chamado de suporte guarda para qual sistema é.
-- Rodar no Supabase → SQL Editor. (coluna simples, chamados antigos ficam NULL)
-- =============================================================================
ALTER TABLE chamados ADD COLUMN IF NOT EXISTS produto text;
