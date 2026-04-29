import { SITE_URL, PHONE_STRUCTURED, PHONE_WA, INSTAGRAM_URL, OG_DEFAULT_IMAGE, CRECI } from './config'
import { HOMEPAGE_FAQ } from '../data/faq'

export const AGENT_ID = `${SITE_URL}/#agent`
export const WEBSITE_ID = `${SITE_URL}/#website`

export function buildBreadcrumb(items: { name: string; path: string }[]): Record<string, unknown> {
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

export function buildHomepageJsonLd(_heroImageUrl: string): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: HOMEPAGE_FAQ.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answerText,
        },
      })),
    },
  ]
}
