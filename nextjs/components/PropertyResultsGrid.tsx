import { LISTING_INITIAL_VISIBLE } from '../lib/constants'
import PropertyCard from './PropertyCard'
import LazyPropertyGrid from './LazyPropertyGrid'
import type { Imovel } from '../types'

export default function PropertyResultsGrid({ imoveis }: { imoveis: Imovel[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {imoveis.slice(0, LISTING_INITIAL_VISIBLE).map(property => (
        <PropertyCard key={property.id} imovel={property} />
      ))}
      <LazyPropertyGrid items={imoveis.slice(LISTING_INITIAL_VISIBLE)} />
    </div>
  )
}
