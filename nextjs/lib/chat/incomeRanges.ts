import type { ModelMessage } from 'ai'

/**
 * Household-income ranges aligned to the 2026 Minha Casa Minha Vida bands.
 * Shared by the chat UI (renders the chips) and the chat route (recognises the
 * tap to force the property search). `label` is the chip; `message` is the text
 * sent on tap so the model knows the band and can search with the midpoint.
 *
 * Single source of truth: keep these strings here only — both client and server
 * match against them.
 */
export const INCOME_RANGES = [
  { label: 'R$ 2.850 a R$ 4.700', message: 'Minha renda familiar é de R$ 2.850 a R$ 4.700' },
  { label: 'R$ 4.700 a R$ 8.600', message: 'Minha renda familiar é de R$ 4.700 a R$ 8.600' },
  { label: 'R$ 8.600 a R$ 13.000', message: 'Minha renda familiar é de R$ 8.600 a R$ 13.000' },
  { label: 'Acima de R$ 13.000', message: 'Minha renda familiar é acima de R$ 13.000' },
] as const

/** True when a message is one of the income-range taps from perguntarRenda. */
export function isIncomeReply(text: string): boolean {
  return INCOME_RANGES.some(range => range.message === text)
}

/** Flatten a ModelMessage's content (string or parts) into plain text. */
function messageText(content: ModelMessage['content']): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map(part => (part.type === 'text' ? part.text : ''))
    .join('')
}

/**
 * Whether the upcoming step must be forced to call buscarImoveis.
 *
 * Gemini frequently narrates ("encontrei algumas opções, dá uma olhada acima")
 * or re-asks the property type instead of actually searching after the income
 * tap, so the buyer never sees any listings. We force the search on the first
 * step right after an income reply; later steps run with auto tool choice so the
 * model can present the results and push toward the visit.
 */
export function shouldForcePropertySearch(messages: ModelMessage[], stepNumber: number): boolean {
  if (stepNumber !== 0) return false
  const last = messages[messages.length - 1]
  if (!last || last.role !== 'user') return false
  return isIncomeReply(messageText(last.content))
}
