import { useState, useEffect } from 'react'
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import axios from 'axios'
import PropertyCard from '../components/PropertyCard'
import SkeletonCard from '../components/SkeletonCard'
import SEOHead from '../components/SEOHead'
import PropertyFilters from '../components/property/PropertyFilters'
import { API_URL, PHONE_WA, SITE_URL } from '../config'
import { imovelSlug } from '../utils/imovelUtils'
import { ITEMS_PER_PAGE, SORT_OPTIONS } from '../constants'
import { usePropertyFilters } from '../hooks/usePropertyFilters'

export default function Imoveis() {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <SEOHead
        title="Imóveis à Venda e para Alugar em Osasco e Região"
        description="Catálogo completo de imóveis em Osasco. Casas e apartamentos à venda, terrenos, chalés, chácaras e imóveis comerciais. Encontre o imóvel ideal com o Corretor Yuri."
        url="/imoveis"
        jsonLd={properties.length > 0 ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Imóveis disponíveis — Corretor Yuri Imóveis',
          url: `${SITE_URL}/imoveis`,
          numberOfItems: total,
          itemListElement: properties.map((property, i) => ({
            '@type': 'ListItem',
            position: (page - 1) * ITEMS_PER_PAGE + i + 1,
            url: `${SITE_URL}/imoveis/${imovelSlug(property)}`,
            name: property.titulo,
          })),
        } : undefined}
      />

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
            <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-dark"
                >
                  <FiFilter size={14} />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-xs text-gray-500">
                  {loading ? 'Buscando...' : `${total} imóvel${total !== 1 ? 'is' : ''}`}
                </p>
              </div>
              <select
                value={ordem}
                onChange={e => updateFilter('ordem', e.target.value)}
                className="text-xs border border-gray-200 px-3 py-2 focus:outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tipo && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    {tipo === 'venda' ? 'Venda' : 'Aluguel'}
                    <button onClick={() => updateFilter('tipo', '')} aria-label="Remover filtro"><FiX size={10} /></button>
                  </span>
                )}
                {categoria && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    {categoria}
                    <button onClick={() => updateFilter('categoria', '')} aria-label="Remover filtro"><FiX size={10} /></button>
                  </span>
                )}
                {cidade && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    {cidade}
                    <button onClick={() => updateFilter('cidade', '')} aria-label="Remover filtro"><FiX size={10} /></button>
                  </span>
                )}
                {precoMin && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    Mín R$ {Number(precoMin).toLocaleString('pt-BR')}
                    <button onClick={() => updateFilter('precoMin', '')} aria-label="Remover filtro"><FiX size={10} /></button>
                  </span>
                )}
                {precoMax && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    Máx R$ {Number(precoMax).toLocaleString('pt-BR')}
                    <button onClick={() => updateFilter('precoMax', '')} aria-label="Remover filtro"><FiX size={10} /></button>
                  </span>
                )}
                {quartos && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    {quartos === '4+' ? '4+ quartos' : `${quartos} quarto${quartos !== '1' ? 's' : ''}`}
                    <button onClick={() => updateFilter('quartos', '')} aria-label="Remover filtro"><FiX size={10} /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200 px-6">
                <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
                <h3 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel encontrado</h3>
                <p className="text-gray-500 text-sm mb-6">Tente ajustar os filtros ou fale com o corretor para encontrar o imóvel ideal.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="btn-primary">Limpar filtros</button>
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {properties.map((property, i) => (
                  <div key={property.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                    <PropertyCard imovel={property} />
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                <button
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`w-9 h-9 text-xs font-bold transition-colors ${
                      page === i + 1 ? 'bg-primary text-white' : 'border border-gray-300 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
