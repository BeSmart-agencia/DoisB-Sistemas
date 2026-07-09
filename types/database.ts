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
      brand_kit: {
        Row: { id: string; key: string; value: Json; updated_at: string }
        Insert: { id?: string; key: string; value: Json; updated_at?: string }
        Update: { id?: string; key?: string; value?: Json; updated_at?: string }
        Relationships: []
      }
      icp: {
        Row: {
          id: string; nome: string; segmento: string
          dores: Json | null; objecoes: Json | null; gatilhos: Json | null; ativo: boolean
        }
        Insert: {
          id?: string; nome: string; segmento: string
          dores?: Json | null; objecoes?: Json | null; gatilhos?: Json | null; ativo?: boolean
        }
        Update: {
          id?: string; nome?: string; segmento?: string
          dores?: Json | null; objecoes?: Json | null; gatilhos?: Json | null; ativo?: boolean
        }
        Relationships: []
      }
      marketing_plans: {
        Row: {
          id: string; mes: string; objetivos: Json | null; alocacao_orcamento: Json | null
          hipoteses: Json | null; created_by: string; created_at: string
        }
        Insert: {
          id?: string; mes: string; objetivos?: Json | null; alocacao_orcamento?: Json | null
          hipoteses?: Json | null; created_by?: string; created_at?: string
        }
        Update: {
          id?: string; mes?: string; objetivos?: Json | null; alocacao_orcamento?: Json | null
          hipoteses?: Json | null; created_by?: string; created_at?: string
        }
        Relationships: []
      }
      copy_library: {
        Row: {
          id: string; canal: string; formato: string | null; angulo: string | null
          categoria: string | null; titulo: string | null; corpo: string; status: string
          performance: Json | null; linha: string; created_at: string
        }
        Insert: {
          id?: string; canal: string; formato?: string | null; angulo?: string | null
          categoria?: string | null; titulo?: string | null; corpo: string; status?: string
          performance?: Json | null; linha?: string; created_at?: string
        }
        Update: {
          id?: string; canal?: string; formato?: string | null; angulo?: string | null
          categoria?: string | null; titulo?: string | null; corpo?: string; status?: string
          performance?: Json | null; linha?: string; created_at?: string
        }
        Relationships: []
      }
      content_calendar: {
        Row: {
          id: string; data_prevista: string | null; pilar: string; formato: string | null
          plataforma: string | null; roteiro: string | null; copy_legenda: string | null
          hashtags: string | null; status: string; copy_id: string | null; linha: string
        }
        Insert: {
          id?: string; data_prevista?: string | null; pilar: string; formato?: string | null
          plataforma?: string | null; roteiro?: string | null; copy_legenda?: string | null
          hashtags?: string | null; status?: string; copy_id?: string | null; linha?: string
        }
        Update: {
          id?: string; data_prevista?: string | null; pilar?: string; formato?: string | null
          plataforma?: string | null; roteiro?: string | null; copy_legenda?: string | null
          hashtags?: string | null; status?: string; copy_id?: string | null; linha?: string
        }
        Relationships: [
          { foreignKeyName: "content_calendar_copy_id_fkey"; columns: ["copy_id"]; isOneToOne: false; referencedRelation: "copy_library"; referencedColumns: ["id"] }
        ]
      }
      trend_briefs: {
        Row: { id: string; semana: string; resumo: string | null; achados: Json | null; fontes: Json | null; created_at: string }
        Insert: { id?: string; semana: string; resumo?: string | null; achados?: Json | null; fontes?: Json | null; created_at?: string }
        Update: { id?: string; semana?: string; resumo?: string | null; achados?: Json | null; fontes?: Json | null; created_at?: string }
        Relationships: []
      }
      campaigns: {
        Row: {
          id: string; plataforma: string; external_id: string | null; nome: string
          objetivo: string | null; orcamento_diario: number | null; status: string
          estrutura: Json | null; linha: string; created_at: string
        }
        Insert: {
          id?: string; plataforma: string; external_id?: string | null; nome: string
          objetivo?: string | null; orcamento_diario?: number | null; status?: string
          estrutura?: Json | null; linha?: string; created_at?: string
        }
        Update: {
          id?: string; plataforma?: string; external_id?: string | null; nome?: string
          objetivo?: string | null; orcamento_diario?: number | null; status?: string
          estrutura?: Json | null; linha?: string; created_at?: string
        }
        Relationships: []
      }
      ads: {
        Row: { id: string; campaign_id: string | null; external_id: string | null; copy_id: string | null; criativo_url: string | null; status: string }
        Insert: { id?: string; campaign_id?: string | null; external_id?: string | null; copy_id?: string | null; criativo_url?: string | null; status?: string }
        Update: { id?: string; campaign_id?: string | null; external_id?: string | null; copy_id?: string | null; criativo_url?: string | null; status?: string }
        Relationships: [
          { foreignKeyName: "ads_campaign_id_fkey"; columns: ["campaign_id"]; isOneToOne: false; referencedRelation: "campaigns"; referencedColumns: ["id"] },
          { foreignKeyName: "ads_copy_id_fkey"; columns: ["copy_id"]; isOneToOne: false; referencedRelation: "copy_library"; referencedColumns: ["id"] }
        ]
      }
      ad_metrics: {
        Row: {
          id: string; ad_id: string | null; data: string
          impressoes: number | null; cliques: number | null; gasto: number | null
          ctr: number | null; cpm: number | null; cpl: number | null
          leads: number | null; conversas_whatsapp: number | null; compras: number | null; raw: Json | null
        }
        Insert: {
          id?: string; ad_id?: string | null; data: string
          impressoes?: number | null; cliques?: number | null; gasto?: number | null
          ctr?: number | null; cpm?: number | null; cpl?: number | null
          leads?: number | null; conversas_whatsapp?: number | null; compras?: number | null; raw?: Json | null
        }
        Update: {
          id?: string; ad_id?: string | null; data?: string
          impressoes?: number | null; cliques?: number | null; gasto?: number | null
          ctr?: number | null; cpm?: number | null; cpl?: number | null
          leads?: number | null; conversas_whatsapp?: number | null; compras?: number | null; raw?: Json | null
        }
        Relationships: [
          { foreignKeyName: "ad_metrics_ad_id_fkey"; columns: ["ad_id"]; isOneToOne: false; referencedRelation: "ads"; referencedColumns: ["id"] }
        ]
      }
      campaign_actions: {
        Row: { id: string; agent: string; acao: string; payload: Json | null; status: string; approved_at: string | null; created_at: string }
        Insert: { id?: string; agent: string; acao: string; payload?: Json | null; status?: string; approved_at?: string | null; created_at?: string }
        Update: { id?: string; agent?: string; acao?: string; payload?: Json | null; status?: string; approved_at?: string | null; created_at?: string }
        Relationships: []
      }
      lp_variants: {
        Row: { id: string; slug: string; hipotese: string | null; config: Json; peso: number; status: string; copy_id: string | null; linha: string }
        Insert: { id?: string; slug: string; hipotese?: string | null; config: Json; peso?: number; status?: string; copy_id?: string | null; linha?: string }
        Update: { id?: string; slug?: string; hipotese?: string | null; config?: Json; peso?: number; status?: string; copy_id?: string | null; linha?: string }
        Relationships: [
          { foreignKeyName: "lp_variants_copy_id_fkey"; columns: ["copy_id"]; isOneToOne: false; referencedRelation: "copy_library"; referencedColumns: ["id"] }
        ]
      }
      experiments: {
        Row: {
          id: string; nome: string | null; variant_a: string | null; variant_b: string | null
          metrica_alvo: string; inicio: string | null; fim: string | null; vencedora: string | null; resultado: Json | null
        }
        Insert: {
          id?: string; nome?: string | null; variant_a?: string | null; variant_b?: string | null
          metrica_alvo?: string; inicio?: string | null; fim?: string | null; vencedora?: string | null; resultado?: Json | null
        }
        Update: {
          id?: string; nome?: string | null; variant_a?: string | null; variant_b?: string | null
          metrica_alvo?: string; inicio?: string | null; fim?: string | null; vencedora?: string | null; resultado?: Json | null
        }
        Relationships: [
          { foreignKeyName: "experiments_variant_a_fkey"; columns: ["variant_a"]; isOneToOne: false; referencedRelation: "lp_variants"; referencedColumns: ["id"] },
          { foreignKeyName: "experiments_variant_b_fkey"; columns: ["variant_b"]; isOneToOne: false; referencedRelation: "lp_variants"; referencedColumns: ["id"] }
        ]
      }
      marketing_leads: {
        Row: {
          id: string; nome: string | null; telefone: string | null; email: string | null
          empresa: string | null; segmento: string | null; cidade: string | null; origem: string | null
          score: number | null; score_motivo: string | null; estagio: string
          script_whatsapp: string | null; notas: Json | null; linha: string; created_at: string
        }
        Insert: {
          id?: string; nome?: string | null; telefone?: string | null; email?: string | null
          empresa?: string | null; segmento?: string | null; cidade?: string | null; origem?: string | null
          score?: number | null; score_motivo?: string | null; estagio?: string
          script_whatsapp?: string | null; notas?: Json | null; linha?: string; created_at?: string
        }
        Update: {
          id?: string; nome?: string | null; telefone?: string | null; email?: string | null
          empresa?: string | null; segmento?: string | null; cidade?: string | null; origem?: string | null
          score?: number | null; score_motivo?: string | null; estagio?: string
          script_whatsapp?: string | null; notas?: Json | null; linha?: string; created_at?: string
        }
        Relationships: []
      }
      agent_conversations: {
        Row: { id: string; agent: string; messages: Json; updated_at: string }
        Insert: { id?: string; agent: string; messages?: Json; updated_at?: string }
        Update: { id?: string; agent?: string; messages?: Json; updated_at?: string }
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
