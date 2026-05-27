"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Bot, Send, Trash2, User, Headphones, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface Mensagem {
  id: string
  role: "user" | "assistant"
  content: string
  streaming?: boolean
  loading?: boolean
}

function getSessaoId(): string {
  const key = "doisb_chat_sessao_id"
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(key, id)
  return id
}

const MSG_INICIAL: Mensagem = {
  id: "boas-vindas",
  role: "assistant",
  content: `Olá! Sou o assistente da **DoisB Sistemas** 👋

Posso responder suas dúvidas sobre o **ZWeb** com base nos manuais oficiais do sistema.

Sobre o que você precisa de ajuda hoje?`,
}

const SUGESTOES = [
  "Como emitir uma NF-e?",
  "Como usar o PDV?",
  "Configurar maquininha",
  "Venda offline, como funciona?",
  "Como cadastrar um produto?",
]

export default function ChatSuportePage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([MSG_INICIAL])
  const [input, setInput] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [sessaoId, setSessaoId] = useState("")

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSessaoId(getSessaoId())
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  const limparConversa = useCallback(() => {
    abortRef.current?.abort()
    const novoId = crypto.randomUUID()
    localStorage.setItem("doisb_chat_sessao_id", novoId)
    setSessaoId(novoId)
    setMensagens([MSG_INICIAL])
    setInput("")
    setEnviando(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const enviar = useCallback(async (texto?: string) => {
    const msg = (texto ?? input).trim()
    if (!msg || enviando || !sessaoId) return

    setInput("")
    setEnviando(true)

    if (inputRef.current) inputRef.current.style.height = "auto"

    const userMsg: Mensagem = { id: crypto.randomUUID(), role: "user", content: msg }
    const loadingId = crypto.randomUUID()
    const loadingMsg: Mensagem = { id: loadingId, role: "assistant", content: "", loading: true }

    setMensagens((prev) => [...prev, userMsg, loadingMsg])

    const historico = [...mensagens.filter((m) => m.id !== "boas-vindas"), userMsg].map(
      (m) => ({ role: m.role, content: m.content })
    )

    try {
      abortRef.current = new AbortController()
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: historico, sessao_id: sessaoId }),
        signal: abortRef.current.signal,
      })

      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let resposta = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        resposta += decoder.decode(value, { stream: true })
        setMensagens((prev) =>
          prev.map((m) =>
            m.id === loadingId ? { ...m, loading: false, streaming: true, content: resposta } : m
          )
        )
      }

      setMensagens((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, loading: false, streaming: false, content: resposta || "_(sem resposta)_" }
            : m
        )
      )
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setMensagens((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, loading: false, streaming: false, content: "Desculpe, tive um problema. Tente novamente." }
            : m
        )
      )
    } finally {
      setEnviando(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [input, enviando, sessaoId, mensagens])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  const somenteInicial = mensagens.length === 1 && mensagens[0].id === "boas-vindas"

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, #060e1a 0%, #0a1628 100%)" }}
    >
      {/* Gradient decorations */}
      <div
        className="absolute top-0 right-0 pointer-events-none z-0"
        style={{
          width: "40rem",
          height: "40rem",
          background: "radial-gradient(ellipse at top right, rgba(20,114,181,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none z-0"
        style={{
          width: "30rem",
          height: "30rem",
          background: "radial-gradient(ellipse at bottom left, rgba(20,114,181,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="relative z-10 flex-none"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(145deg, #1a5fa8 0%, #0e3a6e 100%)" }}
              >
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 shadow-sm"
                style={{ borderColor: "#06111e" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Assistente DoisB</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "rgba(52,211,153,0.9)" }}>
                Online · ZWeb
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/suporte"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ color: "rgba(147,197,253,0.7)" }}
            >
              <Headphones className="h-3.5 w-3.5" />
              Suporte humano
            </Link>
            <button
              onClick={limparConversa}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ color: "rgba(148,163,184,0.6)" }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mensagens ──────────────────────────────────────────────────── */}
      <div ref={messagesRef} className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex items-start gap-3", msg.role === "user" && "flex-row-reverse")}
            >
              {/* Avatar */}
              {msg.role === "assistant" ? (
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5"
                  style={{ background: "linear-gradient(145deg, #1a5fa8 0%, #0e3a6e 100%)" }}
                >
                  <Bot className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <User className="h-4 w-4" style={{ color: "rgba(147,197,253,0.8)" }} />
                </div>
              )}

              {/* Bolha */}
              <div
                className={cn("max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed", msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm")}
                style={
                  msg.role === "user"
                    ? { background: "linear-gradient(145deg, #1a5fa8 0%, #1060a0 100%)", color: "white", boxShadow: "0 4px 16px rgba(20,114,181,0.3)" }
                    : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(226,232,240,0.9)" }
                }
              >
                {msg.loading ? (
                  <div className="flex items-center gap-1.5 py-0.5 px-1">
                    <span className="h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ background: "rgba(147,197,253,0.6)" }} />
                    <span className="h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ background: "rgba(147,197,253,0.6)" }} />
                    <span className="h-2 w-2 rounded-full animate-bounce" style={{ background: "rgba(147,197,253,0.6)" }} />
                  </div>
                ) : msg.role === "assistant" ? (
                  <div className="relative prose prose-sm max-w-none prose-invert prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:my-2 prose-pre:my-2 prose-code:text-blue-300 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded prose-a:text-blue-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    {msg.streaming && (
                      <span className="inline-block h-4 w-0.5 animate-pulse ml-0.5 align-middle" style={{ background: "rgba(147,197,253,0.7)" }} />
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Sugestões (só quando não tem mensagem do usuário ainda) ──── */}
      {somenteInicial && (
        <div className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 pb-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGESTOES.map((s) => (
              <button
                key={s}
                onClick={() => enviar(s)}
                className="text-sm rounded-full px-4 py-2 transition-all hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(147,197,253,0.8)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ──────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-none"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div
            className="flex items-end gap-2 rounded-2xl px-3 py-2.5 transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: enviando ? "1px solid rgba(20,114,181,0.6)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: enviando ? "0 0 0 3px rgba(20,114,181,0.1)" : "none",
            }}
          >
            <div
              className="p-2 rounded-xl shrink-0"
              style={{ background: "rgba(20,114,181,0.15)" }}
            >
              <Sparkles className="h-4 w-4" style={{ color: "rgba(147,197,253,0.8)" }} />
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre qualquer funcionalidade do ZWeb..."
              className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
              style={{
                color: "rgba(226,232,240,0.9)",
                minHeight: "24px",
                maxHeight: "160px",
              }}
              rows={1}
              disabled={enviando}
            />
            <button
              onClick={() => enviar()}
              disabled={!input.trim() || enviando}
              className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(145deg, #1a5fa8 0%, #0e3a6e 100%)",
                color: "white",
                boxShadow: "0 4px 12px rgba(20,114,181,0.4)",
              }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] text-center mt-2" style={{ color: "rgba(100,116,139,0.6)" }}>
            Enter para enviar · Shift+Enter para nova linha ·{" "}
            <Link href="/suporte" className="underline underline-offset-2 hover:opacity-80" style={{ color: "rgba(147,197,253,0.5)" }}>
              abrir chamado
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
