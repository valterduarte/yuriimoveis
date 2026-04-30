'use client'

import { FiX, FiSearch } from 'react-icons/fi'
import { PROPERTY_CATEGORIES, BEDROOM_OPTIONS } from '../../lib/constants'

const TRANSACTION_TYPE_OPTIONS = [
  { value: '',        label: 'Todos'   },
  { value: 'venda',   label: 'Venda'   },
  { value: 'aluguel', label: 'Aluguel' },
]

interface PropertyFiltersProps {
  tipo: string
  categoria: string
  cidade: string
  bairro: string
  bairros?: string[]
  cidades?: string[]
  precoMinInput: string
  precoMaxInput: string
  quartos: string
  codigo: string
  activeFilterCount: number
  onUpdateFilter: (key: string, value: string) => void
  onUpdatePriceMin: (value: string) => void
  onUpdatePriceMax: (value: string) => void
  onClearFilters: () => void
}

export default function PropertyFilters({
  tipo, categoria, cidade, bairro, bairros = [], cidades = [],
  precoMinInput, precoMaxInput, quartos, codigo,
  activeFilterCount,
  onUpdateFilter,
  onUpdatePriceMin,
  onUpdatePriceMax,
  onClearFilters,
}: PropertyFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-dark">Filtros</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-[10px] text-primary uppercase tracking-wider flex items-center gap-1"
          >
            <FiX size={11} /> Limpar ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Código do Imóvel</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ex: 42"
              value={codigo}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '')
                onUpdateFilter('codigo', raw)
              }}
              className="w-full border border-gray-200 px-3 py-2.5 pr-9 text-sm focus:outline-none focus:border-primary"
            />
            <FiSearch size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Finalidade</label>
          <div className="flex gap-1">
            {TRANSACTION_TYPE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => onUpdateFilter('tipo', option.value)}
                className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                  tipo === option.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Tipo</label>
          <select
            value={categoria}
            onChange={e => onUpdateFilter('categoria', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          >
            <option value="">Todos</option>
            {PROPERTY_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Cidade</label>
          <select
            value={cidade}
            onChange={e => onUpdateFilter('cidade', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          >
            <option value="">Todas</option>
            {cidades.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {bairros.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Bairro</label>
            <select
              value={bairro}
              onChange={e => onUpdateFilter('bairro', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Todos</option>
              {bairros.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Faixa de Preço</label>
          <input
            type="number"
            placeholder="Mínimo (R$)"
            value={precoMinInput}
            onChange={e => onUpdatePriceMin(e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary mb-2"
          />
          <input
            type="number"
            placeholder="Máximo (R$)"
            value={precoMaxInput}
            onChange={e => onUpdatePriceMax(e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Quartos</label>
          <div className="flex gap-1">
            {BEDROOM_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => onUpdateFilter('quartos', option)}
                className={`flex-1 py-2 text-[10px] font-bold transition-colors ${
                  quartos === option ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option || 'Todos'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
