import { describe, it, expect } from 'vitest'
import {
  buildEmpreendimentoFinancingExample,
  EMPREENDIMENTO_FINANCING_TERM_MONTHS,
} from './empreendimentoFinance'
import { MIN_DOWN_PAYMENT_RATE } from './financiamento'

describe('buildEmpreendimentoFinancingExample', () => {
  it('returns null for non-positive prices', () => {
    expect(buildEmpreendimentoFinancingExample(0)).toBeNull()
    expect(buildEmpreendimentoFinancingExample(-1)).toBeNull()
    expect(buildEmpreendimentoFinancingExample(Number.NaN)).toBeNull()
  })

  it('uses the 20% SBPE minimum down payment and finances the rest', () => {
    const example = buildEmpreendimentoFinancingExample(300_000)
    if (!example) throw new Error('expected a financing example')
    expect(example.entradaRate).toBe(MIN_DOWN_PAYMENT_RATE)
    expect(example.entrada).toBe(60_000)
    expect(example.valorFinanciado).toBe(240_000)
    expect(example.prazoMeses).toBe(EMPREENDIMENTO_FINANCING_TERM_MONTHS)
  })

  it('picks the MCMV estimate rate for a unit that fits the program ceiling', () => {
    // R$ 377.371 (≤ R$ 400k) with no income → MCMV estimate (9.9%)
    const example = buildEmpreendimentoFinancingExample(377_371)
    if (!example) throw new Error('expected a financing example')
    expect(example.programaLabel).toContain('Minha Casa Minha Vida')
    expect(example.taxaAnual).toBe(9.9)
  })

  it('falls back to SBPE for a unit above the MCMV ceiling', () => {
    // R$ 567.839 (> R$ 400k) with no income → SBPE market rate
    const example = buildEmpreendimentoFinancingExample(567_839)
    if (!example) throw new Error('expected a financing example')
    expect(example.programaLabel).toContain('SBPE')
  })

  it('reports the first SAC installment as the highest (worst-case) one', () => {
    const example = buildEmpreendimentoFinancingExample(300_000)
    if (!example) throw new Error('expected a financing example')
    // first installment must exceed simple amortization (financed / term)
    expect(example.primeiraParcela).toBeGreaterThan(240_000 / EMPREENDIMENTO_FINANCING_TERM_MONTHS)
  })
})
