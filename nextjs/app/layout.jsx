import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FloatingContact from '../components/FloatingContact'
import ScrollReveal from '../components/ScrollReveal'
import { SITE_URL } from '../lib/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <FloatingContact />
        <ScrollReveal />
      </body>
    </html>
  )
}
