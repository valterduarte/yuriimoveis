import { describe, it, expect } from 'vitest'
import {
  normalizeSearchText,
  buildSearchTerms,
  matchesSearchQuery,
  filterSearchItems,
  type SearchItem,
} from './search'

describe('normalizeSearchText', () => {
  it('lowercases, strips accents and collapses whitespace', () => {
    expect(normalizeSearchText('  Tamboré   Osasco ')).toBe('tambore osasco')
    expect(normalizeSearchText('Conceição')).toBe('conceicao')
  })
})

describe('buildSearchTerms', () => {
  it('joins fields and drops empty/nullish values', () => {
    expect(buildSearchTerms([84, 'Look Condomínio', '', null, undefined, 'Rochdale']))
      .toBe('84 look condominio rochdale')
  })
})

describe('matchesSearchQuery', () => {
  const fields = [84, 'Look Condomínio Clube', 'Rochdale', 'Osasco', 'apartamento']

  it('matches by id, name, bairro and cidade', () => {
    expect(matchesSearchQuery(fields, '84')).toBe(true)
    expect(matchesSearchQuery(fields, 'look')).toBe(true)
    expect(matchesSearchQuery(fields, 'rochdale')).toBe(true)
    expect(matchesSearchQuery(fields, 'osasco')).toBe(true)
    expect(matchesSearchQuery(fields, 'apartamento')).toBe(true)
  })

  it('is accent-insensitive', () => {
    expect(matchesSearchQuery([1, 'Tamboré'], 'tambore')).toBe(true)
    expect(matchesSearchQuery([1, 'Tambore'], 'tamboré')).toBe(true)
  })

  it('matches multiple tokens in any order, across fields', () => {
    expect(matchesSearchQuery(fields, 'rochdale look')).toBe(true)
    expect(matchesSearchQuery(fields, 'look 84')).toBe(true)
    expect(matchesSearchQuery(fields, 'osasco apartamento look')).toBe(true)
  })

  it('fails when any token is absent', () => {
    expect(matchesSearchQuery(fields, 'look barueri')).toBe(false)
  })

  it('treats an empty query as a match (no filtering)', () => {
    expect(matchesSearchQuery(fields, '   ')).toBe(true)
  })
})

describe('filterSearchItems', () => {
  const items: SearchItem[] = [
    { type: 'empreendimento', label: 'Look Condomínio Clube', sublabel: '', url: '/e/look', terms: 'look condominio clube rochdale osasco' },
    { type: 'imovel', label: 'Look 2 Dorms 43m²', sublabel: '', url: '/i/84', terms: '84 look condominio clube 2 dorms rochdale osasco' },
    { type: 'imovel', label: 'Ocean Park 3 Dorms', sublabel: '', url: '/i/12', terms: '12 ocean park padroeira osasco' },
  ]

  it('returns only items matching every token', () => {
    const r = filterSearchItems(items, 'look')
    expect(r).toHaveLength(2)
    expect(r.every(i => i.terms.includes('look'))).toBe(true)
  })

  it('ranks earlier (contiguous) matches first', () => {
    // "look" is at index 0 of the empreendimento terms, index 3 of the imóvel.
    const r = filterSearchItems(items, 'look')
    expect(r[0].url).toBe('/e/look')
  })

  it('returns an empty list for an empty query', () => {
    expect(filterSearchItems(items, '')).toEqual([])
  })

  it('honours the limit', () => {
    expect(filterSearchItems(items, 'osasco', 1)).toHaveLength(1)
  })
})
