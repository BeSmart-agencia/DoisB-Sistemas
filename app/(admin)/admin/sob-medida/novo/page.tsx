import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProjetoForm } from "../_components/projeto-form"

export const metadata = { title: "Novo projeto | Sob Medida" }

export default function NovoProjetoPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/admin/sob-medida" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Sob Medida
        </Link>
        <h1 className="text-2xl font-bold text-slate-950 mt-2">Novo projeto sob medida</h1>
      </div>
      <ProjetoForm />
    </div>
  )
}
