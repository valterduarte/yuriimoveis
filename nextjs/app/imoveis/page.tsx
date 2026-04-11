import Link from 'next/link'
import ImoveisControls from '../../components/imoveis/ImoveisControls'
import PropertyGrid from '../../components/imoveis/PropertyGrid'
import { fetchProperties, fetchDistinctBairros } from '../../lib/api'
import { ITEMS_PER_PAGE } from '../../lib/constants'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import type { Metadata } from 'next'

const FILTER_KEYS = ['tipo', 'categoria', 'cidade', 'bairro', 'precoMin', 'precoMax', 'quartos', 'codigo']

export const metadata: Metadata = {
  title: 'Imóveis Disponíveis em Osasco SP — Corretor Yuri',
  description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco e região. Atendimento com o Corretor Yuri, CRECI-SP 235509.',
  alternates: { canonical: `${SITE_URL}/imoveis` },
  openGraph: {
    title: 'Imóveis Disponíveis em Osasco SP — Corretor Yuri',
    description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco e região.',
    url: `${SITE_URL}/imoveis`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Imóveis em Osasco e Região' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imóveis Disponíveis em Osasco SP — Corretor Yuri',
    description: 'Encontre casas, apartamentos e terrenos à venda e para alugar em Osasco e região.',
    images: [OG_DEFAULT_IMAGE],
  },
}

export default async function ImoveisPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const [{ imoveis, total }, bairros] = await Promise.all([
    fetchProperties({
      ...Object.fromEntries(FILTER_KEYS.filter(k => params[k]).map(k => [k, params[k]])),
      ordem: params.ordem || 'recente',
      page:  params.page  || 1,
      limit: ITEMS_PER_PAGE,
    }),
    fetchDistinctBairros(),
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
        </div>
      </div>
      <div className="container mx-auto px-6 py-10">
        <ImoveisControls total={total} currentPage={currentPage} totalPages={totalPages} bairros={bairros}>
          <PropertyGrid properties={imoveis} activeFilterCount={activeFilterCount} />
        </ImoveisControls>
      </div>
    </div>
  )
}
