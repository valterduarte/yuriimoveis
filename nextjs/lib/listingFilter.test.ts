import { describe, it, expect } from 'vitest'
import {
  resolveListingFilter,
  filterToFetchOptions,
  filterLabel,
} from './listingFilter'

describe('resolveListingFilter', () => {
  it('resolves a bedroom slug', () => {
    const r = resolveListingFilter('2-quartos', 'venda')
    expect(r?.kind).toBe('bedroom')
    if (r?.kind !== 'bedroom') return
    expect(r.bedroom.value).toBe(2)
  })

  it('resolves an amenity slug', () => {
    const r = resolveListingFilter('com-piscina', 'venda')
    expect(r?.kind).toBe('amenity')
  })

  it('returns null for an unknown slug', () => {
    expect(resolveListingFilter('does-not-exist', 'venda')).toBeNull()
  })
})

describe('filterToFetchOptions', () => {
  it('serialises bedroom value to quartos string', () => {
    const r = resolveListingFilter('2-quartos', 'venda')
    expect(r).not.toBeNull()
    if (!r) return
    expect(filterToFetchOptions(r)).toEqual({ quartos: '2' })
  })

  it('serialises amenity matchTerms joined by pipe', () => {
    const r = resolveListingFilter('com-piscina', 'venda')
    expect(r).not.toBeNull()
    if (!r) return
    expect(filterToFetchOptions(r).amenity).toContain('piscina')
  })
})

describe('filterLabel', () => {
  it('builds bedroom fragment with "com" connector', () => {
    const r = resolveListingFilter('2-quartos', 'venda')
    expect(r).not.toBeNull()
    if (!r) return
    const l = filterLabel(r)
    expect(l.connector).toBe('com ')
    expect(l.fragment.startsWith('com ')).toBe(true)
  })

  it('builds amenity fragment without connector', () => {
    const r = resolveListingFilter('com-piscina', 'venda')
    expect(r).not.toBeNull()
    if (!r) return
    expect(filterLabel(r).connector).toBe('')
  })
})
