'use client'

import HoverSyncCard from './HoverSyncCard'
import ListingMapPanel from './ListingMapPanel'
import {
  ListingMapStoreProvider,
  useListingMapStore,
} from './ListingMapStoreProvider'
import MobileMapToggle from './MobileMapToggle'
import type { Imovel } from '../../../types'

interface ListingMapShellProps {
  imoveis: Imovel[]
}

const EAGER_LOAD_COUNT = 2

function FilteredList({ imoveis }: { imoveis: Imovel[] }) {
  const filteredIds = useListingMapStore((s) => s.filteredIds)
  const setFilteredIds = useListingMapStore((s) => s.setFilteredIds)
  const visible = filteredIds
    ? imoveis.filter((i) => filteredIds.has(i.id))
    : imoveis

  return (
    <>
      {filteredIds && (
        <div className="mb-4 flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-2 text-sm">
          <span>Filtrado pela área do mapa: {visible.length} imóveis</span>
          <button
            type="button"
            onClick={() => setFilteredIds(null)}
            className="text-primary font-semibold hover:underline"
          >
            Limpar filtro
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visible.map((imovel, i) => (
          <HoverSyncCard
            key={imovel.id}
            imovel={imovel}
            priority={i < EAGER_LOAD_COUNT}
          />
        ))}
      </div>
    </>
  )
}

export default function ListingMapShell({ imoveis }: ListingMapShellProps) {
  return (
    <ListingMapStoreProvider>
      <section className="md:relative md:grid md:grid-cols-[60%_40%] md:gap-6 md:h-[calc(100vh-4rem)] md:overflow-hidden">
        <div className="md:min-h-0 md:h-full md:overflow-y-auto md:pr-2">
          <FilteredList imoveis={imoveis} />
        </div>
        <div className="hidden md:block md:h-full">
          <ListingMapPanel imoveis={imoveis} />
        </div>
      </section>
      <MobileMapToggle count={imoveis.length}>
        <ListingMapPanel imoveis={imoveis} />
      </MobileMapToggle>
    </ListingMapStoreProvider>
  )
}
