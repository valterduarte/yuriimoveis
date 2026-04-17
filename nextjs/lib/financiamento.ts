export interface SimulationInput {
  propertyValue: number
  downPayment: number
  termMonths: number
  annualInterestRate: number
}

export interface SimulationResult {
  financedAmount: number
  monthlyInterestRate: number
  firstInstallment: number
  lastInstallment: number
  totalInterest: number
  totalPaid: number
  itbiEstimate: number
  registrationEstimate: number
  upfrontCostsTotal: number
}

export const SAC_RATE_DEFAULT_ANNUAL = 11.49
export const ITBI_RATE = 0.02
export const REGISTRATION_RATE = 0.025
export const MCMV_INCOME_LIMIT = 8000
export const MCMV_PROPERTY_LIMIT = 350000
export const MIN_DOWN_PAYMENT_RATE = 0.20
export const MAX_TERM_MONTHS = 420

/* ── Credit programs ─────────────────────────────────────────────────────────── */

export interface CreditProgram {
  id: 'mcmv_1' | 'mcmv_2' | 'mcmv_3' | 'mcmv_estimado' | 'associativo' | 'sbpe'
  label: string
  description: string
  rate: number
}

const MCMV_FAIXA_1: CreditProgram = {
  id: 'mcmv_1',
  label: 'Minha Casa Minha Vida — Faixa 1',
  description: 'Renda até R$ 2.640 · Juros subsidiados',
  rate: 4.0,
}

const MCMV_FAIXA_2: CreditProgram = {
  id: 'mcmv_2',
  label: 'Minha Casa Minha Vida — Faixa 2',
  description: 'Renda de R$ 2.640 a R$ 4.400',
  rate: 5.5,
}

const MCMV_FAIXA_3: CreditProgram = {
  id: 'mcmv_3',
  label: 'Minha Casa Minha Vida — Faixa 3',
  description: 'Renda de R$ 4.400 a R$ 8.000',
  rate: 7.66,
}

const MCMV_ESTIMADO: CreditProgram = {
  id: 'mcmv_estimado',
  label: 'Minha Casa Minha Vida — estimativa',
  description: 'Imóvel elegível · Preencha sua renda para taxa exata',
  rate: 9.9,
}

const ASSOCIATIVO: CreditProgram = {
  id: 'associativo',
  label: 'Crédito Associativo',
  description: 'Cooperativas e programas habitacionais',
  rate: 8.5,
}

const SBPE: CreditProgram = {
  id: 'sbpe',
  label: 'SBPE — Mercado Livre',
  description: 'Financiamento tradicional dos bancos',
  rate: SAC_RATE_DEFAULT_ANNUAL,
}

/**
 * Detects the most likely credit program based on property value and income.
 * Returns the best-fit program or SBPE as default.
 */
export function detectCreditProgram(propertyValue: number, monthlyIncome: number): CreditProgram {
  // With income: precise faixa detection
  if (propertyValue > 0 && propertyValue <= MCMV_PROPERTY_LIMIT && monthlyIncome > 0) {
    if (monthlyIncome <= 2640) return MCMV_FAIXA_1
    if (monthlyIncome <= 4400) return MCMV_FAIXA_2
    if (monthlyIncome <= MCMV_INCOME_LIMIT) return MCMV_FAIXA_3
  }

  // Without income but property fits MCMV: conservative market estimate
  if (propertyValue > 0 && propertyValue <= MCMV_PROPERTY_LIMIT && monthlyIncome === 0) {
    return MCMV_ESTIMADO
  }

  // Associativo: income up to R$ 12k, property up to R$ 500k
  if (monthlyIncome > 0 && monthlyIncome <= 12000 && propertyValue > 0 && propertyValue <= 500000) {
    return ASSOCIATIVO
  }

  return SBPE
}

export const ALL_CREDIT_PROGRAMS: CreditProgram[] = [
  MCMV_FAIXA_1, MCMV_FAIXA_2, MCMV_FAIXA_3, MCMV_ESTIMADO, ASSOCIATIVO, SBPE,
]

export const TERM_OPTIONS = [
  { value: 240, label: '240 meses' },
  { value: 300, label: '300 meses' },
  { value: 360, label: '360 meses' },
  { value: 420, label: '420 meses' },
]

export function annualToMonthlyRate(annualRatePercent: number): number {
  return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1
}

export function calculateSacFinancing(input: SimulationInput): SimulationResult {
  const financedAmount = Math.max(0, input.propertyValue - input.downPayment)
  const monthlyInterestRate = annualToMonthlyRate(input.annualInterestRate)
  const constantAmortization = financedAmount / input.termMonths

  const firstInstallment = constantAmortization + financedAmount * monthlyInterestRate
  const lastAmortizationInterest = constantAmortization * monthlyInterestRate
  const lastInstallment = constantAmortization + lastAmortizationInterest

  const totalInterest = ((firstInstallment + lastInstallment) / 2) * input.termMonths - financedAmount
  const totalPaid = financedAmount + totalInterest

  const itbiEstimate = input.propertyValue * ITBI_RATE
  const registrationEstimate = input.propertyValue * REGISTRATION_RATE
  const upfrontCostsTotal = input.downPayment + itbiEstimate + registrationEstimate

  return {
    financedAmount,
    monthlyInterestRate,
    firstInstallment,
    lastInstallment,
    totalInterest,
    totalPaid,
    itbiEstimate,
    registrationEstimate,
    upfrontCostsTotal,
  }
}

export function isMcmvEligible(propertyValue: number, monthlyIncome: number): boolean {
  return monthlyIncome > 0
    && monthlyIncome <= MCMV_INCOME_LIMIT
    && propertyValue > 0
    && propertyValue <= MCMV_PROPERTY_LIMIT
}

export function isMcmvOrAssociativo(programId: CreditProgram['id']): boolean {
  return programId === 'mcmv_1' || programId === 'mcmv_2' || programId === 'mcmv_3' || programId === 'mcmv_estimado' || programId === 'associativo'
}

export function maxAffordableInstallment(monthlyIncome: number): number {
  return monthlyIncome * 0.30
}
