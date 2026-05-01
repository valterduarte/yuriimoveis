import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import ImovelDetalheClient from '../../../components/ImovelDetalheClient'
import PropertyCard from '../../../components/PropertyCard'
import {
  fetchImovel,
  fetchAllPropertySlugs,
  fetchPropertiesByBairro,
  fetchPropertiesByTypeCategory,
  fetchDistinctBairros,
  fetchSimilarProperties,
  fetchNavigationMatrix,
} from '../../../lib/api'
import { imovelSlug, slugify, formatNeighborhoodName, buildSeoDescription, ogImageUrl } from '../../../utils/imovelUtils'
import { BAIRROS, getBairroBySlug } from '../../../data/bairros'
import { findLandingPage, LANDING_PAGES } from '../../../data/landingPages'
import { PLACEHOLDER_IMAGE } from '../../../lib/constants'
import { SITE_URL, PHONE_WA_BASE, OG_DEFAULT_IMAGE } from '../../../lib/config'
import { AGENT_ID } from '../../../lib/jsonLd'
import {
  bairroDbNameToSlug,
  buildHierarchicalUrl,
  cidadeNameToSlug,
  cidadeSlugToName,
  hasRichBairroContent,
  tipoToAcao,
} from '../../../lib/navigation'
import { CATEGORIAS } from '../../../data/categorias'
import WhatsAppLink from '../../../components/WhatsAppLink'
import type { Metadata } from 'next'

export const revalidate = 60

type PageProps = { params: Promise<{ slug: string }> }

// ── helpers ───────────────────────────────────────────────────────────────────

function isPropertySlug(slug: string): boolean {
  return /-\d+$/.test(slug)
}

function isLandingPageSlug(slug: string): boolean {
  return !!findLandingPage(slug)
}

// ── static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const [imoveis, bairros] = await Promise.all([
    fetchAllPropertySlugs(),
    fetchDistinctBairros(),
  ])
  const propertyParams = imoveis.map(imovel => ({ slug: imovelSlug(imovel) }))

  const configuredBairros = Object.values(BAIRROS)
  const overriddenDbNames = new Set(configuredBairros.map(b => b.dbMatch).filter(Boolean) as string[])
  const configuredSlugs = new Set(configuredBairros.map(b => b.slug))

  const configuredBairroParams = configuredBairros.map(b => ({ slug: b.slug }))
  const dbBairroParams = bairros
    .filter(b => !overriddenDbNames.has(b) && !configuredSlugs.has(slugify(b)))
    .map(b => ({ slug: slugify(b) }))

  const landingParams = LANDING_PAGES.map(lp => ({ slug: lp.slug }))
  return [...landingParams, ...propertyParams, ...configuredBairroParams, ...dbBairroParams]
}

// ── metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  if (isPropertySlug(slug)) {
    const id = slug.split('-').pop()!
    const imovel = await fetchImovel(id)
    if (!imovel) return { title: 'Imóvel não encontrado' }

    const description = buildSeoDescription(imovel)
    const pageUrl = `${SITE_URL}/imoveis/${imovelSlug(imovel)}`
    const rawImage = imovel.imagens?.[0] ?? PLACEHOLDER_IMAGE
    const socialImage = ogImageUrl(rawImage)

    return {
      title: `${imovel.titulo} — Corretor Yuri Imóveis`,
      description,
      alternates: { canonical: pageUrl },
      openGraph: {
        title: `${imovel.titulo} — Corretor Yuri Imóveis`,
        description,
        url: pageUrl,
        siteName: 'Corretor Yuri Imóveis',
        locale: 'pt_BR',
        type: 'website',
        images: [{ url: socialImage, width: 1200, height: 630, alt: imovel.titulo, type: 'image/jpeg' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: imovel.titulo,
        description,
        images: [socialImage],
      },
    }
  }

  // Landing page (tipo+categoria)
  const landingPage = findLandingPage(slug)
  if (landingPage) {
    return {
      title: landingPage.titulo,
      description: landingPage.descricaoMeta,
      alternates: { canonical: `${SITE_URL}/imoveis/${slug}` },
      openGraph: {
        title: landingPage.titulo,
        description: landingPage.descricaoMeta,
        url: `${SITE_URL}/imoveis/${slug}`,
        siteName: 'Corretor Yuri Imóveis',
        locale: 'pt_BR',
        type: 'website',
        images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: landingPage.h1 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: landingPage.titulo,
        description: landingPage.descricaoMeta,
        images: [OG_DEFAULT_IMAGE],
      },
    }
  }

  // Bairro page
  const bairroData = getBairroBySlug(slug)
  const neighborhoodName = bairroData?.nome || formatNeighborhoodName(slug)
  const title = bairroData?.titulo || `Imóveis em ${neighborhoodName}, Osasco SP — Corretor Yuri`
  const description = bairroData?.descricaoMeta || `Veja todos os imóveis disponíveis no ${neighborhoodName} em Osasco, SP. Casas, apartamentos e terrenos à venda e para alugar. Atendimento com o Corretor Yuri.`

  const bairroImage = bairroData?.imagem
    ? ogImageUrl(bairroData.imagem)
    : OG_DEFAULT_IMAGE

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/imoveis/${slug}` },
    openGraph: {
      title: bairroData?.titulo || `Imóveis em ${neighborhoodName}, Osasco SP`,
      description,
      url: `${SITE_URL}/imoveis/${slug}`,
      siteName: 'Corretor Yuri Imóveis',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: bairroImage, width: 1200, height: 630, alt: `Imóveis em ${neighborhoodName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: bairroData?.titulo || `Imóveis em ${neighborhoodName}, Osasco SP`,
      description,
      images: [bairroImage],
    },
  }
}

// ── property detail page ──────────────────────────────────────────────────────

async function ImovelDetalhePage({ slug }: { slug: string }) {
  const id = slug.split('-').pop()!
  const imovel = await fetchImovel(id)

  if (!imovel) notFound()

  const similarProperties = await fetchSimilarProperties(imovel)

  const acao = tipoToAcao(imovel.tipo)
  const cidadeSlug = imovel.cidade ? cidadeNameToSlug(imovel.cidade) : ''
  const bairroSlug = imovel.bairro ? bairroDbNameToSlug(imovel.bairro) : ''
  const cidadeSupported = !!cidadeSlugToName(cidadeSlug)
  const categoriaData = CATEGORIAS[imovel.categoria]
  const categoriaPlural = categoriaData?.plural ?? 'Imóveis'
  const actionLabel = acao === 'alugar' ? 'aluguel' : 'venda'
  const bairroDisplay = imovel.bairro || ''
  const cidadeDisplay = imovel.cidade || ''
  const hasGuide = bairroSlug && hasRichBairroContent(bairroSlug)

  const matrix = await fetchNavigationMatrix()
  const bairroInventoryForCategory = matrix.find(row =>
    row.tipo === imovel.tipo &&
    row.cidade === imovel.cidade &&
    row.categoria === imovel.categoria &&
    row.bairro === imovel.bairro,
  )?.count ?? 0
  const bairroHasOwnPage = bairroInventoryForCategory >= 3 || (bairroInventoryForCategory >= 1 && hasGuide)

  const exploreLinks: { href: string; label: string }[] = []
  if (hasGuide) {
    exploreLinks.push({
      href: `/bairros/${bairroSlug}`,
      label: `Guia do bairro ${bairroDisplay}`,
    })
  }
  if (cidadeSupported && bairroSlug && bairroDisplay && bairroHasOwnPage) {
    exploreLinks.push({
      href: buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: imovel.categoria, bairro: bairroSlug }),
      label: `${categoriaPlural} para ${actionLabel} no ${bairroDisplay}`,
    })
  }
  if (cidadeSupported && cidadeDisplay) {
    exploreLinks.push({
      href: buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: imovel.categoria }),
      label: `${categoriaPlural} para ${actionLabel} em ${cidadeDisplay}`,
    })
    exploreLinks.push({
      href: buildHierarchicalUrl({ acao, cidade: cidadeSlug }),
      label: `Imóveis para ${actionLabel} em ${cidadeDisplay}`,
    })
  }

  const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER_IMAGE]
  const lcpImage = images[0]?.includes('res.cloudinary.com')
    ? images[0].replace('/upload/', '/upload/f_auto,q_auto,w_1920/')
    : images[0]
  const imovelDescription = buildSeoDescription(imovel)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início',  item: `${SITE_URL}/`        },
        { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${SITE_URL}/imoveis`  },
        { '@type': 'ListItem', position: 3, name: imovel.titulo, item: `${SITE_URL}/imoveis/${imovelSlug(imovel)}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: imovel.titulo,
      description: imovelDescription,
      image: images,
      url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
      datePosted: imovel.created_at ? new Date(imovel.created_at).toISOString().split('T')[0] : undefined,
      dateModified: imovel.updated_at ? new Date(imovel.updated_at).toISOString().split('T')[0] : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: imovel.endereco || undefined,
        addressLocality: imovel.cidade || 'Osasco',
        addressRegion: 'SP',
        postalCode: imovel.cep || undefined,
        addressCountry: 'BR',
      },
      ...(imovel.lat && imovel.lng
        ? { geo: { '@type': 'GeoCoordinates', latitude: imovel.lat, longitude: imovel.lng } }
        : {}),
      numberOfBedrooms: imovel.quartos || undefined,
      numberOfBathroomsTotal: imovel.banheiros || undefined,
      numberOfRooms: imovel.quartos || undefined,
      floorSize: imovel.area
        ? { '@type': 'QuantitativeValue', value: imovel.area, unitCode: 'MTK' }
        : undefined,
      ...(imovel.vagas ? {
        amenityFeature: {
          '@type': 'LocationFeatureSpecification',
          name: 'Vagas de garagem',
          value: imovel.vagas,
        },
      } : {}),
      ...(imovel.diferenciais?.length ? {
        additionalProperty: imovel.diferenciais.map(d => ({
          '@type': 'PropertyValue',
          name: d,
        })),
      } : {}),
      offers: {
        '@type': 'Offer',
        price: imovel.preco,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        businessFunction: imovel.tipo === 'aluguel'
          ? 'http://purl.org/goodrelations/v1#LeaseOut'
          : 'http://purl.org/goodrelations/v1#Sell',
        seller: { '@id': AGENT_ID },
      },
    },
  ]

  return (
    <>
      <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ImovelDetalheClient imovel={imovel} />
      {similarProperties.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <span className="section-label">Veja também</span>
            <h2 className="section-title mb-8">Imóveis Semelhantes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarProperties.map(p => (
                <PropertyCard key={p.id} imovel={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      {exploreLinks.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <span className="section-label">Explore mais</span>
            <h2 className="section-title mb-6">Continue sua busca</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exploreLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between gap-3 border border-gray-200 px-4 py-3 text-sm text-dark hover:border-primary hover:text-primary transition-colors"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="text-xs">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}

// ── neighborhood page ─────────────────────────────────────────────────────────

async function BairroPage({ slug }: { slug: string }) {
  const bairroData = getBairroBySlug(slug)
  const neighborhoodName = bairroData?.nome || formatNeighborhoodName(slug)
  const dbSearchTerm = bairroData?.dbMatch || neighborhoodName
  const { imoveis: properties, total } = await fetchPropertiesByBairro(dbSearchTerm)
  const hasProperties = properties.length > 0

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início',  item: `${SITE_URL}/`       },
        { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${SITE_URL}/imoveis` },
        { '@type': 'ListItem', position: 3, name: neighborhoodName, item: `${SITE_URL}/imoveis/${slug}` },
      ],
    },
    ...(hasProperties ? [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Imóveis em ${neighborhoodName}, Osasco SP`,
      url: `${SITE_URL}/imoveis/${slug}`,
      numberOfItems: total,
      description: bairroData?.descricaoMeta || `Imóveis disponíveis no bairro ${neighborhoodName} em Osasco, SP.`,
      itemListElement: properties.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
        name: p.titulo,
      })),
    }] : []),
    ...(bairroData ? [{
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
      containedInPlace: {
        '@type': 'City',
        name: 'Osasco',
      },
    }] : []),
  ]

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
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors"
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

// ── landing page (tipo + categoria) ──────────────────────────────────────────

async function LandingPage({ slug }: { slug: string }) {
  const landing = findLandingPage(slug)!
  const { imoveis: properties, total } = await fetchPropertiesByTypeCategory(landing.tipo, landing.categoria)
  const hasProperties = properties.length > 0
  const tipoLabel = landing.tipo === 'venda' ? 'à Venda' : 'para Alugar'

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Imóveis', item: `${SITE_URL}/imoveis` },
        { '@type': 'ListItem', position: 3, name: landing.h1, item: `${SITE_URL}/imoveis/${slug}` },
      ],
    },
    ...(hasProperties ? [{
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
    }] : []),
  ]

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
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors"
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

// ── router ────────────────────────────────────────────────────────────────────

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params
  if (isPropertySlug(slug)) return <ImovelDetalhePage slug={slug} />
  if (isLandingPageSlug(slug)) return <LandingPage slug={slug} />
  return <BairroPage slug={slug} />
}
