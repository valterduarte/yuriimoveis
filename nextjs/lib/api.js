import { getDb } from './db'

function parseImovel(row) {
  return {
    ...row,
    imagens:      JSON.parse(row.imagens      || '[]'),
    diferenciais: JSON.parse(row.diferenciais || '[]'),
  }
}

export async function fetchFeaturedProperties() {
  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND destaque = true ORDER BY destaque DESC, created_at DESC LIMIT 6`
    )
    return result.rows.map(parseImovel)
  } catch {
    return []
  }
}

export async function fetchImovel(id) {
  try {
    const result = await getDb().query(
      'SELECT * FROM imoveis WHERE id = $1 AND ativo = true',
      [id]
    )
    if (!result.rows[0]) return null
    return parseImovel(result.rows[0])
  } catch {
    return null
  }
}

export async function fetchPropertiesByBairro(bairroName) {
  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true AND bairro ILIKE $1 ORDER BY created_at DESC LIMIT 50`,
      [`%${bairroName}%`]
    )
    const imoveis = result.rows.map(parseImovel)
    return { imoveis, total: imoveis.length }
  } catch {
    return { imoveis: [], total: 0 }
  }
}

export async function fetchProperties({ tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, destaque, todos, ordem = 'recente', page = 1, limit = 9 } = {}) {
  try {
    const conditions = todos ? [] : ['ativo = true']
    const params = []
    let idx = 1

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
    const orderMap = { recente: 'created_at DESC', menor_preco: 'preco ASC', maior_preco: 'preco DESC', maior_area: 'area DESC' }
    const order = `ORDER BY destaque DESC, ${orderMap[ordem] || orderMap.recente}`
    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const offset   = (pageNum - 1) * limitNum

    const dataResult = await getDb().query(
      `SELECT *, COUNT(*) OVER() as total FROM imoveis ${where} ${order} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limitNum, offset]
    )
    const total = dataResult.rows.length > 0 ? parseInt(dataResult.rows[0].total) : 0
    const imoveis = dataResult.rows.map(row => {
      const { total: _total, ...rest } = row
      return parseImovel(rest)
    })
    return { imoveis, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
  } catch {
    return { imoveis: [], total: 0, page: 1, limit: 9, pages: 0 }
  }
}

export async function fetchSiteConfig(key) {
  try {
    const result = await getDb().query('SELECT value FROM site_config WHERE key = $1', [key])
    return result.rows[0]?.value ?? null
  } catch {
    return null
  }
}

export async function fetchDistinctBairros() {
  try {
    const result = await getDb().query(
      `SELECT DISTINCT bairro FROM imoveis WHERE ativo = true AND bairro IS NOT NULL AND bairro != '' ORDER BY bairro`
    )
    return result.rows.map(r => r.bairro)
  } catch {
    return []
  }
}

export async function fetchAllPropertySlugs() {
  try {
    const result = await getDb().query(
      `SELECT id, titulo, updated_at FROM imoveis WHERE ativo = true ORDER BY created_at DESC LIMIT 1000`
    )
    return result.rows
  } catch {
    return []
  }
}
