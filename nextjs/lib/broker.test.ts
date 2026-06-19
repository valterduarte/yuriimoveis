import { describe, it, expect } from 'vitest'
import { brokerInitials, formatRating, reviewCountLabel, resolveRating } from './broker'

describe('brokerInitials', () => {
  it('takes first and last initial of a full name', () => {
    expect(brokerInitials('Yuri Duarte')).toBe('YD')
  })

  it('uses the first and last word when there are middle names', () => {
    expect(brokerInitials('Yuri da Silva Duarte')).toBe('YD')
  })

  it('returns the first two letters of a single name', () => {
    expect(brokerInitials('Yuri')).toBe('YU')
  })

  it('collapses extra whitespace', () => {
    expect(brokerInitials('  Yuri   Duarte  ')).toBe('YD')
  })

  it('falls back to a placeholder for an empty name', () => {
    expect(brokerInitials('')).toBe('?')
    expect(brokerInitials('   ')).toBe('?')
  })
})

describe('formatRating', () => {
  it('formats with one decimal and a comma separator', () => {
    expect(formatRating(4.9)).toBe('4,9')
  })

  it('keeps a trailing zero', () => {
    expect(formatRating(5)).toBe('5,0')
  })
})

describe('reviewCountLabel', () => {
  it('uses the singular for a single review', () => {
    expect(reviewCountLabel(1)).toBe('1 avaliação')
  })

  it('uses the plural for multiple reviews', () => {
    expect(reviewCountLabel(38)).toBe('38 avaliações')
  })
})

describe('resolveRating', () => {
  it('returns the pair when rating and a positive count are present', () => {
    expect(resolveRating(4.9, 38)).toEqual({ rating: 4.9, reviewCount: 38 })
  })

  it('returns null when rating is missing', () => {
    expect(resolveRating(null, 38)).toBeNull()
  })

  it('returns null when there are no reviews', () => {
    expect(resolveRating(4.9, 0)).toBeNull()
    expect(resolveRating(4.9, null)).toBeNull()
  })
})
