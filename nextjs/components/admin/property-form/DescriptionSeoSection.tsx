'use client'

import { card, fieldTextarea, sectionHeading } from '../ui/styles'
import type { FormState, UpdateField } from './types'

interface DescriptionSeoSectionProps {
  form: FormState
  updateField: UpdateField
}

const MIN_RECOMMENDED_LENGTH = 150

export default function DescriptionSeoSection({ form, updateField }: DescriptionSeoSectionProps) {
  const len = form.descricao_seo.length
  const showLengthHint = len > 0 && len < MIN_RECOMMENDED_LENGTH

  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-1`}>Descrição SEO</h2>
      <p className="text-xs text-gray-500 mb-3">
        Texto corrido para o Google. Sem emojis. Mencione: tipo, bairro, cidade, características principais. 150–300 palavras.
      </p>
      <div className="bg-amber-50 rounded-md border border-amber-200 px-3 py-2 mb-3 text-xs text-amber-700 leading-relaxed">
        Exemplo: &quot;Apartamento 2 dormitórios com terraço gourmet à venda no Rochdale, Osasco SP. Condomínio LOOK com piscina, academia e 392 unidades. Financiamento disponível. Atendimento com o Corretor Yuri — (11) 97256-3420.&quot;
      </div>
      <textarea
        value={form.descricao_seo}
        onChange={e => updateField('descricao_seo', e.target.value)}
        rows={6}
        placeholder="Escreva um texto corrido, sem emojis, focado em palavras-chave de busca..."
        className={fieldTextarea}
      />
      <p className="mt-1.5 text-xs text-gray-500">
        {len} caracteres {showLengthHint ? `— recomendado: mínimo ${MIN_RECOMMENDED_LENGTH}` : ''}
      </p>
    </div>
  )
}
