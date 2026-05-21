import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function requireAdmin() {
  // Auth check via session cookie
  const sessionClient = await createClient()
  const {
    data: { user },
  } = await sessionClient.auth.getUser()

  if (!user) {
    return {
      admin: null,
      supabase: null,
      response: NextResponse.json({ error: "Não autorizado" }, { status: 401 }),
    }
  }

  // DB operations via service_role — bypasses RLS
  const db = createAdminClient()

  const { data: admin } = await db
    .from("admins")
    .select("id, email, nome, ativo")
    .eq("id", user.id)
    .eq("ativo", true)
    .maybeSingle()

  if (!admin) {
    return {
      admin: null,
      supabase: null,
      response: NextResponse.json({ error: "Acesso negado" }, { status: 403 }),
    }
  }

  return { admin, supabase: db, response: null }
}
