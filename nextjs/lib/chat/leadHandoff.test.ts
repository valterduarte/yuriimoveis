import { describe, it, expect } from 'vitest'
import { buildLeadSummary, buildHandoffMessage, buildWhatsAppHandoff, type LeadInfo } from './leadHandoff'

const fullLead: LeadInfo = {
  nome: 'Maria Silva',
  telefone: '(11) 99999-9999',
  intencao: 'comprar',
  tipoImovel: 'apartamento de 2 quartos',
  regiao: 'Centro, Osasco',
  orcamento: 'até R$ 350 mil',
  financiamento: 'Minha Casa Minha Vida',
  prazo: '2 meses',
  imovelTitulo: 'Apartamento no Centro',
  imovelId: 1234,
}

describe('buildLeadSummary', () => {
  it('lists every provided field with a labelled line', () => {
    const summary = buildLeadSummary(fullLead)
    expect(summary).toContain('Interesse: Comprar')
    expect(summary).toContain('Tipo de imóvel: apartamento de 2 quartos')
    expect(summary).toContain('Região: Centro, Osasco')
    expect(summary).toContain('Orçamento: até R$ 350 mil')
    expect(summary).toContain('Financiamento: Minha Casa Minha Vida')
    expect(summary).toContain('Prazo para mudar: 2 meses')
    expect(summary).toContain('Imóvel de interesse: Apartamento no Centro (#1234)')
  })

  it('translates the alugar intent', () => {
    expect(buildLeadSummary({ intencao: 'alugar' })).toContain('Interesse: Alugar')
  })

  it('skips empty fields instead of printing blank labels', () => {
    const summary = buildLeadSummary({ nome: 'João', telefone: '11999999999' })
    expect(summary).not.toContain('Orçamento:')
    expect(summary).not.toContain('Região:')
  })

  it('falls back to an incomplete-qualification note when nothing is known', () => {
    expect(buildLeadSummary({})).toContain('qualificação incompleta')
  })
})

describe('buildHandoffMessage', () => {
  it('writes a first-person message addressed to the agent', () => {
    const message = buildHandoffMessage(fullLead)
    expect(message).toContain('Olá Yuri! Sou Maria Silva.')
    expect(message).toContain('Quero comprar apartamento de 2 quartos em Centro, Osasco.')
    expect(message).toContain('Meu telefone: (11) 99999-9999.')
  })

  it('uses the alugar verb for rentals', () => {
    expect(buildHandoffMessage({ intencao: 'alugar', tipoImovel: 'casa' })).toContain('Quero alugar casa.')
  })

  it('degrades gracefully without a name', () => {
    expect(buildHandoffMessage({})).toContain('Olá Yuri!')
    expect(buildHandoffMessage({})).toContain('Quero comprar um imóvel.')
  })
})

describe('buildWhatsAppHandoff', () => {
  it('builds a wa.me link to the agent number with the message url-encoded', () => {
    const url = buildWhatsAppHandoff(fullLead)
    expect(url.startsWith('https://wa.me/5511972563420?text=')).toBe(true)
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(buildHandoffMessage(fullLead))
  })
})
