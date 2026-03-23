import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'
import axios from 'axios'
import SEOHead from '../components/SEOHead'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const ordemOptions = [
  { value: 'recente', label: 'Mais recente' },
  { value: 'menor_preco', label: 'Menor preço' },
  { value: 'maior_preco', label: 'Maior preço' },
  { value: 'maior_area', label: 'Maior área' },
]

export default function Imoveis() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [imoveis, setImoveis] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 9

  const [filters, setFilters] = useState({
    tipo: searchParams.get('tipo') || '',
    categoria: searchParams.get('categoria') || '',
    cidade: searchParams.get('cidade') || '',
    precoMin: '',
    precoMax: searchParams.get('precoMax') || '',
    quartos: '',
    ordem: 'recente',
  })

  const fetchImoveis = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.tipo) params.set('tipo', filters.tipo)
      if (filters.categoria) params.set('categoria', filters.categoria)
      if (filters.cidade) params.set('cidade', filters.cidade)
      if (filters.precoMin) params.set('precoMin', filters.precoMin)
      if (filters.precoMax) params.set('precoMax', filters.precoMax)
      if (filters.quartos) params.set('quartos', filters.quartos)
      params.set('ordem', filters.ordem)
      params.set('page', page)
      params.set('limit', limit)
      const res = await axios.get(`${API_URL}/api/imoveis?${params.toString()}`)
      setImoveis(res.data.imoveis || [])
      setTotal(res.data.total || 0)
    } catch {
      setImoveis([])
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchImoveis() }, [fetchImoveis])

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ tipo: '', categoria: '', cidade: '', precoMin: '', precoMax: '', quartos: '', ordem: 'recente' })
    setSearchParams({})
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)
  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== 'ordem').length

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Imóveis à Venda e Aluguel em Canela"
        description="Explore o catálogo completo de imóveis em Canela e região. Casas, apartamentos, terrenos, chalés e comerciais disponíveis para venda e aluguel."
        url="/imoveis"
      />
      {/* Page header */}
      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <span className="section-label">Portfólio</span>
          <h1 className="text-4xl font-black uppercase text-white">Imóveis Disponíveis</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark">Filtros</h3>
                {activeCount > 0 && (
                  <button onClick={clearFilters}
                    className="text-[10px] text-primary uppercase tracking-wider flex items-center gap-1">
                    <FiX size={11} /> Limpar ({activeCount})
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Finalidade */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Finalidade</label>
                  <div className="flex gap-1">
                    {[{ v: '', l: 'Todos' }, { v: 'venda', l: 'Venda' }, { v: 'aluguel', l: 'Aluguel' }].map(t => (
                      <button key={t.v} onClick={() => updateFilter('tipo', t.v)}
                        className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                          filters.tipo === t.v ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tipo</label>
                  <select value={filters.categoria} onChange={e => updateFilter('categoria', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">Todos</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="chale">Chalé</option>
                    <option value="comercial">Comercial</option>
                    <option value="chacara">Chácara</option>
                  </select>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Cidade</label>
                  <select value={filters.cidade} onChange={e => updateFilter('cidade', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">Todas</option>
                    <option value="Osasco">Osasco</option>
                  </select>
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Faixa de Preço</label>
                  <input type="number" placeholder="Mínimo (R$)" value={filters.precoMin}
                    onChange={e => updateFilter('precoMin', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary mb-2" />
                  <input type="number" placeholder="Máximo (R$)" value={filters.precoMax}
                    onChange={e => updateFilter('precoMax', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>

                {/* Quartos */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Quartos</label>
                  <div className="flex gap-1">
                    {['', '1', '2', '3', '4+'].map(q => (
                      <button key={q} onClick={() => updateFilter('quartos', q)}
                        className={`flex-1 py-2 text-[10px] font-bold transition-colors ${
                          filters.quartos === q ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {q || 'Td'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-dark">
                  <FiFilter size={14} />
                  Filtros
                  {activeCount > 0 && (
                    <span className="bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center">{activeCount}</span>
                  )}
                </button>
                <p className="text-xs text-gray-500">
                  {loading ? 'Buscando...' : `${total} imóvel${total !== 1 ? 'is' : ''}`}
                </p>
              </div>
              <select value={filters.ordem} onChange={e => updateFilter('ordem', e.target.value)}
                className="text-xs border border-gray-200 px-3 py-2 focus:outline-none focus:border-primary">
                {ordemOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 h-72 animate-pulse" />)}
              </div>
            ) : imoveis.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel encontrado</h3>
                <p className="text-gray-500 text-sm mb-5">Tente ajustar os filtros</p>
                <button onClick={clearFilters} className="btn-primary">Limpar filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {imoveis.map(imovel => <PropertyCard key={imovel.id} imovel={imovel} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors">
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 text-xs font-bold transition-colors ${
                      page === i + 1 ? 'bg-primary text-white' : 'border border-gray-300 hover:border-primary hover:text-primary'
                    }`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors">
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
