import { describe, it, expect } from 'vitest'
import {
  extractEmpreendimentoFromTitulo,
  buildEmpreendimentosFromRows,
  buildEmpreendimentoTitle,
  type EmpreendimentoSourceRow,
} from './empreendimento'

describe('buildEmpreendimentoTitle', () => {
  it('adds the city to a name that lacks it (the common branded-search case)', () => {
    expect(buildEmpreendimentoTitle('Ocean Park Condomínio Clube', 'Osasco', 'R$ 250.000'))
      .toBe('Ocean Park Condomínio Clube em Osasco — Apartamentos a partir de R$ 250.000')
  })

  it('does not duplicate the city when the name already carries it', () => {
    expect(buildEmpreendimentoTitle('Terra Alta Barueri', 'Barueri', 'R$ 310.000'))
      .toBe('Terra Alta Barueri — Apartamentos a partir de R$ 310.000')
  })

  it('matches the city ignoring case and accents', () => {
    // name carries "Carapicuiba" unaccented; city is the accented "Carapicuíba"
    expect(buildEmpreendimentoTitle('Residencial Carapicuiba', 'Carapicuíba', 'R$ 200.000'))
      .toBe('Residencial Carapicuiba — Apartamentos a partir de R$ 200.000')
  })
})

describe('extractEmpreendimentoFromTitulo', () => {
  it('extracts before em-dash separator', () => {
    expect(extractEmpreendimentoFromTitulo('Terra Alta Barueri — 52,90m² | 1 Suíte'))
      .toBe('Terra Alta Barueri')
  })

  it('extracts before colon separator', () => {
    expect(extractEmpreendimentoFromTitulo('Pop Granja: Seu 2 Dormitórios com Vaga'))
      .toBe('Pop Granja')
  })

  it('extracts before hyphen separator with spaces', () => {
    expect(extractEmpreendimentoFromTitulo('Azzure Resort Life - Cidade de Deus - Osasco'))
      .toBe('Azzure Resort Life')
  })

  it('extracts complex empreendimento names', () => {
    expect(extractEmpreendimentoFromTitulo('Lumini Clube Residencial 1 — 2 Dorms 44m² (Final 06 e 07) | Vila Sul Americana, Carapicuíba'))
      .toBe('Lumini Clube Residencial 1')
  })

  it('rejects generic category prefixes', () => {
    expect(extractEmpreendimentoFromTitulo('Apartamento a Venda - Azzure Resort Life - Em Frente Ao Bradesco'))
      .toBeNull()
    expect(extractEmpreendimentoFromTitulo('Casa - Bela Vista - Osasco'))
      .toBeNull()
  })

  it('returns null when no separator', () => {
    expect(extractEmpreendimentoFromTitulo('Studio compacto no centro')).toBeNull()
  })

  it('returns null for prefixes too short', () => {
    expect(extractEmpreendimentoFromTitulo('TA — 52m²')).toBeNull()
  })

  it('handles accented characters in generic detection', () => {
    expect(extractEmpreendimentoFromTitulo('Chácara - Cotia - SP')).toBeNull()
    expect(extractEmpreendimentoFromTitulo('Imóvel comercial - Centro de Osasco')).toBeNull()
  })
})

function row(overrides: Partial<EmpreendimentoSourceRow> & Pick<EmpreendimentoSourceRow, 'id' | 'titulo'>): EmpreendimentoSourceRow {
  return {
    endereco: 'Rua X, 1',
    bairro: 'Centro',
    cidade: 'Osasco',
    preco: 300_000,
    area: 50,
    status: 'planta',
    imagens: '["a.jpg"]',
    ...overrides,
  }
}

describe('buildEmpreendimentosFromRows', () => {
  it('splits two empreendimentos sharing the same address by extracted name', () => {
    const result = buildEmpreendimentosFromRows([
      row({ id: 18, titulo: 'POP Osasco — Studio 24m² | Metalúrgicos, Osasco', endereco: 'Av. Sarah, 1', area: 24, preco: 224_000 }),
      row({ id: 19, titulo: 'POP Osasco — 2 Dorms 34m² | Metalúrgicos, Osasco', endereco: 'Av. Sarah, 1', area: 34, preco: 280_000 }),
      row({ id: 50, titulo: 'PIN Osasco Residencial Clube — 2 Dorms 36m² | Metalúrgicos, Osasco', endereco: 'Av. Sarah, 1', area: 36, preco: 310_000 }),
    ])

    expect(result).toHaveLength(2)
    const pop = result.find(e => e.slug === 'pop-osasco')
    const pin = result.find(e => e.slug === 'pin-osasco-residencial-clube')
    expect(pop?.totalUnidades).toBe(2)
    expect(pop?.imovelIds).toEqual([18, 19])
    expect(pin?.totalUnidades).toBe(1)
    expect(pin?.imovelIds).toEqual([50])
  })

  it('groups multiple title variants with the same extracted name into one empreendimento', () => {
    const result = buildEmpreendimentosFromRows([
      row({ id: 101, titulo: 'Pop Granja — 1 Dorm 24m² sem Vaga | Jardim Ana Estela, Carapicuíba', endereco: 'Estrada da Fazendinha, 2158', area: 24, preco: 171_000 }),
      row({ id: 102, titulo: 'Pop Granja: Seu Apartamento de 2 Dormitórios na Região da Granja Viana', endereco: 'Estrada da Fazendinha, 2158', area: 34, preco: 220_000 }),
      row({ id: 103, titulo: 'Pop Granja - 2 Dorms 36m² com Vaga | Jardim Ana Estela, Carapicuíba', endereco: 'Estrada da Fazendinha, 2158', area: 36, preco: 245_000 }),
    ])

    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('pop-granja')
    expect(result[0].totalUnidades).toBe(3)
    expect(result[0].precoMin).toBe(171_000)
    expect(result[0].precoMax).toBe(245_000)
    expect(result[0].areaMin).toBe(24)
    expect(result[0].areaMax).toBe(36)
  })

  it('skips rows whose title has no extractable empreendimento name', () => {
    const result = buildEmpreendimentosFromRows([
      row({ id: 1, titulo: 'Apartamento a venda em Osasco' }),
      row({ id: 2, titulo: 'Boreal — 2 Dorms', endereco: 'Av. Y, 2' }),
    ])
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('boreal')
  })

  it('picks heroImage from the smallest-area listing', () => {
    const result = buildEmpreendimentosFromRows([
      row({ id: 2, titulo: 'Boreal — 2 Dorms', area: 60, imagens: '["big.jpg"]' }),
      row({ id: 1, titulo: 'Boreal — Studio', area: 25, imagens: '["small.jpg"]' }),
    ])
    expect(result[0].heroImage).toBe('small.jpg')
  })

  it('resolves status by priority (planta > construcao > pronto) on ties', () => {
    const result = buildEmpreendimentosFromRows([
      row({ id: 1, titulo: 'Boreal — A', status: 'pronto' }),
      row({ id: 2, titulo: 'Boreal — B', status: 'planta' }),
    ])
    expect(result[0].status).toBe('planta')
  })
})
