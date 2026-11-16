-- =============================================================================
-- CNPJ único POR PRODUTO (antes era único global)
-- Rodar no Supabase → SQL Editor.
-- =============================================================================
--
-- O checkout verifica duplicidade por (cnpj, produto) — um cliente DoisB Web
-- deve poder assinar também o ZWeb com o mesmo CNPJ. A constraint antiga de
-- cnpj único global fazia o insert do segundo produto falhar com 500.

ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_cnpj_key;

ALTER TABLE clientes ADD CONSTRAINT clientes_cnpj_produto_key UNIQUE (cnpj, produto);
