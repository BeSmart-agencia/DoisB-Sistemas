import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://doisbsistemas.com.br'),
  title: {
    default: 'DoisB Sistemas',
    template: '%s | DoisB Sistemas',
  },
  description: 'Revenda autorizada Zucchetti. Sistema de gestão ZWeb para o varejo brasileiro.',
  icons: {
    icon: '/logos/doisb-blue.png',
    shortcut: '/logos/doisb-blue.png',
    apple: '/logos/doisb-blue.png',
  },
  openGraph: {
    title: 'DoisB Sistemas',
    description: 'Sistema de gestão ZWeb para o varejo brasileiro. Revenda autorizada Zucchetti.',
    siteName: 'DoisB Sistemas',
    url: 'https://doisbsistemas.com.br',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/logos/doisb-blue.png', width: 800, height: 600, alt: 'DoisB Sistemas' }],
  },
  twitter: {
    card: 'summary',
    title: 'DoisB Sistemas',
    description: 'Sistema de gestão ZWeb para o varejo brasileiro.',
    images: ['/logos/doisb-blue.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
