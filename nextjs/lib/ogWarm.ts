import { after } from 'next/server'
import { propertyOgImageUrl, formatPrice } from '../utils/imovelUtils'

interface WarmInput {
  imagens?: string[]
  preco?: number
  tipo?: string
  bairro?: string
  cidade?: string
}

/**
 * Pre-renders and caches a property's social-share card right after a save, so
 * the branded thumbnail is already warm in the CDN before WhatsApp (or anyone)
 * scrapes the listing for the first time. Best effort: runs after the response
 * via `after()` and never throws into the request.
 */
export function warmPropertyOgCard(data: WarmInput): void {
  const rawImage = data.imagens?.[0]
  if (!rawImage) return

  const location = [data.bairro, data.cidade].filter(Boolean).join(' - ')
  const url = propertyOgImageUrl(rawImage, {
    priceLabel: data.preco && data.preco > 0 ? formatPrice(data.preco, data.tipo ?? '') : undefined,
    location: location || undefined,
  })

  after(async () => {
    try {
      await fetch(url, { headers: { 'User-Agent': 'CorretorYuri-OgWarm/1.0' } })
    } catch {
      // The card still renders on the first real request; warming is a nicety.
    }
  })
}
