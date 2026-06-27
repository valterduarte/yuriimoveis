import { describe, it, expect } from 'vitest'
import type { ModelMessage } from 'ai'
import { INCOME_RANGES, isIncomeReply, shouldForcePropertySearch } from './incomeRanges'

describe('isIncomeReply', () => {
  it('matches every income-range tap message', () => {
    for (const range of INCOME_RANGES) {
      expect(isIncomeReply(range.message)).toBe(true)
    }
  })

  it('ignores ordinary messages', () => {
    expect(isIncomeReply('osasco')).toBe(false)
    expect(isIncomeReply('Quero comprar')).toBe(false)
    expect(isIncomeReply('')).toBe(false)
  })
})

describe('shouldForcePropertySearch', () => {
  const incomeMessage = INCOME_RANGES[1].message

  it('forces the search on step 0 right after an income tap (string content)', () => {
    const messages: ModelMessage[] = [
      { role: 'user', content: 'Quero comprar' },
      { role: 'user', content: incomeMessage },
    ]
    expect(shouldForcePropertySearch(messages, 0)).toBe(true)
  })

  it('forces the search when the user content is a text-part array', () => {
    const messages: ModelMessage[] = [
      { role: 'user', content: [{ type: 'text', text: incomeMessage }] },
    ]
    expect(shouldForcePropertySearch(messages, 0)).toBe(true)
  })

  it('does not force on later steps (search already ran)', () => {
    const messages: ModelMessage[] = [{ role: 'user', content: incomeMessage }]
    expect(shouldForcePropertySearch(messages, 1)).toBe(false)
  })

  it('does not force when the last message is not an income tap', () => {
    const messages: ModelMessage[] = [{ role: 'user', content: 'osasco' }]
    expect(shouldForcePropertySearch(messages, 0)).toBe(false)
  })

  it('does not force when the last message is from the assistant', () => {
    const messages: ModelMessage[] = [
      { role: 'user', content: incomeMessage },
      { role: 'assistant', content: 'Buscando...' },
    ]
    expect(shouldForcePropertySearch(messages, 0)).toBe(false)
  })

  it('handles an empty history safely', () => {
    expect(shouldForcePropertySearch([], 0)).toBe(false)
  })
})
