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
    '@id': `${url}#place`,
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
