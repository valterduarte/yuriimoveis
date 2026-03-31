'use client'

import { useState, useEffect, Suspense } from 'react'
import axios from 'axios'
import PropertyFilters from '../../components/property/PropertyFilters'
import SortBar from '../../components/imoveis/SortBar'
import ActiveFilters from '../../components/imoveis/ActiveFilters'
import PropertyGrid from '../../components/imoveis/PropertyGrid'
import Pagination from '../../components/imoveis/Pagination'
import SkeletonCard from '../../components/SkeletonCard'
import { API_URL } from '../../lib/config'
import { ITEMS_PER_PAGE } from '../../lib/constants'
import { usePropertyFilters } from '../../hooks/usePropertyFilters'

function ImoveisContent() {
  const {
    tipo, categoria, cidade, precoMin, precoMax, quartos, ordem,
    precoMinInput, precoMaxInput,
    page, setPage,
    updateFilter, updatePriceFilter,
    setPrecoMinInput, setPrecoMaxInput,
    clearFilters, activeFilterCount,
  } = usePropertyFilters()

  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const params = new URLSearchParams()
    if (tipo)      params.set('tipo',      tipo)
    if (categoria) params.set('categoria', categoria)
    if (cidade)    params.set('cidade',    cidade)
    if (precoMin)  params.set('precoMin',  precoMin)
    if (precoMax)  params.set('precoMax',  precoMax)
    if (quartos)   params.set('quartos',   quartos)
    params.set('ordem', ordem)
    params.set('page',  page)
    params.set('limit', ITEMS_PER_PAGE)
    axios
      .get(`${API_URL}/api/imoveis?${params.toString()}`, { signal: controller.signal })
      .then(res => { setProperties(res.data.imoveis || []); setTotal(res.data.total || 0) })
      .catch(err => { if (!axios.isCancel(err)) setProperties([]) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [tipo, categoria, cidade, precoMin, precoMax, quartos, ordem, page])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const goToPage = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <span className="section-label">Portfólio</span>
          <h1 className="text-4xl font-black uppercase text-white">Imóveis Disponíveis</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
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
              loading={loading}
              ordem={ordem}
              activeFilterCount={activeFilterCount}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
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
              loading={loading}
              activeFilterCount={activeFilterCount}
              onClearFilters={clearFilters}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ImoveisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="bg-dark text-white py-12">
          <div className="container mx-auto px-6">
            <span className="section-label">Portfólio</span>
            <h1 className="text-4xl font-black uppercase text-white">Imóveis Disponíveis</h1>
          </div>
        </div>
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    }>
      <ImoveisContent />
    </Suspense>
  )
}
