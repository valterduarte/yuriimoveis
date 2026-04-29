import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FloatingContact from '../components/FloatingContact'
import CompareBar from '../components/compare/CompareBar'
import ScrollReveal from '../components/ScrollReveal'
import GoogleAnalytics from '../components/GoogleAnalytics'
import { SITE_URL } from '../lib/config'
import { buildGlobalJsonLd } from '../lib/jsonLd'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Corretor Yuri — Imóveis em Osasco, Barueri e Carapicuíba',
    template: '%s | Corretor Yuri Imóveis',
  },
  description:
    'Corretor de imóveis em Osasco, Barueri e Carapicuíba com mais de 10 anos de experiência. Casas, apartamentos, terrenos e comerciais para compra e aluguel.',
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
  const globalJsonLd = buildGlobalJsonLd()
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        {globalJsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="main-content" className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <CompareBar />
        <FloatingContact />
        <ScrollReveal />
        <GoogleAnalytics />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
