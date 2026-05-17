'use client'

import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { useListingMapStore } from './ListingMapStoreProvider'
import type { LatLng } from '../../../lib/bairroCoords'
import type { MapImovel } from '../../../lib/api'

interface PriceMarkerProps {
  imovel: MapImovel
  coords: LatLng
  onClick: () => void
}

function formatPriceShort(preco: number, tipo: 'venda' | 'aluguel'): string {
  if (tipo === 'aluguel') {
    const value = preco.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
    return `R$ ${value}/mês`
  }
  if (preco >= 1_000_000) {
    const v = (preco / 1_000_000).toFixed(1).replace('.', ',').replace(/,0$/, '')
    return `R$ ${v}M`
  }
  if (preco >= 1_000) {
    return `R$ ${Math.round(preco / 1_000)}K`
  }
  return `R$ ${preco}`
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
