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
  deriveVideoPoster,
  ogImageUrl,
  buildPropertyNarrative,
  buildPropertyWhatsAppMessage,
} from './imovelUtils'
import type { Imovel } from '../types'

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

describe('deriveVideoPoster', () => {
  it('swaps a Cloudinary video extension for a .jpg frame', () => {
    const url = 'https://res.cloudinary.com/demo/video/upload/v1/tour.mp4'
    expect(deriveVideoPoster(url)).toBe('https://res.cloudinary.com/demo/video/upload/v1/tour.jpg')
  })

  it('handles other Cloudinary video formats', () => {
    const url = 'https://res.cloudinary.com/demo/video/upload/v1/tour.mov'
    expect(deriveVideoPoster(url)).toBe('https://res.cloudinary.com/demo/video/upload/v1/tour.jpg')
  })

  it('returns empty string for non-Cloudinary URLs', () => {
    expect(deriveVideoPoster('https://example.com/tour.mp4')).toBe('')
  })

  it('returns empty string when no recognizable extension is present', () => {
    expect(deriveVideoPoster('https://res.cloudinary.com/demo/video/upload/v1/tour')).toBe('')
  })

  it('handles falsy input', () => {
    expect(deriveVideoPoster('')).toBe('')
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

describe('buildPropertyNarrative', () => {
  const baseImovel: Imovel = {
    id: 1, titulo: 'Test', descricao: '', descricao_seo: '',
    tipo: 'venda', categoria: 'apartamento', preco: 0, area: 0,
    quartos: 0, banheiros: 0, vagas: 0,
    endereco: '', bairro: '', cidade: '', cep: '',
    status: 'pronto', destaque: false, ativo: true,
    imagens: [], diferenciais: [],
    parcela_display: '', parcela_label: '',
    created_at: '', updated_at: '',
  }

  it('joins category, dorms, action and location with feminine bairro article', () => {
    const imovel = { ...baseImovel, quartos: 2, bairro: 'Vila Yara', cidade: 'Osasco' }
    const narrative = buildPropertyNarrative(imovel)
    expect(narrative).toContain('Apartamento de 2 dormitórios à venda na Vila Yara, Osasco.')
  })

  it('lists specs and diferenciais in natural Portuguese with proper conjunctions', () => {
    const imovel = {
      ...baseImovel,
      quartos: 3, area: 64, banheiros: 2, vagas: 1,
      bairro: 'Cidade de Deus', cidade: 'Osasco',
      diferenciais: ['piscina', 'academia', 'área gourmet'],
    }
    const narrative = buildPropertyNarrative(imovel)
    expect(narrative).toContain('Conta com 64 m² de área, 2 banheiros e 1 vaga de garagem.')
    expect(narrative).toContain('Entre os diferenciais do empreendimento estão piscina, academia e área gourmet.')
    expect(narrative).toContain('O imóvel está pronto para entrega imediata.')
  })
})

describe('buildPropertyWhatsAppMessage', () => {
  const baseImovel: Imovel = {
    id: 73, titulo: 'Apartamento Vila Ayrosa', descricao: '', descricao_seo: '',
    tipo: 'venda', categoria: 'apartamento', preco: 320000, area: 51,
    quartos: 3, banheiros: 1, vagas: 1,
    endereco: '', bairro: 'Vila Ayrosa', cidade: 'Osasco', cep: '',
    status: 'pronto', destaque: false, ativo: true,
    imagens: [], diferenciais: [],
    parcela_display: '', parcela_label: '',
    created_at: '', updated_at: '',
  }

  it('embeds price, code and a forward-moving question for the interest intent', () => {
    const message = normaliseSpaces(buildPropertyWhatsAppMessage(baseImovel))
    expect(message).toContain('*Apartamento Vila Ayrosa*')
    expect(message).toContain('R$ 320.000')
    expect(message).toContain('Código #73')
    expect(message).toContain('ainda está disponível')
    expect(message).toContain('agendar uma visita')
    expect(message).toContain('/imoveis/apartamento-vila-ayrosa-73')
  })

  it('asks for financing terms on the simulation intent', () => {
    const message = buildPropertyWhatsAppMessage(baseImovel, 'simulacao')
    expect(message).toContain('simular o financiamento')
    expect(message).toContain('valor de entrada, parcelas e prazo')
  })

  it('omits the price when the property has no value set', () => {
    const message = buildPropertyWhatsAppMessage({ ...baseImovel, preco: 0 })
    expect(message).not.toContain('por R$')
    expect(message).toContain('(Código #73)')
  })
})
