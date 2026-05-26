/**
 * Script de ingestão da base de conhecimento ZWeb
 *
 * Execução:
 *   npm run ingest
 *   (ou: npx tsx --env-file=.env.local scripts/ingestar-conhecimento.ts)
 *
 * O script é idempotente — pode ser rodado várias vezes sem duplicar chunks.
 */

import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// ── Carregar .env.local manualmente (fora do contexto Next.js) ──────────────
import { readFileSync } from 'fs'
import { resolve } from 'path'

try {
  const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
  for (const linha of env.split('\n')) {
    const trimmed = linha.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

// ── Clientes ────────────────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Chunking ─────────────────────────────────────────────────────────────────
/**
 * Quebra um texto em chunks com overlap.
 * Aproximação: 1 token ≈ 4 caracteres para português.
 */
export function chunkText(text: string, maxTokens = 500, overlap = 50): string[] {
  const charsPerChunk = maxTokens * 4
  const overlapChars = overlap * 4
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + charsPerChunk, text.length)

    // Tentar quebrar em limite de parágrafo/frase para não cortar no meio
    let breakPoint = end
    if (end < text.length) {
      const slice = text.slice(start, end + 200)
      const paraBreak = slice.lastIndexOf('\n\n', charsPerChunk)
      const sentBreak = slice.lastIndexOf('. ', charsPerChunk)
      if (paraBreak > charsPerChunk * 0.6) breakPoint = start + paraBreak + 2
      else if (sentBreak > charsPerChunk * 0.6) breakPoint = start + sentBreak + 2
    }

    const chunk = text.slice(start, breakPoint).trim()
    if (chunk.length > 80) chunks.push(chunk)

    if (breakPoint >= text.length) break
    start = breakPoint - overlapChars
  }

  return chunks
}

// ── Atraso simples para rate limiting ────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Iniciando ingestão da base de conhecimento ZWeb...\n')

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌  OPENAI_API_KEY não definida. Defina em .env.local')
    process.exit(1)
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌  Variáveis do Supabase não definidas.')
    process.exit(1)
  }

  // Buscar documentos
  const { data: documentos, error: errDocs } = await supabase
    .from('documentos')
    .select('id, nome_arquivo, conteudo_texto')

  if (errDocs || !documentos) {
    console.error('❌  Erro ao buscar documentos:', errDocs?.message)
    process.exit(1)
  }

  console.log(`📚 ${documentos.length} documento(s) encontrado(s).\n`)

  let totalChunks = 0
  let totalNovos = 0
  let totalPulados = 0

  for (let i = 0; i < documentos.length; i++) {
    const doc = documentos[i]
    const pct = (((i + 1) / documentos.length) * 100).toFixed(0).padStart(3)

    console.log(`[${pct}%] ${doc.nome_arquivo}`)

    const conteudo = (doc as Record<string, unknown>).conteudo_texto as string | null
    if (!conteudo?.trim()) {
      console.log('       ⚠️  Sem texto — pulado\n')
      continue
    }

    const chunks = chunkText(conteudo, 500, 50)
    console.log(`       📄 ${chunks.length} chunk(s)`)

    let novos = 0
    let pulados = 0

    for (let ci = 0; ci < chunks.length; ci++) {
      // Idempotência: verifica se chunk já existe
      const { data: existente } = await supabase
        .from('documento_chunks')
        .select('id')
        .eq('documento_id', doc.id)
        .eq('chunk_index', ci)
        .maybeSingle()

      if (existente) {
        pulados++
        totalPulados++
        continue
      }

      // Gerar embedding
      const embRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunks[ci],
        dimensions: 1536,
      })

      const { error: errInsert } = await supabase
        .from('documento_chunks')
        .insert({
          documento_id: doc.id,
          conteudo: chunks[ci],
          chunk_index: ci,
          embedding: embRes.data[0].embedding as unknown as string,
        })

      if (errInsert) {
        console.error(`       ❌ Chunk ${ci}: ${errInsert.message}`)
      } else {
        novos++
        totalNovos++
      }

      // Rate limiting — evitar throttle da OpenAI (3500 req/min no tier Free)
      await sleep(30)
    }

    totalChunks += chunks.length
    console.log(`       ✅ ${novos} novo(s)${pulados ? `, ${pulados} já existia(m)` : ''}\n`)
  }

  console.log('─────────────────────────────────────────')
  console.log(`✅ Ingestão concluída!`)
  console.log(`   Documentos processados : ${documentos.length}`)
  console.log(`   Total de chunks        : ${totalChunks}`)
  console.log(`   Novos inseridos        : ${totalNovos}`)
  console.log(`   Já existiam            : ${totalPulados}`)
  console.log('')
}

main().catch((err) => {
  console.error('\n❌ Erro fatal:', err)
  process.exit(1)
})
