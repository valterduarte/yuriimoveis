'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
      >
        <FiChevronLeft size={16} />
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`w-9 h-9 text-xs font-bold transition-colors ${
            page === i + 1 ? 'bg-primary text-white' : 'border border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-9 h-9 border border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  )
}
