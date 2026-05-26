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
  openGraph: {
    siteName: 'DoisB Sistemas',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/logos/doisb-blue.png', width: 800, height: 600 }],
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
