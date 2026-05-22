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
          <label htmlFor="filter-codigo" className="label-field">Código do Imóvel</label>
          <div className="relative">
            <input
              id="filter-codigo"
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
            <FiSearch size={14} aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <fieldset>
          <legend className="label-field">Finalidade</legend>
          <div className="flex gap-1" role="group">
            {TRANSACTION_TYPE_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdateFilter('tipo', option.value)}
                aria-pressed={tipo === option.value}
                className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                  tipo === option.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="filter-categoria" className="label-field">Tipo</label>
          <select
            id="filter-categoria"
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
          <label htmlFor="filter-cidade" className="label-field">Cidade</label>
          <select
            id="filter-cidade"
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
            <label htmlFor="filter-bairro" className="label-field">Bairro</label>
            <select
              id="filter-bairro"
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

        <fieldset>
          <legend className="label-field">Faixa de Preço</legend>
          <label htmlFor="filter-preco-min" className="sr-only">Preço mínimo</label>
          <input
            id="filter-preco-min"
            type="number"
            placeholder="Mínimo (R$)"
            value={precoMinInput}
            onChange={e => onUpdatePriceMin(e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary mb-2"
          />
          <label htmlFor="filter-preco-max" className="sr-only">Preço máximo</label>
          <input
            id="filter-preco-max"
            type="number"
            placeholder="Máximo (R$)"
            value={precoMaxInput}
            onChange={e => onUpdatePriceMax(e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </fieldset>

        <fieldset>
          <legend className="label-field">Quartos</legend>
          <div className="flex gap-1" role="group">
            {BEDROOM_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => onUpdateFilter('quartos', option)}
                aria-pressed={quartos === option}
                aria-label={option ? `${option} quartos` : 'Qualquer quantidade de quartos'}
                className={`flex-1 py-2 text-[10px] font-bold transition-colors ${
                  quartos === option ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option || 'Todos'}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  )
}
