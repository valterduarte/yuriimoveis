import { unstable_cache } from 'next/cache'
import { getDb } from './db'
import { logDbError } from './logger'
import { CACHE_TAG_IMOVEIS, STATIC_DATA_REVALIDATE_SECONDS } from './cacheTags'

const TITLE_SEPARATOR = /^(.+?)(?:\s+[—|-]\s+|:\s+)/
const GENERIC_PREFIX_WORDS = new Set([
  'apartamento', 'apartamentos',
  'casa', 'casas',
  'terreno', 'terrenos',
  'chacara', 'chácara', 'chácaras',
  'chale', 'chalé',
  'imovel', 'imóvel', 'imoveis', 'imóveis',
  'comercial', 'sala',
  'lancamento', 'lançamento',
  'venda', 'aluguel',
])

export function extractEmpreendimentoFromTitulo(titulo: string): string | null {
  const match = titulo.match(TITLE_SEPARATOR)
  if (!match) return null

  const candidate = match[1].trim()
  if (candidate.length < 4 || candidate.length > 80) return null

  const firstWordNormalized = candidate
    .split(/\s+/)[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

  if (GENERIC_PREFIX_WORDS.has(firstWordNormalized)) return null

  return candidate
}

export interface Empreendimento {
  nome: string
  totalUnidades: number
}

const fetchSiblingTitlesCached = unstable_cache(
  async (endereco: string, bairro: string, cidade: string, excludeId: number): Promise<string[]> => {
    if (!endereco) return []
    const result = await getDb().query(
      `SELECT titulo FROM imoveis
       WHERE ativo = true
         AND id != $1
         AND endereco = $2
         AND bairro = $3
         AND cidade = $4
       ORDER BY id ASC
       LIMIT 20`,
      [excludeId, endereco, bairro, cidade],
    )
    return result.rows.map((r: { titulo: string }) => r.titulo)
  },
  ['fetchSiblingTitles'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: STATIC_DATA_REVALIDATE_SECONDS },
)

export async function detectEmpreendimento(imovel: {
  id: number
  titulo: string
  endereco: string
  bairro: string
  cidade: string
}): Promise<Empreendimento | null> {
  let nome = extractEmpreendimentoFromTitulo(imovel.titulo)
  let siblingTitles: string[] = []

  try {
    siblingTitles = await fetchSiblingTitlesCached(imovel.endereco, imovel.bairro, imovel.cidade, imovel.id)
  } catch (err) {
    logDbError('detectEmpreendimento', err)
    return nome ? { nome, totalUnidades: 1 } : null
  }

  if (!nome) {
    for (const siblingTitulo of siblingTitles) {
      nome = extractEmpreendimentoFromTitulo(siblingTitulo)
      if (nome) break
    }
  }

  if (!nome) return null

  return { nome, totalUnidades: siblingTitles.length + 1 }
}
