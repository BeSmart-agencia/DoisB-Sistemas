import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QueryProvider } from "@/lib/providers/query-provider"
import { Sidebar } from "./_components/sidebar"
import { Toaster } from "sonner"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: admin } = await supabase
    .from("admins")
    .select("nome, email")
    .eq("id", user.id)
    .eq("ativo", true)
    .maybeSingle()

  if (!admin) redirect("/login?acesso=negado")

  return (
    <QueryProvider>
      <div className="min-h-screen admin-soft-bg">
        <Sidebar adminNome={admin.nome} adminEmail={admin.email} />
        <div className="lg:pl-64">
          <main className="page-shell px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </QueryProvider>
  )
}
