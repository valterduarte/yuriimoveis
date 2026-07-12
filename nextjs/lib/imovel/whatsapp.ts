import { formatPrice } from '../formatters'
import { SITE_URL } from '../config'
import { imovelSlug } from './slug'
import type { Imovel } from '../../types'

export type WhatsAppIntent = 'interesse' | 'simulacao'

// Pre-filled WhatsApp message for a property. Carries the price, the listing
// link and a forward-moving question so the chat doesn't open cold with
// "qual o valor?" — the lead who sends it has already accepted the price,
// and the corretor gets a concrete thread to continue (availability, visit,
// payment terms) instead of a dead-end price quote.
export function buildPropertyWhatsAppMessage(
  imovel: Imovel,
  intent: WhatsAppIntent = 'interesse',
): string {
  const url = `${SITE_URL}/imoveis/${imovelSlug(imovel)}`
  const priceLabel = imovel.preco > 0 ? ` por ${formatPrice(imovel.preco, imovel.tipo)}` : ''
  const ref = `*${imovel.titulo}*${priceLabel} (Código #${imovel.id})`

  if (intent === 'simulacao') {
    return (
      `Olá, Yuri! Quero simular o financiamento do imóvel ${ref}. ` +
      `Pode me passar as condições — valor de entrada, parcelas e prazo?\n${url}`
    )
  }

  return (
    `Olá, Yuri! Vi o imóvel ${ref} no site e tenho interesse. ` +
    `Ele ainda está disponível? Gostaria de saber as condições de pagamento e agendar uma visita.\n${url}`
  )
}
