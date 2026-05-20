import { describe, it, expect } from 'vitest'
import {
  annualToMonthlyRate,
  calculateSacFinancing,
  detectCreditProgram,
  isMcmvEligible,
  isMcmvOrAssociativo,
  maxAffordableInstallment,
  ITBI_RATE,
  REGISTRATION_RATE,
} from './financiamento'

describe('annualToMonthlyRate', () => {
  it('converts 12% annual to its monthly equivalent (~0.949%)', () => {
    expect(annualToMonthlyRate(12)).toBeCloseTo(0.00949, 5)
  })

  it('returns 0 for a 0% rate', () => {
    expect(annualToMonthlyRate(0)).toBe(0)
  })

  it('compounds — 11.49% annual should not be exactly 11.49 / 12', () => {
    const monthly = annualToMonthlyRate(11.49)
    expect(monthly).not.toBe(11.49 / 100 / 12)
    expect(monthly).toBeCloseTo(0.00910, 4)
  })
})

describe('calculateSacFinancing', () => {
  it('computes a clean SAC schedule for a typical R$ 450k / 90k entry / 360m / 11.49% input', () => {
    const result = calculateSacFinancing({
      propertyValue: 450000,
      downPayment: 90000,
      termMonths: 360,
      annualInterestRate: 11.49,
    })

    expect(result.financedAmount).toBe(360000)
    // First installment: amortização (1000) + juros do mês cheio (~3274) = ~4274
    expect(result.firstInstallment).toBeGreaterThan(4200)
    expect(result.firstInstallment).toBeLessThan(4350)
    // Last installment: amortização (1000) + juros sobre amortização (~9) = ~1009
    expect(result.lastInstallment).toBeGreaterThan(1000)
    expect(result.lastInstallment).toBeLessThan(1015)
    // SAC always has firstInstallment > lastInstallment for positive rates
    expect(result.firstInstallment).toBeGreaterThan(result.lastInstallment)
  })

  it('returns zero financed amount when down payment covers the property fully', () => {
    const result = calculateSacFinancing({
      propertyValue: 100000,
      downPayment: 100000,
      termMonths: 360,
      annualInterestRate: 10,
    })
    expect(result.financedAmount).toBe(0)
    expect(result.firstInstallment).toBe(0)
    expect(result.lastInstallment).toBe(0)
  })

  it('clamps financedAmount to non-negative when downPayment exceeds property value', () => {
    const result = calculateSacFinancing({
      propertyValue: 100000,
      downPayment: 150000,
      termMonths: 360,
      annualInterestRate: 10,
    })
    expect(result.financedAmount).toBe(0)
  })

  it('estimates ITBI and registration as fixed percentages of the property value', () => {
    const result = calculateSacFinancing({
      propertyValue: 500000,
      downPayment: 100000,
      termMonths: 360,
      annualInterestRate: 10,
    })
    expect(result.itbiEstimate).toBe(500000 * ITBI_RATE)
    expect(result.registrationEstimate).toBe(500000 * REGISTRATION_RATE)
  })
})

describe('detectCreditProgram', () => {
  it('returns Faixa 1 for income up to R$ 3.200 with eligible property', () => {
    expect(detectCreditProgram(200000, 2000).id).toBe('mcmv_1')
    expect(detectCreditProgram(200000, 3200).id).toBe('mcmv_1')
  })

  it('returns Faixa 2 for income between R$ 3.201 and R$ 5.000', () => {
    expect(detectCreditProgram(300000, 4000).id).toBe('mcmv_2')
    expect(detectCreditProgram(300000, 5000).id).toBe('mcmv_2')
  })

  it('returns Faixa 3 for income between R$ 5.001 and R$ 9.600 within R$ 400k cap', () => {
    expect(detectCreditProgram(350000, 7000).id).toBe('mcmv_3')
    expect(detectCreditProgram(400000, 9600).id).toBe('mcmv_3')
  })

  it('returns Faixa 4 for income between R$ 9.601 and R$ 13.000 within R$ 600k cap', () => {
    expect(detectCreditProgram(500000, 11000).id).toBe('mcmv_4')
    expect(detectCreditProgram(600000, 13000).id).toBe('mcmv_4')
  })

  it('returns mcmv_estimado for an MCMV-eligible property when income is unknown', () => {
    expect(detectCreditProgram(350000, 0).id).toBe('mcmv_estimado')
  })

  it('returns associativo for income above MCMV faixa 4 within R$ 600k property cap', () => {
    expect(detectCreditProgram(500000, 13000).id).toBe('mcmv_4')
    expect(detectCreditProgram(450000, 10000).id).toBe('mcmv_4')
  })

  it('falls back to SBPE for income above R$ 13k or property above R$ 600k', () => {
    expect(detectCreditProgram(800000, 15000).id).toBe('sbpe')
    expect(detectCreditProgram(800000, 0).id).toBe('sbpe')
  })

  it('returns SBPE for an empty property value', () => {
    expect(detectCreditProgram(0, 5000).id).toBe('sbpe')
  })
})

describe('isMcmvEligible', () => {
  it('returns true for Faixa 3 boundaries (R$ 9.600 income, R$ 400k property)', () => {
    expect(isMcmvEligible(400000, 9600)).toBe(true)
    expect(isMcmvEligible(300000, 7000)).toBe(true)
  })

  it('returns true for Faixa 4 boundaries (R$ 13.000 income, R$ 600k property)', () => {
    expect(isMcmvEligible(600000, 13000)).toBe(true)
    expect(isMcmvEligible(500000, 11000)).toBe(true)
  })

  it('returns false above the Faixa 4 ceilings', () => {
    expect(isMcmvEligible(700000, 13000)).toBe(false)
    expect(isMcmvEligible(500000, 14000)).toBe(false)
  })

  it('returns false when income is missing', () => {
    expect(isMcmvEligible(300000, 0)).toBe(false)
  })
})

describe('isMcmvOrAssociativo', () => {
  it('returns true for any MCMV faixa and for associativo', () => {
    expect(isMcmvOrAssociativo('mcmv_1')).toBe(true)
    expect(isMcmvOrAssociativo('mcmv_2')).toBe(true)
    expect(isMcmvOrAssociativo('mcmv_3')).toBe(true)
    expect(isMcmvOrAssociativo('mcmv_4')).toBe(true)
    expect(isMcmvOrAssociativo('mcmv_estimado')).toBe(true)
    expect(isMcmvOrAssociativo('associativo')).toBe(true)
  })

  it('returns false for SBPE', () => {
    expect(isMcmvOrAssociativo('sbpe')).toBe(false)
  })
})

describe('maxAffordableInstallment', () => {
  it('returns 30% of monthly income (Brazilian banking convention)', () => {
    expect(maxAffordableInstallment(9600)).toBe(2880)
    expect(maxAffordableInstallment(13000)).toBe(3900)
    expect(maxAffordableInstallment(0)).toBe(0)
  })
})
