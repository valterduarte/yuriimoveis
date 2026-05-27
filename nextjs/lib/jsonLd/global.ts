import { SITE_URL, PHONE_STRUCTURED, INSTAGRAM_URL, OG_DEFAULT_IMAGE, CRECI } from '../config'
import { AGENT_ID, PERSON_ID, WEBSITE_ID } from './ids'
import { buildFaqPageSchema, type FaqEntry } from './faq'

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
      founder:  { '@id': PERSON_ID },
      employee: [{ '@id': PERSON_ID }],
      sameAs: [INSTAGRAM_URL],
    },
  ]
}

export function buildHomepageJsonLd(faqs: FaqEntry[]): Record<string, unknown>[] {
  return [buildFaqPageSchema(faqs)]
}
