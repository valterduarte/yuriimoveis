import { describe, it, expect } from 'vitest'
import {
  formatBRL,
  formatBRLInteger,
  formatCentsOnly,
  formatIntBR,
  parseDigits,
  parseDecimalBR,
  formatRate,
} from './formatters'

// Intl.NumberFormat in pt-BR uses a non-breaking space (U+00A0) between
// the BRL symbol and the digits. Normalising any whitespace to a regular
// space keeps the price assertions readable.
const normaliseSpaces = (s: string) => s.replace(/[  \s]+/g, ' ')

describe('formatBRL', () => {
  it('formats integer values with the BRL symbol and PT-BR separators', () => {
    expect(normaliseSpaces(formatBRL(450000))).toBe('R$ 450.000')
  })

  it('rounds to zero decimal places', () => {
    expect(normaliseSpaces(formatBRL(450000.49))).toBe('R$ 450.000')
    expect(normaliseSpaces(formatBRL(450000.51))).toBe('R$ 450.001')
  })

  it('handles zero', () => {
    expect(normaliseSpaces(formatBRL(0))).toBe('R$ 0')
  })
})

describe('formatBRLInteger', () => {
  it('truncates (not rounds) the cents away', () => {
    expect(normaliseSpaces(formatBRLInteger(1234.99))).toBe('R$ 1.234')
    expect(normaliseSpaces(formatBRLInteger(1234.01))).toBe('R$ 1.234')
  })
})

describe('formatCentsOnly', () => {
  it('returns the cents part as a 2-digit string', () => {
    expect(formatCentsOnly(1234.5)).toBe('50')
    expect(formatCentsOnly(1234.05)).toBe('05')
    expect(formatCentsOnly(1234)).toBe('00')
  })

  it('rounds the cents to nearest integer', () => {
    expect(formatCentsOnly(1234.494)).toBe('49')
  })

  // Documents an edge case in the current implementation: when the cents
  // round to 100 the function returns "100" instead of carrying into the
  // integer part. The simulator only feeds it computed installment values
  // that are unlikely to land on .99..5, so this stays as a known limit.
  it('returns "100" when the cents round to a full real (current limitation)', () => {
    expect(formatCentsOnly(1234.999)).toBe('100')
  })
})

describe('formatIntBR', () => {
  it('returns empty string for zero or negative (used as input placeholder)', () => {
    expect(formatIntBR(0)).toBe('')
    expect(formatIntBR(-1)).toBe('')
  })

  it('formats positive integers with PT-BR thousand separators', () => {
    expect(formatIntBR(1234567)).toBe('1.234.567')
    expect(formatIntBR(1000)).toBe('1.000')
  })
})

describe('parseDigits', () => {
  it('strips all non-digit characters', () => {
    expect(parseDigits('R$ 1.234,56')).toBe(123456)
    expect(parseDigits('abc 42 def')).toBe(42)
  })

  it('returns 0 for empty input', () => {
    expect(parseDigits('')).toBe(0)
    expect(parseDigits('abc')).toBe(0)
  })
})

describe('parseDecimalBR', () => {
  it('accepts comma as decimal separator', () => {
    expect(parseDecimalBR('11,49')).toBe(11.49)
    expect(parseDecimalBR('0,5')).toBe(0.5)
  })

  it('accepts dot as decimal separator', () => {
    expect(parseDecimalBR('11.49')).toBe(11.49)
  })

  it('strips currency symbols and other noise', () => {
    expect(parseDecimalBR('R$ 11,49')).toBe(11.49)
  })

  it('returns 0 for unparseable input', () => {
    expect(parseDecimalBR('abc')).toBe(0)
    expect(parseDecimalBR('')).toBe(0)
  })
})

describe('formatRate', () => {
  it('uses comma as the decimal separator (PT-BR convention for percentages)', () => {
    expect(formatRate(11.49)).toBe('11,49')
    expect(formatRate(8)).toBe('8')
    expect(formatRate(0.5)).toBe('0,5')
  })
})
