"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { Bot, Send, Trash2, User, Headphones, ChevronRight } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

// ── Tipos ────────────────────────────────────────────────────────────────────
interface Mensagem {
  id: string
  role: "user" | "assistant"
  content: string
  streaming?: boolean
  loading?: boolean
}

// ── Sessão persistente ────────────────────────────────────────────────────────
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

// ── Componente principal ─────────────────────────────────────────────────────
export default function ChatSuportePage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([MSG_INICIAL])
  const [input, setInput] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [sessaoId, setSessaoId] = useState("")

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  // Inicializar sessão no cliente
  useEffect(() => {
    setSessaoId(getSessaoId())
  }, [])

  // Auto-scroll para a última mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  // Auto-resize do textarea
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

  const enviar = useCallback(async () => {
    const texto = input.trim()
    if (!texto || enviando || !sessaoId) return

    setInput("")
    setEnviando(true)

    // Reset altura do textarea
    if (inputRef.current) inputRef.current.style.height = "auto"

    const userMsg: Mensagem = {
      id: crypto.randomUUID(),
      role: "user",
      content: texto,
    }

    const loadingId = crypto.randomUUID()
    const loadingMsg: Mensagem = {
      id: loadingId,
      role: "assistant",
      content: "",
      loading: true,
    }

    setMensagens((prev) => [...prev, userMsg, loadingMsg])

    // Histórico para a API (sem a mensagem inicial fixa e sem o loading)
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

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let resposta = ""

      while (true) {
        const { done, value } = await reader.read()
        console.log("[chat] read:", { done, bytes: value?.length })
        if (done) break

        const text = decoder.decode(value, { stream: true })
        resposta += text

        setMensagens((prev) =>
          prev.map((m) =>
            m.id === loadingId
              ? { ...m, loading: false, streaming: true, content: resposta }
              : m
          )
        )
      }

      // Finalizar
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
            ? {
                ...m,
                loading: false,
                streaming: false,
                content:
                  "Desculpe, tive um problema para processar sua pergunta. Tente novamente.",
              }
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

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex-none bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">Assistente DoisB</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Online · ZWeb</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/suporte"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Headphones className="h-3.5 w-3.5" />
              Suporte humano
            </Link>
            <button
              onClick={limparConversa}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mensagens ──────────────────────────────────────────────────── */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              {msg.role === "assistant" ? (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}

              {/* Bolha */}
              <div
                className={cn(
                  "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-blue-800 text-white rounded-tr-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                )}
              >
                {msg.loading ? (
                  /* Dots animados */
                  <div className="flex items-center gap-1.5 py-0.5 px-1">
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                  </div>
                ) : msg.role === "assistant" ? (
                  <div className="relative prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:my-2 prose-pre:my-2 prose-code:text-blue-800 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-a:text-blue-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                    {msg.streaming && (
                      <span className="inline-block h-4 w-0.5 bg-slate-400 animate-pulse ml-0.5 align-middle" />
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

      {/* ── Footer: CTA + Input ─────────────────────────────────────────── */}
      <div className="flex-none bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.05)]">
        {/* CTA */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-3">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
            Não encontrou o que queria?
            <Link
              href="/suporte"
              className="inline-flex items-center gap-0.5 text-blue-700 font-semibold hover:underline underline-offset-2"
            >
              Abrir chamado de suporte
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Input */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div
            className={cn(
              "flex items-end gap-3 bg-white border rounded-2xl px-4 py-3 transition-all",
              enviando
                ? "border-blue-300 ring-1 ring-blue-100"
                : "border-slate-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100"
            )}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre qualquer funcionalidade do ZWeb..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none leading-relaxed"
              style={{ minHeight: "24px", maxHeight: "160px" }}
              rows={1}
              disabled={enviando}
            />
            <button
              onClick={enviar}
              disabled={!input.trim() || enviando}
              className="h-8 w-8 rounded-xl bg-blue-800 hover:bg-blue-900 text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-md disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  )
}
