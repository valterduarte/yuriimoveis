'use client'

import { card, fieldTextarea, sectionHeading } from '../ui/styles'
import type { FormState, UpdateField } from './types'

interface DescriptionSeoSectionProps {
  form: FormState
  updateField: UpdateField
}

// The meta description shown in Google's result snippet is sliced from the
// first SNIPPET_LIMIT characters (see buildSeoDescription); the rest still
// feeds the JSON-LD description used by Google and AI engines.
const SNIPPET_LIMIT = 155

export default function DescriptionSeoSection({ form, updateField }: DescriptionSeoSectionProps) {
  const len = form.descricao_seo.length
  const overflow = Math.max(0, len - SNIPPET_LIMIT)

  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-1`}>Descrição SEO</h2>
      <p className="text-xs text-gray-500 mb-3">
        Frase de venda para o Google, sem emojis. Os primeiros ~{SNIPPET_LIMIT} caracteres viram o trecho que aparece no resultado de busca — escreva a primeira frase já completa (tipo, bairro, cidade, destaque). O texto extra reforça os dados estruturados (Google e IA). Opcional: se vazio, o site usa a Descrição com os emojis removidos.
      </p>
      <div className="bg-amber-50 rounded-md border border-amber-200 px-3 py-2 mb-3 text-xs text-amber-700 leading-relaxed">
        Exemplo de primeira frase: &quot;Apartamento 2 dormitórios com terraço gourmet à venda no Rochdale, Osasco SP — condomínio LOOK com piscina e academia, financiamento disponível.&quot;
      </div>
      <textarea
        value={form.descricao_seo}
        onChange={e => updateField('descricao_seo', e.target.value)}
        rows={6}
        placeholder="Comece com uma frase de venda completa; depois detalhe o imóvel para os dados estruturados..."
        className={fieldTextarea}
      />
      <p className="mt-1.5 text-xs text-gray-500">
        {len === 0
          ? 'Opcional — se vazio, o site usa a Descrição (sem emojis).'
          : overflow === 0
            ? `${len}/${SNIPPET_LIMIT} — cabe inteiro no trecho do Google.`
            : `${SNIPPET_LIMIT} no trecho do Google · +${overflow} reforça os dados estruturados.`}
      </p>
    </div>
  )
}
