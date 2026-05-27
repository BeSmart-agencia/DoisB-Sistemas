"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Store, DatabaseZap, Smartphone, Calculator, MousePointer2 } from "lucide-react"

const ORBIT_R = 145
const CX = 250
const CY = 250
const CYCLE_MS = 4200

function nodePos(angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + ORBIT_R * Math.cos(rad), y: CY + ORBIT_R * Math.sin(rad) }
}

const ITEMS = [
  {
    id: 0, Icon: Store, angle: 90, color: "#1472B5", destaque: true,
    shortName: "Marketplace",
    title: "Venda nos marketplaces",
    subtitle: "Mercado Livre, Amazon, Shopee e mais",
    text: "Integre sua operação com os principais canais digitais do Brasil. Produtos, estoque e pedidos sincronizados automaticamente — sem trabalho duplicado.",
  },
  {
    id: 1, Icon: DatabaseZap, angle: 270, color: "#1472B5", destaque: true,
    shortName: "Migração",
    title: "Migração assistida",
    subtitle: "Troque sem perder o histórico",
    text: "Já usa outro sistema? A equipe DoisB ajuda a importar clientes, produtos e histórico. Você moderniza sua gestão sem começar do zero.",
  },
  {
    id: 2, Icon: Smartphone, angle: 0, color: "#7c3aed", destaque: false,
    shortName: "AppsCloud",
    title: "AppsCloud",
    subtitle: "Gestão no celular, de qualquer lugar",
    text: "Emita NFC-e, consulte estoque, faça pedidos e orçamentos diretamente do celular Android ou da maquininha. Sem depender do computador.",
  },
  {
    id: 3, Icon: Calculator, angle: 180, color: "#0e9f6e", destaque: false,
    shortName: "Fiscal",
    title: "Contador integrado",
    subtitle: "Fiscal automatizado, zero dor de cabeça",
    text: "SPED, Sintegra, MDF-e, NFC-e, NF-e — tudo gerado e organizado automaticamente. Seu contador recebe os arquivos certos, na hora certa.",
  },
]

/* Label offset per angle so text never clips */
function labelAttrs(angleDeg: number, nodeX: number, nodeY: number) {
  const offset = 40
  if (angleDeg === 90)  return { x: nodeX + offset, y: nodeY + 4, anchor: "start" as const }
  if (angleDeg === 270) return { x: nodeX - offset, y: nodeY + 4, anchor: "end" as const }
  if (angleDeg === 0)   return { x: nodeX, y: nodeY - offset + 4, anchor: "middle" as const }
  return               { x: nodeX, y: nodeY + offset + 4, anchor: "middle" as const }
}

export function Vantagens() {
  const [selected, setSelected] = useState(0)
  const [manuallyPicked, setManuallyPicked] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const current = ITEMS[selected]

  useEffect(() => {
    if (manuallyPicked) return
    const id = setInterval(() => setSelected((s) => (s + 1) % ITEMS.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [manuallyPicked])

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3200)
    return () => clearTimeout(t)
  }, [])

  function pick(id: number) {
    setSelected(id)
    setManuallyPicked(true)
    setShowHint(false)
  }

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            O que torna o ZWeb diferente
          </h2>
          <p className="text-lg text-slate-500 mt-3 max-w-xl mx-auto">
            Explore cada diferencial clicando nos pontos da órbita.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* ── Orbital diagram ── */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center py-8"
          >
            {/* px-16 gives horizontal room for the labels that overflow the SVG */}
            <div className="relative w-full max-w-[380px] aspect-square" style={{ overflow: "visible" }}>

              {/* Soft radial bg */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle at center, rgba(20,114,181,0.07) 0%, transparent 68%)" }}
              />

              {/* SVG — overflow:visible prevents label clipping */}
              <svg
                viewBox="0 0 500 500"
                className="absolute inset-0 w-full h-full"
                style={{ overflow: "visible" }}
                aria-hidden
              >
                <defs>
                  {/* Line glow */}
                  <filter id="vg-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  {/* Node drop shadow for white bg */}
                  <filter id="vg-shadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(0,0,0,0.10)" />
                  </filter>
                  {/* Per-node halo gradients */}
                  {ITEMS.map((item) => (
                    <radialGradient key={item.id} id={`vgHalo${item.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={item.color} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={item.color} stopOpacity="0" />
                    </radialGradient>
                  ))}
                </defs>

                {/* Slow-rotating outer dashed ring */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: `${CX}px ${CY}px` }}
                >
                  <circle cx={CX} cy={CY} r={192} fill="none" stroke="rgba(20,114,181,0.1)" strokeWidth="1" strokeDasharray="3 13" />
                </motion.g>

                {/* Main orbit ring */}
                <circle cx={CX} cy={CY} r={ORBIT_R} fill="none" stroke="rgba(20,114,181,0.22)" strokeWidth="1.5" strokeDasharray="6 5" />

                {/* Expanding pulse ring while auto-cycling */}
                {!manuallyPicked && (
                  <motion.circle
                    cx={CX} cy={CY} r={ORBIT_R}
                    fill="none" stroke="rgba(20,114,181,0.18)" strokeWidth="2"
                    animate={{ opacity: [0, 0.7, 0], r: [ORBIT_R, ORBIT_R + 16, ORBIT_R + 28] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}

                {/* Spoke lines center → nodes */}
                {ITEMS.map((item) => {
                  const pos = nodePos(item.angle)
                  const isActive = item.id === selected
                  return (
                    <g key={item.id}>
                      {isActive && (
                        <line
                          x1={CX} y1={CY} x2={pos.x} y2={pos.y}
                          stroke={item.color} strokeWidth="8" strokeOpacity="0.12"
                          strokeLinecap="round" filter="url(#vg-glow)"
                        />
                      )}
                      <line
                        x1={CX} y1={CY} x2={pos.x} y2={pos.y}
                        stroke={isActive ? item.color : "rgba(20,114,181,0.12)"}
                        strokeWidth={isActive ? 1.5 : 1}
                        strokeDasharray={isActive ? "none" : "4 5"}
                        strokeLinecap="round"
                      />
                    </g>
                  )
                })}

                {/* Center circle — white fill, colored border */}
                <circle cx={CX} cy={CY} r={72} fill="rgba(20,114,181,0.05)" />
                <circle cx={CX} cy={CY} r={62} fill="white" stroke={current.color} strokeWidth="2" filter="url(#vg-shadow)" />
                <circle cx={CX} cy={CY} r={53} fill="none" stroke="rgba(20,114,181,0.1)" strokeWidth="1" strokeDasharray="3 4" />
                {/* Pulsing outer ring keyed to selection */}
                <motion.circle
                  key={selected}
                  cx={CX} cy={CY} r={70}
                  fill="none" stroke={current.color} strokeWidth="1.5" strokeOpacity="0.2"
                  animate={{ r: [66, 74, 66], opacity: [0.35, 0.08, 0.35] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <text x={CX} y={CY - 7} textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="700" fontFamily="sans-serif">ZWeb</text>
                <text x={CX} y={CY + 10} textAnchor="middle" fill="rgba(20,114,181,0.65)" fontSize="9.5" fontFamily="sans-serif">diferenciais</text>

                {/* Nodes */}
                {ITEMS.map((item) => {
                  const pos = nodePos(item.angle)
                  const isActive = item.id === selected
                  return (
                    <g key={item.id}>
                      {/* Color halo behind active node */}
                      {isActive && (
                        <circle cx={pos.x} cy={pos.y} r={52} fill={`url(#vgHalo${item.id})`} />
                      )}
                      {/* Expanding pulse ring on inactive (clickability hint) */}
                      {!isActive && (
                        <motion.circle
                          cx={pos.x} cy={pos.y} r={27}
                          fill="none" stroke={item.color} strokeWidth="1"
                          animate={{ r: [25, 38, 50], opacity: [0.55, 0.2, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: item.id * 0.5 }}
                        />
                      )}
                      {/* Destaque dashed outer ring */}
                      {item.destaque && (
                        <circle
                          cx={pos.x} cy={pos.y}
                          r={isActive ? 40 : 33}
                          fill="none" stroke={item.color}
                          strokeWidth={isActive ? "1.5" : "0.8"}
                          strokeDasharray="3 4"
                          opacity={isActive ? "0.5" : "0.22"}
                        />
                      )}
                      {/* Main node: WHITE fill when inactive, colored when active */}
                      <circle
                        cx={pos.x} cy={pos.y}
                        r={isActive ? 28 : 24}
                        fill={isActive ? item.color : "white"}
                        stroke={isActive ? "none" : item.color}
                        strokeWidth="1.5"
                        strokeOpacity={isActive ? "0" : "0.55"}
                        filter="url(#vg-shadow)"
                      />
                    </g>
                  )
                })}

                {/* Short text labels — hidden on mobile to avoid clipping, visible on sm+ */}
                {ITEMS.map((item) => {
                  const pos = nodePos(item.angle)
                  const { x, y, anchor } = labelAttrs(item.angle, pos.x, pos.y)
                  const isActive = item.id === selected
                  return (
                    <text
                      key={item.id}
                      x={x} y={y}
                      textAnchor={anchor}
                      fontSize="11.5"
                      fontWeight={isActive ? "700" : "500"}
                      fontFamily="sans-serif"
                      fill={isActive ? item.color : "rgba(71,85,105,0.85)"}
                      className="hidden sm:inline"
                    >
                      {item.shortName}
                    </text>
                  )
                })}
              </svg>

              {/* HTML icon overlays — outer div handles position, inner motion.button handles hover scale */}
              {ITEMS.map((item) => {
                const pos = nodePos(item.angle)
                const isActive = item.id === selected
                return (
                  <div
                    key={item.id}
                    className="absolute"
                    style={{
                      left: `${(pos.x / 500) * 100}%`,
                      top: `${(pos.y / 500) * 100}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                    }}
                  >
                    <motion.button
                      onClick={() => pick(item.id)}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="flex items-center justify-center rounded-full focus:outline-none"
                      style={{
                        width: isActive ? "56px" : "48px",
                        height: isActive ? "56px" : "48px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label={item.title}
                    >
                      <item.Icon
                        style={{
                          width: isActive ? "21px" : "16px",
                          height: isActive ? "21px" : "16px",
                          color: isActive ? "white" : item.color,
                          transition: "all 0.3s",
                        }}
                      />
                    </motion.button>
                  </div>
                )
              })}

              {/* "Click" hint — fades out after 3.2s */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none whitespace-nowrap"
                    style={{
                      background: "rgba(20,114,181,0.08)",
                      border: "1px solid rgba(20,114,181,0.2)",
                      color: "rgba(20,114,181,0.75)",
                    }}
                  >
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <MousePointer2 className="h-3 w-3" />
                    </motion.div>
                    Clique nos pontos para explorar
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Detail panel ── */}
          <div className="min-h-[300px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {current.destaque && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: current.color }}
                  >
                    ✦ Destaque
                  </span>
                )}

                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${current.color}18` }}
                >
                  <current.Icon className="h-7 w-7" style={{ color: current.color }} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{current.title}</h3>
                  <p className="text-sm font-semibold mt-1" style={{ color: current.color }}>
                    {current.subtitle}
                  </p>
                </div>

                <p className="text-slate-500 leading-relaxed">{current.text}</p>

                {/* Progress dots */}
                <div className="flex items-center gap-2 mt-2">
                  {ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => pick(item.id)}
                      className="relative h-2 rounded-full transition-all duration-300 focus:outline-none overflow-hidden"
                      style={{
                        width: item.id === selected ? "32px" : "8px",
                        background: item.id === selected ? current.color : "rgba(20,114,181,0.15)",
                      }}
                      aria-label={item.title}
                    >
                      {item.id === selected && !manuallyPicked && (
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ background: "rgba(255,255,255,0.45)" }}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                          key={`${selected}-progress`}
                        />
                      )}
                    </button>
                  ))}
                  {!manuallyPicked && (
                    <span className="text-xs ml-1" style={{ color: "rgba(100,116,139,0.55)" }}>
                      explorando automaticamente
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
