-- ============================================================
-- GCLID (Google Click ID) no cadastro do cliente
-- Rodar no Supabase → SQL Editor. Idempotente.
--
-- Guarda o clique do anúncio do Google Ads (capturado em ?gclid= e salvo
-- em cookie) para enviar a conversão offline quando o pagamento for
-- CONFIRMADO no webhook — medindo venda real (inclui boleto/PIX).
-- ============================================================

alter table clientes add column if not exists gclid text;
