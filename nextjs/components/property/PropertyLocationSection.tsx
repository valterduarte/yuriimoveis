'use client'

import dynamic from 'next/dynamic'
import { FiMapPin, FiExternalLink } from 'react-icons/fi'
import { coordsForImovel } from '../../lib/bairroCoords'
import type { Imovel } from '../../types'

const PropertyLocationMap = dynamic(() => import('./PropertyLocationMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs uppercase tracking-widest">
      Carregando mapa…
    </div>
  ),
})

interface PropertyLocationSectionProps {
  imovel: Pick<Imovel, 'id' | 'bairro' | 'cidade' | 'tipo' | 'lat' | 'lng'>
}

const MAP_HEIGHT_PX = 360

function buildGoogleMapsUrl(imovel: PropertyLocationSectionProps['imovel']): string {
  if (imovel.lat && imovel.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${imovel.lat},${imovel.lng}`
  }
  const query = `${imovel.bairro}, ${imovel.cidade}, SP`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function resolveCoords(imovel: PropertyLocationSectionProps['imovel']) {
  if (imovel.lat && imovel.lng) return { lat: imovel.lat, lng: imovel.lng }
  return coordsForImovel(imovel.id, imovel.bairro, imovel.cidade)
}

export default function PropertyLocationSection({ imovel }: PropertyLocationSectionProps) {
  const coords = resolveCoords(imovel)
  const googleMapsUrl = buildGoogleMapsUrl(imovel)

  return (
    <section id="localizacao">
      <span className="section-label">Localização</span>
      <h2 className="section-title mb-8">Onde fica</h2>

      <div className="bg-white border border-gray-200 p-6 mb-4">
        <p className="flex items-start gap-2.5 text-sm text-gray-600">
          <FiMapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <span><strong>{imovel.bairro}</strong>, {imovel.cidade} — SP</span>
        </p>
      </div>

      {coords ? (
        <>
          <div className="border border-gray-200 overflow-hidden" style={{ height: MAP_HEIGHT_PX }}>
            <PropertyLocationMap
              coords={coords}
              bairro={imovel.bairro}
              cidade={imovel.cidade}
              tipo={imovel.tipo}
            />
          </div>
        </>
      ) : (
        <div className="bg-dark flex items-center justify-center" style={{ height: MAP_HEIGHT_PX }}>
          <div className="text-center">
            <FiMapPin size={40} className="mx-auto mb-3 text-primary" />
            <p className="text-white font-bold uppercase tracking-widest text-sm">{imovel.cidade} — SP</p>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">{imovel.bairro}</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-primary border border-primary px-5 py-2 hover:bg-primary hover:text-white transition-colors"
            >
              Ver no Google Maps <FiExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
