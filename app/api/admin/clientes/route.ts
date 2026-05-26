import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import type { StatusPagamento, Plano } from "@/types/database"

export async function GET(request: Request) {
  const { supabase, response } = await requireAdmin()
  if (response) return response

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = 20
  const offset = (page - 1) * limit
  const search = searchParams.get("search") ?? ""
  const status = searchParams.get("status") ?? ""
  const plano = searchParams.get("plano") ?? ""

  let query = supabase!
    .from("clientes")
    .select("id, nome_empresa, cnpj, email, telefone, nome_responsavel, plano, status_pagamento, acesso_liberado, data_assinatura, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`nome_empresa.ilike.%${search}%,cnpj.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (status) {
    query = query.eq("status_pagamento", status as StatusPagamento)
  }
  if (plano) {
    query = query.eq("plano", plano as Plano)
  }

  const { data, count, error } = await query

  if (error) {
    console.error("[clientes] Supabase error:", error)
    return NextResponse.json({ error: `Supabase: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({
    clientes: data ?? [],
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  })
}
