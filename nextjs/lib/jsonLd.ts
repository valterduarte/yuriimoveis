import { SITE_URL, PHONE_STRUCTURED, PHONE_WA } from './config'
import { HOMEPAGE_FAQ } from '../data/faq'

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

export function buildHomepageJsonLd(heroImageUrl: string): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Corretor Yuri Imóveis',
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/imoveis?busca={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
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
    {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'RealEstateAgent'],
      name: 'Corretor Yuri Imóveis',
      description:
        'Especialistas em imóveis residenciais e comerciais em Osasco e região. Mais de 10 anos de experiência, atendimento personalizado e segurança jurídica.',
      url: SITE_URL,
      telephone: PHONE_STRUCTURED,
      image: heroImageUrl,
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      areaServed: [
        { '@type': 'City', name: 'Osasco' },
        { '@type': 'AdministrativeArea', name: 'Grande São Paulo' },
      ],
      sameAs: [PHONE_WA],
    },
  ]
}
