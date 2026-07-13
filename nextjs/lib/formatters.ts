/**
 * Locale-aware formatters and parsers used across price-bearing UI
 * (simulador, listings, admin). Kept dependency-free so they are safe
 * to call from server components.
 */

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatPrice(price: number, tipo: string): string {
  return tipo === 'aluguel' ? `${formatBRL(price)}/mês` : formatBRL(price)
}

export function formatBRLInteger(value: number): string {
  return Math.floor(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatCentsOnly(value: number): string {
  const cents = Math.round((value - Math.floor(value)) * 100)
  return cents.toString().padStart(2, '0')
}

export function formatIntBR(value: number): string {
  return value > 0 ? value.toLocaleString('pt-BR') : ''
}

export function parseDigits(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

export function parseDecimalBR(raw: string): number {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

export function formatRate(rate: number): string {
  return String(rate).replace('.', ',')
}

/** Abbreviated price for tight UI like map markers: "R$ 1,2M", "R$ 450K", "R$ 2.500/mês". */
export function formatPriceShort(preco: number, tipo: 'venda' | 'aluguel'): string {
  if (tipo === 'aluguel') {
    return `R$ ${preco.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês`
  }
  if (preco >= 1_000_000) {
    const millions = (preco / 1_000_000).toFixed(1).replace('.', ',').replace(/,0$/, '')
    return `R$ ${millions}M`
  }
  if (preco >= 1_000) {
    return `R$ ${Math.round(preco / 1_000)}K`
  }
  return `R$ ${preco}`
}

/** Area or area range with the m² unit: "64 m²" or "26,50 a 49,00 m²". */
export function formatAreaRange(min: number, max: number, decimals = 0): string {
  const fmt = (n: number) => n.toFixed(decimals).replace('.', ',')
  const range = min === max ? fmt(min) : `${fmt(min)} a ${fmt(max)}`
  return `${range} m²`
}
