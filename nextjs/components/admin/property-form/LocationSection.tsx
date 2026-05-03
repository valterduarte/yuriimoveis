'use client'

import dynamic from 'next/dynamic'
import type { FormState, UpdateField } from './types'

const AdminLocationPicker = dynamic(() => import('../AdminLocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs uppercase tracking-widest">
      Carregando mapa…
    </div>
  ),
})

interface LocationSectionProps {
  form: FormState
  updateField: UpdateField
  onCoordsChange: (coords: { lat: number; lng: number }) => void
  onClearCoords: () => void
}

const inputClass = 'w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary'
const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5'

const MAP_HEIGHT_PX = 320

export default function LocationSection({ form, updateField, onCoordsChange, onClearCoords }: LocationSectionProps) {
  const pickerValue = form.lat && form.lng
    ? { lat: Number(form.lat), lng: Number(form.lng) }
    : null

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-5">Localização</h2>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Endereço</label>
          <input value={form.endereco} onChange={e => updateField('endereco', e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bairro</label>
            <input value={form.bairro} onChange={e => updateField('bairro', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cidade</label>
            <input value={form.cidade} onChange={e => updateField('cidade', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-baseline justify-between mb-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Posição no mapa
            </label>
            <p className="text-[10px] text-gray-400">
              Clique no mapa pra fixar o pino. Arraste pra ajustar.
            </p>
          </div>
          <div className="border border-gray-200" style={{ height: MAP_HEIGHT_PX }}>
            <AdminLocationPicker
              value={pickerValue}
              bairro={form.bairro}
              cidade={form.cidade}
              onChange={onCoordsChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className={labelClass}>Latitude</label>
              <input
                value={form.lat}
                onChange={e => updateField('lat', e.target.value)}
                inputMode="decimal"
                placeholder="-23.5329"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                value={form.lng}
                onChange={e => updateField('lng', e.target.value)}
                inputMode="decimal"
                placeholder="-46.7917"
                className={inputClass}
              />
            </div>
          </div>
          {form.lat && form.lng && (
            <button
              type="button"
              onClick={onClearCoords}
              className="mt-2 text-[10px] uppercase tracking-widest text-gray-500 hover:text-primary font-bold"
            >
              Limpar coordenadas (volta ao centroide do bairro)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
