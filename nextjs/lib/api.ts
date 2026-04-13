import { getDb } from './db'
import type { Imovel, ImovelRow, PropertyFilters, PropertyListResult } from '../types'

export function parseImovel(row: ImovelRow): Imovel {
  return {
    ...row,
    imagens:      JSON.parse(row.imagens      || '[]'),
    diferenciais: JSON.parse(row.diferenciais || '[]'),
  }
}

export async function fetchFeaturedProperties(): Promise<Imovel[]> {
  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND destaque = true ORDER BY destaque DESC, created_at DESC LIMIT 6`
    )
    return result.rows.map(parseImovel)
  } catch (err) {
    console.error('fetchFeaturedProperties error:', err)
    return []
  }
}

export async function fetchImovel(id: string | number): Promise<Imovel | null> {
  try {
    const result = await getDb().query(
      'SELECT * FROM imoveis WHERE id = $1 AND ativo = true',
      [id]
    )
    if (!result.rows[0]) return null
    return parseImovel(result.rows[0])
  } catch (err) {
    console.error('fetchImovel error:', err)
    return null
  }
}

export async function fetchPropertiesByBairro(bairroName: string): Promise<{ imoveis: Imovel[]; total: number }> {
  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND bairro ILIKE $1 ORDER BY created_at DESC LIMIT 50`,
      [`%${bairroName}%`]
    )
    const imoveis = result.rows.map(parseImovel)
    return { imoveis, total: imoveis.length }
  } catch (err) {
    console.error('fetchPropertiesByBairro error:', err)
    return { imoveis: [], total: 0 }
  }
}

export async function fetchProperties(filters: PropertyFilters = {}): Promise<PropertyListResult> {
  try {
    const { tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, codigo, destaque, todos, ordem = 'recente', page = 1, limit = 9 } = filters
    const conditions: string[] = todos === true || todos === 'true' ? [] : ['ativo = true']
    const params: (string | number)[] = []
    let idx = 1

    if (codigo)   { conditions.push(`id = $${idx++}`);        params.push(Number(codigo)) }
    if (tipo)     { conditions.push(`tipo = $${idx++}`);       params.push(tipo) }
    if (categoria){ conditions.push(`categoria = $${idx++}`);  params.push(categoria) }
    if (cidade)   { conditions.push(`cidade = $${idx++}`);     params.push(cidade) }
    if (bairro)   { conditions.push(`bairro ILIKE $${idx++}`); params.push(`%${bairro}%`) }
    if (precoMin) { conditions.push(`preco >= $${idx++}`);     params.push(Number(precoMin)) }
    if (precoMax) { conditions.push(`preco <= $${idx++}`);     params.push(Number(precoMax)) }
    if (destaque) { conditions.push('destaque = true') }
    if (quartos) {
      if (quartos === '4+') { conditions.push('quartos >= 4') }
      else { conditions.push(`quartos >= $${idx++}`); params.push(Number(quartos)) }
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
  } catch (err) {
    console.error('fetchProperties error:', err)
    return { imoveis: [], total: 0, page: 1, limit: 9, pages: 0 }
  }
}

export async function fetchSiteConfig(key: string): Promise<string | null> {
  try {
    const result = await getDb().query('SELECT value FROM site_config WHERE key = $1', [key])
    return result.rows[0]?.value ?? null
  } catch (err) {
    console.error('fetchSiteConfig error:', err)
    return null
  }
}

export async function fetchDistinctBairros(): Promise<string[]> {
  try {
    const result = await getDb().query(
      `SELECT DISTINCT bairro FROM imoveis WHERE ativo = true AND bairro IS NOT NULL AND bairro != '' ORDER BY bairro`
    )
    return result.rows.map((r: { bairro: string }) => r.bairro)
  } catch (err) {
    console.error('fetchDistinctBairros error:', err)
    return []
  }
}

export async function fetchSimilarProperties(imovel: Pick<Imovel, 'id' | 'categoria' | 'cidade' | 'tipo'>): Promise<Imovel[]> {
  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND id != $1
       AND (categoria = $2 OR cidade = $3)
       AND tipo = $4
       ORDER BY (categoria = $2 AND cidade = $3)::int DESC, destaque DESC, created_at DESC
       LIMIT 3`,
      [imovel.id, imovel.categoria, imovel.cidade, imovel.tipo]
    )
    return result.rows.map(parseImovel)
  } catch (err) {
    console.error('fetchSimilarProperties error:', err)
    return []
  }
}

export async function fetchPropertiesByTypeCategory(
  tipo: string,
  categoria: string
): Promise<{ imoveis: Imovel[]; total: number }> {
  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND tipo = $1 AND categoria = $2
       ORDER BY destaque DESC, created_at DESC LIMIT 50`,
      [tipo, categoria]
    )
    const imoveis = result.rows.map(parseImovel)
    return { imoveis, total: imoveis.length }
  } catch (err) {
    console.error('fetchPropertiesByTypeCategory error:', err)
    return { imoveis: [], total: 0 }
  }
}

export interface NavigationMatrixRow {
  tipo: string
  cidade: string
  categoria: string
  bairro: string
  count: number
}

export async function fetchNavigationMatrix(): Promise<NavigationMatrixRow[]> {
  try {
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
  } catch (err) {
    console.error('fetchNavigationMatrix error:', err)
    return []
  }
}

export async function fetchAllPropertySlugs(): Promise<Pick<Imovel, 'id' | 'titulo' | 'updated_at' | 'imagens'>[]> {
  try {
    const result = await getDb().query(
      `SELECT id, titulo, updated_at, imagens FROM imoveis WHERE ativo = true ORDER BY created_at DESC LIMIT 1000`
    )
    return result.rows.map(row => ({
      ...row,
      imagens: typeof row.imagens === 'string' ? JSON.parse(row.imagens || '[]') : (row.imagens || []),
    }))
  } catch (err) {
    console.error('fetchAllPropertySlugs error:', err)
    return []
  }
}
