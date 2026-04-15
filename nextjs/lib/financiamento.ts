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
export const MCMV_INCOME_LIMIT = 12000
export const MCMV_PROPERTY_LIMIT = 350000
export const MIN_DOWN_PAYMENT_RATE = 0.20
export const MAX_TERM_MONTHS = 420

export const TERM_OPTIONS = [
  { value: 240, label: '240 meses (20 anos)' },
  { value: 300, label: '300 meses (25 anos)' },
  { value: 360, label: '360 meses (30 anos)' },
  { value: 420, label: '420 meses (35 anos)' },
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

export function maxAffordableInstallment(monthlyIncome: number): number {
  return monthlyIncome * 0.30
}
