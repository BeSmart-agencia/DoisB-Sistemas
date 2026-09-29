-- =============================================================================
-- Base de conhecimento e tutoriais por produto (chat de IA por produto)
-- Rodar no Supabase → SQL Editor.
-- =============================================================================

-- 1) Coluna `produto` nas tabelas do KB (registros atuais viram 'zweb').
ALTER TABLE documentos       ADD COLUMN IF NOT EXISTS produto text NOT NULL DEFAULT 'zweb';
ALTER TABLE documento_chunks ADD COLUMN IF NOT EXISTS produto text NOT NULL DEFAULT 'zweb';
ALTER TABLE tutoriais        ADD COLUMN IF NOT EXISTS produto text NOT NULL DEFAULT 'zweb';

CREATE INDEX IF NOT EXISTS documento_chunks_produto_idx ON documento_chunks (produto);
CREATE INDEX IF NOT EXISTS tutoriais_produto_idx        ON tutoriais (produto);

-- 2) match_documents com filtro opcional de produto.
DROP FUNCTION IF EXISTS match_documents(vector, float, int);
DROP FUNCTION IF EXISTS match_documents(vector, float, int, text);

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float default 0.5,
  match_count     int   default 5,
  filtro_produto  text  default null
)
returns table (
  id           uuid,
  documento_id uuid,
  conteudo     text,
  similarity   float
)
language sql stable
as $$
  select
    dc.id,
    dc.documento_id,
    dc.conteudo,
    1 - (dc.embedding <=> query_embedding) as similarity
  from documento_chunks dc
  where dc.embedding is not null
    and (filtro_produto is null or dc.produto = filtro_produto)
    and 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
