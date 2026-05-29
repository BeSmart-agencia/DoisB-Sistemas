"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Search, MapPin, Star, Phone, Plus, PlusSquare, Loader2,
  LayoutList, PhoneOff, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PlaceResult {
  google_place_id: string
  nome: string
  endereco: string
  telefone: string | null
  rating: number | null
  lat: number | null
  lng: number | null
}

interface CidadeSugestao {
  nome: string
  uf: string
  label: string
}

/* ── Cache IBGE (carrega uma vez, filtra localmente) ── */
type MunicipioRaw = { nome: string; uf: string }
let ibgeCache: MunicipioRaw[] | null = null

async function getMunicipios(): Promise<MunicipioRaw[]> {
  if (ibgeCache) return ibgeCache
  const res = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
  )
  if (!res.ok) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await res.json()
  ibgeCache = data.map((m) => ({
    nome: m.nome as string,
    uf: (m.microrregiao?.mesorregiao?.UF?.sigla as string) ?? "",
  }))
  return ibgeCache
}

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")

async function buscarCidades(query: string): Promise<CidadeSugestao[]> {
  if (query.length < 2) return []
  try {
    const municipios = await getMunicipios()
    const q = norm(query)
    return municipios
      .filter((m) => norm(m.nome).startsWith(q))
      .slice(0, 8)
      .map((m) => ({ ...m, label: `${m.nome} — ${m.uf}` }))
  } catch {
    return []
  }
}

export default function LeadsBuscarPage() {
  const [results, setResults] = useState<PlaceResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [adicionados, setAdicionados] = useState<Set<string>>(new Set())
  const [adicionando, setAdicionando] = useState<Set<string>>(new Set())

  /* segmentos */
  const [segmentos, setSegmentos] = useState<string[]>([])
  const [segInput, setSegInput] = useState("")

  /* cidade */
  const [cidadeInput, setCidadeInput] = useState("")
  const [cidadeSelecionada, setCidadeSelecionada] = useState("")
  const [estado, setEstado] = useState("")
  const [sugestoes, setSugestoes] = useState<CidadeSugestao[]>([])
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [buscandoCidade, setBuscandoCidade] = useState(false)
  const cidadeRef = useRef<HTMLDivElement>(null)
  const skipSearchRef = useRef(false)

  /* limite */
  const [limite, setLimite] = useState(20)

  /* ── Fechar dropdown ao clicar fora ── */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (cidadeRef.current && !cidadeRef.current.contains(e.target as Node)) {
        setDropdownAberto(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ── Debounce busca IBGE ── */
  useEffect(() => {
    if (skipSearchRef.current) { skipSearchRef.current = false; return }
    if (cidadeInput.length < 2) { setSugestoes([]); return }
    setBuscandoCidade(true)
    const t = setTimeout(async () => {
      const res = await buscarCidades(cidadeInput)
      setSugestoes(res)
      setDropdownAberto(res.length > 0)
      setBuscandoCidade(false)
    }, 300)
    return () => clearTimeout(t)
  }, [cidadeInput])

  /* ── Adicionar segmento ── */
  function addSegmento(valor: string) {
    const v = valor.replace(/,/g, "").trim()
    if (v.length >= 2 && !segmentos.includes(v)) {
      setSegmentos((prev) => [...prev, v])
    }
    setSegInput("")
  }

  function onSegKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault()
      addSegmento(segInput)
    } else if (e.key === "Backspace" && segInput === "" && segmentos.length > 0) {
      setSegmentos((prev) => prev.slice(0, -1))
    }
  }

  function onSegChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (v.endsWith(",")) { addSegmento(v); return }
    setSegInput(v)
  }

  function removerSegmento(seg: string) {
    setSegmentos((prev) => prev.filter((s) => s !== seg))
  }

  /* ── Selecionar cidade ── */
  function selecionarCidade(c: CidadeSugestao) {
    skipSearchRef.current = true
    setCidadeInput(c.nome)
    setCidadeSelecionada(c.nome)
    setEstado(c.uf)
    setDropdownAberto(false)
    setSugestoes([])
  }

  function onCidadeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCidadeInput(e.target.value)
    setCidadeSelecionada("")
    setEstado("")
  }

  /* ── Buscar ── */
  async function onSearch(e: React.FormEvent) {
    e.preventDefault()
    if (segmentos.length === 0) { toast.error("Adicione pelo menos um segmento"); return }
    const cidadeFinal = cidadeSelecionada || cidadeInput
    if (cidadeFinal.length < 2) { toast.error("Informe a cidade"); return }

    setLoading(true)
    setResults(null)
    setAdicionados(new Set())
    try {
      const p = new URLSearchParams({
        segmento: segmentos.join(", "),
        cidade: cidadeFinal,
        ...(estado && { estado }),
        limite: limite.toString(),
      })
      const res = await fetch(`/api/leads/buscar?${p}`)
      const text = await res.text()
      let json: { error?: string; results?: PlaceResult[] }
      try { json = JSON.parse(text) } catch { toast.error(`Resposta inválida: ${text.slice(0, 120)}`); return }
      if (!res.ok) { toast.error(json.error ?? `Erro ${res.status}`); return }
      setResults(json.results ?? [])
      if ((json.results ?? []).length === 0) toast.info("Nenhuma empresa nova encontrada")
    } catch (err) {
      toast.error(`Erro de conexão: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  async function adicionarLead(place: PlaceResult) {
    const cidadeFinal = cidadeSelecionada || cidadeInput
    setAdicionando((prev) => new Set(prev).add(place.google_place_id))
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...place,
          segmento: segmentos.join(", "),
          cidade: cidadeFinal,
          estado,
        }),
      })
      const text = await res.text()
      let json: { error?: string } = {}
      try { json = JSON.parse(text) } catch { /* ignore */ }
      if (!res.ok) {
        toast.error(json.error ?? `Erro ${res.status} ao adicionar`)
        return
      }
      setAdicionados((prev) => new Set(prev).add(place.google_place_id))
      toast.success(`${place.nome} adicionado`)
    } catch (err) {
      toast.error(`Erro de conexão: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setAdicionando((prev) => { const s = new Set(prev); s.delete(place.google_place_id); return s })
    }
  }

  async function adicionarTodos() {
    const pendentes = (results ?? []).filter((r) => !adicionados.has(r.google_place_id))
    for (const place of pendentes) await adicionarLead(place)
  }

  return (
    <div className="space-y-6">
      <div className="admin-panel-strong flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Captação de leads</h1>
          <p className="text-slate-500 text-sm mt-1">Busque empresas por segmento e adicione como leads</p>
        </div>
        <Link href="/admin/leads/lista">
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutList className="h-4 w-4" /> Funil de leads
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="admin-panel p-6">
        <form onSubmit={onSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Segmentos (tags) */}
            <div className="space-y-1.5 lg:col-span-2">
              <Label className="text-slate-700 font-medium text-sm">
                Segmento * <span className="font-normal text-slate-400">(vírgula ou Enter para adicionar)</span>
              </Label>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-md border border-slate-200 bg-white cursor-text",
                  "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                )}
                onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}
              >
                {segmentos.map((seg) => (
                  <span
                    key={seg}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {seg}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removerSegmento(seg) }}
                      className="hover:text-blue-900 ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={segInput}
                  onChange={onSegChange}
                  onKeyDown={onSegKeyDown}
                  onBlur={() => { if (segInput.trim()) addSegmento(segInput) }}
                  placeholder={segmentos.length === 0 ? "padaria, oficina, mercado..." : ""}
                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Cidade (autocomplete IBGE) */}
            <div className="space-y-1.5 relative" ref={cidadeRef}>
              <Label className="text-slate-700 font-medium text-sm">Cidade *</Label>
              <div className="relative">
                <input
                  value={cidadeInput}
                  onChange={onCidadeChange}
                  onFocus={() => sugestoes.length > 0 && setDropdownAberto(true)}
                  placeholder="Digite a cidade..."
                  autoComplete="off"
                  className="w-full h-9 px-3 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                />
                {buscandoCidade && (
                  <Loader2 className="absolute right-2.5 top-2 h-4 w-4 animate-spin text-slate-400" />
                )}
              </div>
              {dropdownAberto && sugestoes.length > 0 && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  {sugestoes.map((c) => (
                    <button
                      key={`${c.nome}-${c.uf}`}
                      type="button"
                      onMouseDown={() => selecionarCidade(c)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-800">{c.nome}</span>
                      <span className="text-xs font-semibold text-slate-400 shrink-0">{c.uf}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Estado (auto-preenchido) */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-medium text-sm">Estado</Label>
              <input
                value={estado}
                onChange={(e) => setEstado(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="RS"
                maxLength={2}
                className="w-full h-9 px-3 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder:text-slate-400"
                style={{ textTransform: "uppercase" }}
              />
            </div>
          </div>

          {/* Limite */}
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-medium text-sm">Máx. resultados</Label>
              <input
                type="number"
                min={1}
                max={60}
                value={limite}
                onChange={(e) => setLimite(Number(e.target.value))}
                className="w-24 h-9 px-3 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-blue-800 hover:bg-blue-900 text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Buscando..." : "Buscar empresas"}
            </Button>
          </div>
        </form>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-sm font-medium">
              {results.length} empresa{results.length !== 1 ? "s" : ""} disponíve{results.length !== 1 ? "is" : "l"} para adicionar
            </p>
            {results.length > 1 && (
              <Button size="sm" variant="outline" onClick={adicionarTodos} className="gap-2">
                <PlusSquare className="h-4 w-4" /> Adicionar todos
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="admin-panel text-center py-12 text-slate-400">
              Todas as empresas encontradas já foram adicionadas como leads
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((place) => {
                const adicionado = adicionados.has(place.google_place_id)
                const adicionandoNow = adicionando.has(place.google_place_id)
                return (
                  <div
                    key={place.google_place_id}
                    className={cn(
                      "admin-panel p-4 flex flex-col gap-3 transition-all hover:-translate-y-0.5",
                      adicionado ? "border-green-200 bg-green-50/30" : "border-slate-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900 text-sm leading-tight">{place.nome}</p>
                      {place.rating != null && (
                        <div className="flex items-center gap-0.5 shrink-0 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-medium">{place.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-start gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                        <span>{place.endereco}</span>
                      </div>
                      {place.telefone ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span>{place.telefone}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <PhoneOff className="h-3.5 w-3.5 shrink-0" />
                          <span>Telefone não disponível</span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={adicionado ? "outline" : "default"}
                      disabled={adicionado || adicionandoNow}
                      onClick={() => adicionarLead(place)}
                      className={cn(
                        "w-full gap-2",
                        adicionado
                          ? "border-green-300 text-green-700 bg-green-50"
                          : "bg-blue-800 hover:bg-blue-900 text-white"
                      )}
                    >
                      {adicionandoNow ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : adicionado ? (
                        "✓ Adicionado"
                      ) : (
                        <><Plus className="h-3.5 w-3.5" /> Adicionar como lead</>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
