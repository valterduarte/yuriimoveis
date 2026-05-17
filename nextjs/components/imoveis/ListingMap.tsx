'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { FiMapPin } from 'react-icons/fi'
import { coordsForImovel } from '../../lib/bairroCoords'
import type { MapImovel } from '../../lib/api'
import type { Imovel } from '../../types'

const MapaLeaflet = dynamic(() => import('../mapa/MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
      Carregando mapa…
    </div>
  ),
})

interface ListingMapProps {
  imoveis: Imovel[]
  title: string
}

function toMapImovel(imovel: Imovel): MapImovel {
  return {
    id: imovel.id,
    titulo: imovel.titulo,
    preco: imovel.preco,
    tipo: imovel.tipo,
    categoria: imovel.categoria,
    quartos: imovel.quartos,
    area: imovel.area,
    bairro: imovel.bairro,
    cidade: imovel.cidade,
    imagem: imovel.imagens?.[0] ?? '',
    updated_at: imovel.updated_at,
  }
}

export default function ListingMap({ imoveis, title }: ListingMapProps) {
  const markers = useMemo(
    () =>
      imoveis
        .map(imovel => {
          const coords = coordsForImovel(imovel.id, imovel.bairro, imovel.cidade)
          return coords ? { imovel: toMapImovel(imovel), coords } : null
        })
        .filter((m): m is NonNullable<typeof m> => m !== null),
    [imoveis],
  )

  if (markers.length === 0) return null

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4 mb-4">
        <h2 className="text-base font-bold text-dark uppercase tracking-wide">{title}</h2>
        <p className="text-xs text-gray-500 flex items-center gap-1.5 whitespace-nowrap">
          <FiMapPin size={12} className="text-primary" />
          {markers.length} {markers.length === 1 ? 'imóvel' : 'imóveis'} no mapa
        </p>
      </div>

      <div className="border border-gray-200 bg-white" style={{ height: '480px' }}>
        <MapaLeaflet markers={markers} />
      </div>

      <p className="text-[11px] text-gray-500 mt-2">
        Posições aproximadas por bairro para preservar a privacidade. Clique em um pin para ver detalhes do imóvel.
      </p>
    </section>
  )
}
