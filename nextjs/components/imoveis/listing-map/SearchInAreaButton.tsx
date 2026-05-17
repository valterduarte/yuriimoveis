'use client'

import { FiSearch } from 'react-icons/fi'

interface SearchInAreaButtonProps {
  count: number
  onClick: () => void
}

export default function SearchInAreaButton({ count, onClick }: SearchInAreaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors"
    >
      <FiSearch size={14} className="text-primary" />
      Buscar nesta área ({count} {count === 1 ? 'imóvel' : 'imóveis'})
    </button>
  )
}
