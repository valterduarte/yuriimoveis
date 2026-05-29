import { BAIRROS, getBairroBySlug } from '../data/bairros'
import { getCategoriaBySlug } from '../data/categorias'
import { slugify } from '../utils/imovelUtils'
import { SEO_MIN_PROPERTIES_FOR_INDEXING } from './constants'
import type { BairroData, TransactionType } from '../types'

export type AcaoSlug = 'comprar' | 'alugar'

const VALID_ACOES: AcaoSlug[] = ['comprar', 'alugar']

const ACAO_TO_TIPO: Record<AcaoSlug, TransactionType> = {
  comprar: 'venda',
  alugar:  'aluguel',
}

const TIPO_TO_ACAO: Record<TransactionType, AcaoSlug> = {
  venda:   'comprar',
  aluguel: 'alugar',
}

const CIDADES_SUPORTADAS = new Map<string, string>([
  ['osasco', 'Osasco'],
  ['barueri', 'Barueri'],
  ['carapicuiba', 'Carapicuíba'],
])

export function inferCidadeFromBairro(bairro: BairroData): string {
  return bairro.cidade
}

export function acaoToTipo(acao: AcaoSlug): TransactionType {
  return ACAO_TO_TIPO[acao]
}

export function tipoToAcao(tipo: TransactionType): AcaoSlug {
  return TIPO_TO_ACAO[tipo]
}

export function isValidAcao(acao: string): acao is AcaoSlug {
  return VALID_ACOES.includes(acao as AcaoSlug)
}

export function cidadeSlugToName(slug: string): string | undefined {
  return CIDADES_SUPORTADAS.get(slug)
}

export function cidadeNameToSlug(name: string): string {
  return slugify(name)
}

export function getAllCidadeSlugs(): string[] {
  return Array.from(CIDADES_SUPORTADAS.keys())
}

export function bairroSlugToDbName(slug: string): string | undefined {
  const bairro = getBairroBySlug(slug)
  return bairro?.dbMatch || bairro?.nome
}

export function bairroDbNameToSlug(dbName: string): string {
  const raw = slugify(dbName)
  const configured = Object.values(BAIRROS).find(b => b.dbMatch === dbName || b.nome === dbName)
  return configured?.slug || raw
}

export function hasRichBairroContent(bairroSlug: string): boolean {
  return !!getBairroBySlug(bairroSlug)
}

/**
 * Single source of truth for whether a hierarchical category+bairro leaf page
 * should be indexed. Shared by the sitemap and the page's robots meta so the
 * sitemap never advertises a noindexed URL. A leaf qualifies when it has enough
 * listings on its own, or has at least one listing in a bairro that ships rich
 * editorial content.
 */
export function isHierarchicalLeafIndexable(count: number, bairroSlug: string): boolean {
  return count >= SEO_MIN_PROPERTIES_FOR_INDEXING || (count >= 1 && hasRichBairroContent(bairroSlug))
}

export function buildHierarchicalUrl(params: {
  acao: AcaoSlug
  cidade: string
  categoria?: string
  bairro?: string
}): string {
  const parts = [params.acao, params.cidade]
  if (params.categoria) parts.push(params.categoria)
  if (params.bairro) parts.push(params.bairro)
  return `/${parts.join('/')}`
}

export const ACAO_LABELS: Record<AcaoSlug, { preposicao: string; verbo: string }> = {
  comprar: { preposicao: 'à Venda', verbo: 'Comprar' },
  alugar:  { preposicao: 'para Alugar', verbo: 'Alugar' },
}

export { getCategoriaBySlug }
