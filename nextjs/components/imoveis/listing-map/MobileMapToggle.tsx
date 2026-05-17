'use client'

import { FiMap, FiList, FiX } from 'react-icons/fi'
import { useListingMapStore } from './ListingMapStoreProvider'

interface MobileMapToggleProps {
  count: number
  children: React.ReactNode
}

export default function MobileMapToggle({ count, children }: MobileMapToggleProps) {
  const open = useListingMapStore((s) => s.mobileMapOpen)
  const toggle = useListingMapStore((s) => s.toggleMobileMap)

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={toggle}
          className="md:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-primary text-white rounded-full shadow-lg px-4 py-3 text-sm font-bold"
          aria-label={`Ver ${count} imóveis no mapa`}
        >
          <FiMap size={18} />
          Mapa ({count})
        </button>
      )}

      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <button
            type="button"
            onClick={toggle}
            className="absolute top-4 right-4 z-10 bg-white rounded-full shadow-lg p-2"
            aria-label="Fechar mapa"
          >
            <FiX size={20} className="text-dark" />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-primary text-white rounded-full shadow-lg px-4 py-3 text-sm font-bold"
          >
            <FiList size={18} />
            Lista
          </button>
          <div className="w-full h-full">{children}</div>
        </div>
      )}
    </>
  )
}
