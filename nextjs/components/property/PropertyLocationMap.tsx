'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from '../../lib/bairroCoords'

interface PropertyLocationMapProps {
  coords: LatLng
  bairro: string
  cidade: string
  tipo: 'venda' | 'aluguel'
}

const MAP_ZOOM = 15

const buildPinIcon = (tipo: 'venda' | 'aluguel'): L.DivIcon => {
  const color = tipo === 'venda' ? '#af1e23' : '#10b981'
  return L.divIcon({
    html: `<div style="width:22px;height:22px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function PropertyMarker({ coords, bairro, cidade, tipo }: PropertyLocationMapProps) {
  const map = useMap()

  useEffect(() => {
    const icon = buildPinIcon(tipo)
    const marker = L.marker([coords.lat, coords.lng], { icon })
      .bindTooltip(`${bairro}, ${cidade}`, { permanent: false, direction: 'top', offset: [0, -10] })
      .addTo(map)

    return () => {
      marker.remove()
    }
  }, [map, coords.lat, coords.lng, bairro, cidade, tipo])

  return null
}

export default function PropertyLocationMap({ coords, bairro, cidade, tipo }: PropertyLocationMapProps) {
  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={MAP_ZOOM}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <PropertyMarker coords={coords} bairro={bairro} cidade={cidade} tipo={tipo} />
    </MapContainer>
  )
}
