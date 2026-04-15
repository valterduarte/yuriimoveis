import type { Metadata } from 'next'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import { fetchPropertiesForMap } from '../../lib/api'
import MapaClient from '../../components/mapa/MapaClient'

const TITLE = 'Mapa de Imóveis em Osasco e Região — Corretor Yuri'
const DESCRIPTION =
  'Veja todos os imóveis disponíveis no mapa de Osasco, Barueri, Carapicuíba e Cotia. Filtre por preço, quartos e tipo e encontre o imóvel certo pela localização.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/mapa` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/mapa`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Mapa de Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_DEFAULT_IMAGE],
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Mapa de Imóveis', item: `${SITE_URL}/mapa` },
  ],
}

export default async function MapaPage() {
  const imoveis = await fetchPropertiesForMap()

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <span className="uppercase tracking-widest text-xs font-bold text-primary mb-3 block">
            Mapa
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-3">
            Imóveis no Mapa
          </h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base leading-relaxed">
            Encontre o imóvel certo pela localização. Filtre por preço, tipo e número de quartos e navegue pelos
            bairros de Osasco, Barueri, Carapicuíba e Cotia.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-6">
          {imoveis.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-sm">Não há imóveis disponíveis no momento.</p>
            </div>
          ) : (
            <MapaClient imoveis={imoveis} />
          )}
        </div>
      </section>
    </div>
  )
}
