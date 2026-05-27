"use client"

import { motion } from "framer-motion"
import { Wrench, Shirt, ShoppingCart, Cookie, Laptop, HeartHandshake } from "lucide-react"
import { MeshGradient, NeuroNoise, DotOrbit } from "@paper-design/shaders-react"

const shaderStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
}

const segmentos = [
  {
    Icon: Wrench,
    title: "Oficinas Mecânicas",
    desc: "OS, peças, serviços e garantia. Tudo integrado do orçamento à NF-e.",
    renderBg: () => (
      <MeshGradient
        style={shaderStyle}
        colors={["#0a1628", "#1472B5", "#0e3a6e", "#060e1a"]}
        speed={0.25}
        distortion={0.35}
      />
    ),
  },
  {
    Icon: Shirt,
    title: "Vestuário e Calçados",
    desc: "Controle de grades por tamanho e cor, etiquetas e vitrine digital.",
    renderBg: () => (
      <NeuroNoise
        style={shaderStyle}
        colorFront="#7c3aed"
        colorMid="#4c1d95"
        colorBack="#1a0040"
        speed={0.35}
        brightness={1.1}
      />
    ),
  },
  {
    Icon: ShoppingCart,
    title: "Mercados e Minimercados",
    desc: "PDV ágil, balança integrada e controle de validade de produtos.",
    renderBg: () => (
      <MeshGradient
        style={shaderStyle}
        colors={["#052e16", "#166534", "#15803d", "#14532d"]}
        speed={0.2}
        distortion={0.3}
      />
    ),
  },
  {
    Icon: Cookie,
    title: "Empórios e Padarias",
    desc: "Produção, fichas técnicas, pesagem e frente de caixa rápida.",
    renderBg: () => (
      <MeshGradient
        style={shaderStyle}
        colors={["#431407", "#9a3412", "#c2410c", "#7c2d12"]}
        speed={0.28}
        distortion={0.45}
        swirl={0.2}
      />
    ),
  },
  {
    Icon: Laptop,
    title: "Assistências Técnicas",
    desc: "OS detalhada com objeto, identificadores e situações personalizadas.",
    renderBg: () => (
      <NeuroNoise
        style={shaderStyle}
        colorFront="#0e7490"
        colorMid="#155e75"
        colorBack="#083344"
        speed={0.3}
        contrast={1.1}
      />
    ),
  },
  {
    Icon: HeartHandshake,
    title: "Prestadores de Serviço",
    desc: "Orçamentos, NFS-e e cobrança recorrente integrada.",
    renderBg: () => (
      <DotOrbit
        style={shaderStyle}
        colorBack="#060e1a"
        colors={["#1472B5", "#0e3a6e", "#7c3aed"]}
        speed={0.4}
        size={0.06}
        spreading={0.7}
      />
    ),
  },
]

export function Segmentos() {
  return (
    <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Feito para o varejo que você conhece
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Não importa o seu segmento — temos a configuração certa pra você.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {segmentos.map(({ Icon, title, desc, renderBg }, i) => (
            <motion.div
              key={i}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-2xl cursor-default"
              style={{ minHeight: "200px" }}
            >
              {/* WebGL shader background */}
              <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                {renderBg()}
              </div>

              {/* Dark overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-end" style={{ minHeight: "200px" }}>
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-base mb-1.5">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: "inset 0 0 0 1.5px rgba(20,114,181,0.5)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
