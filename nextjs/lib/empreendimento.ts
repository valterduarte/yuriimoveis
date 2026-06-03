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

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/**
 * SERP title for a development page. Buyers searching a building by name almost
 * always append the city ("ocean park osasco"), so the city belongs in the
 * title for exact-match relevance and click-through — front-loaded before the
 * price. The city is skipped when the name already carries it (e.g. "Terra Alta
 * Barueri") to avoid reading "… Barueri em Barueri —".
 *
 * `priceFrom` is the already-formatted lowest price (e.g. "R$ 250.000"), kept as
 * a parameter so this stays a pure, dependency-free function.
 */
export function buildEmpreendimentoTitle(nome: string, cidade: string, priceFrom: string): string {
  const nomeComCidade = normalizeForMatch(nome).includes(normalizeForMatch(cidade))
    ? nome
    : `${nome} em ${cidade}`
  return `${nomeComCidade} — Apartamentos a partir de ${priceFrom}`
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

export type EmpreendimentoSourceRow = Pick<
  ImovelRow,
  'id' | 'titulo' | 'endereco' | 'bairro' | 'cidade' | 'preco' | 'area' | 'status' | 'imagens' | 'empreendimento'
>

interface EmpreendimentoGroup {
  nome: string
  /** True once the display name came from the explicit field (beats parsed titles). */
  nomeIsExplicit: boolean
  endereco: string
  bairro: string
  cidade: string
  ids: number[]
  statuses: PropertyStatus[]
  precos: number[]
  areas: number[]
  firstImagens: string | null
}

function parseHeroImage(imagensJson: string | null): string | null {
  if (!imagensJson) return null
  try {
    const imgs = JSON.parse(imagensJson) as string[]
    return imgs[0] ?? null
  } catch {
    return null
  }
}

export function buildEmpreendimentosFromRows(rows: EmpreendimentoSourceRow[]): EmpreendimentoSummary[] {
  const sorted = [...rows].sort((a, b) => {
    const areaDiff = Number(a.area) - Number(b.area)
    return areaDiff !== 0 ? areaDiff : a.id - b.id
  })

  const groups = new Map<string, EmpreendimentoGroup>()

  for (const row of sorted) {
    // The explicit field set in the admin form is authoritative; the title
    // parser is only a fallback for units that predate it. This frees the
    // listing title from having to match an exact pattern.
    const explicit = (row.empreendimento ?? '').trim()
    const nome = explicit || extractEmpreendimentoFromTitulo(row.titulo)
    if (!nome) continue

    // Key by the normalized name alone — the building identity. Dropping
    // endereço (a typo used to split a building) and not requiring bairro/cidade
    // means a unit groups even when those fields were left blank; the location
    // is then filled from whichever sibling unit does have it.
    const key = normalizeForMatch(nome)
    const existing = groups.get(key)

    if (existing) {
      existing.ids.push(row.id)
      existing.statuses.push(row.status)
      existing.precos.push(Number(row.preco))
      existing.areas.push(Number(row.area))
      // An explicit name wins over a parsed one for display consistency.
      if (explicit && !existing.nomeIsExplicit) {
        existing.nome = explicit
        existing.nomeIsExplicit = true
      }
      // Fill missing location from the first sibling that carries it.
      if (!existing.bairro && row.bairro) existing.bairro = row.bairro
      if (!existing.cidade && row.cidade) existing.cidade = row.cidade
      if (!existing.endereco && row.endereco) existing.endereco = row.endereco
    } else {
      groups.set(key, {
        nome,
        nomeIsExplicit: !!explicit,
        endereco: row.endereco ?? '',
        bairro: row.bairro ?? '',
        cidade: row.cidade ?? '',
        ids: [row.id],
        statuses: [row.status],
        precos: [Number(row.preco)],
        areas: [Number(row.area)],
        firstImagens: row.imagens ?? null,
      })
    }
  }

  const empreendimentos: EmpreendimentoSummary[] = []
  const seenSlugs = new Set<string>()

  for (const group of groups.values()) {
    const slug = slugify(group.nome)
    if (seenSlugs.has(slug)) continue
    seenSlugs.add(slug)

    empreendimentos.push({
      slug,
      nome: group.nome,
      endereco: group.endereco,
      bairro: group.bairro,
      cidade: group.cidade,
      totalUnidades: group.ids.length,
      precoMin: Math.min(...group.precos),
      precoMax: Math.max(...group.precos),
      areaMin: Math.min(...group.areas),
      areaMax: Math.max(...group.areas),
      heroImage: parseHeroImage(group.firstImagens),
      imovelIds: group.ids,
      status: resolveEmpreendimentoStatus(group.statuses),
    })
  }

  return empreendimentos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

const listEmpreendimentosCached = unstable_cache(
  async (): Promise<EmpreendimentoSummary[]> => {
    const result = await getDb().query(`
      SELECT id, titulo, endereco, bairro, cidade, preco, area, status, imagens, empreendimento
      FROM imoveis
      WHERE ativo = true
    `)
    return buildEmpreendimentosFromRows(result.rows as EmpreendimentoSourceRow[])
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
