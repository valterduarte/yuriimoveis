'use client'

import { FiFilter } from 'react-icons/fi'
import { SORT_OPTIONS } from '../../lib/constants'

interface SortBarProps {
  total: number
  ordem: string
  activeFilterCount: number
  onToggleFilters: () => void
  onSortChange: (value: string) => void
}

export default function SortBar({ total, ordem, activeFilterCount, onToggleFilters, onSortChange }: SortBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFilters}
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
          {`${total} imóvel${total !== 1 ? 'is' : ''}`}
        </p>
      </div>
      <select
        value={ordem}
        onChange={e => onSortChange(e.target.value)}
        className="text-xs border border-gray-200 px-3 py-2 focus:outline-none focus:border-primary"
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}
