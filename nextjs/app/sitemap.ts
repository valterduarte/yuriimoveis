import { fetchAllPropertySlugs, fetchDistinctBairros, fetchNavigationMatrix, fetchPriceBedroomMatrix, fetchAllBlogSlugs } from '../lib/api'
import { imovelSlug, ogImageUrl, slugify } from '../utils/imovelUtils'
import { BAIRROS } from '../data/bairros'
import { getCategoriaBySlug } from '../data/categorias'
import { LANDING_PAGES } from '../data/landingPages'
import { AJUDA_ARTIGOS } from '../data/ajudaArtigos'
import { getAllPriceRanges, BEDROOM_FILTERS } from '../data/priceRanges'
import { AMENITY_FILTERS, imovelMatchesAmenity } from '../data/amenityFilters'
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

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, bairros, matrix, priceMatrix, blogSlugs] = await Promise.all([
    fetchAllPropertySlugs(),
    fetchDistinctBairros(),
    fetchNavigationMatrix(),
    fetchPriceBedroomMatrix(),
    fetchAllBlogSlugs(),
  ])

  if (properties.length === 0 && bairros.length === 0 && matrix.length === 0) {
    throw new Error('sitemap: database returned no data — refusing to serve empty sitemap')
  }

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

  const MIN_PROPERTIES_FOR_INDEXING = 3

  const bairroCountByDbName = new Map<string, number>()
  const landingCountByTipoCategoria = new Map<string, number>()
  for (const row of matrix) {
    bairroCountByDbName.set(row.bairro, (bairroCountByDbName.get(row.bairro) ?? 0) + row.count)
    const landingKey = `${row.tipo}|${row.categoria}`
    landingCountByTipoCategoria.set(landingKey, (landingCountByTipoCategoria.get(landingKey) ?? 0) + row.count)
  }

  const configuredBairros = Object.values(BAIRROS)
  const overriddenDbNames = new Set(configuredBairros.map(b => b.dbMatch).filter(Boolean) as string[])
  const configuredSlugs = new Set(configuredBairros.map(b => b.slug))

  const bairroHasEnoughStock = (slug: string, dbName: string | undefined): boolean => {
    if (hasRichBairroContent(slug)) return true
    if (!dbName) return false
    return (bairroCountByDbName.get(dbName) ?? 0) >= MIN_PROPERTIES_FOR_INDEXING
  }

  const configuredBairroUrls: MetadataRoute.Sitemap = configuredBairros
    .filter(b => bairroHasEnoughStock(b.slug, b.dbMatch))
    .map(b => ({
      url: `${SITE_URL}/imoveis/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  const dbBairroUrls: MetadataRoute.Sitemap = bairros
    .filter(b => !overriddenDbNames.has(b) && !configuredSlugs.has(slugify(b)))
    .filter(b => (bairroCountByDbName.get(b) ?? 0) >= MIN_PROPERTIES_FOR_INDEXING)
    .map(b => ({
      url: `${SITE_URL}/imoveis/${slugify(b)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  const bairroUrls: MetadataRoute.Sitemap = [...configuredBairroUrls, ...dbBairroUrls]

  const landingUrls: MetadataRoute.Sitemap = LANDING_PAGES
    .filter(lp => (landingCountByTipoCategoria.get(`${lp.tipo}|${lp.categoria}`) ?? 0) >= MIN_PROPERTIES_FOR_INDEXING)
    .map(lp => ({
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

  // Filter pages (price ranges + bedroom counts) — city-wide, category-scoped, and bairro-scoped
  const filterUrls: MetadataRoute.Sitemap = []
  const filterSeen = new Set<string>()
  const categoryFilterSeen = new Set<string>()
  const bairroFilterSeen = new Set<string>()

  for (const row of priceMatrix) {
    const acao: AcaoSlug = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidadeSlug = cidadeNameToSlug(row.cidade)
    if (!cidadeSlugToName(cidadeSlug)) continue
    const hasCategoria = !!getCategoriaBySlug(row.categoria)
    const bairroSlug = bairroDbNameToSlug(row.bairro)

    const priceRanges = getAllPriceRanges(row.tipo as 'venda' | 'aluguel')
    for (const range of priceRanges) {
      const inRange = (!range.min || row.preco >= range.min) && (!range.max || row.preco <= range.max)
      if (!inRange) continue

      const key = `${acao}|${cidadeSlug}|${range.slug}`
      if (!filterSeen.has(key)) {
        filterSeen.add(key)
        filterUrls.push({
          url: `${SITE_URL}/${acao}/${cidadeSlug}/filtro/${range.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        })
      }

      if (hasCategoria) {
        const catKey = `${acao}|${cidadeSlug}|${row.categoria}|${range.slug}`
        if (!categoryFilterSeen.has(catKey)) {
          categoryFilterSeen.add(catKey)
          filterUrls.push({
            url: `${SITE_URL}/${acao}/${cidadeSlug}/${row.categoria}/filtro/${range.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }

        if (bairroSlug) {
          const bairroKey = `${acao}|${cidadeSlug}|${row.categoria}|${bairroSlug}|${range.slug}`
          if (!bairroFilterSeen.has(bairroKey)) {
            bairroFilterSeen.add(bairroKey)
            filterUrls.push({
              url: `${SITE_URL}/${acao}/${cidadeSlug}/${row.categoria}/${bairroSlug}/filtro/${range.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.78,
            })
          }
        }
      }
    }

    for (const amenity of AMENITY_FILTERS) {
      if (!imovelMatchesAmenity(row.diferenciais, amenity)) continue

      const key = `${acao}|${cidadeSlug}|${amenity.slug}`
      if (!filterSeen.has(key)) {
        filterSeen.add(key)
        filterUrls.push({
          url: `${SITE_URL}/${acao}/${cidadeSlug}/filtro/${amenity.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        })
      }

      if (hasCategoria) {
        const catKey = `${acao}|${cidadeSlug}|${row.categoria}|${amenity.slug}`
        if (!categoryFilterSeen.has(catKey)) {
          categoryFilterSeen.add(catKey)
          filterUrls.push({
            url: `${SITE_URL}/${acao}/${cidadeSlug}/${row.categoria}/filtro/${amenity.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }

        if (bairroSlug) {
          const bairroKey = `${acao}|${cidadeSlug}|${row.categoria}|${bairroSlug}|${amenity.slug}`
          if (!bairroFilterSeen.has(bairroKey)) {
            bairroFilterSeen.add(bairroKey)
            filterUrls.push({
              url: `${SITE_URL}/${acao}/${cidadeSlug}/${row.categoria}/${bairroSlug}/filtro/${amenity.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.78,
            })
          }
        }
      }
    }

    for (const bf of BEDROOM_FILTERS) {
      const minBedrooms = bf.value === '4+' ? 4 : bf.value
      const matches = row.quartos >= minBedrooms
      if (!matches) continue

      const key = `${acao}|${cidadeSlug}|${bf.slug}`
      if (!filterSeen.has(key)) {
        filterSeen.add(key)
        filterUrls.push({
          url: `${SITE_URL}/${acao}/${cidadeSlug}/filtro/${bf.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.75,
        })
      }

      if (hasCategoria) {
        const catKey = `${acao}|${cidadeSlug}|${row.categoria}|${bf.slug}`
        if (!categoryFilterSeen.has(catKey)) {
          categoryFilterSeen.add(catKey)
          filterUrls.push({
            url: `${SITE_URL}/${acao}/${cidadeSlug}/${row.categoria}/filtro/${bf.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }

        if (bairroSlug) {
          const bairroKey = `${acao}|${cidadeSlug}|${row.categoria}|${bairroSlug}|${bf.slug}`
          if (!bairroFilterSeen.has(bairroKey)) {
            bairroFilterSeen.add(bairroKey)
            filterUrls.push({
              url: `${SITE_URL}/${acao}/${cidadeSlug}/${row.categoria}/${bairroSlug}/filtro/${bf.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.78,
            })
          }
        }
      }
    }
  }

  const activeBairroDbNames = new Set(matrix.map(r => r.bairro))
  const bairroGuideUrls: MetadataRoute.Sitemap = Object.values(BAIRROS)
    .filter(b => activeBairroDbNames.has(b.dbMatch || b.nome))
    .map(b => ({
      url: `${SITE_URL}/bairros/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.78,
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
      url: `${SITE_URL}/mapa`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/simulador`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
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
    ...(blogSlugs.length > 0 ? [{
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }] : []),
    ...blogSlugs.map(b => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    {
      url: `${SITE_URL}/bairros`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...hierarchicalUrls,
    ...filterUrls,
    ...landingUrls,
    ...bairroUrls,
    ...bairroGuideUrls,
    ...propertyUrls,
  ]
}
