import { fetchAllPropertySlugs, fetchDistinctBairros } from '../lib/api'
import { imovelSlug, slugify } from '../utils/imovelUtils'
import { SITE_URL } from '../lib/config'

export default async function sitemap() {
  const [properties, bairros] = await Promise.all([
    fetchAllPropertySlugs(),
    fetchDistinctBairros(),
  ])

  const propertyUrls = properties.map(p => ({
    url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const bairroUrls = bairros.map(b => ({
    url: `${SITE_URL}/imoveis/${slugify(b)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
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
      url: `${SITE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...bairroUrls,
    ...propertyUrls,
  ]
}
