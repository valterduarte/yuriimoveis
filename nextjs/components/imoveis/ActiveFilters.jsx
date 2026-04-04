'use client'

import { FiX } from 'react-icons/fi'

export default function ActiveFilters({ tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, onRemove }) {
  if (!tipo && !categoria && !cidade && !bairro && !precoMin && !precoMax && !quartos) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
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
        <FilterTag label={`Mín R$ ${Number(precoMin).toLocaleString('pt-BR')}`} onRemove={() => onRemove('precoMin')} />
      )}
      {precoMax && (
        <FilterTag label={`Máx R$ ${Number(precoMax).toLocaleString('pt-BR')}`} onRemove={() => onRemove('precoMax')} />
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

function FilterTag({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
      {label}
      <button onClick={onRemove} aria-label="Remover filtro"><FiX size={10} /></button>
    </span>
  )
}
