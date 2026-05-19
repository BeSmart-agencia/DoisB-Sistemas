# DoisB Sistemas

Plataforma de revenda do software **ZWeb** (Zucchetti) — sistema de gestão de ponto e controle de acesso.

## Visão geral

| Módulo | Descrição |
|---|---|
| **Site público** | Landing page, planos/preços, blog, área de demonstração |
| **Painel admin** | Gestão de clientes, assinaturas, tickets e métricas |
| **Suporte** | Sistema de tickets com SLA e chat com IA (Claude) |
| **Chat IA** | Assistente treinado na base de conhecimento do ZWeb |

## Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: Tailwind CSS + shadcn/ui
- **Auth / DB / Storage**: Supabase (PostgreSQL + pgvector)
- **Pagamentos**: Stripe
- **E-mails**: Resend
- **IA**: Anthropic Claude (chat) + OpenAI (embeddings)

## Estrutura de pastas

```
app/
  (site)/          → Rotas públicas (landing, preços, blog)
  (admin)/         → Rotas protegidas (dashboard, clientes, suporte)
  api/             → Route handlers (webhooks, edge functions)
components/
  ui/              → Componentes shadcn/ui
  site/            → Componentes do site público
  admin/           → Componentes do painel admin
lib/
  supabase/        → Clients: browser, server, admin (service_role)
  stripe/          → Helpers de pagamento
  utils/           → Utilitários gerais
types/             → Tipagem TypeScript global
middleware.ts      → Proteção de rotas via Supabase Auth
```

## Configuração inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha **todas** as variáveis no `.env.local`. Veja a seção abaixo.

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente obrigatórias

| Variável | Onde obter |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `ANTHROPIC_API_KEY` | Anthropic Console |
| `OPENAI_API_KEY` | OpenAI Platform |
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console |
| `NEXT_PUBLIC_SITE_URL` | URL de produção (ex: `https://doisbsistemas.com.br`) |

## Próximos passos

- [ ] Criar schema do banco de dados no Supabase (migrations)
- [ ] Gerar tipos TypeScript com `supabase gen types`
- [ ] Configurar webhook do Stripe
- [ ] Criar templates de e-mail no Resend
- [ ] Subir base de conhecimento do ZWeb para pgvector
- [ ] Implementar landing page do site

## Desenvolvimento

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm run lint     # checar ESLint
```

## Licença

Propriedade de DoisB Sistemas. Todos os direitos reservados.
