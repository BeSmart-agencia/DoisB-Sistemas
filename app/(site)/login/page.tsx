"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Lock } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/admin"

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro("E-mail ou senha inválidos.")
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-800 mb-4 shadow-xl shadow-blue-950/30">
          <Lock className="h-6 w-6 text-blue-800" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">DoisB Admin</h1>
        <p className="text-slate-400 text-sm mt-1">Acesso restrito ao painel operacional</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/10 p-8 space-y-5 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
      >
        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">E-mail</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:border-blue-400 [&:-webkit-autofill]:![box-shadow:0_0_0_30px_#020617_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:white]"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Senha</Label>
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus-visible:border-blue-400 [&:-webkit-autofill]:![box-shadow:0_0_0_30px_#020617_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:white]"
          />
        </div>

        {erro && (
          <p className="text-sm text-red-200 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
            {erro}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-slate-950 hover:bg-blue-50 font-bold h-10"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
        </Button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
