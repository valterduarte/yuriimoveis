import { OG_DEFAULT_IMAGE } from '../config'
import { AGENT_ID, PERSON_ID } from './ids'

interface ArticleSchemaInput {
  headline: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
  /** Schema.org type. Use 'BlogPosting' for blog posts, 'Article' (default) for landing/guide pages. */
  type?: 'Article' | 'BlogPosting'
}

export function buildArticleSchema({
  headline,
  description,
  url,
  image = OG_DEFAULT_IMAGE,
  datePublished,
  dateModified,
  type = 'Article',
}: ArticleSchemaInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': type,
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
