import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import ImovelDetalheClient from '../../../components/ImovelDetalheClient'
import PropertyCard from '../../../components/PropertyCard'
import SkeletonCard from '../../../components/SkeletonCard'
import {
  fetchImovel,
  fetchAllPropertySlugs,
  fetchPropertiesByBairro,
} from '../../../lib/api'
import { imovelSlug, formatNeighborhoodName } from '../../../utils/imovelUtils'
import { PLACEHOLDER_IMAGE } from '../../../lib/constants'
import { SITE_URL, PHONE_WA, PHONE_STRUCTURED } from '../../../lib/config'

export const revalidate = 3600

// ── helpers ───────────────────────────────────────────────────────────────────

function isPropertySlug(slug) {
  return /-\d+$/.test(slug)
}

// ── static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return []
}

// ── metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params

  if (isPropertySlug(slug)) {
    const id = slug.split('-').pop()
    const imovel = await fetchImovel(id)
    if (!imovel) return { title: 'Imóvel não encontrado' }

    const description = imovel.descricao_seo
      ? imovel.descricao_seo.slice(0, 155)
      : imovel.descricao
        ? imovel.descricao.replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]/gu, '').replace(/\n/g, ' ').slice(0, 155).trim()
        : `${imovel.titulo} em ${imovel.cidade || 'Osasco'}, SP. ${imovel.tipo === 'aluguel' ? 'Aluguel' : 'Venda'}.`

    const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER_IMAGE]

    const pageUrl = `${SITE_URL}/imoveis/${imovelSlug(imovel)}`
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
        type: 'article',
        images: images[0] !== PLACEHOLDER_IMAGE
          ? [{ url: images[0], width: 1200, height: 800, alt: imovel.titulo }]
          : [],
      },
    }
  }

  // Bairro page
  const neighborhoodName = formatNeighborhoodName(slug)
  return {
    title: `Imóveis em ${neighborhoodName}, Osasco SP — Corretor Yuri`,
    description: `Veja todos os imóveis disponíveis no ${neighborhoodName} em Osasco, SP. Casas, apartamentos e terrenos à venda e para alugar. Atendimento com o Corretor Yuri.`,
    alternates: { canonical: `${SITE_URL}/imoveis/${slug}` },
    openGraph: {
      title: `Imóveis em ${neighborhoodName}, Osasco SP`,
      description: `Im\u00f3veis dispon\u00edveis no ${neighborhoodName} em Osasco, SP.`,
      url: `${SITE_URL}/imoveis/${slug}`,
      siteName: 'Corretor Yuri Im\u00f3veis',
      locale: 'pt_BR',
    },
  }
}

// ── property detail page ──────────────────────────────────────────────────────

async function ImovelDetalhePage({ slug }) {
  const id = slug.split('-').pop()
  const imovel = await fetchImovel(id)

  if (!imovel) notFound()

  const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER_IMAGE]
  const imovelDescription = imovel.descricao_seo
    ? imovel.descricao_seo.slice(0, 155)
    : imovel.descricao
      ? imovel.descricao.replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]/gu, '').replace(/\n/g, ' ').slice(0, 155).trim()
      : `${imovel.titulo} em ${imovel.cidade || 'Osasco'}, SP. ${imovel.tipo === 'aluguel' ? 'Aluguel' : 'Venda'}.`

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
      '@type': 'Product',
      name: imovel.titulo,
      description: imovelDescription,
      image: images,
      url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
      offers: {
        '@type': 'Offer',
        price: imovel.preco,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
        seller: { '@type': 'RealEstateAgent', name: 'Corretor Yuri Imóveis', telephone: PHONE_STRUCTURED, url: SITE_URL },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: imovel.titulo,
      description: imovelDescription,
      image: images,
      url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
      datePosted: imovel.created_at ? imovel.created_at.split('T')[0] : undefined,
      price: imovel.preco ? String(imovel.preco) : undefined,
      priceCurrency: 'BRL',
      address: {
        '@type': 'PostalAddress',
        streetAddress: imovel.endereco || undefined,
        addressLocality: imovel.cidade || 'Osasco',
        addressRegion: imovel.estado || 'SP',
        postalCode: imovel.cep || undefined,
        addressCountry: 'BR',
      },
      ...(imovel.lat && imovel.lng
        ? { geo: { '@type': 'GeoCoordinates', latitude: imovel.lat, longitude: imovel.lng } }
        : {}),
      numberOfRooms: imovel.quartos || undefined,
      floorSize: imovel.area
        ? { '@type': 'QuantitativeValue', value: imovel.area, unitCode: 'MTK' }
        : undefined,
      offers: {
        '@type': 'Offer',
        price: imovel.preco,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'RealEstateAgent', name: 'Corretor Yuri Imóveis', telephone: PHONE_STRUCTURED, url: SITE_URL },
      },
    },
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ImovelDetalheClient imovel={imovel} />
    </>
  )
}

// ── neighborhood page ─────────────────────────────────────────────────────────

async function BairroPage({ slug }) {
  const neighborhoodName = formatNeighborhoodName(slug)
  const { imoveis: properties, total } = await fetchPropertiesByBairro(neighborhoodName)
  const notFound_ = properties.length === 0

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
    ...(!notFound_ ? [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Imóveis em ${neighborhoodName}, Osasco SP`,
      url: `${SITE_URL}/imoveis/${slug}`,
      numberOfItems: total,
      description: `Imóveis disponíveis no bairro ${neighborhoodName} em Osasco, SP.`,
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
            <span>/</span>
            <Link href="/imoveis" className="hover:text-white transition-colors">Imóveis</Link>
            <span>/</span>
            <span className="text-white">{neighborhoodName}</span>
          </nav>
          <span className="section-label">Bairro</span>
          <h1 className="text-4xl font-black uppercase text-white">{neighborhoodName}</h1>
          {!notFound_ && (
            <p className="text-gray-400 text-sm mt-2">
              {total} imóvel{total !== 1 ? 'is' : ''} disponível{total !== 1 ? 'is' : ''} em Osasco, SP
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href="/imoveis" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os bairros
          </Link>
        </div>

        {notFound_ ? (
          <div className="text-center py-20 bg-white border border-gray-200 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
            <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel em {neighborhoodName}</h2>
            <p className="text-gray-500 text-sm mb-6">Ainda não temos imóveis cadastrados neste bairro. Fale com o corretor para mais opções.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
              <a
                href={`${PHONE_WA}?text=${encodeURIComponent(`Olá! Procuro imóveis no ${neighborhoodName} em Osasco. Pode me ajudar?`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors"
              >
                <FaWhatsapp size={14} /> Falar com o Corretor
              </a>
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

export default async function SlugPage({ params }) {
  const { slug } = await params
  return isPropertySlug(slug)
    ? <ImovelDetalhePage slug={slug} />
    : <BairroPage slug={slug} />
}
