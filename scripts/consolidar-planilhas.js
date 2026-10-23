/*
 * Consolida vários arquivos .xls/.xlsx de uma pasta num único .xlsx.
 * Mantém o cabeçalho da 1ª planilha e concatena todas as linhas de dados,
 * sem alterar nenhum valor (leitura crua). Avisa se algum cabeçalho divergir.
 *
 * Uso:
 *   node scripts/consolidar-planilhas.js <pasta-entrada> <arquivo-saida.xlsx>
 *
 * Exemplos:
 *   node scripts/consolidar-planilhas.js "docs/pmaq/contatosnovos" "docs/pmaq/contatosnovos_consolidado.xlsx"
 *   node scripts/consolidar-planilhas.js "docs/pmaq/produtosnovos"  "docs/pmaq/produtosnovos_consolidado.xlsx"
 */
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const [, , inDir, outFile] = process.argv;
if (!inDir || !outFile) {
  console.error("Uso: node scripts/consolidar-planilhas.js <pasta-entrada> <arquivo-saida.xlsx>");
  process.exit(1);
}

// ordena "arquivo.xls", "arquivo (1).xls", ... "arquivo (10).xls" de forma natural
function naturalSort(a, b) {
  const na = (a.match(/\((\d+)\)/) || [0, 0])[1] | 0;
  const nb = (b.match(/\((\d+)\)/) || [0, 0])[1] | 0;
  const baseA = a.replace(/\s*\(\d+\)/, "");
  const baseB = b.replace(/\s*\(\d+\)/, "");
  if (baseA === baseB) return na - nb;
  return a.localeCompare(b);
}

const files = fs
  .readdirSync(inDir)
  .filter((f) => /\.(xlsx?|XLSX?)$/.test(f))
  .sort(naturalSort);

if (!files.length) {
  console.error("Nenhum arquivo .xls/.xlsx encontrado em", inDir);
  process.exit(1);
}

let header = null;
const dataRows = [];
const report = [];

for (const f of files) {
  const wb = XLSX.readFile(path.join(inDir, f));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null, blankrows: false });
  if (!rows.length) { report.push([f, 0]); continue; }
  if (!header) header = rows[0];
  else if (JSON.stringify(rows[0]) !== JSON.stringify(header)) {
    console.error("!! CABECALHO DIFERENTE em", f, "(verifique antes de confiar no resultado)");
  }
  const body = rows.slice(1);
  for (const r of body) dataRows.push(r);
  report.push([f, body.length]);
}

const outWb = XLSX.utils.book_new();
const outWs = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
XLSX.utils.book_append_sheet(outWb, outWs, "Consolidado");
XLSX.writeFile(outWb, outFile);

console.log(`\n=== ${inDir} -> ${outFile} ===`);
for (const [f, n] of report) console.log(`  ${f}: ${n} linhas`);
console.log(`  TOTAL: ${dataRows.length} linhas de dados (+1 cabecalho) de ${files.length} arquivos`);
