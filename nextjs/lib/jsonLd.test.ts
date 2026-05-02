import { describe, it, expect } from 'vitest'
import {
  buildArticleSchema,
  buildBreadcrumb,
  buildCollectionPage,
  buildFaqPageSchema,
  buildPlaceSchema,
  AGENT_ID,
} from './jsonLd'
import { SITE_URL } from './config'

describe('buildBreadcrumb', () => {
  it('numbers items starting at 1 and prefixes paths with SITE_URL', () => {
    const schema = buildBreadcrumb([
      { name: 'Início',  path: '/' },
      { name: 'Bairros', path: '/bairros' },
    ])
    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início',  item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Bairros', item: `${SITE_URL}/bairros` },
      ],
    })
  })

  it('handles a single-item breadcrumb', () => {
    const schema = buildBreadcrumb([{ name: 'Início', path: '/' }])
    expect((schema.itemListElement as unknown[]).length).toBe(1)
  })
})

describe('buildCollectionPage', () => {
  it('builds the minimal shape with name and url only', () => {
    const schema = buildCollectionPage({ name: 'Imóveis em Osasco', url: 'https://x.com/y' })
    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Imóveis em Osasco',
      url: 'https://x.com/y',
    })
  })

  it('includes optional fields only when provided', () => {
    const schema = buildCollectionPage({
      name: 'Vila Yara',
      url: 'https://x.com/v',
      description: 'Apartamentos na Vila Yara',
      numberOfItems: 4,
      itemNames: ['Imóvel 1', 'Imóvel 2'],
    })
    expect(schema.description).toBe('Apartamentos na Vila Yara')
    expect(schema.numberOfItems).toBe(4)
    expect(schema.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Imóvel 1' },
      { '@type': 'ListItem', position: 2, name: 'Imóvel 2' },
    ])
  })
})

describe('buildArticleSchema', () => {
  it('attributes the article to the global agent id', () => {
    const schema = buildArticleSchema({
      headline: 'Morar no Tamboré',
      description: 'Guia completo do bairro',
      url: 'https://x.com/bairros/tambore',
    })
    expect(schema['@type']).toBe('Article')
    expect(schema.author).toEqual({ '@id': AGENT_ID })
    expect(schema.publisher).toEqual({ '@id': AGENT_ID })
  })

  it('uses the default OG image when no image is provided', () => {
    const schema = buildArticleSchema({
      headline: 'X',
      description: 'Y',
      url: 'https://x.com',
    })
    expect(schema.image).toBeDefined()
  })

  it('omits date fields that were not provided', () => {
    const schema = buildArticleSchema({ headline: 'X', description: 'Y', url: 'z' })
    expect(schema).not.toHaveProperty('datePublished')
    expect(schema).not.toHaveProperty('dateModified')
  })
})

describe('buildFaqPageSchema', () => {
  it('maps each FAQ entry to a Question/Answer pair', () => {
    const schema = buildFaqPageSchema([
      { question: 'Como é morar no Tamboré?', answer: 'Muito bom.' },
      { question: 'Quais escolas?', answer: 'Várias.' },
    ])
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toEqual([
      { '@type': 'Question', name: 'Como é morar no Tamboré?', acceptedAnswer: { '@type': 'Answer', text: 'Muito bom.' } },
      { '@type': 'Question', name: 'Quais escolas?',           acceptedAnswer: { '@type': 'Answer', text: 'Várias.' } },
    ])
  })
})

describe('buildPlaceSchema', () => {
  it('describes the bairro and contains it within the cidade', () => {
    const schema = buildPlaceSchema({
      name: 'Tamboré, Barueri',
      description: 'Bairro de alto padrão',
      url: 'https://x.com/bairros/tambore',
      cidade: 'Barueri',
    })
    expect(schema['@type']).toBe('Place')
    expect(schema.name).toBe('Tamboré, Barueri')
    expect(schema.address).toMatchObject({ addressLocality: 'Barueri', addressRegion: 'SP' })
    expect(schema.containedInPlace).toMatchObject({ '@type': 'City', name: 'Barueri' })
  })
})
