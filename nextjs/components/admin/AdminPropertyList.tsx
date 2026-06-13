'use client'

import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi'
import { ADMIN_LIST_PAGE_SIZE } from '../../lib/constants'
import { matchesSearchQuery } from '../../lib/search'
import AdminListItem from './AdminListItem'
import type { Imovel, PropertyCategory, TransactionType } from '../../types'

interface AdminPropertyListProps {
  properties: Imovel[]
  onEdit: (id: number) => void
  onDeactivate: (id: number) => void
  onReactivate: (id: number) => void
}

type StatusFilter = 'all' | 'active' | 'inactive'

const SELECT_CLASS = 'border border-gray-300 text-xs px-3 py-2 bg-white text-dark'

export default function AdminPropertyList({ properties, onEdit, onDeactivate, onReactivate }: AdminPropertyListProps) {
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoriaFilter, setCategoriaFilter] = useState<PropertyCategory | ''>('')
  const [cidadeFilter, setCidadeFilter] = useState('')
  const [tipoFilter, setTipoFilter] = useState<TransactionType | ''>('')
  const [page, setPage] = useState(1)

  const { categorias, cidades } = useMemo(() => {
    const cats = new Set<PropertyCategory>()
    const cits = new Set<string>()
    for (const p of properties) {
      if (p.categoria) cats.add(p.categoria)
      if (p.cidade)    cits.add(p.cidade)
    }
    return {
      categorias: Array.from(cats).sort(),
      cidades:    Array.from(cits).sort(),
    }
  }, [properties])

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (statusFilter === 'active'   && !p.ativo) return false
      if (statusFilter === 'inactive' &&  p.ativo) return false
      if (categoriaFilter && p.categoria !== categoriaFilter) return false
      if (cidadeFilter    && p.cidade    !== cidadeFilter)    return false
      if (tipoFilter      && p.tipo      !== tipoFilter)      return false
      return matchesSearchQuery([p.titulo, p.bairro, p.cidade, p.id, p.categoria], search)
    })
  }, [properties, search, statusFilter, categoriaFilter, cidadeFilter, tipoFilter])

  useEffect(() => { setPage(1) }, [search, statusFilter, categoriaFilter, cidadeFilter, tipoFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ADMIN_LIST_PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const start      = (safePage - 1) * ADMIN_LIST_PAGE_SIZE
  const visible    = filtered.slice(start, start + ADMIN_LIST_PAGE_SIZE)

  const handleDeactivate = (id: number) => {
    setConfirmingId(null)
    onDeactivate(id)
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCategoriaFilter('')
    setCidadeFilter('')
    setTipoFilter('')
  }

  const hasActiveFilter = !!(search || statusFilter !== 'all' || categoriaFilter || cidadeFilter || tipoFilter)

  if (properties.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-500">
        Nenhum imóvel cadastrado.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 p-4 space-y-3">
        <div className="relative">
          <FiSearch size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, código, bairro, cidade ou categoria"
            aria-label="Buscar imóveis"
            className="w-full border border-gray-300 text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Filtrar por status" value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)} className={SELECT_CLASS}>
            <option value="all">Todos status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
          <select aria-label="Filtrar por categoria" value={categoriaFilter}
            onChange={e => setCategoriaFilter(e.target.value as PropertyCategory | '')} className={SELECT_CLASS}>
            <option value="">Todas categorias</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Filtrar por cidade" value={cidadeFilter}
            onChange={e => setCidadeFilter(e.target.value)} className={SELECT_CLASS}>
            <option value="">Todas cidades</option>
            {cidades.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Filtrar por tipo" value={tipoFilter}
            onChange={e => setTipoFilter(e.target.value as TransactionType | '')} className={SELECT_CLASS}>
            <option value="">Venda/Aluguel</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
          {hasActiveFilter && (
            <button type="button" onClick={handleClearFilters}
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-dark">
              <FiX size={12} aria-hidden="true" /> Limpar
            </button>
          )}
          <span className="ml-auto text-xs text-gray-500">
            {filtered.length} de {properties.length}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-500">
          Nenhum imóvel encontrado com esses filtros.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(property => (
            <AdminListItem
              key={property.id}
              inactive={!property.ativo}
              title={property.titulo}
              meta={
                <>
                  {property.categoria} · {property.tipo} · ID {property.id}
                  {property.bairro && <> · {property.bairro}</>}
                  {!property.ativo && <span className="ml-2 text-red-500 font-bold">· Inativo</span>}
                </>
              }
              actions={
                <>
                  {property.ativo && (
                    <button
                      onClick={() => onEdit(property.id)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-primary hover:underline"
                    >
                      <FiEdit2 size={12} aria-hidden="true" /> Editar
                    </button>
                  )}

                  {property.ativo ? (
                    confirmingId === property.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">Confirmar?</span>
                        <button
                          onClick={() => handleDeactivate(property.id)}
                          className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:underline"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:underline"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(property.id)}
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:underline"
                      >
                        <FiTrash2 size={12} aria-hidden="true" /> Desativar
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onReactivate(property.id)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-green-500 hover:underline"
                    >
                      <FiPlus size={12} aria-hidden="true" /> Reativar
                    </button>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginação" className="flex items-center justify-center gap-2 pt-2">
          <button type="button" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}
            className="text-[10px] uppercase tracking-widest font-bold text-gray-600 disabled:opacity-30 hover:text-dark px-3 py-2">
            ← Anterior
          </button>
          <span className="text-xs text-gray-500">
            Página {safePage} de {totalPages}
          </span>
          <button type="button" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}
            className="text-[10px] uppercase tracking-widest font-bold text-gray-600 disabled:opacity-30 hover:text-dark px-3 py-2">
            Próxima →
          </button>
        </nav>
      )}
    </div>
  )
}
