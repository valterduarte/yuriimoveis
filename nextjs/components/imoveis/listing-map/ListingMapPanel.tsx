'use client'

import { useEffect, useMemo, useState } from 'react'
import { APIProvider, Map, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import {
  coordsForImovelJittered,
  DEFAULT_MAP_CENTER,
  type LatLng,
} from '../../../lib/bairroCoords'
import PriceMarker from './PriceMarker'
import PropertyInfoCard from './PropertyInfoCard'
import SearchInAreaButton from './SearchInAreaButton'
import { useListingMapStore } from './ListingMapStoreProvider'
import {
  boundsAreaDelta,
  idsInsideBounds,
  type LatLngBoundsLiteral,
} from './viewportBounds'
import type { MapImovel } from '../../../lib/api'
import type { Imovel } from '../../../types'

interface ListingMapPanelProps {
  imoveis: Imovel[]
}

interface PointEntry {
  imovel: MapImovel
  coords: LatLng
}

function toMapImovel(i: Imovel): MapImovel {
  return {
    id: i.id,
    titulo: i.titulo,
    preco: i.preco,
    tipo: i.tipo,
    categoria: i.categoria,
    quartos: i.quartos,
    area: i.area,
    bairro: i.bairro,
    cidade: i.cidade,
    imagem: i.imagens?.[0] ?? '',
    updated_at: i.updated_at,
  }
}

function BoundsWatcher({
  points,
  originalBounds,
}: {
  points: PointEntry[]
  originalBounds: LatLngBoundsLiteral | null
}) {
  const map = useMap()
  const setFilteredIds = useListingMapStore((s) => s.setFilteredIds)
  const [currentBounds, setCurrentBounds] = useState<LatLngBoundsLiteral | null>(null)

  useEffect(() => {
    if (!map) return
    const listener = map.addListener('idle', () => {
      const b = map.getBounds()
      if (!b) return
      const ne = b.getNorthEast()
      const sw = b.getSouthWest()
      setCurrentBounds({
        north: ne.lat(),
        east: ne.lng(),
        south: sw.lat(),
        west: sw.lng(),
      })
    })
    return () => listener.remove()
  }, [map])

  const show =
    currentBounds &&
    originalBounds &&
    boundsAreaDelta(currentBounds, originalBounds) >= 0.1

  if (!show || !currentBounds) return null
  const ids = idsInsideBounds(
    points.map((p) => ({ id: p.imovel.id, coords: p.coords })),
    currentBounds,
  )

  return (
    <SearchInAreaButton count={ids.size} onClick={() => setFilteredIds(ids)} />
  )
}

export default function ListingMapPanel({ imoveis }: ListingMapPanelProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const filteredIds = useListingMapStore((s) => s.filteredIds)
  const [activeInfoId, setActiveInfoId] = useState<number | null>(null)

  const points = useMemo<PointEntry[]>(
    () =>
      imoveis
        .map((i) => {
          const coords = coordsForImovelJittered(i.id, i.bairro)
          return coords ? { imovel: toMapImovel(i), coords } : null
        })
        .filter((p): p is PointEntry => p !== null),
    [imoveis],
  )

  const visiblePoints = useMemo(
    () => (filteredIds ? points.filter((p) => filteredIds.has(p.imovel.id)) : points),
    [points, filteredIds],
  )

  const initialBounds = useMemo<LatLngBoundsLiteral | null>(() => {
    if (points.length === 0) return null
    let n = -Infinity
    let s = Infinity
    let e = -Infinity
    let w = Infinity
    for (const { coords } of points) {
      if (coords.lat > n) n = coords.lat
      if (coords.lat < s) s = coords.lat
      if (coords.lng > e) e = coords.lng
      if (coords.lng < w) w = coords.lng
    }
    return { north: n, south: s, east: e, west: w }
  }, [points])

  const activeInfoPoint = useMemo(
    () =>
      activeInfoId
        ? points.find((p) => p.imovel.id === activeInfoId) ?? null
        : null,
    [activeInfoId, points],
  )

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set; listing map will not render.',
      )
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Mapa indisponível (configure a chave do Google Maps)
      </div>
    )
  }

  if (points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Nenhum imóvel com localização disponível
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-full">
        <Map
          mapId="listing-map"
          defaultCenter={DEFAULT_MAP_CENTER}
          defaultZoom={13}
          defaultBounds={initialBounds ?? undefined}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          {visiblePoints.map((p) => (
            <PriceMarker
              key={p.imovel.id}
              imovel={p.imovel}
              coords={p.coords}
              onClick={() => setActiveInfoId(p.imovel.id)}
            />
          ))}
          {activeInfoPoint && (
            <InfoWindow
              position={activeInfoPoint.coords}
              onCloseClick={() => setActiveInfoId(null)}
            >
              <PropertyInfoCard imovel={activeInfoPoint.imovel} />
            </InfoWindow>
          )}
          <BoundsWatcher points={points} originalBounds={initialBounds} />
        </Map>
      </div>
    </APIProvider>
  )
}
