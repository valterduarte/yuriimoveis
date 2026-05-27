import { OG_DEFAULT_IMAGE } from '../config'
import { AGENT_ID, PERSON_ID } from './ids'

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
    author:    { '@id': PERSON_ID },
    publisher: { '@id': AGENT_ID  },
    mainEntityOfPage: url,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified  ? { dateModified  } : {}),
  }
}
