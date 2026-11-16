import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cnpj = searchParams.get("cnpj")?.replace(/\D/g, "") ?? ""

  if (cnpj.length !== 14) {
    return NextResponse.json({ found: false })
  }

  const supabase = createAdminClient()
  // Um CNPJ pode ter um cliente por produto — para o autofill qualquer um serve.
  const { data: rows } = await supabase
    .from("clientes")
    .select("email, nome_empresa, nome_responsavel")
    .eq("cnpj", cnpj)
    .limit(1)
  const data = rows?.[0]

  if (!data) return NextResponse.json({ found: false })

  return NextResponse.json({
    found: true,
    email: data.email,
    nomeEmpresa: data.nome_empresa,
    nomeContato: data.nome_responsavel,
  })
}
