"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Save, Eye, EyeOff, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import { cn } from "@/lib/utils"

type Categoria = "primeiros_passos" | "cadastros" | "vendas" | "fiscal" | "financeiro" |
  "ordens_servico" | "estoque_compras" | "integracoes" | "configuracoes"

type Status = "publicado" | "rascunho"

export interface TutorialData {
  id?: string
  titulo: string
  slug?: string
  categoria: Categoria | ""
  resumo: string
  conteudo_html: string
  status: Status
  ordem: number
}

const CAT_LABEL: Record<Categoria, string> = {
  primeiros_passos: "Primeiros passos",
  cadastros: "Cadastros",
  vendas: "Vendas",
  fiscal: "Fiscal",
  financeiro: "Financeiro",
  ordens_servico: "Ordens de Serviço",
  estoque_compras: "Estoque e Compras",
  integracoes: "Integrações",
  configuracoes: "Configurações avançadas",
}

interface Props {
  initialData?: TutorialData
  mode: "create" | "edit"
}

export default function TutorialForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const [titulo, setTitulo] = useState(initialData?.titulo ?? "")
  const [categoria, setCategoria] = useState<Categoria | "">(initialData?.categoria ?? "")
  const [resumo, setResumo] = useState(initialData?.resumo ?? "")
  const [conteudo, setConteudo] = useState(initialData?.conteudo_html ?? "")
  const [ordem, setOrdem] = useState(initialData?.ordem ?? 0)
  const [status, setStatus] = useState<Status>(initialData?.status ?? "rascunho")

  async function salvar(novoStatus?: Status) {
    if (!titulo.trim()) { toast.error("Título obrigatório"); return }
    if (!categoria) { toast.error("Categoria obrigatória"); return }

    const body = {
      titulo: titulo.trim(),
      categoria,
      resumo: resumo.trim() || null,
      conteudo_html: conteudo || null,
      ordem,
      status: novoStatus ?? status,
    }

    if (novoStatus) setPublishing(true)
    else setSaving(true)

    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/tutoriais", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) { toast.error(data.error ?? "Erro ao criar"); return }
        toast.success("Tutorial criado!")
        router.push(`/admin/tutoriais/${data.id}/editar`)
      } else {
        const res = await fetch(`/api/admin/tutoriais/${initialData!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) { toast.error(data.error ?? "Erro ao salvar"); return }
        if (novoStatus) setStatus(novoStatus)
        toast.success(novoStatus ? (novoStatus === "publicado" ? "Tutorial publicado!" : "Tutorial despublicado") : "Salvo!")
      }
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/tutoriais">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {mode === "create" ? "Novo tutorial" : "Editar tutorial"}
            </h1>
            {mode === "edit" && initialData?.slug && (
              <Link
                href={`/tutoriais/${initialData.slug}`}
                target="_blank"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                /tutoriais/{initialData.slug}
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                status === "publicado"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {status === "publicado" ? "Publicado" : "Rascunho"}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => salvar()}
            disabled={saving || publishing}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </Button>
          {mode === "edit" && (
            <Button
              size="sm"
              className="gap-1.5"
              variant={status === "publicado" ? "outline" : "default"}
              onClick={() => salvar(status === "publicado" ? "rascunho" : "publicado")}
              disabled={saving || publishing}
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === "publicado" ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {status === "publicado" ? "Despublicar" : "Publicar"}
            </Button>
          )}
          {mode === "create" && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => salvar("publicado")}
              disabled={saving || publishing}
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Criar e publicar
            </Button>
          )}
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: main fields */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Como fazer o primeiro acesso ao ZWeb"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="resumo">Resumo</Label>
            <Textarea
              id="resumo"
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Breve descrição exibida na listagem e em SEO"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        {/* Right: meta */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Categoria *</Label>
            <Select
              value={categoria || undefined}
              onValueChange={(v) => v && setCategoria(v as Categoria)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar…" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(CAT_LABEL) as [Categoria, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ordem">Ordem de exibição</Label>
            <Input
              id="ordem"
              type="number"
              min={0}
              value={ordem}
              onChange={(e) => setOrdem(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-slate-400">Menor número aparece primeiro na categoria.</p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-1.5">
        <Label>Conteúdo</Label>
        <TiptapEditor content={conteudo} onChange={setConteudo} />
      </div>
    </div>
  )
}
