import { unstable_cache } from 'next/cache'
import { getDb } from './db'
import { logDbError } from './logger'
import type { Imovel, ImovelRow, BlogPost, BlogPostRow, PropertyFilters, PropertyListResult } from '../types'

export const CACHE_TAG_IMOVEIS = 'imoveis'
export const CACHE_TAG_SITE_CONFIG = 'site-config'
export const CACHE_TAG_BLOG = 'blog'

const LISTING_REVALIDATE_SECONDS = 300
const STATIC_DATA_REVALIDATE_SECONDS = 3600
const SITE_CONFIG_REVALIDATE_SECONDS = 86400

export function parseImovel(row: ImovelRow): Imovel {
  return {
    ...row,
    imagens:      JSON.parse(row.imagens      || '[]'),
    diferenciais: JSON.parse(row.diferenciais || '[]'),
  }
}

// ── Cached implementations (throw on error so failures don't poison cache) ───

const fetchFeaturedPropertiesCached = unstable_cache(
  async (): Promise<Imovel[]> => {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND destaque = true ORDER BY destaque DESC, created_at DESC LIMIT 6`
    )
    return result.rows.map(parseImovel)
  },
  ['fetchFeaturedProperties'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchImovelCached = unstable_cache(
  async (id: string | number): Promise<Imovel | null> => {
    const result = await getDb().query(
      'SELECT * FROM imoveis WHERE id = $1 AND ativo = true',
      [id]
    )
    if (!result.rows[0]) return null
    return parseImovel(result.rows[0])
  },
  ['fetchImovel'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchPropertiesByBairroCached = unstable_cache(
  async (bairroName: string): Promise<{ imoveis: Imovel[]; total: number }> => {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND bairro ILIKE $1 ORDER BY created_at DESC LIMIT 50`,
      [`%${bairroName}%`]
    )
    const imoveis = result.rows.map(parseImovel)
    return { imoveis, total: imoveis.length }
  },
  ['fetchPropertiesByBairro'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchPropertiesCached = unstable_cache(
  async (filters: PropertyFilters): Promise<PropertyListResult> => {
    const { tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, amenity, codigo, destaque, todos, ordem = 'recente', page = 1, limit = 9 } = filters
    const conditions: string[] = todos === true || todos === 'true' ? [] : ['ativo = true']
    const params: (string | number)[] = []
    let idx = 1

    if (codigo)   { conditions.push(`id = $${idx++}`);        params.push(Number(codigo)) }
    if (tipo)     { conditions.push(`tipo = $${idx++}`);       params.push(tipo) }
    if (categoria){ conditions.push(`categoria = $${idx++}`);  params.push(categoria) }
    if (cidade)   { conditions.push(`cidade = $${idx++}`);     params.push(cidade) }
    if (bairro)   { conditions.push(`bairro = $${idx++}`);     params.push(bairro) }
    if (precoMin) { conditions.push(`preco >= $${idx++}`);     params.push(Number(precoMin)) }
    if (precoMax) { conditions.push(`preco <= $${idx++}`);     params.push(Number(precoMax)) }
    if (destaque) { conditions.push('destaque = true') }
    if (quartos) {
      if (quartos === '4+') { conditions.push('quartos >= 4') }
      else { conditions.push(`quartos >= $${idx++}`); params.push(Number(quartos)) }
    }
    if (amenity) {
      const terms = amenity.split('|').filter(Boolean)
      if (terms.length > 0) {
        const clauses = terms.map(() => `diferenciais ILIKE $${idx++}`)
        conditions.push(`(${clauses.join(' OR ')})`)
        for (const term of terms) params.push(`%${term}%`)
      }
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderMap: Record<string, string> = { recente: 'created_at DESC', menor_preco: 'preco ASC', maior_preco: 'preco DESC', maior_area: 'area DESC' }
    const order = `ORDER BY destaque DESC, ${orderMap[ordem as string] || orderMap.recente}`
    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const offset   = (pageNum - 1) * limitNum

    const dataResult = await getDb().query(
      `SELECT *, COUNT(*) OVER() as total FROM imoveis ${where} ${order} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limitNum, offset]
    )
    const total = dataResult.rows.length > 0 ? parseInt(dataResult.rows[0].total) : 0
    const imoveis = dataResult.rows.map((row: ImovelRow & { total: string }) => {
      const { total: _total, ...rest } = row
      return parseImovel(rest)
    })
    return { imoveis, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
  },
  ['fetchProperties'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchSiteConfigCached = unstable_cache(
  async (key: string): Promise<string | null> => {
    const result = await getDb().query('SELECT value FROM site_config WHERE key = $1', [key])
    return result.rows[0]?.value ?? null
  },
  ['fetchSiteConfig'],
  { tags: [CACHE_TAG_SITE_CONFIG], revalidate: SITE_CONFIG_REVALIDATE_SECONDS }
)

const fetchDistinctBairrosCached = unstable_cache(
  async (): Promise<string[]> => {
    const result = await getDb().query(
      `SELECT DISTINCT bairro FROM imoveis WHERE ativo = true AND bairro IS NOT NULL AND bairro != '' ORDER BY bairro`
    )
    return result.rows.map((r: { bairro: string }) => r.bairro)
  },
  ['fetchDistinctBairros'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: STATIC_DATA_REVALIDATE_SECONDS }
)

const fetchCidadesByTipoCached = unstable_cache(
  async (): Promise<Record<string, string[]>> => {
    const result = await getDb().query(
      `SELECT DISTINCT tipo, cidade FROM imoveis
       WHERE ativo = true
         AND tipo IS NOT NULL AND tipo != ''
         AND cidade IS NOT NULL AND cidade != ''
       ORDER BY cidade`
    )
    const grouped: Record<string, string[]> = {}
    for (const row of result.rows as { tipo: string; cidade: string }[]) {
      if (!grouped[row.tipo]) grouped[row.tipo] = []
      grouped[row.tipo].push(row.cidade)
    }
    return grouped
  },
  ['fetchCidadesByTipo'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: STATIC_DATA_REVALIDATE_SECONDS }
)

const fetchSimilarPropertiesCached = unstable_cache(
  async (imovel: Pick<Imovel, 'id' | 'categoria' | 'cidade' | 'tipo'>): Promise<Imovel[]> => {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND id != $1
       AND (categoria = $2 OR cidade = $3)
       AND tipo = $4
       ORDER BY (categoria = $2 AND cidade = $3)::int DESC, destaque DESC, created_at DESC
       LIMIT 3`,
      [imovel.id, imovel.categoria, imovel.cidade, imovel.tipo]
    )
    return result.rows.map(parseImovel)
  },
  ['fetchSimilarProperties'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchPropertiesByTypeCategoryCached = unstable_cache(
  async (tipo: string, categoria: string): Promise<{ imoveis: Imovel[]; total: number }> => {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND tipo = $1 AND categoria = $2
       ORDER BY destaque DESC, created_at DESC LIMIT 50`,
      [tipo, categoria]
    )
    const imoveis = result.rows.map(parseImovel)
    return { imoveis, total: imoveis.length }
  },
  ['fetchPropertiesByTypeCategory'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

export interface NavigationMatrixRow {
  tipo: string
  cidade: string
  categoria: string
  bairro: string
  count: number
}

const fetchNavigationMatrixCached = unstable_cache(
  async (): Promise<NavigationMatrixRow[]> => {
    const result = await getDb().query(
      `SELECT tipo, cidade, categoria, bairro, COUNT(*)::int AS count
       FROM imoveis
       WHERE ativo = true
         AND tipo IS NOT NULL AND tipo != ''
         AND cidade IS NOT NULL AND cidade != ''
         AND categoria IS NOT NULL AND categoria != ''
         AND bairro IS NOT NULL AND bairro != ''
       GROUP BY tipo, cidade, categoria, bairro`
    )
    return result.rows.map((r: NavigationMatrixRow) => ({
      tipo:      r.tipo,
      cidade:    r.cidade,
      categoria: r.categoria,
      bairro:    r.bairro,
      count:     Number(r.count),
    }))
  },
  ['fetchNavigationMatrix'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: STATIC_DATA_REVALIDATE_SECONDS }
)

export interface MapImovel {
  id: number
  titulo: string
  preco: number
  tipo: Imovel['tipo']
  categoria: Imovel['categoria']
  quartos: number
  area: number
  bairro: string
  cidade: string
  imagem: string
  updated_at: string
}

const fetchPropertiesForMapCached = unstable_cache(
  async (): Promise<MapImovel[]> => {
    const result = await getDb().query(
      `SELECT id, titulo, preco, tipo, categoria, quartos, area, bairro, cidade, imagens, updated_at
       FROM imoveis WHERE ativo = true ORDER BY destaque DESC, created_at DESC LIMIT 500`
    )
    return result.rows.map((row: ImovelRow) => {
      const imagens = typeof row.imagens === 'string' ? JSON.parse(row.imagens || '[]') : (row.imagens || [])
      return {
        id: row.id,
        titulo: row.titulo,
        preco: row.preco,
        tipo: row.tipo,
        categoria: row.categoria,
        quartos: row.quartos,
        area: row.area,
        bairro: row.bairro,
        cidade: row.cidade,
        imagem: Array.isArray(imagens) && imagens[0] ? String(imagens[0]) : '',
        updated_at: row.updated_at,
      }
    })
  },
  ['fetchPropertiesForMap'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchAllPropertySlugsCached = unstable_cache(
  async (): Promise<Pick<Imovel, 'id' | 'titulo' | 'updated_at' | 'imagens'>[]> => {
    const result = await getDb().query(
      `SELECT id, titulo, updated_at, imagens FROM imoveis WHERE ativo = true ORDER BY created_at DESC LIMIT 1000`
    )
    return result.rows.map(row => ({
      ...row,
      imagens: typeof row.imagens === 'string' ? JSON.parse(row.imagens || '[]') : (row.imagens || []),
    }))
  },
  ['fetchAllPropertySlugs'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: STATIC_DATA_REVALIDATE_SECONDS }
)

// ── Public wrappers (log + graceful fallback) ───────────────────────────────

export async function fetchFeaturedProperties(): Promise<Imovel[]> {
  try {
    return await fetchFeaturedPropertiesCached()
  } catch (err) {
    logDbError('fetchFeaturedProperties', err)
    return []
  }
}

export async function fetchImovel(id: string | number): Promise<Imovel | null> {
  try {
    return await fetchImovelCached(id)
  } catch (err) {
    logDbError('fetchImovel', err, { id })
    return null
  }
}

export async function fetchPropertiesByBairro(bairroName: string): Promise<{ imoveis: Imovel[]; total: number }> {
  try {
    return await fetchPropertiesByBairroCached(bairroName)
  } catch (err) {
    logDbError('fetchPropertiesByBairro', err, { bairroName })
    return { imoveis: [], total: 0 }
  }
}

export async function fetchProperties(filters: PropertyFilters = {}): Promise<PropertyListResult> {
  try {
    return await fetchPropertiesCached(filters)
  } catch (err) {
    logDbError('fetchProperties', err, { filters })
    return { imoveis: [], total: 0, page: 1, limit: 9, pages: 0 }
  }
}

export async function fetchSiteConfig(key: string): Promise<string | null> {
  try {
    return await fetchSiteConfigCached(key)
  } catch (err) {
    logDbError('fetchSiteConfig', err, { key })
    return null
  }
}

export async function fetchDistinctBairros(): Promise<string[]> {
  try {
    return await fetchDistinctBairrosCached()
  } catch (err) {
    logDbError('fetchDistinctBairros', err)
    return []
  }
}

export async function fetchCidadesByTipo(): Promise<Record<string, string[]>> {
  try {
    return await fetchCidadesByTipoCached()
  } catch (err) {
    logDbError('fetchCidadesByTipo', err)
    return {}
  }
}

export async function fetchDistinctCidades(): Promise<string[]> {
  const grouped = await fetchCidadesByTipo()
  const unique = new Set<string>()
  for (const list of Object.values(grouped)) {
    for (const cidade of list) unique.add(cidade)
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export async function fetchSimilarProperties(imovel: Pick<Imovel, 'id' | 'categoria' | 'cidade' | 'tipo'>): Promise<Imovel[]> {
  try {
    return await fetchSimilarPropertiesCached(imovel)
  } catch (err) {
    logDbError('fetchSimilarProperties', err, { imovelId: imovel.id })
    return []
  }
}

export async function fetchPropertiesByTypeCategory(
  tipo: string,
  categoria: string
): Promise<{ imoveis: Imovel[]; total: number }> {
  try {
    return await fetchPropertiesByTypeCategoryCached(tipo, categoria)
  } catch (err) {
    logDbError('fetchPropertiesByTypeCategory', err, { tipo, categoria })
    return { imoveis: [], total: 0 }
  }
}

export async function fetchNavigationMatrix(): Promise<NavigationMatrixRow[]> {
  try {
    return await fetchNavigationMatrixCached()
  } catch (err) {
    logDbError('fetchNavigationMatrix', err)
    return []
  }
}

export async function fetchAllPropertySlugs(): Promise<Pick<Imovel, 'id' | 'titulo' | 'updated_at' | 'imagens'>[]> {
  try {
    return await fetchAllPropertySlugsCached()
  } catch (err) {
    logDbError('fetchAllPropertySlugs', err)
    return []
  }
}

export interface PriceBedroomMatrixRow {
  tipo: string
  cidade: string
  categoria: string
  bairro: string
  preco: number
  quartos: number
  diferenciais: string[]
}

const fetchPriceBedroomMatrixCached = unstable_cache(
  async (): Promise<PriceBedroomMatrixRow[]> => {
    const result = await getDb().query(
      `SELECT tipo, cidade, categoria, bairro, preco, quartos, diferenciais
       FROM imoveis
       WHERE ativo = true
         AND tipo IS NOT NULL AND tipo != ''
         AND cidade IS NOT NULL AND cidade != ''
         AND categoria IS NOT NULL AND categoria != ''
         AND bairro IS NOT NULL AND bairro != ''
         AND preco > 0`
    )
    return result.rows.map((r: { tipo: string; cidade: string; categoria: string; bairro: string; preco: number; quartos: number; diferenciais: string | string[] | null }) => ({
      tipo:      r.tipo,
      cidade:    r.cidade,
      categoria: r.categoria,
      bairro:    r.bairro,
      preco:     Number(r.preco),
      quartos:   Number(r.quartos),
      diferenciais: typeof r.diferenciais === 'string' ? JSON.parse(r.diferenciais || '[]') : (r.diferenciais ?? []),
    }))
  },
  ['fetchPriceBedroomMatrix'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: STATIC_DATA_REVALIDATE_SECONDS }
)

export async function fetchPriceBedroomMatrix(): Promise<PriceBedroomMatrixRow[]> {
  try {
    return await fetchPriceBedroomMatrixCached()
  } catch (err) {
    logDbError('fetchPriceBedroomMatrix', err)
    return []
  }
}

export async function fetchPropertiesForMap(): Promise<MapImovel[]> {
  try {
    return await fetchPropertiesForMapCached()
  } catch (err) {
    logDbError('fetchPropertiesForMap', err)
    return []
  }
}

// ── Blog ─────────────────────────────────────────────────────────────────────

function parseBlogPost(row: BlogPostRow): BlogPost {
  return { ...row, tags: JSON.parse(row.tags || '[]') }
}

const fetchPublishedBlogPostsCached = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const result = await getDb().query(
      'SELECT * FROM blog_posts WHERE publicado = true ORDER BY created_at DESC'
    )
    return result.rows.map(parseBlogPost)
  },
  ['fetchPublishedBlogPosts'],
  { tags: [CACHE_TAG_BLOG], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchBlogPostBySlugCached = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const result = await getDb().query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND publicado = true',
      [slug]
    )
    if (!result.rows[0]) return null
    return parseBlogPost(result.rows[0])
  },
  ['fetchBlogPostBySlug'],
  { tags: [CACHE_TAG_BLOG], revalidate: LISTING_REVALIDATE_SECONDS }
)

const fetchAllBlogSlugsCached = unstable_cache(
  async (): Promise<Pick<BlogPost, 'slug' | 'updated_at'>[]> => {
    const result = await getDb().query(
      'SELECT slug, updated_at FROM blog_posts WHERE publicado = true ORDER BY created_at DESC'
    )
    return result.rows
  },
  ['fetchAllBlogSlugs'],
  { tags: [CACHE_TAG_BLOG], revalidate: STATIC_DATA_REVALIDATE_SECONDS }
)

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    return await fetchPublishedBlogPostsCached()
  } catch (err) {
    logDbError('fetchPublishedBlogPosts', err)
    return []
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await fetchBlogPostBySlugCached(slug)
  } catch (err) {
    logDbError('fetchBlogPostBySlug', err, { slug })
    return null
  }
}

export async function fetchAllBlogSlugs(): Promise<Pick<BlogPost, 'slug' | 'updated_at'>[]> {
  try {
    return await fetchAllBlogSlugsCached()
  } catch (err) {
    logDbError('fetchAllBlogSlugs', err)
    return []
  }
}

export async function fetchRelatedBlogPosts(
  currentSlug: string,
  tags: string[],
  limit = 3,
): Promise<BlogPost[]> {
  try {
    const result = await getDb().query(
      `SELECT *,
         (SELECT COUNT(*) FROM jsonb_array_elements_text(tags::jsonb) tag
          WHERE tag = ANY($2::text[])) AS tag_matches
       FROM blog_posts
       WHERE publicado = true AND slug != $1
       ORDER BY tag_matches DESC, created_at DESC
       LIMIT $3`,
      [currentSlug, tags, limit],
    )
    return result.rows.map(parseBlogPost)
  } catch (err) {
    logDbError('fetchRelatedBlogPosts', err, { currentSlug })
    return []
  }
}
