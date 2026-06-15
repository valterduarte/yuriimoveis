'use client'

import dynamic from 'next/dynamic'
import { useEffect, useId, useState } from 'react'
import { apiClient, isAuthError } from '../../../lib/apiClient'
import { API_URL } from '../../../lib/config'
import { card, fieldInput, fieldLabel, fieldHint, sectionHeading } from '../ui/styles'
import type { FormState, UpdateField } from './types'

const AdminLocationPicker = dynamic(() => import('../AdminLocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs uppercase tracking-widest">
      Carregando mapa…
    </div>
  ),
})

interface LocationSectionProps {
  form: FormState
  updateField: UpdateField
  onCoordsChange: (coords: { lat: number; lng: number }) => void
  onClearCoords: () => void
  authHeader: () => Record<string, string>
  onAuthError: () => void
}

const MAP_HEIGHT_PX = 320

export default function LocationSection({ form, updateField, onCoordsChange, onClearCoords, authHeader, onAuthError }: LocationSectionProps) {
  const pickerValue = form.lat && form.lng
    ? { lat: Number(form.lat), lng: Number(form.lng) }
    : null

  const bairrosListId = useId()
  const cidadesListId = useId()
  const [bairros, setBairros] = useState<string[]>([])
  const [cidades, setCidades] = useState<string[]>([])

  useEffect(() => {
    apiClient
      .get<{ bairros: string[]; cidades: string[] }>(`${API_URL}/api/admin/bairros`, { headers: authHeader() })
      .then(data => {
        setBairros(data.bairros)
        setCidades(data.cidades)
      })
      .catch(err => {
        if (isAuthError(err)) onAuthError()
      })
  }, [authHeader, onAuthError])

  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-5`}>Localização</h2>
      <div className="space-y-4">
        <div>
          <label className={fieldLabel}>Endereço</label>
          <input value={form.endereco} onChange={e => updateField('endereco', e.target.value)} className={fieldInput} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={fieldLabel}>Bairro</label>
            <input
              list={bairrosListId}
              value={form.bairro}
              onChange={e => updateField('bairro', e.target.value)}
              className={fieldInput}
              autoComplete="off"
            />
            <datalist id={bairrosListId}>
              {bairros.map(b => <option key={b} value={b} />)}
            </datalist>
            <p className={fieldHint}>Selecione um existente ou digite um novo. A capitalização é normalizada ao salvar.</p>
          </div>
          <div>
            <label className={fieldLabel}>Cidade</label>
            <input
              list={cidadesListId}
              value={form.cidade}
              onChange={e => updateField('cidade', e.target.value)}
              className={fieldInput}
              autoComplete="off"
            />
            <datalist id={cidadesListId}>
              {cidades.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-baseline justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700">
              Posição no mapa
            </label>
            <p className="text-xs text-gray-500">
              Clique no mapa pra fixar o pino. Arraste pra ajustar.
            </p>
          </div>
          <div className="rounded-md overflow-hidden border border-gray-300" style={{ height: MAP_HEIGHT_PX }}>
            <AdminLocationPicker
              value={pickerValue}
              bairro={form.bairro}
              cidade={form.cidade}
              onChange={onCoordsChange}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className={fieldLabel}>Latitude</label>
              <input
                value={form.lat}
                onChange={e => updateField('lat', e.target.value)}
                inputMode="decimal"
                placeholder="-23.5329"
                className={fieldInput}
              />
            </div>
            <div>
              <label className={fieldLabel}>Longitude</label>
              <input
                value={form.lng}
                onChange={e => updateField('lng', e.target.value)}
                inputMode="decimal"
                placeholder="-46.7917"
                className={fieldInput}
              />
            </div>
          </div>
          {form.lat && form.lng && (
            <button
              type="button"
              onClick={onClearCoords}
              className="mt-2 text-xs uppercase tracking-wide text-gray-500 hover:text-primary font-bold"
            >
              Limpar coordenadas (volta ao centroide do bairro)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
