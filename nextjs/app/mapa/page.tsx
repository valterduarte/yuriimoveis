import { SITE_URL } from '../../lib/config'
import { fetchPropertiesForMap } from '../../lib/api'
import MapaClient from '../../components/mapa/MapaClient'
import { buildPageMetadata } from '../../lib/seo'

const PAGE_TITLE = 'Mapa de Imóveis em Osasco e Região'
const SOCIAL_TITLE = `${PAGE_TITLE} — Corretor Yuri`
const DESCRIPTION =
  'Veja todos os imóveis disponíveis no mapa de Osasco, Barueri, Carapicuíba e Cotia. Filtre por preço, quartos e tipo e encontre o imóvel certo pela localização.'

export const metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/mapa`,
  socialTitle: SOCIAL_TITLE,
  ogImageAlt: 'Mapa de Imóveis',
})

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
