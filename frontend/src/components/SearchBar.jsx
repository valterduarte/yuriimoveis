import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

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
      {/* Tipo tabs */}
      <div className="flex">
        {[
          { value: 'venda', label: 'Comprar' },
          { value: 'aluguel', label: 'Alugar' },
        ].map(t => (
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
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Tipo de Imóvel
          </label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)}
            className="w-full text-sm text-dark focus:outline-none bg-white">
            <option value="">Todos os tipos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="terreno">Terreno</option>
            <option value="chale">Chalé</option>
            <option value="comercial">Comercial</option>
            <option value="chacara">Chácara</option>
          </select>
        </div>
        <div className="p-5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Cidade
          </label>
          <select value={cidade} onChange={e => setCidade(e.target.value)}
            className="w-full text-sm text-dark focus:outline-none bg-white">
            <option value="">Todas as cidades</option>
            <option value="Canela">Canela</option>
            <option value="Gramado">Gramado</option>
            <option value="Nova Petrópolis">Nova Petrópolis</option>
            <option value="São Francisco de Paula">São Francisco de Paula</option>
            <option value="Caxias do Sul">Caxias do Sul</option>
          </select>
        </div>
        <div className="p-5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Preço Máximo
          </label>
          <select value={precoMax} onChange={e => setPrecoMax(e.target.value)}
            className="w-full text-sm text-dark focus:outline-none bg-white">
            <option value="">Sem limite</option>
            {tipo === 'venda' ? (
              <>
                <option value="200000">R$ 200.000</option>
                <option value="400000">R$ 400.000</option>
                <option value="600000">R$ 600.000</option>
                <option value="800000">R$ 800.000</option>
                <option value="1000000">R$ 1.000.000</option>
                <option value="2000000">R$ 2.000.000+</option>
              </>
            ) : (
              <>
                <option value="1000">R$ 1.000/mês</option>
                <option value="2000">R$ 2.000/mês</option>
                <option value="3000">R$ 3.000/mês</option>
                <option value="5000">R$ 5.000/mês</option>
              </>
            )}
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
