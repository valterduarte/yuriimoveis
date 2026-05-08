'use client'

import { useState } from 'react'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import AdminListItem from './AdminListItem'
import type { Imovel } from '../../types'

interface AdminPropertyListProps {
  properties: Imovel[]
  onEdit: (id: number) => void
  onDeactivate: (id: number) => void
  onReactivate: (id: number) => void
}

export default function AdminPropertyList({ properties, onEdit, onDeactivate, onReactivate }: AdminPropertyListProps) {
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  const handleDeactivate = (id: number) => {
    setConfirmingId(null)
    onDeactivate(id)
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-8 text-center text-sm text-gray-400">
        Nenhum imóvel cadastrado.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {properties.map(property => (
        <AdminListItem
          key={property.id}
          inactive={!property.ativo}
          title={property.titulo}
          meta={
            <>
              {property.categoria} · {property.tipo} · ID {property.id}
              {!property.ativo && <span className="ml-2 text-red-400 font-bold">· Inativo</span>}
            </>
          }
          actions={
            <>
              {property.ativo && (
                <button
                  onClick={() => onEdit(property.id)}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-primary hover:underline"
                >
                  <FiEdit2 size={12} /> Editar
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
                      className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:underline"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(property.id)}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:underline"
                  >
                    <FiTrash2 size={12} /> Desativar
                  </button>
                )
              ) : (
                <button
                  onClick={() => onReactivate(property.id)}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-green-500 hover:underline"
                >
                  <FiPlus size={12} /> Reativar
                </button>
              )}
            </>
          }
        />
      ))}
    </div>
  )
}
