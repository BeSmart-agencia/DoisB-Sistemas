import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cnpj = searchParams.get("cnpj")?.replace(/\D/g, "") ?? ""

  if (cnpj.length !== 14) {
    return NextResponse.json({ found: false })
  }

  const supabase = createAdminClient()
  const { data } = await supabase
    .from("clientes")
    .select("email, nome_empresa, nome_responsavel")
    .eq("cnpj", cnpj)
    .maybeSingle()

  if (!data) return NextResponse.json({ found: false })

  return NextResponse.json({
    found: true,
    email: data.email,
    nomeEmpresa: data.nome_empresa,
    nomeContato: data.nome_responsavel,
  })
}
