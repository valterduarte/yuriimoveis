import { unstable_cache } from 'next/cache'
import { slugify } from '../utils/imovelUtils'
import { getDb } from './db'
import { logDbError } from './logger'
import { CACHE_TAG_IMOVEIS, STATIC_DATA_REVALIDATE_SECONDS } from './cacheTags'
import { parseImovel } from './properties'
import type { Imovel, ImovelRow, PropertyStatus } from '../types'

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

export interface EmpreendimentoSummary {
  slug: string
  nome: string
  endereco: string
  bairro: string
  cidade: string
  totalUnidades: number
  precoMin: number
  precoMax: number
  areaMin: number
  areaMax: number
  heroImage: string | null
  imovelIds: number[]
  status: PropertyStatus
}

export const EMPREENDIMENTO_RESERVED_SLUGS = new Set(['em-construcao', 'pronto-para-morar', 'na-planta'])

export interface EmpreendimentoStatusFilter {
  slug: string
  status: PropertyStatus | null
  label: string
  href: string
}

export const EMPREENDIMENTO_STATUS_FILTERS: EmpreendimentoStatusFilter[] = [
  { slug: '',                  status: null,          label: 'Todos',             href: '/empreendimentos' },
  { slug: 'em-construcao',     status: 'construcao',  label: 'Em Construção',     href: '/empreendimentos/em-construcao' },
  { slug: 'pronto-para-morar', status: 'pronto',      label: 'Pronto para Morar', href: '/empreendimentos/pronto-para-morar' },
]

export interface EmpreendimentoDetail extends EmpreendimentoSummary {
  imoveis: Imovel[]
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

interface GroupRow {
  endereco: string
  bairro: string
  cidade: string
  titulos: string[]
  ids: number[]
  preco_min: string | number
  preco_max: string | number
  area_min: string | number
  area_max: string | number
  first_imagens: string | null
  statuses: PropertyStatus[]
}

const STATUS_PRIORITY: PropertyStatus[] = ['planta', 'construcao', 'pronto']

function resolveEmpreendimentoStatus(statuses: PropertyStatus[]): PropertyStatus {
  const counts = new Map<PropertyStatus, number>()
  for (const s of statuses) counts.set(s, (counts.get(s) ?? 0) + 1)
  let best: PropertyStatus = statuses[0] ?? 'pronto'
  let bestCount = counts.get(best) ?? 0
  for (const [status, count] of counts) {
    if (count > bestCount || (count === bestCount && STATUS_PRIORITY.indexOf(status) < STATUS_PRIORITY.indexOf(best))) {
      best = status
      bestCount = count
    }
  }
  return best
}

const listEmpreendimentosCached = unstable_cache(
  async (): Promise<EmpreendimentoSummary[]> => {
    const result = await getDb().query(`
      SELECT
        endereco,
        bairro,
        cidade,
        array_agg(titulo ORDER BY area ASC, id ASC) AS titulos,
        array_agg(id ORDER BY area ASC, id ASC) AS ids,
        array_agg(status ORDER BY area ASC, id ASC) AS statuses,
        MIN(preco) AS preco_min,
        MAX(preco) AS preco_max,
        MIN(area)  AS area_min,
        MAX(area)  AS area_max,
        (array_agg(imagens ORDER BY area ASC, id ASC))[1] AS first_imagens
      FROM imoveis
      WHERE ativo = true
        AND endereco IS NOT NULL AND endereco != ''
        AND bairro IS NOT NULL AND bairro != ''
        AND cidade IS NOT NULL AND cidade != ''
      GROUP BY endereco, bairro, cidade
      HAVING COUNT(*) >= 2
    `)

    const empreendimentos: EmpreendimentoSummary[] = []
    const seenSlugs = new Set<string>()

    for (const row of result.rows as GroupRow[]) {
      let nome: string | null = null
      for (const titulo of row.titulos) {
        nome = extractEmpreendimentoFromTitulo(titulo)
        if (nome) break
      }
      if (!nome) continue

      const slug = slugify(nome)
      if (seenSlugs.has(slug)) continue
      seenSlugs.add(slug)

      let heroImage: string | null = null
      if (row.first_imagens) {
        try {
          const imgs = JSON.parse(row.first_imagens) as string[]
          heroImage = imgs[0] ?? null
        } catch { /* ignore parse errors */ }
      }

      empreendimentos.push({
        slug,
        nome,
        endereco: row.endereco,
        bairro: row.bairro,
        cidade: row.cidade,
        totalUnidades: row.ids.length,
        precoMin: Number(row.preco_min),
        precoMax: Number(row.preco_max),
        areaMin: Number(row.area_min),
        areaMax: Number(row.area_max),
        heroImage,
        imovelIds: row.ids,
        status: resolveEmpreendimentoStatus(row.statuses ?? []),
      })
    }

    return empreendimentos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  },
  ['listEmpreendimentos'],
  { tags: [CACHE_TAG_IMOVEIS], revalidate: STATIC_DATA_REVALIDATE_SECONDS },
)

export async function listEmpreendimentos(): Promise<EmpreendimentoSummary[]> {
  try {
    return await listEmpreendimentosCached()
  } catch (err) {
    logDbError('listEmpreendimentos', err)
    return []
  }
}

export async function fetchEmpreendimentoBySlug(slug: string): Promise<EmpreendimentoDetail | null> {
  const all = await listEmpreendimentos()
  const summary = all.find(e => e.slug === slug)
  if (!summary) return null

  try {
    const result = await getDb().query(
      `SELECT * FROM imoveis WHERE id = ANY($1::int[]) AND ativo = true ORDER BY area ASC, id ASC`,
      [summary.imovelIds],
    )
    const imoveis = result.rows.map((r: ImovelRow) => parseImovel(r))
    return { ...summary, imoveis }
  } catch (err) {
    logDbError('fetchEmpreendimentoBySlug', err)
    return null
  }
}
