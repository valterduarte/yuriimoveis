import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'
import SkeletonCard from '../components/SkeletonCard'
import axios from 'axios'
import SEOHead from '../components/SEOHead'
import { API_URL, PHONE_WA } from '../config'
import { FaWhatsapp } from 'react-icons/fa'

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

  // Todos os filtros derivados diretamente da URL — fonte única de verdade
  const tipo     = searchParams.get('tipo')     || ''
  const categoria= searchParams.get('categoria')|| ''
  const cidade   = searchParams.get('cidade')   || ''
  const precoMin = searchParams.get('precoMin') || ''
  const precoMax = searchParams.get('precoMax') || ''

  // Estado local para inputs de preço (evita requisição a cada tecla)
  const [precoMinInput, setPrecoMinInput] = useState(precoMin)
  const [precoMaxInput, setPrecoMaxInput] = useState(precoMax)
  const debounceRef = useRef(null)
  const quartos  = searchParams.get('quartos')  || ''
  const ordem    = searchParams.get('ordem')    || 'recente'

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const params = new URLSearchParams()
    if (tipo)     params.set('tipo', tipo)
    if (categoria)params.set('categoria', categoria)
    if (cidade)   params.set('cidade', cidade)
    if (precoMin) params.set('precoMin', precoMin)
    if (precoMax) params.set('precoMax', precoMax)
    if (quartos)  params.set('quartos', quartos)
    params.set('ordem', ordem)
    params.set('page', page)
    params.set('limit', limit)
    axios.get(`${API_URL}/api/imoveis?${params.toString()}`, { signal: controller.signal })
      .then(res => { setImoveis(res.data.imoveis || []); setTotal(res.data.total || 0) })
      .catch(err => { if (!axios.isCancel(err)) setImoveis([]) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [tipo, categoria, cidade, precoMin, precoMax, quartos, ordem, page])

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
    setPage(1)
  }

  // Sincroniza inputs locais quando URL muda externamente (ex: limpar filtros)
  useEffect(() => { setPrecoMinInput(precoMin) }, [precoMin])
  useEffect(() => { setPrecoMaxInput(precoMax) }, [precoMax])

  const updatePreco = (key, value, setter) => {
    setter(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateFilter(key, value), 600)
  }

  const clearFilters = () => {
    setSearchParams({})
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)
  const activeCount = [tipo, categoria, cidade, precoMin, precoMax, quartos].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Imóveis à Venda e para Alugar em Osasco e Região"
        description="Catálogo completo de imóveis em Osasco. Casas e apartamentos à venda, terrenos, chalés, chácaras e imóveis comerciais. Encontre o imóvel ideal com o Corretor Yuri."
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
                          tipo === t.v ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tipo</label>
                  <select value={categoria} onChange={e => updateFilter('categoria', e.target.value)}
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
                  <select value={cidade} onChange={e => updateFilter('cidade', e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">Todas</option>
                    <option value="Osasco">Osasco</option>
                  </select>
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Faixa de Preço</label>
                  <input type="number" placeholder="Mínimo (R$)" value={precoMinInput}
                    onChange={e => updatePreco('precoMin', e.target.value, setPrecoMinInput)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary mb-2" />
                  <input type="number" placeholder="Máximo (R$)" value={precoMaxInput}
                    onChange={e => updatePreco('precoMax', e.target.value, setPrecoMaxInput)}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>

                {/* Quartos */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Quartos</label>
                  <div className="flex gap-1">
                    {['', '1', '2', '3', '4+'].map(q => (
                      <button key={q} onClick={() => updateFilter('quartos', q)}
                        className={`flex-1 py-2 text-[10px] font-bold transition-colors ${
                          quartos === q ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              <select value={ordem} onChange={e => updateFilter('ordem', e.target.value)}
                className="text-xs border border-gray-200 px-3 py-2 focus:outline-none focus:border-primary">
                {ordemOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Tags de filtros ativos */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tipo && <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">{tipo === 'venda' ? 'Venda' : 'Aluguel'}<button onClick={() => updateFilter('tipo', '')} aria-label="Remover filtro"><FiX size={10} /></button></span>}
                {categoria && <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">{categoria}<button onClick={() => updateFilter('categoria', '')} aria-label="Remover filtro"><FiX size={10} /></button></span>}
                {cidade && <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">{cidade}<button onClick={() => updateFilter('cidade', '')} aria-label="Remover filtro"><FiX size={10} /></button></span>}
                {precoMin && <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">Mín R$ {Number(precoMin).toLocaleString('pt-BR')}<button onClick={() => updateFilter('precoMin', '')} aria-label="Remover filtro"><FiX size={10} /></button></span>}
                {precoMax && <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">Máx R$ {Number(precoMax).toLocaleString('pt-BR')}<button onClick={() => updateFilter('precoMax', '')} aria-label="Remover filtro"><FiX size={10} /></button></span>}
                {quartos && <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">{quartos === '4+' ? '4+ quartos' : `${quartos} quarto${quartos !== '1' ? 's' : ''}`}<button onClick={() => updateFilter('quartos', '')} aria-label="Remover filtro"><FiX size={10} /></button></span>}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : imoveis.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200 px-6">
                <div className="text-5xl mb-4" aria-hidden="true">🏠</div>
                <h3 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum imóvel encontrado</h3>
                <p className="text-gray-500 text-sm mb-6">Tente ajustar os filtros ou fale com o corretor para encontrar o imóvel ideal.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeCount > 0 && <button onClick={clearFilters} className="btn-primary">Limpar filtros</button>}
                  <a href={`${PHONE_WA}?text=${encodeURIComponent('Olá! Não encontrei o imóvel que procuro no site. Pode me ajudar?')}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs py-3 px-6 transition-colors">
                    <FaWhatsapp size={14} /> Falar com o Corretor
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {imoveis.map((imovel, i) => (
                  <div key={imovel.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                    <PropertyCard imovel={imovel} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }} disabled={page === 1}
                  className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors">
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`w-9 h-9 text-xs font-bold transition-colors ${
                      page === i + 1 ? 'bg-primary text-white' : 'border border-gray-300 hover:border-primary hover:text-primary'
                    }`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }} disabled={page === totalPages}
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
