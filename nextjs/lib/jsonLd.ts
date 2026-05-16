import { imovelSlug } from '../utils/imovelUtils'
import { SITE_URL, PHONE_STRUCTURED, INSTAGRAM_URL, OG_DEFAULT_IMAGE, CRECI } from './config'
import type { Imovel } from '../types'

export const AGENT_ID = `${SITE_URL}/#agent`
export const PERSON_ID = `${SITE_URL}/sobre#person`
const WEBSITE_ID = `${SITE_URL}/#website`

interface BreadcrumbItem {
  name: string
  path: string
}

export function buildBreadcrumb(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

interface CollectionPageInput {
  name: string
  url: string
  description?: string
  numberOfItems?: number
  itemNames?: string[]
  items?: Record<string, unknown>[]
}

export function buildCollectionPage({
  name,
  url,
  description,
  numberOfItems,
  itemNames,
  items,
}: CollectionPageInput): Record<string, unknown> {
  let itemListElement: Record<string, unknown>[] | undefined
  if (items && items.length) {
    itemListElement = items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, item: it }))
  } else if (itemNames && itemNames.length) {
    itemListElement = itemNames.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n }))
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    ...(description ? { description } : {}),
    ...(numberOfItems !== undefined ? { numberOfItems } : {}),
    ...(itemListElement ? { itemListElement } : {}),
  }
}

interface ArticleSchemaInput {
  headline: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
}

export function buildArticleSchema({
  headline,
  description,
  url,
  image = OG_DEFAULT_IMAGE,
  datePublished,
  dateModified,
}: ArticleSchemaInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    author: { '@id': PERSON_ID },
    publisher: { '@id': AGENT_ID },
    mainEntityOfPage: url,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  }
}

interface PersonSchemaInput {
  name: string
  givenName?: string
  familyName?: string
  alternateName?: string
  image?: string
}

export function buildPersonSchema({ name, givenName, familyName, alternateName, image }: PersonSchemaInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name,
    ...(givenName ? { givenName } : {}),
    ...(familyName ? { familyName } : {}),
    ...(alternateName ? { alternateName } : {}),
    url: `${SITE_URL}/sobre`,
    jobTitle: 'Corretor de Imóveis',
    telephone: PHONE_STRUCTURED,
    ...(image ? { image } : {}),
    worksFor: { '@id': AGENT_ID },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Professional License',
      name: `CRECI-SP ${CRECI}`,
      recognizedBy: {
        '@type': 'Organization',
        name: 'CRECI-SP — Conselho Regional de Corretores de Imóveis de São Paulo',
      },
    },
    knowsAbout: [
      'Mercado imobiliário de Osasco',
      'Mercado imobiliário de Barueri e Alphaville',
      'Mercado imobiliário de Carapicuíba',
      'Financiamento imobiliário Caixa SBPE',
      'Minha Casa Minha Vida',
      'ITBI e impostos imobiliários',
      'Imóveis residenciais e comerciais',
    ],
    sameAs: [INSTAGRAM_URL],
  }
}

interface FaqEntry {
  question: string
  answer: string
}

export function buildFaqPageSchema(faqs: FaqEntry[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

interface PlaceSchemaInput {
  name: string
  description: string
  url: string
  cidade: string
}

export function buildPlaceSchema({ name, description, url, cidade }: PlaceSchemaInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name,
    description,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cidade,
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    containedInPlace: {
      '@type': 'City',
      name: cidade,
      address: { '@type': 'PostalAddress', addressRegion: 'SP', addressCountry: 'BR' },
    },
  }
}

export function buildGlobalJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: 'Corretor Yuri Imóveis',
      url: SITE_URL,
      inLanguage: 'pt-BR',
      publisher: { '@id': AGENT_ID },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/imoveis?busca={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': AGENT_ID,
      name: 'Corretor Yuri Imóveis',
      legalName: 'Corretor Yuri Imóveis',
      description:
        'Corretor de imóveis em Osasco, Barueri e Carapicuíba com mais de 10 anos de experiência. Casas, apartamentos, terrenos e imóveis comerciais para venda e aluguel. Atendimento personalizado e segurança jurídica.',
      url: SITE_URL,
      telephone: PHONE_STRUCTURED,
      image: OG_DEFAULT_IMAGE,
      logo: OG_DEFAULT_IMAGE,
      priceRange: 'R$ 200.000 – R$ 5.000.000',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Osasco',
        addressRegion: 'SP',
        addressCountry: 'BR',
        postalCode: '06010-000',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -23.53296,
        longitude: -46.79173,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '12:00',
        },
      ],
      areaServed: [
        { '@type': 'City', name: 'Osasco' },
        { '@type': 'City', name: 'Barueri' },
        { '@type': 'City', name: 'Carapicuíba' },
        { '@type': 'AdministrativeArea', name: 'Grande São Paulo' },
      ],
      knowsAbout: [
        'Mercado imobiliário de Osasco',
        'Mercado imobiliário de Barueri e Alphaville',
        'Financiamento imobiliário Caixa SBPE',
        'Minha Casa Minha Vida',
        'Imóveis residenciais e comerciais',
        'Locação e venda de imóveis',
      ],
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Professional License',
        name: `CRECI-SP ${CRECI}`,
        recognizedBy: {
          '@type': 'Organization',
          name: 'CRECI-SP — Conselho Regional de Corretores de Imóveis de São Paulo',
        },
      },
      founder: { '@id': PERSON_ID },
      employee: [{ '@id': PERSON_ID }],
      sameAs: [INSTAGRAM_URL],
    },
  ]
}

export function buildHomepageJsonLd(faqs: FaqEntry[]): Record<string, unknown>[] {
  return [buildFaqPageSchema(faqs)]
}

export function buildPropertyProduct(imovel: Imovel): Record<string, unknown> {
  const slug = imovelSlug(imovel)
  const url = `${SITE_URL}/imoveis/${slug}`
  const image = imovel.imagens?.[0] || OG_DEFAULT_IMAGE
  const businessFunction = imovel.tipo === 'venda'
    ? 'https://schema.org/Sell'
    : 'https://schema.org/LeaseOut'

  const additionalProperty: Record<string, unknown>[] = []
  if (imovel.quartos > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Dormitórios', value: imovel.quartos })
  if (imovel.banheiros > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Banheiros', value: imovel.banheiros })
  if (imovel.vagas > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Vagas', value: imovel.vagas })
  if (imovel.area > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Área', value: imovel.area, unitCode: 'MTK' })

  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: imovel.titulo,
    description: imovel.descricao_seo || imovel.descricao || imovel.titulo,
    image,
    url,
    category: 'Imóvel',
    brand: { '@id': AGENT_ID },
    offers: {
      '@type': 'Offer',
      price: imovel.preco,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      businessFunction,
      url,
      seller: { '@id': AGENT_ID },
    },
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  }
}
