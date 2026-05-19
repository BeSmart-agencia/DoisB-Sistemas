"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navLinks = [
  { label: "Planos", href: "#planos" },
  { label: "Tutoriais", href: "/tutoriais" },
  { label: "Suporte", href: "/suporte" },
  { label: "Chat IA", href: "/chat-suporte" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 gap-4">

        {/* Logos: DoisB + separador + ZWeb */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="/" className="flex items-center">
            <Image
              src="/logos/doisb-color.png"
              alt="DoisB Sistemas"
              width={120}
              height={63}
              className="h-14 w-auto object-contain"
              priority
            />
          </a>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              revenda oficial
            </span>
            <Image
              src="/logos/zweb-color.png"
              alt="ZWeb"
              width={80}
              height={27}
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:block shrink-0">
          <a
            href="/cadastro"
            className={cn(
              buttonVariants({ size: "default" }),
              "bg-blue-800 hover:bg-blue-900 text-white rounded-full px-6 shadow-sm hover:-translate-y-0.5 transition-transform"
            )}
          >
            Assinar agora
          </a>
        </div>

        {/* Menu mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "md:hidden shrink-0"
            )}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-6">
            {/* Logos no menu mobile */}
            <div className="flex flex-col items-center gap-3 mb-8 pt-2 pb-6 border-b border-slate-100">
              <Image
                src="/logos/doisb-color.png"
                alt="DoisB Sistemas"
                width={140}
                height={74}
                className="h-12 w-auto object-contain"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">revenda oficial</span>
                <Image
                  src="/logos/zweb-color.png"
                  alt="ZWeb"
                  width={70}
                  height={23}
                  className="h-5 w-auto object-contain"
                />
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-slate-700 hover:text-blue-800 transition-colors py-2.5 px-2 rounded-lg hover:bg-slate-50"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/cadastro"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "mt-6 bg-blue-800 hover:bg-blue-900 text-white rounded-full w-full justify-center"
                )}
              >
                Assinar agora
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
