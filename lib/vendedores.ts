import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

/**
 * Resolve o código de um vendedor externo (vindo do cookie de atribuição)
 * para o vendedor_id, apenas se o vendedor existir e estiver ativo.
 * Retorna null se não houver código ou o vendedor for inválido/inativo —
 * nesse caso a venda simplesmente não fica atribuída a ninguém.
 */
export async function resolverVendedorId(
  supabase: SupabaseClient<Database>,
  codigo: unknown
): Promise<string | null> {
  if (typeof codigo !== "string") return null
  const cod = codigo.trim().toLowerCase()
  if (!/^[a-z0-9._-]{2,40}$/.test(cod)) return null

  const { data } = await supabase
    .from("vendedores")
    .select("id")
    .eq("codigo", cod)
    .eq("ativo", true)
    .maybeSingle()

  return data?.id ?? null
}
