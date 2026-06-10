export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type StatusPagamento = "aguardando" | "ativo" | "atrasado" | "cancelado"
export type Plano = "essencial" | "standard" | "premium"
export type StatusChamado = "a_atender" | "em_andamento" | "aguardando_cliente" | "resolvido" | "cancelado"
export type PrioridadeChamado = "baixa" | "media" | "alta" | "urgente"
export type AutorMensagem = "cliente" | "equipe"
export type StatusLead = "a_enviar" | "1_msg" | "2_msg" | "3_msg" | "interessado" | "em_negociacao" | "fechado" | "perdido" | "sem_resposta"

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: { id: string; email: string; nome: string; ativo: boolean; created_at: string }
        Insert: { id: string; email: string; nome: string; ativo?: boolean; created_at?: string }
        Update: { id?: string; email?: string; nome?: string; ativo?: boolean; created_at?: string }
        Relationships: []
      }
      clientes: {
        Row: {
          id: string; nome_empresa: string; cnpj: string; email: string; telefone: string
          nome_responsavel: string; plano: Plano; status_pagamento: StatusPagamento
          acesso_liberado: boolean; stripe_customer_id: string | null
          stripe_subscription_id: string | null; data_assinatura: string | null
          observacoes: string | null; created_at: string
          forma_pagamento: "cartao" | "boleto" | "pix"; pix_vencimento: string | null; pix_charge_id: string | null
          nome_fantasia: string | null; ie: string | null; im: string | null; crt: string | null
          cep: string | null; logradouro: string | null; numero: string | null; complemento: string | null
          bairro: string | null; cidade: string | null; estado: string | null
        }
        Insert: {
          id?: string; nome_empresa: string; cnpj: string; email: string; telefone: string
          nome_responsavel: string; plano: Plano; status_pagamento?: StatusPagamento
          acesso_liberado?: boolean; stripe_customer_id?: string | null
          stripe_subscription_id?: string | null; data_assinatura?: string | null
          observacoes?: string | null; created_at?: string
          forma_pagamento?: "cartao" | "boleto" | "pix"; pix_vencimento?: string | null; pix_charge_id?: string | null
          nome_fantasia?: string | null; ie?: string | null; im?: string | null; crt?: string | null
          cep?: string | null; logradouro?: string | null; numero?: string | null; complemento?: string | null
          bairro?: string | null; cidade?: string | null; estado?: string | null
        }
        Update: {
          id?: string; nome_empresa?: string; cnpj?: string; email?: string; telefone?: string
          nome_responsavel?: string; plano?: Plano; status_pagamento?: StatusPagamento
          acesso_liberado?: boolean; stripe_customer_id?: string | null
          stripe_subscription_id?: string | null; data_assinatura?: string | null
          observacoes?: string | null; created_at?: string
          forma_pagamento?: "cartao" | "boleto" | "pix"; pix_vencimento?: string | null; pix_charge_id?: string | null
          nome_fantasia?: string | null; ie?: string | null; im?: string | null; crt?: string | null
          cep?: string | null; logradouro?: string | null; numero?: string | null; complemento?: string | null
          bairro?: string | null; cidade?: string | null; estado?: string | null
        }
        Relationships: []
      }
      chamados: {
        Row: {
          id: number; cliente_id: string | null; cnpj_informado: string; email_retorno: string
          assunto: string; descricao: string; status: StatusChamado; prioridade: PrioridadeChamado
          atendente_id: string | null; created_at: string; atualizado_em: string; resolvido_em: string | null
        }
        Insert: {
          id?: number; cliente_id?: string | null; cnpj_informado: string; email_retorno: string
          assunto: string; descricao: string; status?: StatusChamado; prioridade?: PrioridadeChamado
          atendente_id?: string | null; created_at?: string; atualizado_em?: string; resolvido_em?: string | null
        }
        Update: {
          id?: number; cliente_id?: string | null; cnpj_informado?: string; email_retorno?: string
          assunto?: string; descricao?: string; status?: StatusChamado; prioridade?: PrioridadeChamado
          atendente_id?: string | null; created_at?: string; atualizado_em?: string; resolvido_em?: string | null
        }
        Relationships: [
          { foreignKeyName: "chamados_cliente_id_fkey"; columns: ["cliente_id"]; isOneToOne: false; referencedRelation: "clientes"; referencedColumns: ["id"] },
          { foreignKeyName: "chamados_atendente_id_fkey"; columns: ["atendente_id"]; isOneToOne: false; referencedRelation: "admins"; referencedColumns: ["id"] }
        ]
      }
      chamado_mensagens: {
        Row: {
          id: string; chamado_id: number; autor: AutorMensagem; autor_nome: string
          conteudo: string; created_at: string
        }
        Insert: {
          id?: string; chamado_id: number; autor: AutorMensagem; autor_nome: string
          conteudo: string; created_at?: string
        }
        Update: {
          id?: string; chamado_id?: number; autor?: AutorMensagem; autor_nome?: string
          conteudo?: string; created_at?: string
        }
        Relationships: [
          { foreignKeyName: "chamado_mensagens_chamado_id_fkey"; columns: ["chamado_id"]; isOneToOne: false; referencedRelation: "chamados"; referencedColumns: ["id"] }
        ]
      }
      tutoriais: {
        Row: {
          id: string; titulo: string; slug: string; categoria: string
          resumo: string | null; conteudo_html: string | null
          status: string; ordem: number; created_at: string; atualizado_em: string
        }
        Insert: {
          id?: string; titulo: string; slug: string; categoria: string
          resumo?: string | null; conteudo_html?: string | null
          status?: string; ordem?: number; created_at?: string; atualizado_em?: string
        }
        Update: {
          id?: string; titulo?: string; slug?: string; categoria?: string
          resumo?: string | null; conteudo_html?: string | null
          status?: string; ordem?: number; created_at?: string; atualizado_em?: string
        }
        Relationships: []
      }
      documentos: {
        Row: {
          id: string; nome_arquivo: string; categoria: string | null
          conteudo_texto: string; tutorial_id: string | null; created_at: string
        }
        Insert: {
          id?: string; nome_arquivo: string; categoria?: string | null
          conteudo_texto: string; tutorial_id?: string | null; created_at?: string
        }
        Update: {
          id?: string; nome_arquivo?: string; categoria?: string | null
          conteudo_texto?: string; tutorial_id?: string | null; created_at?: string
        }
        Relationships: [
          { foreignKeyName: "documentos_tutorial_id_fkey"; columns: ["tutorial_id"]; isOneToOne: false; referencedRelation: "tutoriais"; referencedColumns: ["id"] }
        ]
      }
      leads: {
        Row: {
          id: string; google_place_id: string | null; nome: string; segmento: string | null
          cidade: string | null; estado: string | null; endereco: string | null; telefone: string | null
          rating: number | null; lat: number | null; lng: number | null; status: StatusLead
          observacoes: string | null; ultima_interacao: string | null; responsavel_id: string | null
          created_at: string; atualizado_em: string
        }
        Insert: {
          id?: string; google_place_id?: string | null; nome: string; segmento?: string | null
          cidade?: string | null; estado?: string | null; endereco?: string | null; telefone?: string | null
          rating?: number | null; lat?: number | null; lng?: number | null; status?: StatusLead
          observacoes?: string | null; ultima_interacao?: string | null; responsavel_id?: string | null
          created_at?: string; atualizado_em?: string
        }
        Update: {
          id?: string; google_place_id?: string | null; nome?: string; segmento?: string | null
          cidade?: string | null; estado?: string | null; endereco?: string | null; telefone?: string | null
          rating?: number | null; lat?: number | null; lng?: number | null; status?: StatusLead
          observacoes?: string | null; ultima_interacao?: string | null; responsavel_id?: string | null
          created_at?: string; atualizado_em?: string
        }
        Relationships: [
          { foreignKeyName: "leads_responsavel_id_fkey"; columns: ["responsavel_id"]; isOneToOne: false; referencedRelation: "admins"; referencedColumns: ["id"] }
        ]
      }
      lead_interacoes: {
        Row: {
          id: string; lead_id: string; tipo: string; descricao: string
          admin_id: string | null; admin_nome: string | null; created_at: string
        }
        Insert: {
          id?: string; lead_id: string; tipo: string; descricao: string
          admin_id?: string | null; admin_nome?: string | null; created_at?: string
        }
        Update: {
          id?: string; lead_id?: string; tipo?: string; descricao?: string
          admin_id?: string | null; admin_nome?: string | null; created_at?: string
        }
        Relationships: [
          { foreignKeyName: "lead_interacoes_lead_id_fkey"; columns: ["lead_id"]; isOneToOne: false; referencedRelation: "leads"; referencedColumns: ["id"] }
        ]
      }
      stripe_events: {
        Row: { id: string; tipo: string; payload: Json; processado_em: string }
        Insert: { id: string; tipo: string; payload: Json; processado_em?: string }
        Update: { id?: string; tipo?: string; payload?: Json; processado_em?: string }
        Relationships: []
      }
      documento_chunks: {
        Row: {
          id: string; documento_id: string; conteudo: string
          chunk_index: number; embedding: string | null; created_at: string
        }
        Insert: {
          id?: string; documento_id: string; conteudo: string
          chunk_index: number; embedding?: string | null; created_at?: string
        }
        Update: {
          id?: string; documento_id?: string; conteudo?: string
          chunk_index?: number; embedding?: string | null; created_at?: string
        }
        Relationships: [
          { foreignKeyName: "documento_chunks_documento_id_fkey"; columns: ["documento_id"]; isOneToOne: false; referencedRelation: "documentos"; referencedColumns: ["id"] }
        ]
      }
      conversas_ia: {
        Row: {
          id: string; sessao_id: string; pergunta: string; resposta: string
          chunks_ids: string[]; sem_resposta: boolean; created_at: string
        }
        Insert: {
          id?: string; sessao_id: string; pergunta: string; resposta: string
          chunks_ids?: string[]; sem_resposta?: boolean; created_at?: string
        }
        Update: {
          id?: string; sessao_id?: string; pergunta?: string; resposta?: string
          chunks_ids?: string[]; sem_resposta?: boolean; created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      match_documents: {
        Args: {
          query_embedding: number[]
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          documento_id: string
          conteudo: string
          similarity: number
        }[]
      }
    }
    Enums: { status_pagamento: StatusPagamento; plano: Plano }
  }
}
