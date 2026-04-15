'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import { coordsForImovel, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, type LatLng } from '../../lib/bairroCoords'
import { imovelSlug } from '../../utils/imovelUtils'
import type { MapImovel } from '../../lib/api'

interface MapMarker {
  imovel: MapImovel
  coords: LatLng
}

interface MapaLeafletProps {
  markers: MapMarker[]
}

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const buildIcon = (tipo: 'venda' | 'aluguel'): L.DivIcon => {
  const color = tipo === 'venda' ? '#af1e23' : '#1a1a1a'
  return L.divIcon({
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  })
}

function FitToMarkers({ markers }: { markers: MapMarker[] }) {
  const map = useMap()
  useEffect(() => {
    if (markers.length === 0) return
    const bounds = L.latLngBounds(markers.map((m) => [m.coords.lat, m.coords.lng]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [map, markers])
  return null
}

export default function MapaLeaflet({ markers }: MapaLeafletProps) {
  const sellIcon = useMemo(() => buildIcon('venda'), [])
  const rentIcon = useMemo(() => buildIcon('aluguel'), [])

  return (
    <MapContainer
      center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]}
      zoom={DEFAULT_MAP_ZOOM}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToMarkers markers={markers} />
      {markers.map(({ imovel, coords }) => (
        <Marker
          key={imovel.id}
          position={[coords.lat, coords.lng]}
          icon={imovel.tipo === 'venda' ? sellIcon : rentIcon}
        >
          <Popup>
            <div className="w-52">
              {imovel.imagem && (
                <img
                  src={imovel.imagem}
                  alt={imovel.titulo}
                  className="w-full h-24 object-cover mb-2"
                  loading="lazy"
                />
              )}
              <p className="text-primary font-bold text-base mb-1" style={{ color: '#af1e23' }}>
                {formatBRL(imovel.preco)}
                {imovel.tipo === 'aluguel' && <span className="text-xs font-normal">/mês</span>}
              </p>
              <p className="text-xs font-semibold text-dark line-clamp-2 mb-1">{imovel.titulo}</p>
              <p className="text-[11px] text-gray-600 mb-2">
                {imovel.bairro}, {imovel.cidade}
                {imovel.area > 0 && ` · ${imovel.area} m²`}
                {imovel.quartos > 0 && ` · ${imovel.quartos} qts`}
              </p>
              <Link
                href={`/imoveis/${imovelSlug(imovel)}`}
                className="inline-block w-full text-center bg-primary text-white text-[11px] font-bold uppercase tracking-wider py-2 px-3 hover:opacity-90"
                style={{ background: '#af1e23' }}
              >
                Ver detalhes
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
