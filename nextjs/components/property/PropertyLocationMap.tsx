'use client'

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { FiMapPin } from 'react-icons/fi'
import type { LatLng } from '../../lib/bairroCoords'

interface PropertyLocationMapProps {
  coords: LatLng
  bairro: string
  cidade: string
  tipo: 'venda' | 'aluguel'
  preco: number
}

const MAP_ZOOM = 15

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

export default function PropertyLocationMap({
  coords,
  bairro,
  cidade,
  tipo,
  preco,
}: PropertyLocationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set; property location map will not render.',
      )
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        <FiMapPin size={16} className="mr-2" />
        Mapa indisponível
      </div>
    )
  }

  const isVenda = tipo === 'venda'
  const markerClass = isVenda
    ? 'bg-primary text-white border-primary'
    : 'bg-emerald-500 text-white border-emerald-500'

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId="property-detail-map"
        defaultCenter={coords}
        defaultZoom={MAP_ZOOM}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker
          position={coords}
          title={`${bairro}, ${cidade}`}
        >
          <div
            className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-md shadow-md border-l-4 whitespace-nowrap ${markerClass}`}
          >
            {formatPriceShort(preco, tipo)}
          </div>
        </AdvancedMarker>
      </Map>
    </APIProvider>
  )
}
