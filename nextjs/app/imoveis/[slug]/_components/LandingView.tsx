import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { fetchPropertiesByTypeCategory } from '../../../../lib/api'
import { findLandingPage } from '../../../../data/landingPages'
import { imovelSlug } from '../../../../utils/imovelUtils'
import { SITE_URL, PHONE_WA_BASE } from '../../../../lib/config'
import { buildBreadcrumb } from '../../../../lib/jsonLd'
import PropertyCard from '../../../../components/PropertyCard'
import WhatsAppLink from '../../../../components/WhatsAppLink'

export default async function LandingView({ slug }: { slug: string }) {
  const landing = findLandingPage(slug)
  if (!landing) notFound()

  const { imoveis: properties, total } = await fetchPropertiesByTypeCategory(landing.tipo, landing.categoria)
  const hasProperties = properties.length > 0
  const tipoLabel = landing.tipo === 'venda' ? 'à Venda' : 'para Alugar'

  const jsonLd: Record<string, unknown>[] = [
    buildBreadcrumb([
      { name: 'Início',   path: '/' },
      { name: 'Imóveis',  path: '/imoveis' },
      { name: landing.h1, path: `/imoveis/${slug}` },
    ]),
  ]

  if (hasProperties) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: landing.h1,
      url: `${SITE_URL}/imoveis/${slug}`,
      numberOfItems: total,
      description: landing.descricaoMeta,
      itemListElement: properties.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
        name: p.titulo,
      })),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/imoveis" className="hover:text-white transition-colors">Imóveis</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{landing.h1}</span>
          </nav>
          <span className="section-label">{tipoLabel}</span>
          <h1 className="text-4xl font-black uppercase text-white">{landing.h1}</h1>
          {hasProperties && (
            <p className="text-gray-400 text-sm mt-2">
              {total} imóvel{total !== 1 ? 'is' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">{landing.introTexto}</p>
        </div>

        <div className="mb-6">
          <Link href="/imoveis" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os imóveis
          </Link>
        </div>

        {!hasProperties ? (
          <div className="text-center py-20 bg-white border border-gray-200 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
            <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel encontrado</h2>
            <p className="text-gray-500 text-sm mb-6">Ainda não temos imóveis nesta categoria. Fale com o corretor para mais opções.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
              <WhatsAppLink
                href={`${PHONE_WA_BASE}?text=${encodeURIComponent(`Olá! Procuro ${landing.h1.toLowerCase()}. Pode me ajudar?`)}`}
                source="landing-sem-resultado"
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
