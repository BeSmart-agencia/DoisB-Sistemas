"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { WifiOff, CreditCard, PackageX, FileWarning, Wifi, Package, FileCheck } from "lucide-react"

const BEFORE = [
  { Icon: WifiOff, title: "Internet caiu, vendas pararam", desc: "Caixa bloqueado, fila crescendo" },
  { Icon: CreditCard, title: "Maquininha desconectada", desc: "Valor digitado duas vezes, erro garantido" },
  { Icon: PackageX, title: "Estoque no chute", desc: "Perda descoberta só no inventário" },
  { Icon: FileWarning, title: "Fiscal bagunçado", desc: "Multa por falta de documento" },
]

const AFTER = [
  { Icon: Wifi, title: "Venda offline garantida", desc: "Retaguarda offline automática" },
  { Icon: CreditCard, title: "Maquininha integrada", desc: "Vero, Stone, PagSeguro e mais" },
  { Icon: Package, title: "Estoque em tempo real", desc: "Alertas e controle automáticos" },
  { Icon: FileCheck, title: "Fiscal descomplicado", desc: "SPED, NF-e, MDF-e organizados" },
]

export function Problemas() {
  const [sliderX, setSliderX] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setSliderX(Math.max(4, Math.min(96, x)))
  }, [])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      updateSlider(e.clientX)
      const onMove = (ev: MouseEvent) => updateSlider(ev.clientX)
      const onUp = () => {
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
      }
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    },
    [updateSlider]
  )

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      updateSlider(e.touches[0].clientX)
      const onMove = (ev: TouchEvent) => updateSlider(ev.touches[0].clientX)
      const onEnd = () => {
        window.removeEventListener("touchmove", onMove)
        window.removeEventListener("touchend", onEnd)
      }
      window.addEventListener("touchmove", onMove, { passive: true })
      window.addEventListener("touchend", onEnd)
    },
    [updateSlider]
  )

  return (
    <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Como o ZWeb transforma sua rotina
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Arraste o divisor e veja a diferença.
          </p>
        </motion.div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className="relative rounded-3xl overflow-hidden select-none cursor-col-resize shadow-2xl"
            style={{ height: "420px", border: "1px solid rgba(0,0,0,0.1)" }}
          >
            {/* BEFORE */}
            <div
              className="absolute inset-0 flex items-center"
              style={{ background: "linear-gradient(135deg, #1a0408 0%, #3a0010 50%, #560018 100%)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-8 py-6 w-full">
                {BEFORE.map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,80,80,0.2)" }}
                  >
                    <div className="shrink-0 h-9 w-9 rounded-lg bg-red-900/40 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{title}</p>
                      <p className="text-red-300/75 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ background: "rgba(185,28,28,0.85)" }}
              >
                ✗ Sem o ZWeb
              </div>
            </div>

            {/* AFTER – clipped by slider */}
            <div
              className="absolute inset-0 flex items-center"
              style={{
                clipPath: `inset(0 ${100 - sliderX}% 0 0)`,
                background: "linear-gradient(135deg, #060e1a 0%, #0a1628 50%, #0d2040 100%)",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-8 py-6 w-full">
                {AFTER.map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                      background: "rgba(20,114,181,0.12)",
                      border: "1px solid rgba(20,114,181,0.28)",
                    }}
                  >
                    <div
                      className="shrink-0 h-9 w-9 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(20,114,181,0.28)" }}
                    >
                      <Icon className="h-4 w-4 text-blue-300" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{title}</p>
                      <p className="text-blue-300/75 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ background: "rgba(20,114,181,0.9)" }}
              >
                ✓ Com o ZWeb
              </div>
            </div>

            {/* Divider handle */}
            <div
              className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
              style={{ left: `${sliderX}%`, transform: "translateX(-50%)", pointerEvents: "none" }}
            >
              <div className="h-full w-px" style={{ background: "rgba(255,255,255,0.85)" }} />
              <div
                className="absolute h-10 w-10 rounded-full flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M6 4l-4 6 4 6M14 4l4 6-4 6"
                    stroke="#0a1628"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
