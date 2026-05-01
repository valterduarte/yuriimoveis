'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  calculateSacFinancing,
  detectCreditProgram,
  maxAffordableInstallment,
  MIN_DOWN_PAYMENT_RATE,
} from '../../lib/financiamento'
import { PHONE_WA, PHONE_WA_BASE } from '../../lib/config'
import { formatBRL, formatRate, parseDecimalBR } from '../../lib/formatters'
import MobileSummary from './MobileSummary'
import SimuladorForm from './SimuladorForm'
import SimuladorResult from './SimuladorResult'

interface SimuladorClientProps {
  initialValue?: number
}

const DEFAULT_PROPERTY_VALUE = 450000
const DEFAULT_TERM_MONTHS = 360

export default function SimuladorClient({ initialValue }: SimuladorClientProps) {
  const startingValue = initialValue && initialValue > 0 ? initialValue : DEFAULT_PROPERTY_VALUE
  const initialProgram = detectCreditProgram(startingValue, 0)

  const [propertyValue, setPropertyValue]   = useState(startingValue)
  const [downPayment, setDownPayment]       = useState(Math.round(startingValue * MIN_DOWN_PAYMENT_RATE))
  const [termMonths, setTermMonths]         = useState(DEFAULT_TERM_MONTHS)
  const [annualRate, setAnnualRate]         = useState(initialProgram.rate)
  const [annualRateText, setAnnualRateText] = useState(formatRate(initialProgram.rate))
  const [monthlyIncome, setMonthlyIncome]   = useState(0)
  const [manualRate, setManualRate]         = useState(false)

  const minDown          = Math.round(propertyValue * MIN_DOWN_PAYMENT_RATE)
  const downBelowMinimum = downPayment < minDown
  const downExceedsValue = downPayment >= propertyValue
  const downPercent      = propertyValue > 0 ? Math.round((downPayment / propertyValue) * 100) : 0

  const detectedProgram = useMemo(
    () => detectCreditProgram(propertyValue, monthlyIncome),
    [propertyValue, monthlyIncome],
  )

  const previousProgramId = useRef(detectedProgram.id)
  useEffect(() => {
    if (previousProgramId.current === detectedProgram.id) return
    previousProgramId.current = detectedProgram.id
    if (manualRate) return
    setAnnualRate(detectedProgram.rate)
    setAnnualRateText(formatRate(detectedProgram.rate))
  }, [detectedProgram, manualRate])

  const result = useMemo(
    () => calculateSacFinancing({
      propertyValue,
      downPayment: Math.min(downPayment, propertyValue),
      termMonths,
      annualInterestRate: annualRate,
    }),
    [propertyValue, downPayment, termMonths, annualRate],
  )

  const maxInstallment           = monthlyIncome > 0 ? maxAffordableInstallment(monthlyIncome) : 0
  const installmentExceedsBudget = monthlyIncome > 0 && result.firstInstallment > maxInstallment

  const whatsappHref = useMemo(() => {
    if (propertyValue <= 0) return PHONE_WA
    const lines = [
      'Olá Yuri! Fiz uma simulação no site e quero conversar:',
      '',
      `Imóvel: ${formatBRL(propertyValue)}`,
      `Entrada: ${formatBRL(Math.min(downPayment, propertyValue))} (${downPercent}%)`,
      `Prazo: ${termMonths} meses`,
      `Taxa: ${formatRate(annualRate)}% a.a. (${detectedProgram.label})`,
      monthlyIncome > 0 ? `Renda familiar: ${formatBRL(monthlyIncome)}` : null,
      `Parcela: ${formatBRL(result.firstInstallment)}/mês`,
      '',
      'Pode me ajudar com as próximas etapas?',
    ].filter(Boolean).join('\n')
    return `${PHONE_WA_BASE}?text=${encodeURIComponent(lines)}`
  }, [propertyValue, downPayment, downPercent, termMonths, annualRate, detectedProgram, monthlyIncome, result.firstInstallment])

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualRate(true)
    setAnnualRateText(e.target.value)
    setAnnualRate(parseDecimalBR(e.target.value))
  }

  const handleResetToAutoRate = () => {
    setManualRate(false)
    setAnnualRate(detectedProgram.rate)
    setAnnualRateText(formatRate(detectedProgram.rate))
  }

  return (
    <>
      <MobileSummary
        propertyValue={propertyValue}
        annualRate={annualRate}
        firstInstallment={result.firstInstallment}
      />

      <div className="grid lg:grid-cols-5 gap-8">
        <SimuladorForm
          propertyValue={propertyValue}
          downPayment={downPayment}
          termMonths={termMonths}
          annualRate={annualRate}
          annualRateText={annualRateText}
          monthlyIncome={monthlyIncome}
          manualRate={manualRate}
          detectedProgram={detectedProgram}
          minDown={minDown}
          downPercent={downPercent}
          downBelowMinimum={downBelowMinimum}
          downExceedsValue={downExceedsValue}
          onPropertyValueChange={setPropertyValue}
          onDownPaymentChange={setDownPayment}
          onTermMonthsChange={setTermMonths}
          onRateChange={handleRateChange}
          onMonthlyIncomeChange={setMonthlyIncome}
          onResetToAutoRate={handleResetToAutoRate}
        />

        <SimuladorResult
          propertyValue={propertyValue}
          downPayment={downPayment}
          downPercent={downPercent}
          termMonths={termMonths}
          annualRate={annualRate}
          monthlyIncome={monthlyIncome}
          detectedProgram={detectedProgram}
          result={result}
          maxInstallment={maxInstallment}
          installmentExceedsBudget={installmentExceedsBudget}
          whatsappHref={whatsappHref}
        />
      </div>
    </>
  )
}
