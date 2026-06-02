import { formatPrice } from './formatters'

/** Highest unit price (R$) still within the Minha Casa Minha Vida cap. */
const MCMV_PRICE_CAP = 600_000

/** Minimum sample needed before we quote concentrations / ranges. */
const MIN_SAMPLE = 3

export interface ListingFacts {
  preco: number
  area: number
  bairro: string
}

export interface ListingInsight {
  /** Ready-to-render factual paragraph built from the real inventory. */
  paragraph: string
  priceFrom: number
  priceTo: number
  areaFrom: number
  areaTo: number
  /** Up to three neighbourhoods where the matched units concentrate. */
  topBairros: string[]
  /** How many matched units fall within the MCMV price cap. */
  mcmvCount: number
}

function topByFrequency(values: string[], limit: number): string[] {
  const counts = new Map<string, number>()
  for (const v of values) {
    const k = v.trim()
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name)
}

function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`
}

function formatArea(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(0)} m²`
}

/**
 * Turns the matched inventory into a unique, factual paragraph for a listing or
 * filter page — real price range, area range, neighbourhood concentration and
 * MCMV eligibility. Returns null when the sample is too small to say anything
 * meaningful (the caller keeps its generic copy in that case).
 *
 * `subject` is the noun phrase the sentence is built around, e.g.
 * "apartamentos de 2 quartos" or "apartamentos com preço até R$ 300 mil".
 * `total` is the real result count (may exceed the sample); when the sample does
 * not cover every result the price is framed as "a partir de" to stay accurate.
 */
export function buildListingInsight(
  imoveis: ListingFacts[],
  opts: { cidadeName: string; total: number; subject: string },
): ListingInsight | null {
  const sample = imoveis.filter(i => i.preco > 0)
  if (sample.length < MIN_SAMPLE) return null

  const prices = sample.map(i => i.preco).sort((a, b) => a - b)
  const areas = sample.map(i => i.area).filter(a => a > 0).sort((a, b) => a - b)
  const priceFrom = prices[0]
  const priceTo = prices[prices.length - 1]
  const areaFrom = areas[0] ?? 0
  const areaTo = areas[areas.length - 1] ?? 0
  const topBairros = topByFrequency(sample.map(i => i.bairro), 3)
  const mcmvCount = sample.filter(i => i.preco <= MCMV_PRICE_CAP).length

  const { cidadeName, total, subject } = opts
  const sampleCoversAll = sample.length >= total

  const priceClause = sampleCoversAll && priceFrom !== priceTo
    ? `com valores de ${formatPrice(priceFrom, 'venda')} a ${formatPrice(priceTo, 'venda')}`
    : `a partir de ${formatPrice(priceFrom, 'venda')}`

  const areaClause = areaFrom > 0
    ? (areaFrom !== areaTo
        ? ` e metragens de ${formatArea(areaFrom)} a ${formatArea(areaTo)}`
        : ` e ${formatArea(areaFrom)}`)
    : ''

  const sentences: string[] = []
  sentences.push(
    `Há ${total} ${subject} à venda em ${cidadeName}, ${priceClause}${areaClause}.`,
  )

  if (topBairros.length > 0) {
    const verb = topBairros.length === 1 ? 'se concentram no bairro' : 'se concentram em bairros como'
    sentences.push(`As opções ${verb} ${joinPt(topBairros)}.`)
  }

  if (mcmvCount > 0) {
    const unidade = mcmvCount === 1 ? 'unidade' : 'unidades'
    sentences.push(
      `${mcmvCount} ${unidade} a partir de ${formatPrice(priceFrom, 'venda')} ${mcmvCount === 1 ? 'pode' : 'podem'} se enquadrar no Minha Casa Minha Vida, conforme a renda familiar — vale simular o financiamento.`,
    )
  }

  return {
    paragraph: sentences.join(' '),
    priceFrom,
    priceTo,
    areaFrom,
    areaTo,
    topBairros,
    mcmvCount,
  }
}
