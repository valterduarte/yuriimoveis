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
