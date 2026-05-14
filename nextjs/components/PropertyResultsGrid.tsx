import PropertyCard from './PropertyCard'
import type { Imovel } from '../types'

export default function PropertyResultsGrid({ imoveis }: { imoveis: Imovel[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {imoveis.map(property => (
        <PropertyCard key={property.id} imovel={property} />
      ))}
    </div>
  )
}
