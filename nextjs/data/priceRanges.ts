export interface PriceRange {
  slug: string
  label: string
  shortLabel: string
  min?: number
  max?: number
}

export const PRICE_RANGES_VENDA: PriceRange[] = [
  { slug: 'ate-200-mil',       label: 'até R$ 200 mil',             shortLabel: 'até R$ 200k',    max: 200_000 },
  { slug: 'ate-300-mil',       label: 'até R$ 300 mil',             shortLabel: 'até R$ 300k',    max: 300_000 },
  { slug: 'ate-500-mil',       label: 'até R$ 500 mil',             shortLabel: 'até R$ 500k',    max: 500_000 },
  { slug: '300-a-500-mil',     label: 'de R$ 300 mil a R$ 500 mil', shortLabel: 'R$ 300k–500k',   min: 300_000, max: 500_000 },
  { slug: '500-mil-a-1-milhao',label: 'de R$ 500 mil a R$ 1 milhão',shortLabel: 'R$ 500k–1M',     min: 500_000, max: 1_000_000 },
  { slug: 'acima-de-1-milhao', label: 'acima de R$ 1 milhão',       shortLabel: 'acima de R$ 1M',  min: 1_000_000 },
]

export const PRICE_RANGES_ALUGUEL: PriceRange[] = [
  { slug: 'ate-1500',          label: 'até R$ 1.500',               shortLabel: 'até R$ 1.500',   max: 1_500 },
  { slug: 'ate-2500',          label: 'até R$ 2.500',               shortLabel: 'até R$ 2.500',   max: 2_500 },
  { slug: '1500-a-3000',       label: 'de R$ 1.500 a R$ 3.000',    shortLabel: 'R$ 1.500–3.000', min: 1_500, max: 3_000 },
  { slug: '2000-a-4000',       label: 'de R$ 2.000 a R$ 4.000',    shortLabel: 'R$ 2.000–4.000', min: 2_000, max: 4_000 },
  { slug: 'acima-de-4000',     label: 'acima de R$ 4.000',          shortLabel: 'acima de R$ 4k',  min: 4_000 },
]

export function getPriceRangeBySlug(slug: string, tipo: 'venda' | 'aluguel'): PriceRange | undefined {
  const ranges = tipo === 'venda' ? PRICE_RANGES_VENDA : PRICE_RANGES_ALUGUEL
  return ranges.find(r => r.slug === slug)
}

export function getAllPriceRanges(tipo: 'venda' | 'aluguel'): PriceRange[] {
  return tipo === 'venda' ? PRICE_RANGES_VENDA : PRICE_RANGES_ALUGUEL
}

export interface BedroomFilter {
  slug: string
  label: string
  shortLabel: string
  value: number | '4+'
}

export const BEDROOM_FILTERS: BedroomFilter[] = [
  { slug: '1-quarto',   label: '1 quarto',       shortLabel: '1 quarto',  value: 1 },
  { slug: '2-quartos',  label: '2 quartos',       shortLabel: '2 quartos', value: 2 },
  { slug: '3-quartos',  label: '3 quartos',       shortLabel: '3 quartos', value: 3 },
  { slug: '4-quartos',  label: '4+ quartos',      shortLabel: '4+ quartos',value: '4+' },
]

export function getBedroomFilterBySlug(slug: string): BedroomFilter | undefined {
  return BEDROOM_FILTERS.find(b => b.slug === slug)
}
