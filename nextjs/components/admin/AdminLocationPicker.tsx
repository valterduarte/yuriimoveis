'use client'

import { useCallback, useEffect } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  type MapMouseEvent,
} from '@vis.gl/react-google-maps'
import {
  coordsForBairro,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  type LatLng,
} from '../../lib/bairroCoords'

interface AdminLocationPickerProps {
  value: LatLng | null
  bairro: string
  cidade: string
  onChange: (coords: LatLng) => void
}

function Pin() {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#af1e23',
        border: '3px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }}
    />
  )
}

function CenterOnValue({ value }: { value: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (!map || !value) return
    map.panTo(value)
    const zoom = map.getZoom()
    if (zoom !== undefined && zoom < 16) map.setZoom(16)
  }, [map, value])
  return null
}

function PickerInner({
  value,
  initialCenter,
  onChange,
}: {
  value: LatLng | null
  initialCenter: LatLng
  onChange: (c: LatLng) => void
}) {
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      const latLng = e.detail.latLng
      if (latLng) onChange({ lat: latLng.lat, lng: latLng.lng })
    },
    [onChange],
  )

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    },
    [onChange],
  )

  return (
    <Map
      mapId="admin-location-picker"
      defaultCenter={initialCenter}
      defaultZoom={value ? 17 : DEFAULT_MAP_ZOOM}
      gestureHandling="greedy"
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={false}
      style={{ height: '100%', width: '100%' }}
      onClick={handleMapClick}
    >
      {value && (
        <AdvancedMarker position={value} draggable onDragEnd={handleMarkerDragEnd}>
          <Pin />
        </AdvancedMarker>
      )}
      <CenterOnValue value={value} />
    </Map>
  )
}

export default function AdminLocationPicker({ value, bairro, cidade, onChange }: AdminLocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const initialCenter = value ?? coordsForBairro(bairro, cidade) ?? DEFAULT_MAP_CENTER

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Mapa indisponível (configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <PickerInner value={value} initialCenter={initialCenter} onChange={onChange} />
    </APIProvider>
  )
}
