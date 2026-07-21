"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Target,
  Goal,
  Headphones,
  Megaphone,
  BookOpen,
  Library,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Target },
  { href: "/admin/marketing", label: "Marketing OS", icon: Megaphone },
  { href: "/admin/metas", label: "Metas", icon: Goal },
  { href: "/admin/suporte", label: "Suporte", icon: Headphones },
  { href: "/admin/tutoriais", label: "Tutoriais", icon: BookOpen },
  { href: "/admin/conhecimento", label: "Base de Conhecimento", icon: Library },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
]

interface SidebarProps {
  adminNome: string
  adminEmail: string
}

export function Sidebar({ adminNome, adminEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const navContent = (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-800 shadow-lg shadow-blue-950/20">
            <span className="text-sm font-black">2B</span>
          </div>
          <div>
            <p className="font-bold text-white leading-none">DoisB</p>
            <p className="text-xs font-medium text-blue-200 mt-1">Painel operacional</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-white text-blue-900 shadow-lg shadow-blue-950/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-blue-500" />}
            </Link>
          )
        })}
      </div>

      {/* Usuário + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="mx-1 mb-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
          <p className="text-sm font-medium text-white truncate">{adminNome}</p>
          <p className="text-xs text-slate-400 truncate mt-0.5">{adminEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-950 min-h-screen fixed left-0 top-0 bottom-0 z-30 shadow-2xl shadow-slate-950/20">
        {navContent}
      </aside>

      {/* Mobile: hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile: overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile: drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-slate-950 z-50 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Fechar menu"
        >
          <X className="h-4 w-4" />
        </button>
        {navContent}
      </aside>
    </>
  )
}
