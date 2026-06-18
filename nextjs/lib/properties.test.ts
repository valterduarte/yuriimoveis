import { describe, it, expect } from 'vitest'
import { parseImovel } from './properties'
import type { ImovelRow } from '../types'

function row(overrides: Partial<ImovelRow> = {}): ImovelRow {
  return {
    id: 1,
    titulo: 'Apartamento Exemplo',
    descricao: '',
    descricao_seo: '',
    tipo: 'venda',
    categoria: 'apartamento',
    preco: 250000,
    area: 50,
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    endereco: 'Rua A, 100',
    bairro: 'Centro',
    cidade: 'Osasco',
    cep: '06000-000',
    status: 'pronto',
    destaque: false,
    ativo: true,
    imagens: '[]',
    diferenciais: '[]',
    parcela_display: '',
    parcela_label: '',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    torre: 'Torre A',
    numero_apartamento: '142',
    ...overrides,
  }
}

describe('parseImovel', () => {
  it('never exposes the admin-only unit fields in the public shape', () => {
    const imovel = parseImovel(row())
    // These are sensitive (the broker's internal unit reference) and must never
    // reach a public response or the page's hydration data.
    expect('torre' in imovel).toBe(false)
    expect('numero_apartamento' in imovel).toBe(false)
  })

  it('strips the unit fields even when the row carries no values', () => {
    const imovel = parseImovel(row({ torre: null, numero_apartamento: null }))
    expect('torre' in imovel).toBe(false)
    expect('numero_apartamento' in imovel).toBe(false)
  })

  it('still parses the public fields, coercing numerics and JSON columns', () => {
    const imovel = parseImovel(row({ preco: 300000, imagens: '["a.jpg","b.jpg"]', diferenciais: '["Piscina"]' }))
    expect(imovel.preco).toBe(300000)
    expect(imovel.imagens).toEqual(['a.jpg', 'b.jpg'])
    expect(imovel.diferenciais).toEqual(['Piscina'])
    expect(imovel.bairro).toBe('Centro')
  })
})
