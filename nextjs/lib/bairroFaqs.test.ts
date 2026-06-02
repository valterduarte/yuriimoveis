import { describe, it, expect } from 'vitest'
import { buildBairroFaqs } from './bairroFaqs'
import type { BairroData } from '../types'

const bairro: BairroData = {
  nome: 'Novo Osasco',
  slug: 'novo-osasco',
  cidade: 'Osasco',
  dbMatch: 'Novo Osasco',
  guiaIndependente: true,
  titulo: 'Imóveis no Novo Osasco, Osasco SP',
  descricaoMeta: 'Apartamentos no Novo Osasco, Osasco SP.',
  conteudo: {
    sobre: 'Bairro residencial da região central de Osasco.',
    infraestrutura: 'Comércio de bairro ativo e serviços do Centro próximos.',
    transporte: 'Próximo à Estação Osasco da CPTM e ao Terminal Osasco.',
    educacao: 'Escolas públicas e particulares na região.',
    porqueMorar: 'Localização central com boa mobilidade.',
  },
}

const baseArgs = {
  bairro,
  cidadeName: 'Osasco',
  cidadeSlug: 'osasco',
  bairroDbName: 'Novo Osasco',
}

describe('buildBairroFaqs', () => {
  it('without listings: returns content FAQs plus an honest availability FAQ, never "0 imóveis"', () => {
    const faqs = buildBairroFaqs({ ...baseArgs, combos: [] })

    expect(faqs).toHaveLength(6)
    const joined = faqs.map(f => `${f.question} ${f.answer}`).join(' ')
    expect(joined).not.toContain('0 imóve')
    expect(joined).not.toMatch(/Quantos imóveis estão disponíveis/)
    expect(faqs.some(f => /Há apartamentos à venda/.test(f.question))).toBe(true)
    // Inventory FAQs that link to a non-existent listing must be absent.
    expect(faqs.some(f => f.answerJsx)).toBe(false)
  })

  it('with listings: appends the inventory FAQs including the availability count', () => {
    const faqs = buildBairroFaqs({
      ...baseArgs,
      combos: [{ acao: 'comprar', categoria: 'apartamento', count: 5 }],
    })

    expect(faqs).toHaveLength(8)
    expect(faqs.some(f => /Quantos imóveis estão disponíveis/.test(f.question))).toBe(true)
    expect(faqs.some(f => f.answer.includes('5'))).toBe(true)
  })

  it('always includes the five content FAQs', () => {
    const faqs = buildBairroFaqs({ ...baseArgs, combos: [] })
    expect(faqs[0].answer).toBe(bairro.conteudo.sobre)
    expect(faqs[1].answer).toBe(bairro.conteudo.infraestrutura)
    expect(faqs[2].answer).toBe(bairro.conteudo.transporte)
    expect(faqs[3].answer).toBe(bairro.conteudo.educacao)
    expect(faqs[4].answer).toBe(bairro.conteudo.porqueMorar)
  })
})
