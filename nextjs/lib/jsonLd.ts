import { SITE_URL, PHONE_STRUCTURED, PHONE_WA } from './config'

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
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quais tipos de imóveis o Corretor Yuri oferece em Osasco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Casas, apartamentos, terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em Osasco e Grande São Paulo.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como funciona o financiamento imobiliário em Osasco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Financiamento de até 80% do valor em até 360 meses via Caixa ou bancos privados. Imóveis até R$ 264.000 podem se enquadrar no Minha Casa Minha Vida com taxas a partir de 5,5% ao ano.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais são os melhores bairros para morar em Osasco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Presidente Altino, Bela Vista, Km 18 e Jaguaribe se destacam pela infraestrutura, transporte e acesso à Grande São Paulo. Cada bairro tem perfil e faixa de preço diferentes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como entrar em contato com o Corretor Yuri?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'WhatsApp (11) 97256-3420 ou Instagram @valterrduarte. Atendimento de segunda a sexta das 9h às 18h.',
          },
        },
      ],
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
