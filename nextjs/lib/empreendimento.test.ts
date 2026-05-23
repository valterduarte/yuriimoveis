import { describe, it, expect } from 'vitest'
import { extractEmpreendimentoFromTitulo } from './empreendimento'

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
