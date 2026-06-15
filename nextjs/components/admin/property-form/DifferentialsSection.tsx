'use client'

import { card, fieldTextarea, sectionHeading } from '../ui/styles'
import type { FormState, UpdateField } from './types'

interface DifferentialsSectionProps {
  form: FormState
  updateField: UpdateField
}

export default function DifferentialsSection({ form, updateField }: DifferentialsSectionProps) {
  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-1`}>Diferenciais</h2>
      <p className="text-xs text-gray-500 mb-3">Um item por linha. Ex: Piscina aquecida</p>
      <textarea value={form.diferenciais} onChange={e => updateField('diferenciais', e.target.value)} rows={5}
        placeholder={'Piscina aquecida\nPortaria 24h\nAcademia'}
        className={fieldTextarea} />
    </div>
  )
}
