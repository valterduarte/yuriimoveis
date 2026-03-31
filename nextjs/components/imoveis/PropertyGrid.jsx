'use client'

import { FaWhatsapp } from 'react-icons/fa'
import PropertyCard from '../PropertyCard'
import { PHONE_WA } from '../../lib/config'

export default function PropertyGrid({ properties, activeFilterCount, onClearFilters }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200 px-6">
        <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
        <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel encontrado</h2>
        <p className="text-gray-500 text-sm mb-6">Tente ajustar os filtros ou fale com o corretor para encontrar o imóvel ideal.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {activeFilterCount > 0 && (
            <button onClick={onClearFilters} className="btn-primary">Limpar filtros</button>
          )}
          <a
            href={`${PHONE_WA}?text=${encodeURIComponent('Olá! Não encontrei o imóvel que procuro no site. Pode me ajudar?')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors"
          >
            <FaWhatsapp size={14} /> Falar com o Corretor
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className="sr-only">Resultados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {properties.map((property, i) => (
          <div key={property.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
            <PropertyCard imovel={property} />
          </div>
        ))}
      </div>
    </>
  )
}
