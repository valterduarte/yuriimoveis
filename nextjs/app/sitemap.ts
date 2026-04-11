import { fetchAllPropertySlugs, fetchDistinctBairros } from '../lib/api'
import { imovelSlug, slugify } from '../utils/imovelUtils'
import { LANDING_PAGES } from '../data/landingPages'
import { SITE_URL } from '../lib/config'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, bairros] = await Promise.all([
    fetchAllPropertySlugs(),
    fetchDistinctBairros(),
  ])

  const propertyUrls: MetadataRoute.Sitemap = properties.map(p => ({
    url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const bairroUrls: MetadataRoute.Sitemap = bairros.map(b => ({
    url: `${SITE_URL}/imoveis/${slugify(b)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const landingUrls: MetadataRoute.Sitemap = LANDING_PAGES.map(lp => ({
    url: `${SITE_URL}/imoveis/${lp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...landingUrls,
    ...bairroUrls,
    ...propertyUrls,
  ]
}
