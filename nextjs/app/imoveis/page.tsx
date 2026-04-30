import Link from 'next/link'
import ImoveisControls from '../../components/imoveis/ImoveisControls'
import PropertyGrid from '../../components/imoveis/PropertyGrid'
import { fetchProperties, fetchDistinctBairros, fetchDistinctCidades } from '../../lib/api'
import { ITEMS_PER_PAGE } from '../../lib/constants'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import type { Metadata } from 'next'

const FILTER_KEYS = ['tipo', 'categoria', 'cidade', 'bairro', 'precoMin', 'precoMax', 'quartos', 'codigo']

export const metadata: Metadata = {
  title: 'Imóveis em Osasco, Barueri e Carapicuíba — Corretor Yuri',
  description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco, Barueri e Carapicuíba. Atendimento com o Corretor Yuri, CRECI-SP 235509.',
  alternates: { canonical: `${SITE_URL}/imoveis` },
  openGraph: {
    title: 'Imóveis em Osasco, Barueri e Carapicuíba — Corretor Yuri',
    description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco, Barueri e Carapicuíba.',
    url: `${SITE_URL}/imoveis`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Imóveis em Osasco, Barueri e Carapicuíba' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imóveis em Osasco, Barueri e Carapicuíba — Corretor Yuri',
    description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco, Barueri e Carapicuíba.',
    images: [OG_DEFAULT_IMAGE],
  },
}

export default async function ImoveisPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const [{ imoveis, total }, bairros, cidades] = await Promise.all([
    fetchProperties({
      ...Object.fromEntries(FILTER_KEYS.filter(k => params[k]).map(k => [k, params[k]])),
      ordem: params.ordem || 'recente',
      page:  params.page  || 1,
      limit: ITEMS_PER_PAGE,
    }),
    fetchDistinctBairros(),
    fetchDistinctCidades(),
  ])
  const currentPage = Number(params.page || 1)
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const activeFilterCount = FILTER_KEYS.filter(k => params[k]).length

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${SITE_URL}/imoveis` },
        ],
      }) }} />
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
        <ImoveisControls total={total} currentPage={currentPage} totalPages={totalPages} bairros={bairros} cidades={cidades}>
          <PropertyGrid
            properties={imoveis}
            activeFilterCount={activeFilterCount}
            filters={{ tipo: params.tipo, cidade: params.cidade, categoria: params.categoria, bairro: params.bairro }}
          />
        </ImoveisControls>
      </div>
    </div>
  )
}
