"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Search, MapPin, Star, Phone, Plus, PlusSquare, Loader2, LayoutList, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const schema = z.object({
  segmento: z.string().min(2, "Informe o segmento"),
  cidade: z.string().min(2, "Informe a cidade"),
  estado: z.string().max(2).optional(),
  limite: z.number().min(1).max(60),
})
type FormData = z.infer<typeof schema>

interface PlaceResult {
  google_place_id: string
  nome: string
  endereco: string
  telefone: string | null
  rating: number | null
  lat: number | null
  lng: number | null
}

export default function LeadsBuscarPage() {
  const [results, setResults] = useState<PlaceResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [adicionados, setAdicionados] = useState<Set<string>>(new Set())
  const [adicionando, setAdicionando] = useState<Set<string>>(new Set())

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { limite: 20 },
  })

  const segmento = watch("segmento") ?? ""
  const cidade = watch("cidade") ?? ""
  const estado = watch("estado") ?? ""

  async function onSearch(data: FormData) {
    setLoading(true)
    setResults(null)
    setAdicionados(new Set())
    try {
      const p = new URLSearchParams({
        segmento: data.segmento,
        cidade: data.cidade,
        ...(data.estado && { estado: data.estado }),
        limite: data.limite.toString(),
      })
      const res = await fetch(`/api/leads/buscar?${p}`)
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? "Erro na busca"); return }
      setResults(json.results)
      if (json.results.length === 0) toast.info("Nenhuma empresa nova encontrada")
    } catch {
      toast.error("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  async function adicionarLead(place: PlaceResult) {
    setAdicionando((prev) => new Set(prev).add(place.google_place_id))
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...place, segmento, cidade, estado }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? "Erro ao adicionar"); return }
      setAdicionados((prev) => new Set(prev).add(place.google_place_id))
      toast.success(`${place.nome} adicionado`)
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
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Segmento *" error={errors.segmento?.message}>
              <Input placeholder="padaria, oficina mecânica..." {...register("segmento")} />
            </Field>
            <Field label="Cidade *" error={errors.cidade?.message}>
              <Input placeholder="Porto Alegre" {...register("cidade")} />
            </Field>
            <Field label="Estado" error={errors.estado?.message}>
              <Input placeholder="RS" maxLength={2} {...register("estado")}
                className="uppercase" style={{ textTransform: "uppercase" }} />
            </Field>
            <Field label="Máx. resultados" error={undefined}>
              <Input type="number" min={1} max={60} {...register("limite", { valueAsNumber: true })} />
            </Field>
          </div>
          <Button
            type="submit" disabled={loading}
            className="gap-2 bg-blue-800 hover:bg-blue-900 text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Buscando..." : "Buscar empresas"}
          </Button>
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-700 font-medium text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
