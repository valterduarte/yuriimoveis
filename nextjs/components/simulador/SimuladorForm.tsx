'use client'

import { FiAlertCircle, FiClock, FiDollarSign, FiHome, FiPercent, FiUsers } from 'react-icons/fi'
import { TERM_OPTIONS, type CreditProgram } from '../../lib/financiamento'
import { formatBRL, formatIntBR, formatRate, parseDigits } from '../../lib/formatters'

const INCOME_PRESETS = [
  { label: 'Até R$ 2.640',       min: 1,    max: 2640,     value: 2000 },
  { label: 'R$ 2.640 – 4.400',   min: 2641, max: 4400,     value: 3500 },
  { label: 'R$ 4.400 – 8.000',   min: 4401, max: 8000,     value: 6000 },
  { label: 'Acima de R$ 8.000',  min: 8001, max: Infinity, value: 12000 },
]

interface SimuladorFormProps {
  propertyValue: number
  downPayment: number
  termMonths: number
  annualRate: number
  annualRateText: string
  monthlyIncome: number
  manualRate: boolean
  detectedProgram: CreditProgram
  minDown: number
  downPercent: number
  downBelowMinimum: boolean
  downExceedsValue: boolean
  onPropertyValueChange: (value: number) => void
  onDownPaymentChange: (value: number) => void
  onTermMonthsChange: (value: number) => void
  onRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMonthlyIncomeChange: (value: number) => void
  onResetToAutoRate: () => void
}

export default function SimuladorForm({
  propertyValue,
  downPayment,
  termMonths,
  annualRate,
  annualRateText,
  monthlyIncome,
  manualRate,
  detectedProgram,
  minDown,
  downPercent,
  downBelowMinimum,
  downExceedsValue,
  onPropertyValueChange,
  onDownPaymentChange,
  onTermMonthsChange,
  onRateChange,
  onMonthlyIncomeChange,
  onResetToAutoRate,
}: SimuladorFormProps) {
  return (
    <form className="lg:col-span-2 space-y-8">
      {/* Section: O imóvel */}
      <section className="space-y-7">
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-dark/30" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-dark/60">O imóvel</p>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FiHome size={16} className="text-primary" />
            </div>
            <label htmlFor="propertyValue" className="text-xs font-bold uppercase tracking-[0.15em] text-dark">
              Valor do imóvel
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">R$</span>
            <input
              id="propertyValue"
              type="text"
              inputMode="numeric"
              value={formatIntBR(propertyValue)}
              onChange={(e) => onPropertyValueChange(parseDigits(e.target.value))}
              placeholder="0"
              className="w-full bg-gray-100 pl-11 pr-4 py-4 text-lg font-bold text-dark focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FiDollarSign size={16} className="text-primary" />
              </div>
              <label htmlFor="downPayment" className="text-xs font-bold uppercase tracking-[0.15em] text-dark">
                Entrada
              </label>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 ${
              downBelowMinimum ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              {downPercent}%
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">R$</span>
            <input
              id="downPayment"
              type="text"
              inputMode="numeric"
              value={formatIntBR(downPayment)}
              onChange={(e) => onDownPaymentChange(parseDigits(e.target.value))}
              placeholder="0"
              className="w-full bg-gray-100 pl-11 pr-4 py-4 text-lg font-bold text-dark focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2.5">Mínimo recomendado: {formatBRL(minDown)} (20%)</p>
          {downBelowMinimum && !downExceedsValue && (
            <div className="flex items-start gap-2 mt-2.5 bg-amber-50 border border-amber-200 px-3 py-2.5">
              <FiAlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={13} />
              <p className="text-[11px] text-amber-800">Bancos costumam exigir entrada mínima de 20%.</p>
            </div>
          )}
          {downExceedsValue && (
            <div className="flex items-start gap-2 mt-2.5 bg-red-50 border border-red-200 px-3 py-2.5">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={13} />
              <p className="text-[11px] text-red-800">Entrada igual ou maior que o valor — não há financiamento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section: Suas condições */}
      <section className="space-y-7">
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-dark/30" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-dark/60">Suas condições</p>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FiClock size={16} className="text-primary" />
            </div>
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-dark">Prazo</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TERM_OPTIONS.map((opt) => {
              const active = termMonths === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onTermMonthsChange(opt.value)}
                  aria-pressed={active}
                  className={`flex items-baseline justify-center gap-1.5 py-3.5 transition-all ${
                    active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-dark hover:bg-gray-200'
                  }`}
                >
                  <span className="text-base font-black">{opt.value}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${active ? 'text-white/80' : 'text-gray-400'}`}>meses</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FiPercent size={16} className="text-primary" />
            </div>
            <label htmlFor="annualRate" className="text-xs font-bold uppercase tracking-[0.15em] text-dark">
              Taxa de juros a.a.
            </label>
          </div>
          <div className="relative">
            <input
              id="annualRate"
              type="text"
              inputMode="decimal"
              value={annualRateText}
              onChange={onRateChange}
              placeholder="0,00"
              className="w-full bg-gray-100 pl-4 pr-10 py-4 text-lg font-bold text-dark focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">%</span>
          </div>

          {manualRate && annualRate !== detectedProgram.rate && (
            <button type="button" onClick={onResetToAutoRate} className="mt-3 text-[11px] text-primary font-bold hover:underline">
              Usar taxa do {detectedProgram.label.split('—')[0].trim()} ({formatRate(detectedProgram.rate)}%)
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FiUsers size={16} className="text-primary" />
            </div>
            <div>
              <label htmlFor="monthlyIncome" className="text-xs font-bold uppercase tracking-[0.15em] text-dark block">
                Renda familiar
              </label>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Preencha para ajustar a taxa</span>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">R$</span>
            <input
              id="monthlyIncome"
              type="text"
              inputMode="numeric"
              value={formatIntBR(monthlyIncome)}
              onChange={(e) => onMonthlyIncomeChange(parseDigits(e.target.value))}
              placeholder="8.000"
              className="w-full bg-gray-100 pl-11 pr-4 py-4 text-lg font-bold text-dark focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2.5">Detecta automaticamente MCMV, Associativo ou SBPE.</p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {INCOME_PRESETS.map((preset) => {
              const active = monthlyIncome > 0 && monthlyIncome >= preset.min && monthlyIncome <= preset.max
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onMonthlyIncomeChange(preset.value)}
                  aria-pressed={active}
                  className={`py-2.5 px-3 text-[11px] font-bold transition-all text-left ${
                    active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-dark'
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </form>
  )
}
