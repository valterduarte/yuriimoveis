import { describe, it, expect } from 'vitest'
import { classifySlug } from './slugRouter'

describe('classifySlug', () => {
  it('classifies a slug ending in -<id> as a property and extracts the id', () => {
    const r = classifySlug('casa-jardim-piratininga-42')
    expect(r).toEqual({ kind: 'property', id: '42' })
  })

  it('handles single-digit and multi-digit property ids', () => {
    expect(classifySlug('imovel-1')).toEqual({ kind: 'property', id: '1' })
    expect(classifySlug('imovel-999999')).toEqual({ kind: 'property', id: '999999' })
  })

  it('treats slug with numeric segment in the middle as bairro (only trailing id counts)', () => {
    const r = classifySlug('rua-13-de-maio')
    expect(r).toEqual({ kind: 'bairro' })
  })

  it('classifies a known landing slug as landing', () => {
    const r = classifySlug('casas-a-venda-em-osasco')
    expect(r).toEqual({ kind: 'landing' })
  })

  it('classifies an unknown non-numeric slug as bairro', () => {
    const r = classifySlug('vila-yara')
    expect(r).toEqual({ kind: 'bairro' })
    expect(classifySlug('algum-bairro-novo')).toEqual({ kind: 'bairro' })
  })

  it('does not match property when id chars are followed by text', () => {
    expect(classifySlug('imovel-42-novo')).toEqual({ kind: 'bairro' })
  })
})
