import {
  getBedroomFilterBySlug,
  getPriceRangeBySlug,
  type BedroomFilter,
  type PriceRange,
} from '../data/priceRanges'
import {
  getAmenityFilterBySlug,
  type AmenityFilter,
} from '../data/amenityFilters'

export type ResolvedFilter =
  | { kind: 'bedroom'; bedroom: BedroomFilter }
  | { kind: 'price';   price:   PriceRange   }
  | { kind: 'amenity'; amenity: AmenityFilter }

/**
 * Resolve a filter slug (price range, bedroom count, or amenity) into a
 * typed discriminated union. Returns null when the slug matches nothing.
 *
 * Price ranges are resolved first because their slugs can overlap with
 * neither bedroom nor amenity slugs in the current data.
 */
export function resolveListingFilter(
  filtro: string,
  tipo: 'venda' | 'aluguel',
): ResolvedFilter | null {
  const price = getPriceRangeBySlug(filtro, tipo)
  if (price) return { kind: 'price', price }

  const bedroom = getBedroomFilterBySlug(filtro)
  if (bedroom) return { kind: 'bedroom', bedroom }

  const amenity = getAmenityFilterBySlug(filtro)
  if (amenity) return { kind: 'amenity', amenity }

  return null
}

export interface FilterFetchOptions {
  precoMin?: string
  precoMax?: string
  quartos?:  string
  amenity?:  string
}

/**
 * Translate a resolved filter into the optional fields expected by
 * fetchProperties(). Pure — does not touch the base filters object.
 */
export function filterToFetchOptions(filter: ResolvedFilter): FilterFetchOptions {
  switch (filter.kind) {
    case 'bedroom': return { quartos: String(filter.bedroom.value) }
    case 'price':   return {
      precoMin: filter.price.min ? String(filter.price.min) : undefined,
      precoMax: filter.price.max ? String(filter.price.max) : undefined,
    }
    case 'amenity': return { amenity: filter.amenity.matchTerms.join('|') }
  }
}

export interface FilterLabel {
  /** Long human label, e.g. "2 quartos" / "até R$ 500 mil" / "Com piscina". */
  label: string
  /** Phrase ready to slot into a sentence, e.g. "com 2 quartos" / "com preço até..." / "com piscina". */
  fragment: string
  /** Connector before label in titles ("com " for bedroom, "" for price/amenity). */
  connector: string
}

export function filterLabel(filter: ResolvedFilter): FilterLabel {
  switch (filter.kind) {
    case 'bedroom':
      return { label: filter.bedroom.label, fragment: `com ${filter.bedroom.label}`,  connector: 'com ' }
    case 'price':
      return { label: filter.price.label,   fragment: `com preço ${filter.price.label}`, connector: '' }
    case 'amenity':
      return { label: filter.amenity.label, fragment: filter.amenity.label,            connector: '' }
  }
}
