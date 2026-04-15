'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, type LatLng } from '../../lib/bairroCoords'
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

const escapeHtml = (raw: string): string =>
  raw.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#39;'
      default:  return ch
    }
  })

const buildPinIcon = (tipo: 'venda' | 'aluguel'): L.DivIcon => {
  const color = tipo === 'venda' ? '#af1e23' : '#1a1a1a'
  return L.divIcon({
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  })
}

const SELL_ICON = typeof window !== 'undefined' ? buildPinIcon('venda') : null
const RENT_ICON = typeof window !== 'undefined' ? buildPinIcon('aluguel') : null

const buildPopupHtml = (imovel: MapImovel): string => {
  const price = formatBRL(imovel.preco)
  const priceSuffix = imovel.tipo === 'aluguel' ? '<span style="font-size:11px;font-weight:normal;">/mês</span>' : ''
  const image = imovel.imagem
    ? `<img src="${escapeHtml(imovel.imagem)}" alt="${escapeHtml(imovel.titulo)}" style="width:100%;height:96px;object-fit:cover;margin-bottom:8px;" loading="lazy" />`
    : ''
  const metaParts: string[] = [escapeHtml(`${imovel.bairro}, ${imovel.cidade}`)]
  if (imovel.area > 0) metaParts.push(`${imovel.area} m²`)
  if (imovel.quartos > 0) metaParts.push(`${imovel.quartos} qts`)
  const slug = imovelSlug(imovel)

  return `
    <div style="width:208px;">
      ${image}
      <p style="color:#af1e23;font-weight:bold;font-size:16px;margin:0 0 4px 0;">${price}${priceSuffix}</p>
      <p style="font-size:12px;font-weight:600;color:#1a1a1a;margin:0 0 4px 0;line-height:1.3;">${escapeHtml(imovel.titulo)}</p>
      <p style="font-size:11px;color:#6b7280;margin:0 0 8px 0;">${metaParts.join(' · ')}</p>
      <a href="/imoveis/${escapeHtml(slug)}" style="display:block;text-align:center;background:#af1e23;color:white;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;padding:8px 12px;text-decoration:none;">
        Ver detalhes
      </a>
    </div>
  `
}

function ClusterLayer({ markers }: { markers: MapMarker[] }) {
  const map = useMap()

  useEffect(() => {
    if (!SELL_ICON || !RENT_ICON) return

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
    })

    for (const { imovel, coords } of markers) {
      const marker = L.marker([coords.lat, coords.lng], {
        icon: imovel.tipo === 'venda' ? SELL_ICON : RENT_ICON,
      })
      marker.bindPopup(buildPopupHtml(imovel))
      cluster.addLayer(marker)
    }

    map.addLayer(cluster)

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.coords.lat, m.coords.lng]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    }

    return () => {
      map.removeLayer(cluster)
    }
  }, [map, markers])

  return null
}

export default function MapaLeaflet({ markers }: MapaLeafletProps) {
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
      <ClusterLayer markers={markers} />
    </MapContainer>
  )
}
