'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { APIProvider, Map, InfoWindow, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { clusterRenderer } from '../imoveis/listing-map/ClusterRenderer'
import PropertyInfoCard from '../imoveis/listing-map/PropertyInfoCard'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, type LatLng } from '../../lib/bairroCoords'
import type { MapImovel } from '../../lib/api'

interface MapMarker {
  imovel: MapImovel
  coords: LatLng
}

interface MapaGoogleProps {
  markers: MapMarker[]
}

function ColoredPin({ tipo }: { tipo: 'venda' | 'aluguel' }) {
  const color = tipo === 'venda' ? '#af1e23' : '#10b981'
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: color,
        border: '3px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }}
    />
  )
}

function ClusteredMarkers({
  markers,
  onMarkerClick,
}: {
  markers: MapMarker[]
  onMarkerClick: (id: number) => void
}) {
  const map = useMap()
  const [markerRefs, setMarkerRefs] = useState<Record<number, google.maps.marker.AdvancedMarkerElement>>({})
  const clustererRef = useRef<MarkerClusterer | null>(null)

  useEffect(() => {
    if (!map) return
    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({ map, renderer: clusterRenderer })
    }
    return () => {
      clustererRef.current?.clearMarkers()
      clustererRef.current = null
    }
  }, [map])

  useEffect(() => {
    const clusterer = clustererRef.current
    if (!clusterer) return
    clusterer.clearMarkers()
    clusterer.addMarkers(Object.values(markerRefs))
  }, [markerRefs])

  const setMarkerRef = useCallback(
    (id: number, ref: google.maps.marker.AdvancedMarkerElement | null) => {
      setMarkerRefs(prev => {
        if (ref && prev[id] === ref) return prev
        if (!ref && !prev[id]) return prev
        const next = { ...prev }
        if (ref) next[id] = ref
        else delete next[id]
        return next
      })
    },
    [],
  )

  return (
    <>
      {markers.map(m => (
        <AdvancedMarker
          key={m.imovel.id}
          position={m.coords}
          ref={ref => setMarkerRef(m.imovel.id, ref)}
          onClick={() => onMarkerClick(m.imovel.id)}
        >
          <ColoredPin tipo={m.imovel.tipo} />
        </AdvancedMarker>
      ))}
    </>
  )
}

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap()
  useEffect(() => {
    if (!map || markers.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    for (const m of markers) bounds.extend(m.coords)
    map.fitBounds(bounds, 40)
  }, [map, markers])
  return null
}

export default function MapaGoogle({ markers }: MapaGoogleProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const [activeId, setActiveId] = useState<number | null>(null)

  const activeMarker = useMemo(
    () => (activeId ? markers.find(m => m.imovel.id === activeId) ?? null : null),
    [activeId, markers],
  )

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set; map will not render.')
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Mapa indisponível (configure a chave do Google Maps)
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId="mapa-imoveis"
        defaultCenter={DEFAULT_MAP_CENTER}
        defaultZoom={DEFAULT_MAP_ZOOM}
        gestureHandling="greedy"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ClusteredMarkers markers={markers} onMarkerClick={setActiveId} />
        {activeMarker && (
          <InfoWindow position={activeMarker.coords} onCloseClick={() => setActiveId(null)}>
            <PropertyInfoCard imovel={activeMarker.imovel} />
          </InfoWindow>
        )}
        <FitBounds markers={markers} />
      </Map>
    </APIProvider>
  )
}
