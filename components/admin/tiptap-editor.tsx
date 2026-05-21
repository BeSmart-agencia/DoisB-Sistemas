"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExt from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Placeholder from "@tiptap/extension-placeholder"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import {
  Bold, Italic, List, ListOrdered, Quote, Code2,
  Heading2, Heading3, Image as ImageIcon, TableIcon, Minus, Undo, Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"

const lowlight = createLowlight(common)

// ─── Toolbar ─────────────────────────────────────────────────────────────────
function ToolBtn({
  onClick, active, title, children, disabled,
}: {
  onClick: () => void
  active?: boolean
  title?: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        active && "bg-blue-100 text-blue-800"
      )}
    >
      {children}
    </button>
  )
}

function Separator() {
  return <div className="w-px h-5 bg-slate-300 mx-0.5" />
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  function inserirImagem() {
    const url = prompt("URL da imagem (ou cole uma URL pública):")
    if (url) editor!.chain().focus().setImage({ src: url }).run()
  }

  function inserirTabela() {
    editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 bg-slate-50 border-b border-slate-200 p-2">
      {/* Undo / Redo */}
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Desfazer" disabled={!editor.can().undo()}>
        <Undo className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Refazer" disabled={!editor.can().redo()}>
        <Redo className="h-4 w-4" />
      </ToolBtn>

      <Separator />

      {/* Headings */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Título H2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Título H3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolBtn>

      <Separator />

      {/* Text formatting */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Negrito"
      >
        <Bold className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Itálico"
      >
        <Italic className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Código inline"
      >
        <Code2 className="h-4 w-4" />
      </ToolBtn>

      <Separator />

      {/* Lists */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Lista com marcadores"
      >
        <List className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Lista numerada"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolBtn>

      <Separator />

      {/* Block */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Citação"
      >
        <Quote className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Bloco de código"
      >
        <Code2 className="h-4 w-4 opacity-70" />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Separador"
      >
        <Minus className="h-4 w-4" />
      </ToolBtn>

      <Separator />

      {/* Image & Table */}
      <ToolBtn onClick={inserirImagem} title="Inserir imagem por URL">
        <ImageIcon className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn onClick={inserirTabela} title="Inserir tabela">
        <TableIcon className="h-4 w-4" />
      </ToolBtn>
    </div>
  )
}

// ─── Editor ───────────────────────────────────────────────────────────────────
interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  className?: string
}

export function TiptapEditor({ content, onChange, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-lg max-w-full h-auto my-4", alt: "" } }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: "Escreva o conteúdo do tutorial aqui..." }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-slate prose-headings:text-slate-900 prose-a:text-blue-700 max-w-none p-5 min-h-[400px] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  })

  return (
    <div className={cn("border border-slate-200 rounded-xl overflow-hidden bg-white", className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
