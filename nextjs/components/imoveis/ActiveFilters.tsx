'use client'

import { FiX } from 'react-icons/fi'
import { formatBRL } from '../../lib/formatters'

interface ActiveFiltersProps {
  tipo: string
  categoria: string
  cidade: string
  bairro: string
  precoMin: string
  precoMax: string
  quartos: string
  codigo: string
  onRemove: (key: string) => void
}

export default function ActiveFilters({ tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, codigo, onRemove }: ActiveFiltersProps) {
  if (!tipo && !categoria && !cidade && !bairro && !precoMin && !precoMax && !quartos && !codigo) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {codigo && (
        <FilterTag label={`Código #${codigo}`} onRemove={() => onRemove('codigo')} />
      )}
      {tipo && (
        <FilterTag label={tipo === 'venda' ? 'Venda' : 'Aluguel'} onRemove={() => onRemove('tipo')} />
      )}
      {categoria && (
        <FilterTag label={categoria} onRemove={() => onRemove('categoria')} />
      )}
      {cidade && (
        <FilterTag label={cidade} onRemove={() => onRemove('cidade')} />
      )}
      {bairro && (
        <FilterTag label={bairro} onRemove={() => onRemove('bairro')} />
      )}
      {precoMin && (
        <FilterTag label={`Mín ${formatBRL(Number(precoMin))}`} onRemove={() => onRemove('precoMin')} />
      )}
      {precoMax && (
        <FilterTag label={`Máx ${formatBRL(Number(precoMax))}`} onRemove={() => onRemove('precoMax')} />
      )}
      {quartos && (
        <FilterTag
          label={quartos === '4+' ? '4+ quartos' : `${quartos} quarto${quartos !== '1' ? 's' : ''}`}
          onRemove={() => onRemove('quartos')}
        />
      )}
    </div>
  )
}

interface FilterTagProps {
  label: string
  onRemove: () => void
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
      {label}
      <button onClick={onRemove} aria-label="Remover filtro"><FiX size={10} /></button>
    </span>
  )
}
