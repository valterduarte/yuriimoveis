import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FloatingContact from '../components/FloatingContact'
import ScrollReveal from '../components/ScrollReveal'
import { SITE_URL } from '../lib/config'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Corretor Yuri Imóveis — Imóveis em Osasco e Região',
    template: '%s | Corretor Yuri Imóveis',
  },
  description:
    'Corretor de imóveis em Osasco com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para venda e aluguel. Atendimento personalizado.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Corretor Yuri Imóveis',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/icon.png', sizes: '180x180' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="main-content" className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <FloatingContact />
        <ScrollReveal />
        <SpeedInsights />
      </body>
    </html>
  )
}
