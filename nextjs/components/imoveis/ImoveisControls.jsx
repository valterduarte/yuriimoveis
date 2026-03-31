'use client'

import { useState } from 'react'
import PropertyFilters from '../property/PropertyFilters'
import SortBar from './SortBar'
import ActiveFilters from './ActiveFilters'
import PropertyGrid from './PropertyGrid'
import Pagination from './Pagination'
import { usePropertyFilters } from '../../hooks/usePropertyFilters'

export default function ImoveisControls({ properties, total, currentPage, totalPages }) {
  const [showFilters, setShowFilters] = useState(false)
  const {
    tipo, categoria, cidade, precoMin, precoMax, quartos, ordem,
    precoMinInput, precoMaxInput,
    updateFilter, updatePriceFilter, navigatePage,
    setPrecoMinInput, setPrecoMaxInput,
    clearFilters, activeFilterCount,
  } = usePropertyFilters()

  const goToPage = (page) => {
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
          precoMinInput={precoMinInput}
          precoMaxInput={precoMaxInput}
          quartos={quartos}
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
          precoMin={precoMin}
          precoMax={precoMax}
          quartos={quartos}
          onRemove={key => updateFilter(key, '')}
        />
        <PropertyGrid
          properties={properties}
          activeFilterCount={activeFilterCount}
          onClearFilters={clearFilters}
        />
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>
    </div>
  )
}
