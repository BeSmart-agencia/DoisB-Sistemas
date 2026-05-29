import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"

interface PlaceResult {
  google_place_id: string
  nome: string
  endereco: string
  telefone: string | null
  rating: number | null
  lat: number | null
  lng: number | null
}

// In-memory cache (survives hot-reload in dev, clears on restart in prod)
const cache = new Map<string, { results: PlaceResult[]; at: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

function removerAcentos(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
}

async function searchPlaces(query: string, limite: number): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY!
  const results: PlaceResult[] = []
  let pageToken: string | undefined

  while (results.length < limite) {
    const batchSize = Math.min(20, limite - results.length)
    const body: Record<string, unknown> = {
      textQuery: query,
      maxResultCount: batchSize,
      languageCode: "pt-BR",
    }
    if (pageToken) body.pageToken = pageToken

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.location,nextPageToken",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? `Google Places error ${res.status}`)
    }

    const data = await res.json()
    const places: unknown[] = data.places ?? []

    for (const p of places as Record<string, unknown>[]) {
      const display = p.displayName as { text?: string } | undefined
      const location = p.location as { latitude?: number; longitude?: number } | undefined
      results.push({
        google_place_id: p.id as string,
        nome: display?.text ?? "",
        endereco: (p.formattedAddress as string) ?? "",
        telefone: (p.nationalPhoneNumber as string | null) ?? null,
        rating: (p.rating as number | null) ?? null,
        lat: location?.latitude ?? null,
        lng: location?.longitude ?? null,
      })
    }

    pageToken = data.nextPageToken as string | undefined
    if (!pageToken || places.length === 0) break
  }

  return results.slice(0, limite)
}

export async function GET(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { searchParams } = new URL(request.url)
  const segmento = searchParams.get("segmento")?.trim() ?? ""
  const cidade = searchParams.get("cidade")?.trim() ?? ""
  const estado = searchParams.get("estado")?.trim() ?? ""
  const limite = Math.min(60, Math.max(1, parseInt(searchParams.get("limite") ?? "20")))

  if (!segmento || !cidade) {
    return NextResponse.json({ error: "Segmento e cidade são obrigatórios" }, { status: 400 })
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY não configurada" }, { status: 500 })
  }

  const query = `${segmento} em ${cidade}${estado ? `, ${estado}` : ""}`
  const cacheKey = `${query}::${limite}`
  const cached = cache.get(cacheKey)

  let allResults: PlaceResult[]
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    allResults = cached.results
  } else {
    try {
      allResults = await searchPlaces(query, limite)
      cache.set(cacheKey, { results: allResults, at: Date.now() })
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Erro na busca" },
        { status: 502 }
      )
    }
  }

  // Filtrar resultados que não contêm a cidade no endereço
  const cidadeNorm = removerAcentos(cidade)
  allResults = allResults.filter((r) => removerAcentos(r.endereco).includes(cidadeNorm))

  // Filter already-added leads
  const placeIds = allResults.map((r) => r.google_place_id).filter(Boolean)
  const { data: existentes } = await supabase!
    .from("leads")
    .select("google_place_id")
    .in("google_place_id", placeIds)

  const existentesSet = new Set((existentes ?? []).map((e) => e.google_place_id))
  const filtrados = allResults.filter((r) => !existentesSet.has(r.google_place_id))

  return NextResponse.json({ results: filtrados, total: filtrados.length })
}
