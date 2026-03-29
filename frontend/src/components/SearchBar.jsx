import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { PROPERTY_CATEGORIES, TRANSACTION_TYPES, SALE_PRICE_OPTIONS, RENT_PRICE_OPTIONS } from '../constants'

export default function SearchBar() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState('venda')
  const [categoria, setCategoria] = useState('')
  const [cidade, setCidade] = useState('')
  const [precoMax, setPrecoMax] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (tipo) params.set('tipo', tipo)
    if (categoria) params.set('categoria', categoria)
    if (cidade) params.set('cidade', cidade)
    if (precoMax) params.set('precoMax', precoMax)
    navigate(`/imoveis?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="bg-white shadow-2xl">
      <div className="flex">
        {TRANSACTION_TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTipo(t.value)}
            className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-all duration-200 border-b-2 ${
              tipo === t.value
                ? 'bg-primary text-white border-primary'
                : 'text-gray-500 hover:text-dark bg-white border-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <div className="p-5">
          <label htmlFor="sb-categoria" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Tipo de Imóvel
          </label>
          <select id="sb-categoria" value={categoria} onChange={e => setCategoria(e.target.value)}
            className="w-full text-sm text-dark focus:outline-none bg-white">
            <option value="">Todos os tipos</option>
            {PROPERTY_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="p-5">
          <label htmlFor="sb-cidade" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Cidade
          </label>
          <select id="sb-cidade" value={cidade} onChange={e => setCidade(e.target.value)}
            className="w-full text-sm text-dark focus:outline-none bg-white">
            <option value="">Todas as cidades</option>
            <option value="Osasco">Osasco</option>
          </select>
        </div>
        <div className="p-5">
          <label htmlFor="sb-preco" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Preço Máximo
          </label>
          <select id="sb-preco" value={precoMax} onChange={e => setPrecoMax(e.target.value)}
            className="w-full text-sm text-dark focus:outline-none bg-white">
            <option value="">Sem limite</option>
            {(tipo === 'venda' ? SALE_PRICE_OPTIONS : RENT_PRICE_OPTIONS).map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <button type="submit"
          className="w-full btn-primary flex items-center justify-center gap-2 py-4">
          <FiSearch size={15} />
          Buscar Imóveis
        </button>
      </div>
    </form>
  )
}
