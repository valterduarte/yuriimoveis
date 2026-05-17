import { FilterChip, FilterChipList } from '../FilterChip'
import { BEDROOM_FILTERS, getAllPriceRanges } from '../../data/priceRanges'
import { AMENITY_FILTERS } from '../../data/amenityFilters'
import type { AcaoSlug } from '../../lib/navigation'
import type { PropertyCategory, TransactionType } from '../../types'

interface AmplieChancesProps {
  acao: AcaoSlug
  cidade: string
  categoria: PropertyCategory
  tipo: TransactionType
}

export default function AmplieChances({ acao, cidade, categoria, tipo }: AmplieChancesProps) {
  const basePath = `/${acao}/${cidade}/${categoria}/filtro`
  const priceRanges = getAllPriceRanges(tipo)

  return (
    <section className="mt-14">
      <h2 className="text-base font-bold text-dark mb-6 uppercase tracking-wide">
        Amplie as chances de encontrar o lar ideal
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">Por quartos</h3>
          <FilterChipList>
            {BEDROOM_FILTERS.map(bf => (
              <FilterChip key={bf.slug} href={`${basePath}/${bf.slug}`}>
                {bf.shortLabel || bf.label}
              </FilterChip>
            ))}
          </FilterChipList>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">Por preço</h3>
          <FilterChipList>
            {priceRanges.map(pr => (
              <FilterChip key={pr.slug} href={`${basePath}/${pr.slug}`}>
                {pr.shortLabel || pr.label}
              </FilterChip>
            ))}
          </FilterChipList>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">Por característica</h3>
          <FilterChipList>
            {AMENITY_FILTERS.map(af => (
              <FilterChip key={af.slug} href={`${basePath}/${af.slug}`}>
                {af.shortLabel || af.label}
              </FilterChip>
            ))}
          </FilterChipList>
        </div>
      </div>
    </section>
  )
}
