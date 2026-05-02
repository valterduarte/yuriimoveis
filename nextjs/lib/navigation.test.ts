import { describe, it, expect } from 'vitest'
import {
  acaoToTipo,
  tipoToAcao,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  getAllCidadeSlugs,
  bairroSlugToDbName,
  bairroDbNameToSlug,
  hasRichBairroContent,
  buildHierarchicalUrl,
  inferCidadeFromBairro,
  ACAO_LABELS,
} from './navigation'
import type { BairroData } from '../types'

describe('acaoToTipo', () => {
  it('maps comprar → venda and alugar → aluguel', () => {
    expect(acaoToTipo('comprar')).toBe('venda')
    expect(acaoToTipo('alugar')).toBe('aluguel')
  })
})

describe('tipoToAcao', () => {
  it('is the inverse of acaoToTipo', () => {
    expect(tipoToAcao('venda')).toBe('comprar')
    expect(tipoToAcao('aluguel')).toBe('alugar')
  })
})

describe('isValidAcao', () => {
  it('narrows known action slugs', () => {
    expect(isValidAcao('comprar')).toBe(true)
    expect(isValidAcao('alugar')).toBe(true)
  })

  it('rejects unknown values', () => {
    expect(isValidAcao('vender')).toBe(false)
    expect(isValidAcao('')).toBe(false)
    expect(isValidAcao('COMPRAR')).toBe(false)
  })
})

describe('cidadeSlugToName', () => {
  it('returns the canonical city name for supported slugs', () => {
    expect(cidadeSlugToName('osasco')).toBe('Osasco')
    expect(cidadeSlugToName('barueri')).toBe('Barueri')
    expect(cidadeSlugToName('carapicuiba')).toBe('Carapicuíba')
  })

  it('returns undefined for unsupported slugs', () => {
    expect(cidadeSlugToName('cotia')).toBeUndefined()
    expect(cidadeSlugToName('')).toBeUndefined()
  })
})

describe('cidadeNameToSlug', () => {
  it('round-trips with cidadeSlugToName for every supported city', () => {
    for (const slug of getAllCidadeSlugs()) {
      const name = cidadeSlugToName(slug)
      expect(name).toBeDefined()
      expect(cidadeNameToSlug(name!)).toBe(slug)
    }
  })

  it('strips accents (Carapicuíba → carapicuiba)', () => {
    expect(cidadeNameToSlug('Carapicuíba')).toBe('carapicuiba')
  })
})

describe('getAllCidadeSlugs', () => {
  it('returns the full list of supported city slugs', () => {
    expect(getAllCidadeSlugs()).toEqual(expect.arrayContaining(['osasco', 'barueri', 'carapicuiba']))
  })
})

describe('bairroSlugToDbName', () => {
  it('returns the configured nome for known slugs', () => {
    // Tamboré uses dbMatch ("Tamboré"); the slug is "tambore".
    expect(bairroSlugToDbName('tambore')).toBe('Tamboré')
  })

  it('returns undefined for unknown slugs', () => {
    expect(bairroSlugToDbName('inexistente')).toBeUndefined()
  })
})

describe('bairroDbNameToSlug', () => {
  it('returns the configured slug when the db name matches a configured bairro', () => {
    expect(bairroDbNameToSlug('Tamboré')).toBe('tambore')
    expect(bairroDbNameToSlug('Vila Sul Americana')).toBe('vila-sul-americana')
  })

  it('falls back to slugifying the name when the bairro is not configured', () => {
    expect(bairroDbNameToSlug('Bairro Inventado')).toBe('bairro-inventado')
  })

  it('honours dbMatch overrides (Jd Roberto → jardim-roberto)', () => {
    expect(bairroDbNameToSlug('Jd Roberto')).toBe('jardim-roberto')
  })
})

describe('hasRichBairroContent', () => {
  it('returns true for slugs that have a configured guide', () => {
    expect(hasRichBairroContent('tambore')).toBe(true)
    expect(hasRichBairroContent('vila-sul-americana')).toBe(true)
  })

  it('returns false for slugs that are not in the data file', () => {
    expect(hasRichBairroContent('nao-existe')).toBe(false)
  })
})

describe('buildHierarchicalUrl', () => {
  it('builds the cidade-only URL', () => {
    expect(buildHierarchicalUrl({ acao: 'comprar', cidade: 'osasco' })).toBe('/comprar/osasco')
  })

  it('appends categoria when provided', () => {
    expect(buildHierarchicalUrl({ acao: 'alugar', cidade: 'barueri', categoria: 'apartamento' })).toBe('/alugar/barueri/apartamento')
  })

  it('appends bairro when provided alongside categoria', () => {
    expect(buildHierarchicalUrl({ acao: 'comprar', cidade: 'osasco', categoria: 'casa', bairro: 'jaguaribe' })).toBe('/comprar/osasco/casa/jaguaribe')
  })
})

describe('inferCidadeFromBairro', () => {
  it('returns the cidade field of the BairroData', () => {
    const bairro = {
      nome: 'Vila X',
      slug: 'vila-x',
      cidade: 'Carapicuíba',
      titulo: 'Imóveis na Vila X — Carapicuíba',
      descricaoMeta: '',
      conteudo: { sobre: '', infraestrutura: '', transporte: '', educacao: '', porqueMorar: '' },
    } as BairroData
    expect(inferCidadeFromBairro(bairro)).toBe('Carapicuíba')
  })
})

describe('ACAO_LABELS', () => {
  it('has the right preposition for each acao', () => {
    expect(ACAO_LABELS.comprar.preposicao).toBe('à Venda')
    expect(ACAO_LABELS.alugar.preposicao).toBe('para Alugar')
  })
})
