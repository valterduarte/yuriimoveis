import { detectCreditProgram, calculateSacFinancing, MIN_DOWN_PAYMENT_RATE } from '../financiamento'
import { formatBRL } from '../formatters'

// "Parcela a partir de" teaser shown on property cards and the chat estimate.
// Delegates to the same model the /simulador page uses (lib/financiamento) so
// the two never disagree: 20% down, 360-month SAC, and the credit-program rate
// the simulator picks for a buyer with no declared income (MCMV estimado for
// eligible prices, SBPE otherwise). Returns the first SAC installment — the
// amount the buyer actually starts paying.
const FINANCING_TERM_MONTHS = 360

export function calcParcela(preco: number): string {
  const downPayment = preco * MIN_DOWN_PAYMENT_RATE
  const program = detectCreditProgram(preco, 0)
  const { firstInstallment } = calculateSacFinancing({
    propertyValue: preco,
    downPayment,
    termMonths: FINANCING_TERM_MONTHS,
    annualInterestRate: program.rate,
  })
  return formatBRL(firstInstallment)
}
