import { describe, it, expect } from 'vitest'
import {
  slugify,
  imovelSlug,
  formatPrice,
  formatNeighborhoodName,
  emBairro,
  deBairro,
  sobreBairro,
  articuloBairro,
  aoBairro,
  capitalize,
  pluralizeImoveis,
  optimizeCloudinaryUrl,
  ogImageUrl,
} from './imovelUtils'

// Intl.NumberFormat in pt-BR uses a non-breaking space (U+00A0) between
// the BRL symbol and the digits. Normalising it to a regular space keeps
// the price assertions readable.
const normaliseSpaces = (s: string) => s.replace(/ /g, ' ')

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Vila Yara')).toBe('vila-yara')
    expect(slugify('Centro Comercial Jubran')).toBe('centro-comercial-jubran')
  })

  it('removes accents (NFD normalisation)', () => {
    expect(slugify('Tamboré')).toBe('tambore')
    expect(slugify('Carapicuíba')).toBe('carapicuiba')
    expect(slugify('Conceição')).toBe('conceicao')
  })

  it('strips punctuation and special characters', () => {
    expect(slugify('São Paulo, SP!')).toBe('sao-paulo-sp')
  })

  it('collapses repeated hyphens', () => {
    expect(slugify('Vila    Sul   Americana')).toBe('vila-sul-americana')
  })

  it('handles empty input', () => {
    expect(slugify('')).toBe('')
  })
})

describe('imovelSlug', () => {
  it('combines a slugified title with the id', () => {
    expect(imovelSlug({ titulo: 'Apartamento Tamboré', id: 42 })).toBe('apartamento-tambore-42')
  })
})

describe('formatPrice', () => {
  it('formats sale prices without suffix', () => {
    expect(normaliseSpaces(formatPrice(450000, 'venda'))).toBe('R$ 450.000')
  })

  it('appends /mês for rental prices', () => {
    expect(normaliseSpaces(formatPrice(2500, 'aluguel'))).toBe('R$ 2.500/mês')
  })
})

describe('formatNeighborhoodName', () => {
  it('reverses a slug back into a Title Case neighborhood name', () => {
    expect(formatNeighborhoodName('vila-yara')).toBe('Vila Yara')
    expect(formatNeighborhoodName('centro-comercial-jubran')).toBe('Centro Comercial Jubran')
  })
})

describe('gender helpers', () => {
  it('classifies masculine neighborhoods as masculine', () => {
    expect(emBairro('Tamboré')).toBe('no')
    expect(deBairro('Tamboré')).toBe('do')
    expect(sobreBairro('Tamboré')).toBe('sobre o')
    expect(articuloBairro('Tamboré')).toBe('o')
    expect(aoBairro('Tamboré')).toBe('ao')
  })

  it('classifies feminine neighborhoods (Vila X, Aldeia, etc.) as feminine', () => {
    expect(emBairro('Vila Sul Americana')).toBe('na')
    expect(deBairro('Vila Sul Americana')).toBe('da')
    expect(sobreBairro('Vila Sul Americana')).toBe('sobre a')
    expect(articuloBairro('Vila Sul Americana')).toBe('a')
    expect(aoBairro('Vila Sul Americana')).toBe('à')
  })

  it('classifies known feminine first words (Aldeia, Conceição, Bela)', () => {
    expect(emBairro('Aldeia')).toBe('na')
    expect(emBairro('Conceição')).toBe('na')
    expect(emBairro('Bela Vista')).toBe('na')
  })
})

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('na')).toBe('Na')
    expect(capitalize('osasco')).toBe('Osasco')
  })

  it('returns empty string unchanged', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('pluralizeImoveis', () => {
  it('returns singular forms for count = 1', () => {
    expect(pluralizeImoveis(1)).toEqual({ noun: 'imóvel', adjective: 'disponível' })
  })

  it('returns plural forms for count != 1', () => {
    expect(pluralizeImoveis(0)).toEqual({ noun: 'imóveis', adjective: 'disponíveis' })
    expect(pluralizeImoveis(2)).toEqual({ noun: 'imóveis', adjective: 'disponíveis' })
    expect(pluralizeImoveis(99)).toEqual({ noun: 'imóveis', adjective: 'disponíveis' })
  })
})

describe('optimizeCloudinaryUrl', () => {
  it('injects f_auto,q_auto transforms into Cloudinary URLs', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'
    expect(optimizeCloudinaryUrl(url)).toBe('https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1/sample.jpg')
  })

  it('appends w_<width> when a width is provided', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'
    expect(optimizeCloudinaryUrl(url, 600)).toBe('https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_600/v1/sample.jpg')
  })

  it('leaves non-Cloudinary URLs untouched', () => {
    const url = 'https://example.com/photo.jpg'
    expect(optimizeCloudinaryUrl(url, 600)).toBe(url)
  })

  it('handles falsy input', () => {
    expect(optimizeCloudinaryUrl('')).toBe('')
  })
})

describe('ogImageUrl', () => {
  it('produces a 1200x630 jpg variant for OG image consumers', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'
    expect(ogImageUrl(url)).toBe('https://res.cloudinary.com/demo/image/upload/f_jpg,q_80,w_1200,h_630,c_fill/v1/sample.jpg')
  })

  it('leaves non-Cloudinary URLs untouched', () => {
    expect(ogImageUrl('https://example.com/x.jpg')).toBe('https://example.com/x.jpg')
  })
})
