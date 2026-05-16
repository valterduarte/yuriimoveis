import PropertyCard from './PropertyCard'
import type { Imovel } from '../types'

const EAGER_LOAD_COUNT = 2

export default function PropertyResultsGrid({ imoveis }: { imoveis: Imovel[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {imoveis.map((property, i) => (
        <PropertyCard key={property.id} imovel={property} priority={i < EAGER_LOAD_COUNT} />
      ))}
    </div>
  )
}
