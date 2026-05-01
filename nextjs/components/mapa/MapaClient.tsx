'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { FiMapPin } from 'react-icons/fi'
import { coordsForImovel } from '../../lib/bairroCoords'
import { PROPERTY_CATEGORIES } from '../../lib/constants'
import type { MapImovel } from '../../lib/api'

const MapaLeaflet = dynamic(() => import('./MapaLeaflet'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
      Carregando mapa…
    </div>
  ),
})

interface MapaClientProps {
  imoveis: MapImovel[]
}

type TipoFilter = '' | 'venda' | 'aluguel'
type QuartosFilter = '' | '1' | '2' | '3' | '4+'

export default function MapaClient({ imoveis }: MapaClientProps) {
  const [tipo, setTipo] = useState<TipoFilter>('')
  const [categoria, setCategoria] = useState('')
  const [cidade, setCidade] = useState('')
  const [quartos, setQuartos] = useState<QuartosFilter>('')
  const [precoMax, setPrecoMax] = useState<number | ''>('')

  const cidades = useMemo(() => {
    const set = new Set(imoveis.map((i) => i.cidade).filter(Boolean))
    return Array.from(set).sort()
  }, [imoveis])

  const markers = useMemo(() => {
    return imoveis
      .filter((imovel) => {
        if (tipo && imovel.tipo !== tipo) return false
        if (categoria && imovel.categoria !== categoria) return false
        if (cidade && imovel.cidade !== cidade) return false
        if (quartos) {
          if (quartos === '4+' && imovel.quartos < 4) return false
          if (quartos !== '4+' && imovel.quartos < Number(quartos)) return false
        }
        if (precoMax !== '' && imovel.preco > precoMax) return false
        return true
      })
      .map((imovel) => {
        const coords = coordsForImovel(imovel.id, imovel.bairro, imovel.cidade)
        return coords ? { imovel, coords } : null
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
  }, [imoveis, tipo, categoria, cidade, quartos, precoMax])

  return (
    <div className="grid lg:grid-cols-4 gap-0 border border-gray-200 bg-white" style={{ height: '70vh', minHeight: 520 }}>
      <aside className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200 p-5 overflow-y-auto bg-gray-50">
        <p className="text-xs font-bold uppercase tracking-wider text-dark mb-4">Filtros</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="map-tipo" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Transação
            </label>
            <select
              id="map-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoFilter)}
              className="input-field"
            >
              <option value="">Todos</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>

          <div>
            <label htmlFor="map-categoria" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Tipo de imóvel
            </label>
            <select
              id="map-categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="input-field"
            >
              <option value="">Todos</option>
              {PROPERTY_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {cidades.length > 1 && (
            <div>
              <label htmlFor="map-cidade" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Cidade
              </label>
              <select
                id="map-cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="input-field"
              >
                <option value="">Todas</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="map-quartos" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Mínimo de quartos
            </label>
            <select
              id="map-quartos"
              value={quartos}
              onChange={(e) => setQuartos(e.target.value as QuartosFilter)}
              className="input-field"
            >
              <option value="">Qualquer</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4+">4+</option>
            </select>
          </div>

          <div>
            <label htmlFor="map-preco" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Preço máximo
            </label>
            <input
              id="map-preco"
              type="number"
              min={0}
              step={50000}
              value={precoMax}
              onChange={(e) => setPrecoMax(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Sem limite"
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mb-2">Legenda</p>
          <div className="space-y-1.5 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-primary border-2 border-white ring-1 ring-gray-300" />
              Venda
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-white ring-1 ring-gray-300" style={{ backgroundColor: '#10b981' }} />
              Aluguel
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm font-bold text-dark flex items-center gap-1.5">
            <FiMapPin size={14} className="text-primary" />
            {markers.length} {markers.length === 1 ? 'imóvel' : 'imóveis'}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Posições aproximadas por bairro para preservar a privacidade.
          </p>
        </div>
      </aside>

      <div className="lg:col-span-3 relative">
        <MapaLeaflet markers={markers} />
      </div>
    </div>
  )
}
