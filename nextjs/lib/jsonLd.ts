import { SITE_URL, PHONE_STRUCTURED, PHONE_WA, INSTAGRAM_URL, OG_DEFAULT_IMAGE, CRECI } from './config'

export const AGENT_ID = `${SITE_URL}/#agent`
export const WEBSITE_ID = `${SITE_URL}/#website`

export interface BreadcrumbItem {
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

export interface CollectionPageInput {
  name: string
  url: string
  description?: string
  numberOfItems?: number
  itemNames?: string[]
}

export function buildCollectionPage({
  name,
  url,
  description,
  numberOfItems,
  itemNames,
}: CollectionPageInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    ...(description ? { description } : {}),
    ...(numberOfItems !== undefined ? { numberOfItems } : {}),
    ...(itemNames && itemNames.length
      ? { itemListElement: itemNames.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n })) }
      : {}),
  }
}

export interface ArticleSchemaInput {
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
    author: { '@id': AGENT_ID },
    publisher: { '@id': AGENT_ID },
    mainEntityOfPage: url,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  }
}

export interface FaqEntry {
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

export interface PlaceSchemaInput {
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
      '@type': ['LocalBusiness', 'RealEstateAgent'],
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
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -23.5329,
        longitude: -46.7917,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
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
      founder: {
        '@type': 'Person',
        name: 'Corretor Yuri',
        jobTitle: 'Corretor de Imóveis',
        url: `${SITE_URL}/sobre`,
        sameAs: [INSTAGRAM_URL],
      },
      sameAs: [INSTAGRAM_URL, PHONE_WA],
    },
  ]
}

export function buildHomepageJsonLd(faqs: FaqEntry[]): Record<string, unknown>[] {
  return [buildFaqPageSchema(faqs)]
}
