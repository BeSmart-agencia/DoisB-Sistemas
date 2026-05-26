/**
 * Importa todos os PDFs da pasta docs/Base de Conhecimento
 * para a tabela `documentos` no Supabase.
 *
 * Execução:
 *   npm run import-pdfs
 *
 * Idempotente — pula arquivos já importados (verifica pelo nome_arquivo).
 */

import { readdirSync, statSync } from 'fs'
import { resolve, join, basename, relative } from 'path'
import { pathToFileURL } from 'url'
import { createRequire } from 'module'
import { createClient } from '@supabase/supabase-js'

const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse') as {
  PDFParse: new (opts: { url: string }) => { getText(): Promise<{ text: string }> }
}

// ── Carregar .env.local ──────────────────────────────────────────────────────
import { readFileSync } from 'fs'
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

// ── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const BASE_DIR = resolve(process.cwd(), 'docs', 'Base de Conhecimento')

// ── Listar PDFs recursivamente ────────────────────────────────────────────────
function listarPdfs(dir: string): { caminho: string; categoria: string }[] {
  const resultado: { caminho: string; categoria: string }[] = []

  function percorrer(atual: string) {
    for (const entrada of readdirSync(atual)) {
      const caminho = join(atual, entrada)
      if (statSync(caminho).isDirectory()) {
        percorrer(caminho)
      } else if (entrada.toLowerCase().endsWith('.pdf')) {
        const relativo = relative(BASE_DIR, caminho)
        const partes = relativo.split(/[\\/]/)
        const categoria = partes.length > 1 ? partes[0] : 'Geral'
        resultado.push({ caminho, categoria })
      }
    }
  }

  percorrer(dir)
  return resultado
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n📂 Importando PDFs para a tabela documentos...\n')

  const pdfs = listarPdfs(BASE_DIR)
  console.log(`📄 ${pdfs.length} PDF(s) encontrado(s).\n`)

  // Buscar nomes já importados
  const { data: existentes } = await supabase
    .from('documentos')
    .select('nome_arquivo')

  const importados = new Set(
    (existentes ?? []).map((d: { nome_arquivo: string }) => d.nome_arquivo)
  )

  let novos = 0
  let pulados = 0
  let erros = 0

  for (let i = 0; i < pdfs.length; i++) {
    const { caminho, categoria } = pdfs[i]
    const nome = basename(caminho)
    const pct = (((i + 1) / pdfs.length) * 100).toFixed(0).padStart(3)

    if (importados.has(nome)) {
      console.log(`[${pct}%] ⏭  ${nome}`)
      pulados++
      continue
    }

    try {
      const fileUrl = pathToFileURL(caminho).href
      const parser = new PDFParse({ url: fileUrl })
      const parsed = await parser.getText()
      const texto = parsed.text?.trim() ?? ''

      if (!texto) {
        console.log(`[${pct}%] ⚠️  ${nome} (sem texto extraível — PDF pode ser imagem)`)
        erros++
        continue
      }

      const titulo = nome
        .replace(/\s*[-–]\s*Base de Conhecimento Zweb\.pdf$/i, '')
        .replace(/\.pdf$/i, '')
        .trim()

      const { error } = await supabase.from('documentos').insert({
        titulo,
        nome_arquivo: nome,
        categoria,
        conteudo_texto: texto,
      } as never)

      if (error) {
        console.log(`[${pct}%] ❌ ${nome}: ${error.message}`)
        erros++
      } else {
        console.log(`[${pct}%] ✅ ${nome} [${categoria}] — ${texto.length.toLocaleString()} chars`)
        novos++
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`[${pct}%] ❌ ${nome}: ${msg}`)
      erros++
    }
  }

  console.log('\n─────────────────────────────────────────')
  console.log(`✅ Importação concluída!`)
  console.log(`   Importados agora : ${novos}`)
  console.log(`   Já existiam      : ${pulados}`)
  console.log(`   Erros            : ${erros}`)

  if (novos > 0) {
    console.log('\n▶  Próximo passo: npm run ingest')
  }
  console.log('')
}

main().catch((err) => {
  console.error('\n❌ Erro fatal:', err)
  process.exit(1)
})
