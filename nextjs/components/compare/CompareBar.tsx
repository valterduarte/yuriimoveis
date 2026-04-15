'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { clearCompare, removeCompareItem, useCompareItems } from '../../lib/compareStore'

export default function CompareBar() {
  const items = useCompareItems()
  const pathname = usePathname()

  if (items.length === 0) return null
  if (pathname === '/comparar') return null

  return (
    <div className="fixed bottom-16 md:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="container mx-auto pointer-events-auto">
        <div className="bg-dark text-white shadow-2xl border border-white/10 px-4 py-3 flex items-center gap-3 max-w-3xl mx-auto">
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            {items.map((item) => (
              <div key={item.id} className="relative w-12 h-12 bg-gray-800 overflow-hidden">
                {item.imagem && (
                  <img
                    src={item.imagem}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeCompareItem(item.id)}
                  aria-label={`Remover ${item.titulo} do comparador`}
                  className="absolute top-0 right-0 bg-black/70 hover:bg-primary p-0.5 transition-colors"
                >
                  <FiX size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-tight">
              {items.length} {items.length === 1 ? 'imóvel selecionado' : 'imóveis selecionados'}
            </p>
            <button
              type="button"
              onClick={clearCompare}
              className="text-[11px] text-white/60 hover:text-white underline"
            >
              limpar tudo
            </button>
          </div>

          <Link
            href="/comparar"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0"
          >
            Comparar
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
