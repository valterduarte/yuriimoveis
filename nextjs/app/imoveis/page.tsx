import Link from 'next/link'
import { Suspense } from 'react'
import ImoveisResults, { ImoveisResultsFallback } from '../../components/imoveis/ImoveisResults'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import { buildBreadcrumb } from '../../lib/jsonLd'
import type { Metadata } from 'next'

export const revalidate = 60

const BASE_TITLE = 'Imóveis em Osasco, Barueri e Carapicuíba — Corretor Yuri'
const BASE_DESCRIPTION = 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco, Barueri e Carapicuíba. Atendimento com o Corretor Yuri, CRECI-SP 235509.'

export const metadata: Metadata = {
  title: BASE_TITLE,
  description: BASE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/imoveis` },
  openGraph: {
    title: BASE_TITLE,
    description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco, Barueri e Carapicuíba.',
    url: `${SITE_URL}/imoveis`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Imóveis em Osasco, Barueri e Carapicuíba' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BASE_TITLE,
    description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco, Barueri e Carapicuíba.',
    images: [OG_DEFAULT_IMAGE],
  },
}

const breadcrumbJsonLd = buildBreadcrumb([
  { name: 'Início',  path: '/' },
  { name: 'Imóveis', path: '/imoveis' },
])

export default function ImoveisPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Imóveis</span>
          </nav>
          <span className="section-label">Portfólio</span>
          <h1 className="text-4xl font-black uppercase text-white">Imóveis Disponíveis</h1>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 mt-4 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            Ver no mapa
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        <Suspense fallback={<ImoveisResultsFallback />}>
          <ImoveisResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
