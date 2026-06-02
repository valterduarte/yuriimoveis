import { fetchAllPropertySlugs, fetchDistinctBairros, fetchNavigationMatrix, fetchPriceBedroomMatrix, fetchAllBlogSlugs } from '../lib/api'
import { listEmpreendimentos } from '../lib/empreendimento'
import { imovelSlug, ogImageUrl } from '../utils/imovelUtils'
import { BAIRROS } from '../data/bairros'
import { getCategoriaBySlug } from '../data/categorias'
import { LANDING_PAGES } from '../data/landingPages'
import { AJUDA_ARTIGOS } from '../data/ajudaArtigos'
import { GUIA_SLUGS } from '../data/guias'
import { getAllPriceRanges, BEDROOM_FILTERS } from '../data/priceRanges'
import { AMENITY_FILTERS, imovelMatchesAmenity } from '../data/amenityFilters'
import {
  bairroDbNameToSlug,
  cidadeNameToSlug,
  cidadeSlugToName,
  buildHierarchicalUrl,
  isHierarchicalLeafIndexable,
  type AcaoSlug,
} from '../lib/navigation'
import { SITE_URL } from '../lib/config'
import { SEO_MIN_PROPERTIES_FOR_INDEXING, SEO_MIN_PROPERTIES_FOR_FILTER } from '../lib/constants'
import { LEGACY_LANDING_REDIRECTS } from '../middleware'
import type { MetadataRoute } from 'next'

export const revalidate = 3600

function pickLatest(current: Date | undefined, incoming: string | undefined): Date | undefined {
  if (!incoming) return current
  const next = new Date(incoming)
  if (!current || next > current) return next
  return current
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, bairros, matrix, priceMatrix, blogSlugs, empreendimentos] = await Promise.all([
    fetchAllPropertySlugs(),
    fetchDistinctBairros(),
    fetchNavigationMatrix(),
    fetchPriceBedroomMatrix(),
    fetchAllBlogSlugs(),
    listEmpreendimentos(),
  ])

  if (properties.length === 0 && bairros.length === 0 && matrix.length === 0) {
    throw new Error('sitemap: database returned no data — refusing to serve empty sitemap')
  }

  const now = new Date()
  let propertiesLatest: Date | undefined
  for (const p of properties) propertiesLatest = pickLatest(propertiesLatest, p.updated_at)

  const propertyUrls: MetadataRoute.Sitemap = properties.map(p => {
    const images = (p.imagens || [])
      .slice(0, 10)
      .map(img => ogImageUrl(img))
      .filter(Boolean)
    return {
      url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      ...(images.length > 0 && { images }),
    }
  })

  const MIN_PROPERTIES_FOR_INDEXING = SEO_MIN_PROPERTIES_FOR_INDEXING
  const MIN_PROPERTIES_FOR_FILTER = SEO_MIN_PROPERTIES_FOR_FILTER

  const bairroCountByDbName = new Map<string, number>()
  const bairroLastModByDbName = new Map<string, Date>()
  const landingCountByTipoCategoria = new Map<string, number>()
  const cidadeLatest = new Map<string, Date>()
  const cidadeCategoriaLatest = new Map<string, Date>()
  const hierarchicalLatest = new Map<string, Date>()

  for (const row of matrix) {
    bairroCountByDbName.set(row.bairro, (bairroCountByDbName.get(row.bairro) ?? 0) + row.count)
    const landingKey = `${row.tipo}|${row.categoria}`
    landingCountByTipoCategoria.set(landingKey, (landingCountByTipoCategoria.get(landingKey) ?? 0) + row.count)

    const lastMod = pickLatest(undefined, row.lastModified) ?? now
    const prev = bairroLastModByDbName.get(row.bairro)
    if (!prev || lastMod > prev) bairroLastModByDbName.set(row.bairro, lastMod)

    const acao: AcaoSlug = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidadeSlug = cidadeNameToSlug(row.cidade)
    const cidadeKey = `${acao}|${cidadeSlug}`
    const ccKey = `${acao}|${cidadeSlug}|${row.categoria}`
    const leafKey = `${acao}|${cidadeSlug}|${row.categoria}|${bairroDbNameToSlug(row.bairro)}`

    for (const [key, map] of [
      [cidadeKey, cidadeLatest] as const,
      [ccKey, cidadeCategoriaLatest] as const,
      [leafKey, hierarchicalLatest] as const,
    ]) {
      const cur = map.get(key)
      if (!cur || lastMod > cur) map.set(key, lastMod)
    }
  }

  const landingUrls: MetadataRoute.Sitemap = LANDING_PAGES
    .filter(lp => !(lp.slug in LEGACY_LANDING_REDIRECTS))
    .filter(lp => (landingCountByTipoCategoria.get(`${lp.tipo}|${lp.categoria}`) ?? 0) >= MIN_PROPERTIES_FOR_INDEXING)
    .map(lp => ({
      url: `${SITE_URL}/imoveis/${lp.slug}`,
      lastModified: propertiesLatest || now,
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
        lastModified: cidadeLatest.get(cidadeKey) || now,
      })
    }

    const ccKey = `${acao}|${cidadeSlug}|${row.categoria}`
    if (!cidadeCategoriaSeen.has(ccKey)) {
      cidadeCategoriaSeen.add(ccKey)
      hierarchicalUrls.push({
        url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: row.categoria })}`,
        lastModified: cidadeCategoriaLatest.get(ccKey) || now,
      })
    }

    if (!isHierarchicalLeafIndexable(row.count, bairroSlug)) continue

    const leafKey = `${acao}|${cidadeSlug}|${row.categoria}|${bairroSlug}`
    if (hierarchicalSeen.has(leafKey)) continue
    hierarchicalSeen.add(leafKey)
    hierarchicalUrls.push({
      url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: row.categoria, bairro: bairroSlug })}`,
      lastModified: hierarchicalLatest.get(leafKey) || now,
    })
  }

  const cityFilterCounts = new Map<string, number>()
  const categoryFilterCounts = new Map<string, number>()
  const bairroFilterCounts = new Map<string, number>()

  const bumpCounts = (acao: AcaoSlug, cidadeSlug: string, categoria: string, hasCategoria: boolean, bairroSlug: string, filterSlug: string) => {
    const cityKey = `${acao}|${cidadeSlug}|${filterSlug}`
    cityFilterCounts.set(cityKey, (cityFilterCounts.get(cityKey) ?? 0) + 1)
    if (hasCategoria) {
      const catKey = `${acao}|${cidadeSlug}|${categoria}|${filterSlug}`
      categoryFilterCounts.set(catKey, (categoryFilterCounts.get(catKey) ?? 0) + 1)
      if (bairroSlug) {
        const bairroKey = `${acao}|${cidadeSlug}|${categoria}|${bairroSlug}|${filterSlug}`
        bairroFilterCounts.set(bairroKey, (bairroFilterCounts.get(bairroKey) ?? 0) + 1)
      }
    }
  }

  for (const row of priceMatrix) {
    const acao: AcaoSlug = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidadeSlug = cidadeNameToSlug(row.cidade)
    if (!cidadeSlugToName(cidadeSlug)) continue
    const hasCategoria = !!getCategoriaBySlug(row.categoria)
    const bairroSlug = bairroDbNameToSlug(row.bairro)

    for (const range of getAllPriceRanges(row.tipo as 'venda' | 'aluguel')) {
      const inRange = (!range.min || row.preco >= range.min) && (!range.max || row.preco <= range.max)
      if (!inRange) continue
      bumpCounts(acao, cidadeSlug, row.categoria, hasCategoria, bairroSlug, range.slug)
    }

    for (const amenity of AMENITY_FILTERS) {
      if (!imovelMatchesAmenity(row.diferenciais, amenity)) continue
      bumpCounts(acao, cidadeSlug, row.categoria, hasCategoria, bairroSlug, amenity.slug)
    }

    for (const bf of BEDROOM_FILTERS) {
      const minBedrooms = bf.value === '4+' ? 4 : bf.value
      if (row.quartos < minBedrooms) continue
      bumpCounts(acao, cidadeSlug, row.categoria, hasCategoria, bairroSlug, bf.slug)
    }
  }

  const filterUrls: MetadataRoute.Sitemap = []
  const lastModForCityCategory = (acao: AcaoSlug, cidadeSlug: string, categoria: string): Date =>
    cidadeCategoriaLatest.get(`${acao}|${cidadeSlug}|${categoria}`)
      || cidadeLatest.get(`${acao}|${cidadeSlug}`)
      || now

  for (const [key, count] of cityFilterCounts) {
    if (count < MIN_PROPERTIES_FOR_FILTER) continue
    const [acao, cidadeSlug, filterSlug] = key.split('|') as [AcaoSlug, string, string]
    filterUrls.push({
      url: `${SITE_URL}/${acao}/${cidadeSlug}/filtro/${filterSlug}`,
      lastModified: cidadeLatest.get(`${acao}|${cidadeSlug}`) || now,
    })
  }

  for (const [key, count] of categoryFilterCounts) {
    if (count < MIN_PROPERTIES_FOR_FILTER) continue
    const [acao, cidadeSlug, categoria, filterSlug] = key.split('|') as [AcaoSlug, string, string, string]
    filterUrls.push({
      url: `${SITE_URL}/${acao}/${cidadeSlug}/${categoria}/filtro/${filterSlug}`,
      lastModified: lastModForCityCategory(acao, cidadeSlug, categoria),
    })
  }

  for (const [key, count] of bairroFilterCounts) {
    if (count < MIN_PROPERTIES_FOR_FILTER) continue
    const [acao, cidadeSlug, categoria, bairroSlug, filterSlug] = key.split('|') as [AcaoSlug, string, string, string, string]
    filterUrls.push({
      url: `${SITE_URL}/${acao}/${cidadeSlug}/${categoria}/${bairroSlug}/filtro/${filterSlug}`,
      lastModified: lastModForCityCategory(acao, cidadeSlug, categoria),
    })
  }

  const activeBairroKeys = new Set(matrix.map(r => `${r.cidade}|${r.bairro}`))
  const bairroGuideUrls: MetadataRoute.Sitemap = Object.values(BAIRROS)
    .filter(b => b.guiaIndependente || activeBairroKeys.has(`${b.cidade}|${b.dbMatch || b.nome}`))
    .map(b => ({
      url: `${SITE_URL}/bairros/${b.slug}`,
      lastModified: (b.dbMatch && bairroLastModByDbName.get(b.dbMatch)) || now,
    }))

  const ajudaLatest = AJUDA_ARTIGOS.reduce<Date | undefined>((latest, a) => {
    const d = new Date(a.atualizadoEm)
    return !latest || d > latest ? d : latest
  }, undefined) || now

  const blogLatest = blogSlugs.reduce<Date | undefined>((latest, b) => {
    if (!b.updated_at) return latest
    const d = new Date(b.updated_at)
    return !latest || d > latest ? d : latest
  }, undefined) || now

  return [
    { url: SITE_URL, lastModified: propertiesLatest || now },
    { url: `${SITE_URL}/imoveis`, lastModified: propertiesLatest || now },
    { url: `${SITE_URL}/alugar`, lastModified: now },
    { url: `${SITE_URL}/mapa`, lastModified: propertiesLatest || now },
    { url: `${SITE_URL}/simulador`, lastModified: now },
    { url: `${SITE_URL}/mcmv-osasco`, lastModified: new Date('2026-05-19'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/avaliacao-imovel-osasco`, lastModified: new Date('2026-05-19'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/sobre`, lastModified: now },
    { url: `${SITE_URL}/contato`, lastModified: now },
    { url: `${SITE_URL}/ajuda`, lastModified: ajudaLatest },
    ...AJUDA_ARTIGOS.map(a => ({
      url: `${SITE_URL}/ajuda/${a.slug}`,
      lastModified: new Date(a.atualizadoEm),
    })),
    ...(blogSlugs.length > 0 ? [{ url: `${SITE_URL}/blog`, lastModified: blogLatest }] : []),
    ...blogSlugs.map(b => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : now,
    })),
    { url: `${SITE_URL}/guia`, lastModified: now },
    ...GUIA_SLUGS.map(slug => ({ url: `${SITE_URL}/guia/${slug}`, lastModified: now })),
    { url: `${SITE_URL}/bairros`, lastModified: propertiesLatest || now },
    ...(empreendimentos.length > 0
      ? [
        { url: `${SITE_URL}/empreendimentos`,                   lastModified: propertiesLatest || now, changeFrequency: 'weekly' as const, priority: 0.8 },
        ...(empreendimentos.some(e => e.status === 'construcao')
          ? [{ url: `${SITE_URL}/empreendimentos/em-construcao`,     lastModified: propertiesLatest || now, changeFrequency: 'weekly' as const, priority: 0.8 }]
          : []),
        ...(empreendimentos.some(e => e.status === 'pronto')
          ? [{ url: `${SITE_URL}/empreendimentos/pronto-para-morar`, lastModified: propertiesLatest || now, changeFrequency: 'weekly' as const, priority: 0.8 }]
          : []),
      ]
      : []),
    ...empreendimentos.map(e => ({
      url: `${SITE_URL}/empreendimentos/${e.slug}`,
      lastModified: propertiesLatest || now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...hierarchicalUrls,
    ...filterUrls,
    ...landingUrls,
    ...bairroGuideUrls,
    ...propertyUrls,
  ]
}
