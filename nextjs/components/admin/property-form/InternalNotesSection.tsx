'use client'

import { card, fieldTextarea, fieldHint, sectionHeading } from '../ui/styles'
import type { FormState, UpdateField } from './types'

interface InternalNotesSectionProps {
  form: FormState
  updateField: UpdateField
}

export default function InternalNotesSection({ form, updateField }: InternalNotesSectionProps) {
  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-1`}>Observações internas</h2>
      <p className="text-xs text-gray-500 mb-3">
        Anotações privadas suas — onde está a chave, contato do porteiro, detalhes pra agendar visita, etc.
        Não aparece no site, nos buscadores nem em nenhuma página pública.
      </p>
      <textarea
        value={form.observacoes}
        onChange={e => updateField('observacoes', e.target.value)}
        rows={5}
        placeholder="Ex.: Chave está com o porteiro do prédio. Agendar visita pela manhã com o proprietário."
        className={fieldTextarea}
      />
      <p className={fieldHint}>Visível apenas pra você no painel administrativo.</p>
    </div>
  )
}
