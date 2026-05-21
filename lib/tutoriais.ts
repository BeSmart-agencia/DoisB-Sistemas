export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

export function addHeadingIds(html: string): string {
  const used = new Map<string, number>()
  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h[23]>/gi,
    (_, level, attrs, inner) => {
      if (/\bid="/.test(attrs)) return `<h${level}${attrs}>${inner}</h${level}>`
      const text = inner.replace(/<[^>]*>/g, "")
      const baseId = slugify(text).slice(0, 60) || "secao"
      const count = used.get(baseId) ?? 0
      used.set(baseId, count + 1)
      const id = count === 0 ? baseId : `${baseId}-${count}`
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
    }
  )
}

export function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const result: { id: string; text: string; level: number }[] = []
  const re = /<h([23])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    result.push({
      level: parseInt(m[1]),
      id: m[2],
      text: m[3].replace(/<[^>]*>/g, "").trim(),
    })
  }
  return result
}
