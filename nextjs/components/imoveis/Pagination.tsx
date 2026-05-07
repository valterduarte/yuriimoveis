'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginação dos imóveis" className="flex items-center justify-center gap-1 mt-10">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
        className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
      >
        <FiChevronLeft size={16} aria-hidden />
      </button>
      {[...Array(totalPages)].map((_, i) => {
        const pageNumber = i + 1
        const isCurrent = page === pageNumber
        return (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Página ${pageNumber}`}
            aria-current={isCurrent ? 'page' : undefined}
            className={`w-9 h-9 text-xs font-bold transition-colors ${
              isCurrent ? 'bg-primary text-white' : 'border border-gray-300 hover:border-primary hover:text-primary'
            }`}
          >
            {pageNumber}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Próxima página"
        className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
      >
        <FiChevronRight size={16} aria-hidden />
      </button>
    </nav>
  )
}
