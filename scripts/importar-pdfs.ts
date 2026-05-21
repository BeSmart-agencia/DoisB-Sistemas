/**
 * Importa PDFs da pasta docs/Base de Conhecimento/ para a tabela tutoriais no Supabase.
 *
 * Uso:
 *   node --env-file .env.local --import tsx/esm scripts/importar-pdfs.ts
 *   node --env-file .env.local --import tsx/esm scripts/importar-pdfs.ts --dry-run
 *   node --env-file .env.local --import tsx/esm scripts/importar-pdfs.ts --sobreescrever
 */

import * as fs from "fs"
import * as path from "path"
import { PDFParse } from "pdf-parse"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BASE_DIR = path.join(process.cwd(), "docs", "Base de Conhecimento")
const DRY_RUN = process.argv.includes("--dry-run")
const SOBREESCREVER = process.argv.includes("--sobreescrever")

type Categoria =
  | "primeiros_passos" | "cadastros" | "vendas" | "fiscal"
  | "financeiro" | "ordens_servico" | "estoque_compras" | "integracoes" | "configuracoes"

const PASTA_PARA_CAT: Record<string, Categoria> = {
  "Cadastros": "cadastros",
  "Configurações": "configuracoes",
  "Documentos": "vendas",
  "Financeiro": "financeiro",
  "Fiscal": "fiscal",
  "Integrações": "integracoes",
  "Tutoriais": "configuracoes",
}

const KEYWORD_RULES: { re: RegExp; cat: Categoria }[] = [
  { re: /primeiro acesso|instalação|download|terminal zweb/i, cat: "primeiros_passos" },
  { re: /ordem de serviço|os no appscloud/i, cat: "ordens_servico" },
  { re: /ordem de compra|inventário de estoque|estoque|compras/i, cat: "estoque_compras" },
  { re: /pdv|nfc-e|sat|mfe|caixa|balança|etiqueta|certificado digital/i, cat: "configuracoes" },
  { re: /boleto|pix|financeiro|plano de contas|dre|formas de pagamento|sicoob|santander|sicredi|inter/i, cat: "financeiro" },
  { re: /nf-e|nfs-e|mdf-e|sped|sintegra|cfop|tribut|fiscal|reform|benefício fiscal|natureza|icms|ipi|pis|cofins|cst/i, cat: "fiscal" },
  { re: /integração|ecommerce|mercado livre|marketplace|zpos|appscloud/i, cat: "integracoes" },
  { re: /venda|orçamento|pedido|dav|romaneio/i, cat: "vendas" },
  { re: /cadastr/i, cat: "cadastros" },
  { re: /configur/i, cat: "configuracoes" },
]

function detectarCategoria(pasta: string, titulo: string): Categoria {
  for (const rule of KEYWORD_RULES) {
    if (rule.re.test(titulo)) return rule.cat
  }
  return PASTA_PARA_CAT[pasta] ?? "configuracoes"
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function inlineHtml(text: string): string {
  return escapeHtml(text).replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )
}

function headingId(text: string, used: Map<string, number>) {
  const base = slugify(text).slice(0, 60) || "secao"
  const count = used.get(base) ?? 0
  used.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}

function extrairSumario(raw: string): string[] {
  const match = raw.match(/\nConte[uú]dos\n([\s\S]*?)\nBase de Conhecimento Zweb\n/i)
  if (!match) return []

  return match[1]
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function limparLinhas(raw: string, titulo: string): string[] {
  const text = raw
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\d{2}\/\d{2}\/\d{4},\s*\d{2}:\d{2}\s+[^\n]*\nhttps?:\/\/[^\n]*\n/g, "\n")
    .replace(/-- \d+ of \d+ --/g, "\n")
    .replace(/Conte[uú]dos\n[\s\S]*?Base de Conhecimento Zweb\n/i, "\n")

  const linhas = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())

  const limpas: string[] = []
  let skipAuthorLines = 0

  for (const line of linhas) {
    if (!line) {
      limpas.push("")
      continue
    }

    if (/^In[ií]cio Manuais\b/i.test(line)) continue
    if (line === titulo) continue
    if (/^\d+\/\d+$/.test(line)) continue
    if (/^Base de Conhecimento Zweb$/i.test(line)) continue

    if (/^Sobre o autor$/i.test(line)) {
      skipAuthorLines = 2
      continue
    }

    if (skipAuthorLines > 0) {
      skipAuthorLines--
      continue
    }

    limpas.push(line)
  }

  return limpas
}

function pareceItemDeLista(line: string) {
  return /^([-*•]|\d+[.)])\s+/.test(line)
}

function normalizarItemLista(line: string) {
  return line.replace(/^([-*•]|\d+[.)])\s+/, "").trim()
}

function isHeadingLine(line: string, tocSet: Set<string>) {
  return tocSet.has(line) || tocSet.has(line.replace(/:$/, ""))
}

function textoParaHtml(raw: string, titulo = ""): string {
  const toc = extrairSumario(raw)
  const tocSet = new Set(toc)
  const usedIds = new Map<string, number>()
  const linhas = limparLinhas(raw, titulo)
  const html: string[] = []
  let paragrafo: string[] = []
  let lista: string[] = []
  let introCriada = false

  function flushLista() {
    if (!lista.length) return
    html.push(
      `<ul class="tutorial-list">\n${lista
        .map((item) => `  <li>${inlineHtml(item)}</li>`)
        .join("\n")}\n</ul>`
    )
    lista = []
  }

  function flushParagrafo() {
    if (!paragrafo.length) return
    const texto = paragrafo.join(" ").replace(/\s+/g, " ").trim()
    paragrafo = []
    if (!texto) return

    if (!introCriada && toc.length > 0 && !tocSet.has(texto)) {
      html.push(`<div class="tutorial-intro"><p>${inlineHtml(texto)}</p></div>`)
      introCriada = true
      return
    }

    const isCallout = /^(observa[cç][aã]o|aten[cç][aã]o|importante|dica|nota):/i.test(texto)
    if (isCallout) {
      html.push(`<div class="tutorial-note"><p>${inlineHtml(texto)}</p></div>`)
    } else {
      html.push(`<p>${inlineHtml(texto)}</p>`)
    }
  }

  if (toc.length > 1) {
    html.push(
      `<div class="tutorial-summary"><strong>Neste tutorial</strong><ol>${toc
        .map((item) => `<li><a href="#${slugify(item).slice(0, 60)}">${inlineHtml(item)}</a></li>`)
        .join("")}</ol></div>`
    )
  }

  for (const line of linhas) {
    if (!line) {
      flushParagrafo()
      flushLista()
      continue
    }

    if (isHeadingLine(line, tocSet)) {
      flushParagrafo()
      flushLista()
      const clean = line.replace(/:$/, "")
      html.push(`<h2 id="${headingId(clean, usedIds)}">${inlineHtml(clean)}</h2>`)
      continue
    }

    if (pareceItemDeLista(line)) {
      flushParagrafo()
      lista.push(normalizarItemLista(line))
      continue
    }

    const isH3 = line.length < 80 && /:$/.test(line) && !/^https?:\/\//.test(line)
    if (isH3) {
      flushParagrafo()
      flushLista()
      const clean = line.replace(/:$/, "")
      html.push(`<h3 id="${headingId(clean, usedIds)}">${inlineHtml(clean)}</h3>`)
      continue
    }

    paragrafo.push(line)
  }

  flushParagrafo()
  flushLista()

  return html.join("\n")
}

function tituloDoArquivo(nomeArquivo: string): string {
  return nomeArquivo
    .replace(/\s*[-–]\s*Base de Conhecimento Zweb\.pdf$/i, "")
    .replace(/\.pdf$/i, "")
    .trim()
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local")
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const { data: existentes } = await supabase.from("tutoriais").select("slug, titulo")
  const slugsExistentes = new Set((existentes ?? []).map((t: { slug: string }) => t.slug))
  const titulosExistentes = new Map((existentes ?? []).map((t: { titulo: string; slug: string }) => [t.titulo, t.slug]))

  const pastas = fs.readdirSync(BASE_DIR).filter((p) =>
    fs.statSync(path.join(BASE_DIR, p)).isDirectory()
  )

  let ordem = 10
  let criados = 0
  let pulados = 0
  let erros = 0

  for (const pasta of pastas) {
    const dirPasta = path.join(BASE_DIR, pasta)
    const pdfs = fs.readdirSync(dirPasta).filter((f) => f.endsWith(".pdf"))

    console.log(`\nPasta: ${pasta} (${pdfs.length} PDFs)`)

    for (const pdf of pdfs) {
      const titulo = tituloDoArquivo(pdf)
      const slug = slugify(titulo)
      const cat = detectarCategoria(pasta, titulo)

      if (slugsExistentes.has(slug) && !SOBREESCREVER) {
        console.log(`  [PULADO] ${titulo}`)
        pulados++
        continue
      }

      let conteudoHtml = ""
      let resumo = ""

      try {
        const filePath = path.join(dirPasta, pdf)
        const fileUrl = `file:///${filePath.replace(/\\/g, "/")}`
        const parser = new PDFParse({ url: fileUrl })
        const parsed = await parser.getText()
        conteudoHtml = textoParaHtml(parsed.text, titulo)

        const match = conteudoHtml.match(/<p>([^<]{20,})<\/p>/)
        if (match) resumo = match[1].replace(/<[^>]*>/g, "").slice(0, 200)
      } catch (err) {
        console.error(`  [ERRO PDF] ${pdf}:`, err)
        erros++
        continue
      }

      console.log(`  ${DRY_RUN ? "[DRY]" : "+"} ${titulo} -> ${cat}`)

      if (!DRY_RUN) {
        const rowInsert = {
          titulo,
          slug,
          categoria: cat,
          resumo: resumo || null,
          conteudo_html: conteudoHtml || null,
          status: "rascunho" as const,
          ordem,
        }
        const rowUpdate = { titulo, slug, categoria: cat, resumo: resumo || null, conteudo_html: conteudoHtml || null, ordem }

        if (SOBREESCREVER && titulosExistentes.has(titulo)) {
          const slugExistente = titulosExistentes.get(titulo)!
          const { error } = await supabase
            .from("tutoriais")
            .update(rowUpdate)
            .eq("slug", slugExistente)
          if (error) { console.error("    Erro update:", error.message); erros++ }
          else criados++
        } else {
          const { error } = await supabase.from("tutoriais").insert(rowInsert)
          if (error) {
            if (error.code === "23505") {
              console.warn(`    Conflito de slug (ja existe): ${slug}`)
              pulados++
            } else {
              console.error("    Erro insert:", error.message)
              erros++
            }
          } else {
            criados++
          }
        }
      }

      ordem += 10
    }
  }

  console.log(`\nConcluido${DRY_RUN ? " (dry-run, nada foi inserido)" : ""}.`)
  console.log(`   Criados/atualizados: ${criados}`)
  console.log(`   Pulados (ja existiam): ${pulados}`)
  console.log(`   Erros: ${erros}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
