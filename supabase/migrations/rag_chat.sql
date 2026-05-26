-- ============================================================
-- RAG Chat — Assistente DoisB
-- Execute no Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Habilitar pgvector
create extension if not exists vector;

-- 2. Recriar tabelas do zero (drop seguro)
drop table if exists conversas_ia cascade;
drop table if exists documento_chunks cascade;

-- 3. Chunks dos documentos com embeddings
create table documento_chunks (
  id           uuid primary key default gen_random_uuid(),
  documento_id uuid not null references documentos(id) on delete cascade,
  conteudo     text not null,
  chunk_index  int not null,
  embedding    vector(1536),
  criado_em    timestamptz not null default now(),
  unique (documento_id, chunk_index)
);

-- 4. Conversas com o assistente IA
create table conversas_ia (
  id           uuid primary key default gen_random_uuid(),
  sessao_id    text not null,
  pergunta     text not null,
  resposta     text not null,
  chunks_ids   uuid[] not null default '{}',
  sem_resposta boolean not null default false,
  criado_em    timestamptz not null default now()
);

-- 5. Índices
create index conversas_ia_data_idx
  on conversas_ia (criado_em desc);

create index conversas_ia_sem_resp_idx
  on conversas_ia (sem_resposta)
  where sem_resposta = true;

-- Nota: o índice ivfflat precisa de dados para ser criado eficientemente.
-- Rode este comando APÓS executar "npm run ingest":
--
-- create index documento_chunks_embedding_idx
--   on documento_chunks
--   using ivfflat (embedding vector_cosine_ops)
--   with (lists = 100);

-- 6. Função de busca por similaridade cosine
drop function if exists match_documents(vector, float, int);

create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float default 0.5,
  match_count     int    default 5
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
    and 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
