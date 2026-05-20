import { SITE_URL } from '../lib/config'
import type { MetadataRoute } from 'next'

const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'OAI-SearchBot', 'PerplexityBot', 'Google-Extended', 'CCBot', 'anthropic-ai', 'cohere-ai']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api'],
      },
      ...AI_CRAWLERS.map(userAgent => ({
        userAgent,
        allow: '/',
        disallow: ['/admin', '/admin/', '/api'],
        crawlDelay: 2,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
