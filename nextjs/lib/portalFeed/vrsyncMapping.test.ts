import { describe, it, expect } from 'vitest'
import { mapCategoria, mapTransactionType, mapFeatures } from './vrsyncMapping'

describe('mapCategoria', () => {
  it('maps casa to Residential / Home with LivingArea', () => {
    expect(mapCategoria('casa')).toEqual({
      propertyType: 'Residential / Home',
      usageType: 'Residential',
      areaField: 'LivingArea',
    })
  })

  it('maps apartamento to Residential / Apartment', () => {
    expect(mapCategoria('apartamento').propertyType).toBe('Residential / Apartment')
  })

  it('maps terreno to Land Lot using LotArea', () => {
    expect(mapCategoria('terreno')).toEqual({
      propertyType: 'Residential / Land Lot',
      usageType: 'Residential',
      areaField: 'LotArea',
    })
  })

  it('maps chacara to Farm Ranch using LotArea', () => {
    expect(mapCategoria('chacara')).toEqual({
      propertyType: 'Residential / Farm Ranch',
      usageType: 'Residential',
      areaField: 'LotArea',
    })
  })

  it('maps comercial to Commercial usage', () => {
    expect(mapCategoria('comercial').usageType).toBe('Commercial')
  })

  it('maps chale to a residential home', () => {
    expect(mapCategoria('chale').usageType).toBe('Residential')
  })
})

describe('mapTransactionType', () => {
  it('maps venda to For Sale', () => {
    expect(mapTransactionType('venda')).toBe('For Sale')
  })
  it('maps aluguel to For Rent', () => {
    expect(mapTransactionType('aluguel')).toBe('For Rent')
  })
})

describe('mapFeatures', () => {
  it('keeps recognized features and drops unknown', () => {
    expect(mapFeatures(['Piscina', 'Academia', 'Alienígenas'])).toEqual(['Pool', 'Gym'])
  })

  it('is accent- and case-insensitive', () => {
    expect(mapFeatures(['PISCINA', 'Ar Condicionado'])).toEqual(['Pool', 'Air conditioning'])
  })

  it('dedupes repeated mappings', () => {
    expect(mapFeatures(['Piscina', 'piscina'])).toEqual(['Pool'])
  })

  it('returns an empty array when nothing is recognized', () => {
    expect(mapFeatures(['Vista para o mar'])).toEqual([])
  })
})
