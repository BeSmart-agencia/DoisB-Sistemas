# Frontend Design Skill — DoisB Sistemas

## Identidade da marca
- **Nome:** DoisB Sistemas
- **Produto:** ZWeb (ERP da Zucchetti para o varejo brasileiro)
- **Tom:** Profissional mas direto, sem jargão, focado em resultado
- **Público:** Lojistas do varejo (não-técnicos), pequenas e médias empresas

## Paleta de cores (tokens)
```
primary-blue:     #1472B5   (azul principal da marca)
primary-dark:     #0F5A94   (hover / enfase)
slate-950:        #0C1023   (títulos principais)
slate-700:        #374151   (texto secundário)
slate-500:        #6B7280   (texto terciário / legendas)
slate-200:        #E5E7EB   (bordas)
slate-50:         #F8FAFC   (fundos de seção alternados)
white:            #FFFFFF   (fundo padrão)
green-600:        #16A34A   (sucesso / check marks)
```

## Tipografia
- **Fonte:** Inter (via next/font, já configurada)
- **Hierarquia:**
  - H1 hero: `text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight`
  - H2 seção: `text-3xl sm:text-4xl font-bold`
  - H3 card: `text-xl font-bold`
  - Body lead: `text-lg text-slate-600 leading-relaxed`
  - Body padrão: `text-base text-slate-500`
  - Caption: `text-sm text-slate-400`
- **Nunca usar:** font-sizes aleatórios sem escala, `text-gray-*` (usar `text-slate-*`)

## Espaçamento (grid de 8px)
- Padding seção vertical: `py-24` (96px)
- Gap entre cards: `gap-6` ou `gap-8`
- Padding interno de card: `p-6` ou `p-8`
- Margem entre título e subtítulo: `mb-4`
- Margem entre subtítulo e conteúdo: `mb-14`
- Border radius: `rounded-2xl` para cards, `rounded-xl` para botões/inputs

## Componentes — padrões

### Botão primário
```tsx
className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all"
```

### Botão outline
```tsx
className="border border-blue-800 text-blue-800 bg-transparent hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all"
```

### Card padrão
```tsx
className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 p-8"
```

### Badge de destaque
```tsx
className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1 rounded-full"
```

### Seção com fundo alternado
- Seções claras: `bg-white`
- Seções alternadas: `bg-slate-50`
- Nunca usar gradientes pesados — sutil se necessário: `from-slate-50 to-white`

## Animações (Framer Motion)
- **Regra geral:** animações devem ser funcionais, não decorativas. Nada pisca ou gira sem motivo.
- **Padrão de entrada (scroll reveal):**
  ```tsx
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  ```
- **Stagger em listas de cards:**
  ```tsx
  transition={{ duration: 0.5, delay: index * 0.1 }}
  ```
- **Hover em cards interativos:**
  ```tsx
  whileHover={{ y: -4, transition: { duration: 0.2 } }}
  ```
- **Nunca usar:** `bounce`, `spring` sem motivo, `duration > 0.6`, animações em loop

## Layout
- **Max-width:** `max-w-7xl mx-auto`
- **Padding lateral:** `px-4 sm:px-6 lg:px-8`
- **Grid de cards:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Dois columns texto+imagem:** `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- Sempre mobile-first — o layout desktop é o último a ser definido

## O que evitar
- Gradientes coloridos pesados (ex: `from-purple-500 to-pink-500`)
- Sombras exageradas (`shadow-2xl` só em elementos destacados)
- Ícones sem propósito decorativo
- Textos em maiúsculas em corpo de texto
- Bordas arredondadas excessivas (`rounded-full` só em badges/avatars)
- Cores fora da paleta definida
- Animações em todos os elementos — reserve para os mais importantes
- "Estética AI genérica": cards com gradiente arco-íris, elementos flutuantes sem contexto

## Estrutura da landing page atual
Seções (em ordem, pelo id):
1. `#hero` — headline + CTA
2. `#problemas` — dores do lojista
3. `#solucao` — como o ZWeb resolve
4. `#segmentos` — para quem é
5. `#vantagens` — diferenciais
6. `#sobre-zucchetti` — credibilidade da Zucchetti
7. `#planos` — preços
8. `#faq` — perguntas frequentes
9. `#contato` — CTA final
