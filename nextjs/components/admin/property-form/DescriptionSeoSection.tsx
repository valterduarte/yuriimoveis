'use client'

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
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Descrição SEO</h2>
      <p className="text-[10px] text-gray-400 mb-3">
        Texto corrido para o Google. Sem emojis. Mencione: tipo, bairro, cidade, características principais. 150–300 palavras.
      </p>
      <div className="bg-amber-50 border border-amber-200 px-3 py-2 mb-3 text-[10px] text-amber-700 leading-relaxed">
        Exemplo: &quot;Apartamento 2 dormitórios com terraço gourmet à venda no Rochdale, Osasco SP. Condomínio LOOK com piscina, academia e 392 unidades. Financiamento disponível. Atendimento com o Corretor Yuri — (11) 97256-3420.&quot;
      </div>
      <textarea
        value={form.descricao_seo}
        onChange={e => updateField('descricao_seo', e.target.value)}
        rows={6}
        placeholder="Escreva um texto corrido, sem emojis, focado em palavras-chave de busca..."
        className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-y"
      />
      <p className="mt-1.5 text-[10px] text-gray-400">
        {len} caracteres {showLengthHint ? `— recomendado: mínimo ${MIN_RECOMMENDED_LENGTH}` : ''}
      </p>
    </div>
  )
}
