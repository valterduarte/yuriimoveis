'use client'

import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { formatPriceShort } from '../../../lib/formatters'
import { useListingMapStore } from './ListingMapStoreProvider'
import type { LatLng } from '../../../lib/bairroCoords'
import type { MapImovel } from '../../../lib/api'

interface PriceMarkerProps {
  imovel: MapImovel
  coords: LatLng
  onClick: () => void
}

export default function PriceMarker({ imovel, coords, onClick }: PriceMarkerProps) {
  const active = useListingMapStore((s) => s.activeImovelId === imovel.id)
  const setActive = useListingMapStore((s) => s.setActive)
  const isVenda = imovel.tipo === 'venda'

  const base = 'inline-flex items-center px-2 py-1 text-xs font-bold rounded-md shadow-md border-l-4 transition-transform whitespace-nowrap cursor-pointer'
  const styled = active
    ? isVenda
      ? 'bg-primary text-white border-primary scale-110'
      : 'bg-emerald-500 text-white border-emerald-500 scale-110'
    : isVenda
      ? 'bg-white text-primary border-primary'
      : 'bg-white text-emerald-600 border-emerald-500'

  return (
    <AdvancedMarker position={coords} onClick={onClick} zIndex={active ? 1000 : 1}>
      <div
        className={`${base} ${styled}`}
        onMouseEnter={() => setActive(imovel.id)}
        onMouseLeave={() => setActive(null)}
      >
        {formatPriceShort(imovel.preco, imovel.tipo)}
      </div>
    </AdvancedMarker>
  )
}
