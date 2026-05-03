'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { coordsForBairro, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, type LatLng } from '../../lib/bairroCoords'

interface AdminLocationPickerProps {
  value: LatLng | null
  bairro: string
  cidade: string
  onChange: (coords: LatLng) => void
}

const PIN_HTML = `<div style="width:22px;height:22px;border-radius:50%;background:#af1e23;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`

function buildPinIcon(): L.DivIcon {
  return L.divIcon({
    html: PIN_HTML,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function ClickableMarker({ value, onChange }: { value: LatLng | null; onChange: (coords: LatLng) => void }) {
  const map = useMap()

  useEffect(() => {
    if (!value) return
    const icon = buildPinIcon()
    const marker = L.marker([value.lat, value.lng], { icon, draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      onChange({ lat: pos.lat, lng: pos.lng })
    })
    return () => {
      marker.remove()
    }
  }, [map, value, onChange])

  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  return null
}

function CenterOnValue({ value }: { value: LatLng | null }) {
  const map = useMap()
  useEffect(() => {
    if (value) map.setView([value.lat, value.lng], Math.max(map.getZoom(), 16))
  }, [map, value])
  return null
}

export default function AdminLocationPicker({ value, bairro, cidade, onChange }: AdminLocationPickerProps) {
  const fallback = value ?? coordsForBairro(bairro, cidade) ?? DEFAULT_MAP_CENTER
  const initialZoom = value ? 17 : DEFAULT_MAP_ZOOM

  return (
    <MapContainer
      center={[fallback.lat, fallback.lng]}
      zoom={initialZoom}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <ClickableMarker value={value} onChange={onChange} />
      <CenterOnValue value={value} />
    </MapContainer>
  )
}
