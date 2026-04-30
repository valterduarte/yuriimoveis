'use client'

import { useState, type ReactNode } from 'react'
import PropertyFilters from '../property/PropertyFilters'
import SortBar from './SortBar'
import ActiveFilters from './ActiveFilters'
import Pagination from './Pagination'
import { usePropertyFilters } from '../../hooks/usePropertyFilters'

interface ImoveisControlsProps {
  total: number
  currentPage: number
  totalPages: number
  bairros?: string[]
  cidades?: string[]
  children: ReactNode
}

export default function ImoveisControls({ total, currentPage, totalPages, bairros = [], cidades = [], children }: ImoveisControlsProps) {
  const [showFilters, setShowFilters] = useState(false)
  const {
    tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, codigo, ordem,
    precoMinInput, precoMaxInput,
    updateFilter, updatePriceFilter, navigatePage,
    setPrecoMinInput, setPrecoMaxInput,
    clearFilters, activeFilterCount,
  } = usePropertyFilters()

  const goToPage = (page: number) => {
    navigatePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <PropertyFilters
          tipo={tipo}
          categoria={categoria}
          cidade={cidade}
          bairro={bairro}
          bairros={bairros}
          cidades={cidades}
          precoMinInput={precoMinInput}
          precoMaxInput={precoMaxInput}
          quartos={quartos}
          codigo={codigo}
          activeFilterCount={activeFilterCount}
          onUpdateFilter={updateFilter}
          onUpdatePriceMin={value => updatePriceFilter('precoMin', value, setPrecoMinInput)}
          onUpdatePriceMax={value => updatePriceFilter('precoMax', value, setPrecoMaxInput)}
          onClearFilters={clearFilters}
        />
      </aside>

      <div className="flex-1">
        <SortBar
          total={total}
          ordem={ordem}
          activeFilterCount={activeFilterCount}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(prev => !prev)}
          onSortChange={value => updateFilter('ordem', value)}
        />
        <ActiveFilters
          tipo={tipo}
          categoria={categoria}
          cidade={cidade}
          bairro={bairro}
          precoMin={precoMin}
          precoMax={precoMax}
          quartos={quartos}
          codigo={codigo}
          onRemove={key => updateFilter(key, '')}
        />
        {children}
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>
    </div>
  )
}
