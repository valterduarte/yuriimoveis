import { BEDROOM_FILTERS, getAllPriceRanges } from '../data/priceRanges'
import { AMENITY_FILTERS, imovelMatchesAmenity } from '../data/amenityFilters'
import type { PriceBedroomMatrixRow } from './navigationMatrix'

/**
 * Yields every filter slug (bedroom, price range, amenity) that a single
 * matrix row satisfies — the union used by all three filter pages to drive
 * generateStaticParams. Replaces three near-identical triple-loops.
 */
export function* expandFilterSlugsForRow(
  row: PriceBedroomMatrixRow,
): Generator<string> {
  for (const bf of BEDROOM_FILTERS) {
    const minBedrooms = bf.value === '4+' ? 4 : bf.value
    if (row.quartos >= minBedrooms) yield bf.slug
  }

  for (const range of getAllPriceRanges(row.tipo as 'venda' | 'aluguel')) {
    const inRange =
      (!range.min || row.preco >= range.min) &&
      (!range.max || row.preco <= range.max)
    if (inRange) yield range.slug
  }

  for (const amenity of AMENITY_FILTERS) {
    if (imovelMatchesAmenity(row.diferenciais, amenity)) yield amenity.slug
  }
}
