import { fetchAllPropertySlugs, fetchDistinctBairros, fetchNavigationMatrix } from '../lib/api'
import { imovelSlug, ogImageUrl, slugify } from '../utils/imovelUtils'
import { BAIRROS } from '../data/bairros'
import { getCategoriaBySlug } from '../data/categorias'
import { LANDING_PAGES } from '../data/landingPages'
import { AJUDA_ARTIGOS } from '../data/ajudaArtigos'
import {
  bairroDbNameToSlug,
  cidadeNameToSlug,
  cidadeSlugToName,
  buildHierarchicalUrl,
  hasRichBairroContent,
  type AcaoSlug,
} from '../lib/navigation'
import { SITE_URL } from '../lib/config'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, bairros, matrix] = await Promise.all([
    fetchAllPropertySlugs(),
    fetchDistinctBairros(),
    fetchNavigationMatrix(),
  ])

  const propertyUrls: MetadataRoute.Sitemap = properties.map(p => {
    const images = (p.imagens || [])
      .slice(0, 10)
      .map(img => ogImageUrl(img))
      .filter(Boolean)
    return {
      url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(images.length > 0 && { images }),
    }
  })

  const configuredBairros = Object.values(BAIRROS)
  const overriddenDbNames = new Set(configuredBairros.map(b => b.dbMatch).filter(Boolean) as string[])
  const configuredSlugs = new Set(configuredBairros.map(b => b.slug))

  const configuredBairroUrls: MetadataRoute.Sitemap = configuredBairros.map(b => ({
    url: `${SITE_URL}/imoveis/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const dbBairroUrls: MetadataRoute.Sitemap = bairros
    .filter(b => !overriddenDbNames.has(b) && !configuredSlugs.has(slugify(b)))
    .map(b => ({
      url: `${SITE_URL}/imoveis/${slugify(b)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  const bairroUrls: MetadataRoute.Sitemap = [...configuredBairroUrls, ...dbBairroUrls]

  const landingUrls: MetadataRoute.Sitemap = LANDING_PAGES.map(lp => ({
    url: `${SITE_URL}/imoveis/${lp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const hierarchicalUrls: MetadataRoute.Sitemap = []
  const hierarchicalSeen = new Set<string>()
  const cidadeSeen = new Set<string>()
  const cidadeCategoriaSeen = new Set<string>()

  for (const row of matrix) {
    const acao: AcaoSlug = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidadeSlug = cidadeNameToSlug(row.cidade)
    if (!cidadeSlugToName(cidadeSlug)) continue
    if (!getCategoriaBySlug(row.categoria)) continue
    const bairroSlug = bairroDbNameToSlug(row.bairro)

    const cidadeKey = `${acao}|${cidadeSlug}`
    if (!cidadeSeen.has(cidadeKey)) {
      cidadeSeen.add(cidadeKey)
      hierarchicalUrls.push({
        url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade: cidadeSlug })}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      })
    }

    const cidadeCategoriaKey = `${acao}|${cidadeSlug}|${row.categoria}`
    if (!cidadeCategoriaSeen.has(cidadeCategoriaKey)) {
      cidadeCategoriaSeen.add(cidadeCategoriaKey)
      hierarchicalUrls.push({
        url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: row.categoria })}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    }

    const passesThreshold = row.count >= 3 || (row.count >= 1 && hasRichBairroContent(bairroSlug))
    if (!passesThreshold) continue

    const leafKey = `${acao}|${cidadeSlug}|${row.categoria}|${bairroSlug}`
    if (hierarchicalSeen.has(leafKey)) continue
    hierarchicalSeen.add(leafKey)
    hierarchicalUrls.push({
      url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: row.categoria, bairro: bairroSlug })}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

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
    {
      url: `${SITE_URL}/ajuda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...AJUDA_ARTIGOS.map(a => ({
      url: `${SITE_URL}/ajuda/${a.slug}`,
      lastModified: new Date(a.atualizadoEm),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...hierarchicalUrls,
    ...landingUrls,
    ...bairroUrls,
    ...propertyUrls,
  ]
}
