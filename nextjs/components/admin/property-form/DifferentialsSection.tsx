'use client'

import type { FormState, UpdateField } from './types'

interface DifferentialsSectionProps {
  form: FormState
  updateField: UpdateField
}

export default function DifferentialsSection({ form, updateField }: DifferentialsSectionProps) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Diferenciais</h2>
      <p className="text-[10px] text-gray-400 mb-3">Um item por linha. Ex: Piscina aquecida</p>
      <textarea value={form.diferenciais} onChange={e => updateField('diferenciais', e.target.value)} rows={5}
        placeholder={'Piscina aquecida\nPortaria 24h\nAcademia'}
        className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y" />
    </div>
  )
}
