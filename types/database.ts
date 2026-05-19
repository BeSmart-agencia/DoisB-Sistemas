// Tipagem gerada automaticamente pelo Supabase CLI
// Execute: npx supabase gen types typescript --project-id SEU_PROJECT_ID > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // As tabelas serão adicionadas conforme o schema for criado
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [key: string]: unknown
    }
    Enums: {
      [key: string]: string
    }
  }
}
