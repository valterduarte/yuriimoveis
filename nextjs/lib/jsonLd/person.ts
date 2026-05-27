import { SITE_URL, PHONE_STRUCTURED, INSTAGRAM_URL, CRECI } from '../config'
import { AGENT_ID, PERSON_ID } from './ids'

interface PersonSchemaInput {
  name: string
  givenName?: string
  familyName?: string
  alternateName?: string
  image?: string
}

export function buildPersonSchema({
  name,
  givenName,
  familyName,
  alternateName,
  image,
}: PersonSchemaInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name,
    ...(givenName     ? { givenName     } : {}),
    ...(familyName    ? { familyName    } : {}),
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
