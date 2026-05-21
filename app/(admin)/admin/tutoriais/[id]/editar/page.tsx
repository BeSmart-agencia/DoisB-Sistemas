"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import TutorialForm from "../../_components/tutorial-form"

export default function EditarTutorialPage() {
  const { id } = useParams<{ id: string }>()

  const { data: tutorial, isLoading } = useQuery({
    queryKey: ["admin-tutorial", id],
    queryFn: () => fetch(`/api/admin/tutoriais/${id}`).then((r) => r.json()),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-5 max-w-5xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!tutorial || tutorial.error) {
    return (
      <div className="p-6 text-slate-500">Tutorial não encontrado.</div>
    )
  }

  return (
    <TutorialForm
      mode="edit"
      initialData={{
        id: tutorial.id,
        titulo: tutorial.titulo ?? "",
        slug: tutorial.slug,
        categoria: tutorial.categoria ?? "",
        resumo: tutorial.resumo ?? "",
        conteudo_html: tutorial.conteudo_html ?? "",
        status: tutorial.status ?? "rascunho",
        ordem: tutorial.ordem ?? 0,
      }}
    />
  )
}
