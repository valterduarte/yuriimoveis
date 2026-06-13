import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchPropertiesByBairro } from '../../../../lib/api'
import { getBairroBySlug } from '../../../../data/bairros'
import { formatNeighborhoodName, imovelSlug } from '../../../../utils/imovelUtils'
import { SITE_URL, PHONE_WA_BASE } from '../../../../lib/config'
import { buildBreadcrumb } from '../../../../lib/jsonLd'
import PropertyCard from '../../../../components/PropertyCard'
import WhatsAppLink from '../../../../components/WhatsAppLink'

function buildBairroJsonLd(args: {
  slug: string
  neighborhoodName: string
  total: number
  hasProperties: boolean
  bairroData: ReturnType<typeof getBairroBySlug>
  properties: Awaited<ReturnType<typeof fetchPropertiesByBairro>>['imoveis']
}): Record<string, unknown>[] {
  const { slug, neighborhoodName, total, hasProperties, bairroData, properties } = args
  const schemas: Record<string, unknown>[] = [
    buildBreadcrumb([
      { name: 'Início',         path: '/' },
      { name: 'Imóveis',        path: '/imoveis' },
      { name: neighborhoodName, path: `/imoveis/${slug}` },
    ]),
  ]

  if (hasProperties) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Imóveis em ${neighborhoodName}, Osasco SP`,
      url: `${SITE_URL}/imoveis/${slug}`,
      numberOfItems: total,
      description:
        bairroData?.descricaoMeta ||
        `Imóveis disponíveis no bairro ${neighborhoodName} em Osasco, SP.`,
      itemListElement: properties.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
        name: p.titulo,
      })),
    })
  }

  if (bairroData) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: neighborhoodName,
      description: bairroData.conteudo.sobre,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Osasco',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
      containedInPlace: { '@type': 'City', name: 'Osasco' },
    })
  }

  return schemas
}

export default async function BairroView({ slug }: { slug: string }) {
  const bairroData = getBairroBySlug(slug)
  const neighborhoodName = bairroData?.nome || formatNeighborhoodName(slug)
  const dbSearchTerm = bairroData?.dbMatch || neighborhoodName
  const { imoveis: properties, total } = await fetchPropertiesByBairro(dbSearchTerm)
  const hasProperties = properties.length > 0

  const jsonLd = buildBairroJsonLd({
    slug, neighborhoodName, total, hasProperties, bairroData, properties,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/imoveis" className="hover:text-white transition-colors">Imóveis</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{neighborhoodName}</span>
          </nav>
          <span className="section-label">Bairro</span>
          <h1 className="text-4xl font-black uppercase text-white">{neighborhoodName}</h1>
          {hasProperties && (
            <p className="text-gray-400 text-sm mt-2">
              {total} imóvel{total !== 1 ? 'is' : ''} disponível{total !== 1 ? 'is' : ''} em Osasco, SP
            </p>
          )}
        </div>
      </div>

      {bairroData && (
        <section className="container mx-auto px-6 pt-10 pb-2">
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">
              Sobre o bairro {neighborhoodName}
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.sobre}</p>

            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Infraestrutura</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.infraestrutura}</p>

            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Transporte e Acesso</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.transporte}</p>

            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Educação</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.educacao}</p>

            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">
              Por que morar no {neighborhoodName}?
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{bairroData.conteudo.porqueMorar}</p>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href="/imoveis" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os imóveis
          </Link>
        </div>

        {!hasProperties ? (
          <div className="text-center py-20 bg-white border border-gray-200 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
            <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel em {neighborhoodName}</h2>
            <p className="text-gray-500 text-sm mb-6">Ainda não temos imóveis cadastrados neste bairro. Fale com o corretor para mais opções.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
              <WhatsAppLink
                href={`${PHONE_WA_BASE}?text=${encodeURIComponent(`Olá! Procuro imóveis no ${neighborhoodName} em Osasco. Pode me ajudar?`)}`}
                source="bairro-sem-resultado"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors"
              >
                <FaWhatsapp size={14} /> Falar com o Corretor
              </WhatsAppLink>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {properties.map((property, i) => (
              <div key={property.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <PropertyCard imovel={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
