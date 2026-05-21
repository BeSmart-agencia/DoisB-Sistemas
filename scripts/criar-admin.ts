/**
 * Cria um admin no Supabase Auth e na tabela admins.
 *
 * Como rodar (Node.js v18+):
 *   node --env-file .env.local --import tsx/esm scripts/criar-admin.ts
 *
 * Ou com npx:
 *   npx dotenv -e .env.local -- npx tsx scripts/criar-admin.ts
 */

import { createClient } from "@supabase/supabase-js"
import * as readline from "readline"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  console.log("\n=== Criar Admin DoisB Sistemas ===\n")

  const nome = await prompt(rl, "Nome: ")
  const email = await prompt(rl, "E-mail: ")
  const senha = await prompt(rl, "Senha (mín. 8 caracteres): ")

  rl.close()

  if (!nome || !email || senha.length < 8) {
    console.error("\n❌ Dados inválidos. Nome e e-mail obrigatórios, senha mín. 8 caracteres.")
    process.exit(1)
  }

  console.log("\n⏳ Criando usuário no Supabase Auth...")

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    console.error("❌ Erro ao criar usuário:", authError?.message)
    process.exit(1)
  }

  console.log("⏳ Inserindo na tabela admins...")

  const { error: insertError } = await supabase.from("admins").insert({
    id: authData.user.id,
    email,
    nome,
    ativo: true,
  })

  if (insertError) {
    // Rollback: remove o usuário do Auth
    await supabase.auth.admin.deleteUser(authData.user.id)
    console.error("❌ Erro ao inserir admin:", insertError.message)
    process.exit(1)
  }

  console.log(`\n✅ Admin criado com sucesso!`)
  console.log(`   Nome:  ${nome}`)
  console.log(`   Email: ${email}`)
  console.log(`   ID:    ${authData.user.id}`)
  console.log("\nAcesse /login com essas credenciais.\n")
}

main().catch((err) => {
  console.error("Erro inesperado:", err)
  process.exit(1)
})
