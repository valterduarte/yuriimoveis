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

export async function fetchAllPropertySlugs() {
  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE ativo = true ORDER BY created_at DESC LIMIT 1000`
    )
    return result.rows.map(parseImovel)
  } catch {
    return []
  }
}
