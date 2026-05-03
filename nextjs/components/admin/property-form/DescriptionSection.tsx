'use client'

import type { FormState, UpdateField } from './types'

const DESCRIPTION_TEMPLATE = `🏢 NOME DO EMPREENDIMENTO – CIDADE

✨ Subtítulo chamativo!
Conforto, segurança e lazer completo para você e sua família.

▶️ Ponto de destaque 1
▶️ Ponto de destaque 2
▶️ Ponto de destaque 3

🔑 Diferenciais do empreendimento:
✔ Item 1
✔ Item 2
✔ Item 3

📐 Plantas disponíveis:
X dormitórios — XXm²
A partir de *R$ 000.000`

interface DescriptionSectionProps {
  form: FormState
  updateField: UpdateField
}

export default function DescriptionSection({ form, updateField }: DescriptionSectionProps) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Descrição</h2>
      <p className="text-[10px] text-gray-400 mb-3">Use o template abaixo como base. Pode usar emojis e formatação livre.</p>
      <div className="bg-gray-50 border border-dashed border-gray-300 p-4 mb-3 text-xs text-gray-500 font-mono leading-relaxed whitespace-pre-line">
        {DESCRIPTION_TEMPLATE}
      </div>
      <textarea value={form.descricao} onChange={e => updateField('descricao', e.target.value)} rows={14}
        placeholder="Cole o template acima e edite..."
        className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y font-mono" />
      <button type="button" onClick={() => updateField('descricao', DESCRIPTION_TEMPLATE)}
        className="mt-2 text-[10px] uppercase tracking-widest text-primary font-bold hover:underline">
        Preencher com template
      </button>
    </div>
  )
}
