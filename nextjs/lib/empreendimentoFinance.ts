import {
  calculateSacFinancing,
  detectCreditProgram,
  MIN_DOWN_PAYMENT_RATE,
} from './financiamento'

/** Default illustrative term, in months (never expressed in years on this site). */
export const EMPREENDIMENTO_FINANCING_TERM_MONTHS = 360

export interface EmpreendimentoFinancingExample {
  /** Unit price the example is based on (the development's entry-level price). */
  precoBase: number
  /** Down payment in R$ (the SBPE minimum, 20%). */
  entrada: number
  /** Down-payment fraction, e.g. 0.2. */
  entradaRate: number
  /** Amount financed (price − down payment). */
  valorFinanciado: number
  /** Illustrative term, in months. */
  prazoMeses: number
  /** First SAC installment in R$ (the highest one — installments decrease over time). */
  primeiraParcela: number
  /** Credit program the rate came from (e.g. "Minha Casa Minha Vida — estimativa"). */
  programaLabel: string
  /** Annual interest rate (%) used for the estimate. */
  taxaAnual: number
}

/**
 * Builds a grounded financing example for a development page from its entry-level
 * unit price. Every number is computed with the same engine as the public
 * simulator — nothing is invented:
 *
 * - down payment = 20% (MIN_DOWN_PAYMENT_RATE, the SBPE minimum);
 * - the interest rate is picked honestly by detectCreditProgram with income 0
 *   (MCMV estimate when the unit fits the program ceiling, SBPE otherwise);
 * - the first SAC installment is the highest one, so it states the worst case.
 *
 * Returns null for a non-positive price so callers can skip the section.
 */
export function buildEmpreendimentoFinancingExample(
  precoBase: number,
): EmpreendimentoFinancingExample | null {
  if (!Number.isFinite(precoBase) || precoBase <= 0) return null

  const entrada = Math.round(precoBase * MIN_DOWN_PAYMENT_RATE)
  const programa = detectCreditProgram(precoBase, 0)
  const simulation = calculateSacFinancing({
    propertyValue: precoBase,
    downPayment: entrada,
    termMonths: EMPREENDIMENTO_FINANCING_TERM_MONTHS,
    annualInterestRate: programa.rate,
  })

  return {
    precoBase,
    entrada,
    entradaRate: MIN_DOWN_PAYMENT_RATE,
    valorFinanciado: simulation.financedAmount,
    prazoMeses: EMPREENDIMENTO_FINANCING_TERM_MONTHS,
    primeiraParcela: simulation.firstInstallment,
    programaLabel: programa.label,
    taxaAnual: programa.rate,
  }
}
