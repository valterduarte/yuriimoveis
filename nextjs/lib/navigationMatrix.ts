import { unstable_cache } from 'next/cache'
import { getDb } from './db'
import { logDbError } from './logger'
import { CACHE_TAG_IMOVEIS, STATIC_DATA_REVALIDATE_SECONDS } from './cacheTags'

export interface NavigationMatrixRow {
  tipo: string
  cidade: string
  categoria: string
  bairro: string
  count: number
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

export async function fetchNavigationMatrix(): Promise<NavigationMatrixRow[]> {
  try {
    return await fetchNavigationMatrixCached()
  } catch (err) {
    logDbError('fetchNavigationMatrix', err)
    return []
  }
}

export async function fetchPriceBedroomMatrix(): Promise<PriceBedroomMatrixRow[]> {
  try {
    return await fetchPriceBedroomMatrixCached()
  } catch (err) {
    logDbError('fetchPriceBedroomMatrix', err)
    return []
  }
}
