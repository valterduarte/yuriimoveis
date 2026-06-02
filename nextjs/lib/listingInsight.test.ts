import { describe, it, expect } from 'vitest'
import { buildListingInsight, type ListingFacts, type ListingInsight } from './listingInsight'

const make = (preco: number, area: number, bairro: string): ListingFacts => ({ preco, area, bairro })

function assertInsight(value: ListingInsight | null): ListingInsight {
  if (!value) throw new Error('expected a non-null insight')
  return value
}

/** Normalises non-breaking spaces (pt-BR currency uses them) for substring matching. */
const norm = (s: string): string => s.replace(/\s/g, ' ')

describe('buildListingInsight', () => {
  it('returns null when the sample is too small to be meaningful', () => {
    expect(buildListingInsight([make(300000, 50, 'Centro')], { locationName: 'Osasco', total: 1, subject: 'apartamentos' })).toBeNull()
    expect(buildListingInsight([], { locationName: 'Osasco', total: 0, subject: 'apartamentos' })).toBeNull()
  })

  it('quotes a real price and area range when the sample covers all results', () => {
    const imoveis = [
      make(280000, 45, 'Rochdale'),
      make(350000, 52, 'Rochdale'),
      make(420000, 60, 'Centro'),
    ]
    const insight = assertInsight(buildListingInsight(imoveis, { locationName: 'Osasco', total: 3, subject: 'apartamentos de 2 quartos' }))
    expect(insight).not.toBeNull()
    expect(insight.priceFrom).toBe(280000)
    expect(insight.priceTo).toBe(420000)
    expect(norm(insight.paragraph)).toContain('3 apartamentos de 2 quartos à venda em Osasco')
    expect(norm(insight.paragraph)).toContain('de R$ 280.000 a R$ 420.000')
    expect(norm(insight.paragraph)).toContain('metragens de 45 m² a 60 m²')
  })

  it('frames price as "a partir de" when the sample does not cover every result', () => {
    const imoveis = [make(300000, 50, 'Centro'), make(400000, 55, 'Centro'), make(500000, 60, 'Centro')]
    const insight = assertInsight(buildListingInsight(imoveis, { locationName: 'Osasco', total: 40, subject: 'apartamentos' }))
    expect(norm(insight.paragraph)).toContain('a partir de R$ 300.000')
    expect(norm(insight.paragraph)).not.toContain(' a R$ 500.000')
  })

  it('surfaces the most frequent neighbourhoods', () => {
    const imoveis = [
      make(300000, 50, 'Rochdale'),
      make(310000, 51, 'Rochdale'),
      make(320000, 52, 'Jaguaribe'),
      make(330000, 53, 'Centro'),
      make(340000, 54, 'Bela Vista'),
    ]
    const insight = assertInsight(buildListingInsight(imoveis, { locationName: 'Osasco', total: 5, subject: 'apartamentos' }))
    expect(insight.topBairros[0]).toBe('Rochdale')
    expect(insight.topBairros).toHaveLength(3)
    expect(norm(insight.paragraph)).toContain('Rochdale')
  })

  it('counts MCMV-eligible units and pluralises correctly', () => {
    const imoveis = [make(300000, 50, 'Centro'), make(450000, 55, 'Centro'), make(900000, 120, 'Centro')]
    const insight = assertInsight(buildListingInsight(imoveis, { locationName: 'Osasco', total: 3, subject: 'apartamentos' }))
    expect(insight.mcmvCount).toBe(2)
    expect(norm(insight.paragraph)).toContain('2 unidades a partir de R$ 300.000 podem se enquadrar no Minha Casa Minha Vida')
  })

  it('omits the neighbourhood sentence when includeBairros is false', () => {
    const imoveis = [make(300000, 50, 'Rochdale'), make(310000, 51, 'Rochdale'), make(320000, 52, 'Rochdale')]
    const insight = assertInsight(buildListingInsight(imoveis, { locationName: 'Rochdale', total: 3, subject: 'apartamentos', includeBairros: false }))
    expect(norm(insight.paragraph)).toContain('à venda em Rochdale')
    expect(insight.paragraph).not.toContain('se concentram')
  })

  it('omits the MCMV sentence when no unit fits the cap', () => {
    const imoveis = [make(700000, 90, 'Tamboré'), make(850000, 110, 'Tamboré'), make(1200000, 140, 'Tamboré')]
    const insight = assertInsight(buildListingInsight(imoveis, { locationName: 'Barueri', total: 3, subject: 'apartamentos de alto padrão' }))
    expect(insight.mcmvCount).toBe(0)
    expect(norm(insight.paragraph)).not.toContain('Minha Casa Minha Vida')
  })
})
