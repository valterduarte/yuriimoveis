'use client'

import { FiCheck, FiPlus } from 'react-icons/fi'
import {
  COMPARE_MAX_ITEMS,
  buildCompareItem,
  toggleCompareItem,
  useCompareItems,
  type CompareItem,
} from '../../lib/compareStore'
import type { Imovel } from '../../types'

interface CompareToggleButtonProps {
  imovel: Imovel
  slug: string
}

export default function CompareToggleButton({ imovel, slug }: CompareToggleButtonProps) {
  const items = useCompareItems()
  const isSelected = items.some((item: CompareItem) => item.id === imovel.id)
  const isFull = items.length >= COMPARE_MAX_ITEMS && !isSelected

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFull) return
    toggleCompareItem(buildCompareItem(imovel, slug))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isFull}
      aria-pressed={isSelected}
      aria-label={isSelected ? 'Remover do comparador' : 'Adicionar ao comparador'}
      title={
        isFull
          ? `Limite de ${COMPARE_MAX_ITEMS} imóveis no comparador`
          : isSelected
            ? 'Remover do comparador'
            : 'Comparar este imóvel'
      }
      className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
        isSelected
          ? 'bg-primary text-white'
          : 'bg-white/95 text-dark hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
    >
      {isSelected ? <FiCheck size={12} /> : <FiPlus size={12} />}
      {isSelected ? 'Comparando' : 'Comparar'}
    </button>
  )
}
