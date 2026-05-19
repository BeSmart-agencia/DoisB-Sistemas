export type { Database } from './database'

// Planos do ZWeb
export type Plan = {
  id: string
  name: string
  description: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  stripe_price_id: string
  is_active: boolean
}

// Usuário da plataforma
export type UserRole = 'admin' | 'customer' | 'support'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// Ticket de suporte
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export type Ticket = {
  id: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  customer_id: string
  assigned_to: string | null
  created_at: string
  updated_at: string
}

// Mensagem do chat com IA
export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
