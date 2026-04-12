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
            text: 'Como corretor de imóveis em Osasco, trabalhamos com casas à venda, apartamentos à venda, terrenos, chalés, chácaras e imóveis comerciais para venda e aluguel em Osasco e Grande São Paulo. Seja para comprar apartamento em Osasco, alugar casa ou investir em imóvel comercial, nossa imobiliária em Osasco tem opções para diferentes perfis e orçamentos.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como funciona o financiamento imobiliário em Osasco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O financiamento imobiliário permite adquirir seu imóvel em Osasco com entrada a partir de 20% do valor e parcelas em até 360 meses. As principais opções são a Caixa Econômica Federal (taxas a partir de 5,5% ao ano) e bancos privados como Itaú, Bradesco e Santander. Imóveis de até R$ 264.000 podem se enquadrar no programa Minha Casa Minha Vida em Osasco, com condições facilitadas e subsídios. Fazemos a simulação gratuita para encontrar a melhor condição para comprar casa em Osasco ou apartamento na região.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais são os melhores bairros para morar em Osasco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Os bairros mais procurados de Osasco para morar são: Presidente Altino — excelente acesso pela estação CPTM, comércio completo e boa oferta de apartamentos à venda; Bela Vista — bairro residencial tranquilo com infraestrutura familiar; Km 18 — região em crescimento com imóveis baratos em Osasco e fácil acesso à Raposo Tavares; Jaguaribe — próximo ao centro comercial de Osasco, com ampla rede de serviços e transporte público.',
          },
        },
        {
          '@type': 'Question',
          name: 'Preciso de um corretor de imóveis para comprar casa em Osasco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim, contar com um corretor de imóveis em Osasco faz toda a diferença. O corretor cuida da negociação, verifica a documentação imobiliária do imóvel, acompanha todo o processo de compra e garante segurança jurídica na transação. Seja para comprar casa em Osasco, apartamento à venda ou imóvel comercial, o acompanhamento profissional evita problemas e agiliza o fechamento.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais documentos são necessários para comprar um imóvel em Osasco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Para comprar um imóvel em Osasco, os principais documentos são: RG, CPF, comprovante de renda, comprovante de residência e certidão de estado civil. No caso de financiamento, o banco pode solicitar também extrato do FGTS, declaração do Imposto de Renda e carteira de trabalho. A documentação imobiliária do imóvel (matrícula atualizada, certidões negativas, IPTU) é igualmente importante. Como sua imobiliária em Osasco, cuidamos de toda essa parte para você.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como entrar em contato com o Corretor Yuri?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Você pode entrar em contato pelo WhatsApp (11) 97256-3420 ou pela página de contato do site. O atendimento é de segunda a sexta das 9h às 18h e sábado das 9h às 12h. Respondemos todas as mensagens em até 2 horas durante o horário comercial.',
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
