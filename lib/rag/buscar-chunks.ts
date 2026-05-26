import OpenAI from 'openai'
import { createAdminClient } from '@/lib/supabase/admin'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface Chunk {
  id: string
  documento_id: string
  conteudo: string
  similarity: number
}

export async function buscarChunksRelevantes(
  pergunta: string,
  limite = 5
): Promise<Chunk[]> {
  const embeddingRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: pergunta,
    dimensions: 1536,
  })

  const queryEmbedding = embeddingRes.data[0].embedding
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.3,
    match_count: limite,
  })

  if (error) {
    console.error('[RAG] Erro ao buscar chunks:', error.message)
    return []
  }

  return (data as Chunk[]) ?? []
}
