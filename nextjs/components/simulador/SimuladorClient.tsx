'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { FiAlertCircle, FiCheckCircle, FiDollarSign, FiPercent, FiClock, FiHome, FiUsers, FiArrowDown, FiZap } from 'react-icons/fi'
import {
  calculateSacFinancing,
  detectCreditProgram,
  maxAffordableInstallment,
  MIN_DOWN_PAYMENT_RATE,
  TERM_OPTIONS,
  type CreditProgram,
} from '../../lib/financiamento'
import { PHONE_WA } from '../../lib/config'
import WhatsAppLink from '../WhatsAppLink'

/* ── formatting helpers ──────────────────────────────────────────────────────── */

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const formatBRLInteger = (value: number) =>
  Math.floor(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const formatCentsOnly = (value: number) => {
  const cents = Math.round((value - Math.floor(value)) * 100)
  return cents.toString().padStart(2, '0')
}

const formatIntBR = (value: number): string =>
  value > 0 ? value.toLocaleString('pt-BR') : ''

const parseDigits = (raw: string): number => {
  const digits = raw.replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

const parseDecimalBR = (raw: string): number => {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

const formatRate = (rate: number): string =>
  String(rate).replace('.', ',')

const INCOME_PRESETS = [
  { label: 'Até R$ 2.640', min: 1, max: 2640, value: 2000 },
  { label: 'R$ 2.640 – 4.400', min: 2641, max: 4400, value: 3500 },
  { label: 'R$ 4.400 – 8.000', min: 4401, max: 8000, value: 6000 },
  { label: 'Acima de R$ 8.000', min: 8001, max: Infinity, value: 12000 },
]

/* ── animated number ─────────────────────────────────────────────────────────── */

function AnimatedValue({ value, formatter }: { value: number; formatter: (n: number) => string }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const from = prev.current
    const to = value
    prev.current = to
    if (from === to) return

    const duration = 350
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])

  return <>{formatter(display)}</>
}

/* ── program badge colors ────────────────────────────────────────────────────── */

function programColors(id: CreditProgram['id']) {
  switch (id) {
    case 'mcmv_1': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: 'text-green-600' }
    case 'mcmv_2': return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', icon: 'text-emerald-600' }
    case 'mcmv_3': return { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300', icon: 'text-teal-600' }
    case 'mcmv_estimado': return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: 'text-amber-600' }
    case 'associativo': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: 'text-blue-600' }
    case 'sbpe': return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', icon: 'text-gray-500' }
  }
}

/* ── main component ──────────────────────────────────────────────────────────── */

interface SimuladorClientProps {
  initialValue?: number
}

export default function SimuladorClient({ initialValue }: SimuladorClientProps) {
  const defaultValue = initialValue && initialValue > 0 ? initialValue : 450000
  const initialProgram = detectCreditProgram(defaultValue, 0)
  const [propertyValue, setPropertyValue] = useState(defaultValue)
  const [downPayment, setDownPayment] = useState(Math.round(defaultValue * MIN_DOWN_PAYMENT_RATE))
  const [termMonths, setTermMonths] = useState(360)
  const [annualRate, setAnnualRate] = useState(initialProgram.rate)
  const [annualRateText, setAnnualRateText] = useState(formatRate(initialProgram.rate))
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [manualRate, setManualRate] = useState(false)

  const minDown = Math.round(propertyValue * MIN_DOWN_PAYMENT_RATE)
  const downBelowMinimum = downPayment < minDown
  const downExceedsValue = downPayment >= propertyValue

  // Auto-detect credit program
  const detectedProgram = useMemo(
    () => detectCreditProgram(propertyValue, monthlyIncome),
    [propertyValue, monthlyIncome],
  )

  // Update rate when program changes (unless user manually edited)
  const prevProgramId = useRef(detectedProgram.id)
  useEffect(() => {
    if (prevProgramId.current !== detectedProgram.id) {
      prevProgramId.current = detectedProgram.id
      if (!manualRate) {
        setAnnualRate(detectedProgram.rate)
        setAnnualRateText(formatRate(detectedProgram.rate))
      }
    }
  }, [detectedProgram, manualRate])

  const result = useMemo(
    () =>
      calculateSacFinancing({
        propertyValue,
        downPayment: Math.min(downPayment, propertyValue),
        termMonths,
        annualInterestRate: annualRate,
      }),
    [propertyValue, downPayment, termMonths, annualRate],
  )

  const maxInstallment = monthlyIncome > 0 ? maxAffordableInstallment(monthlyIncome) : 0
  const installmentExceedsBudget =
    monthlyIncome > 0 && result.firstInstallment > maxInstallment

  const downPercent = propertyValue > 0 ? Math.round((downPayment / propertyValue) * 100) : 0

  const colors = programColors(detectedProgram.id)

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setManualRate(true)
    setAnnualRateText(e.target.value)
    setAnnualRate(parseDecimalBR(e.target.value))
  }

  function resetToAutoRate() {
    setManualRate(false)
    setAnnualRate(detectedProgram.rate)
    setAnnualRateText(formatRate(detectedProgram.rate))
  }

  return (
    <>
      {/* ── Mobile sticky summary ───────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-16 md:top-20 z-30 -mx-6 px-6 py-3 bg-dark/95 backdrop-blur-md border-b border-primary/30 mb-6 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Imóvel</p>
            <p className="text-xs font-bold text-white truncate">{formatBRL(propertyValue)}</p>
          </div>
          <div className="text-right min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-primary font-bold">
              Parcela · {formatRate(annualRate)}% a.a.
            </p>
            <p className="text-lg font-black text-white leading-none mt-0.5">
              <AnimatedValue value={result.firstInstallment} formatter={formatBRL} />
              <span className="text-[10px] font-bold text-gray-400 ml-1">/mês</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
      {/* ── LEFT: Form ──────────────────────────────────────────────────────── */}
      <form className="lg:col-span-2 space-y-6">
        {/* Property value */}
        <div className="bg-white border border-gray-200 p-6">
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
              onChange={(e) => setPropertyValue(parseDigits(e.target.value))}
              placeholder="0"
              className="w-full bg-gray-50 border-2 border-gray-200 pl-11 pr-4 py-4 text-lg font-bold text-dark focus:border-primary focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Down payment */}
        <div className="bg-white border border-gray-200 p-6">
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
              onChange={(e) => setDownPayment(parseDigits(e.target.value))}
              placeholder="0"
              className="w-full bg-gray-50 border-2 border-gray-200 pl-11 pr-4 py-4 text-lg font-bold text-dark focus:border-primary focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2.5">
            Mínimo recomendado: {formatBRL(minDown)} (20%)
          </p>
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

        {/* Term */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FiClock size={16} className="text-primary" />
            </div>
            <label className="text-xs font-bold uppercase tracking-[0.15em] text-dark">
              Prazo
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TERM_OPTIONS.map((opt) => {
              const active = termMonths === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTermMonths(opt.value)}
                  aria-pressed={active}
                  className={`flex items-baseline justify-center gap-1.5 py-3.5 border-2 transition-all ${
                    active
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-gray-200 bg-gray-50 text-dark hover:border-primary/40 hover:bg-white'
                  }`}
                >
                  <span className="text-base font-black">{opt.value}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${active ? 'text-white/80' : 'text-gray-400'}`}>
                    meses
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Rate + detected program */}
        <div className="bg-white border border-gray-200 p-6">
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
              onChange={handleRateChange}
              placeholder="0,00"
              className="w-full bg-gray-50 border-2 border-gray-200 pl-4 pr-10 py-4 text-lg font-bold text-dark focus:border-primary focus:bg-white focus:outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none">%</span>
          </div>

          {/* Program badge */}
          <div className={`mt-3 flex items-start gap-2.5 px-3 py-2.5 border ${colors.bg} ${colors.border}`}>
            <FiZap size={14} className={`${colors.icon} flex-shrink-0 mt-0.5`} />
            <div className="min-w-0">
              <p className={`text-[11px] font-bold ${colors.text}`}>
                {detectedProgram.label}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {detectedProgram.description} · Taxa: {formatRate(detectedProgram.rate)}% a.a.
              </p>
            </div>
          </div>

          {manualRate && annualRate !== detectedProgram.rate && (
            <button
              type="button"
              onClick={resetToAutoRate}
              className="mt-2 text-[11px] text-primary font-bold hover:underline"
            >
              Usar taxa do {detectedProgram.label.split('—')[0].trim()} ({formatRate(detectedProgram.rate)}%)
            </button>
          )}
        </div>

        {/* Monthly income */}
        <div className="bg-white border border-gray-200 p-6">
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
              onChange={(e) => setMonthlyIncome(parseDigits(e.target.value))}
              placeholder="8.000"
              className="w-full bg-gray-50 border-2 border-gray-200 pl-11 pr-4 py-4 text-lg font-bold text-dark focus:border-primary focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2.5">
            Detecta automaticamente MCMV, Associativo ou SBPE.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {INCOME_PRESETS.map((preset) => {
              const active = monthlyIncome > 0 && monthlyIncome >= preset.min && monthlyIncome <= preset.max
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setMonthlyIncome(preset.value)}
                  aria-pressed={active}
                  className={`py-2.5 px-3 text-[11px] font-bold border-2 transition-all text-left ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-primary/40 hover:text-dark'
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>
      </form>

      {/* ── RIGHT: Results ──────────────────────────────────────────────────── */}
      <div className="lg:col-span-3 space-y-5">

        {/* Hero result: first installment */}
        <div className="relative bg-dark overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />

          {propertyValue <= 0 ? (
            <div className="relative p-8 md:p-10 text-center">
              <div className="w-12 h-12 bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <FiHome size={20} className="text-primary" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold mb-3">
                Informe o valor do imóvel
              </p>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
                Preencha o valor ao lado e veja sua parcela, taxa e custos iniciais em tempo real.
              </p>
            </div>
          ) : (
          <div className="relative p-8 md:p-10">
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="w-7 h-1 bg-primary" />
                <p className="text-sm md:text-base font-black text-white uppercase tracking-[0.15em]">
                  Primeira parcela
                </p>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 ${colors.bg} ${colors.text}`}>
                {formatRate(annualRate)}% a.a.
              </span>
            </div>

            <div className="flex items-baseline gap-1 flex-wrap">
              <p className="text-6xl md:text-7xl font-black text-white leading-none tracking-tight">
                <AnimatedValue value={result.firstInstallment} formatter={formatBRLInteger} />
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-400 leading-none">
                ,<AnimatedValue value={result.firstInstallment} formatter={formatCentsOnly} />
              </p>
              <p className="text-sm md:text-base font-bold text-gray-500 leading-none ml-1.5">
                /mês
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiArrowDown size={15} className="text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                    Cai para
                  </p>
                  <p className="text-xl md:text-2xl font-black text-green-400 leading-none">
                    <AnimatedValue value={result.lastInstallment} formatter={formatBRL} />
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1.5">na última parcela</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiClock size={15} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                    Prazo
                  </p>
                  <p className="text-xl md:text-2xl font-black text-white leading-none">
                    {termMonths} <span className="text-sm md:text-base text-gray-400 font-bold">meses</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1.5">pagamento total</p>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Detected program card */}
        {detectedProgram.id !== 'sbpe' && (
          <div className={`border ${colors.border} overflow-hidden`}>
            <div className={`px-6 py-5 flex items-start gap-3 ${colors.bg}`}>
              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                detectedProgram.id === 'mcmv_estimado' ? 'bg-amber-200'
                  : detectedProgram.id.startsWith('mcmv') ? 'bg-green-200'
                  : 'bg-blue-200'
              }`}>
                <FiZap size={16} className={colors.icon} />
              </div>
              <div>
                <p className={`text-sm font-black uppercase tracking-wider ${colors.text}`}>
                  {detectedProgram.label}
                </p>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  {detectedProgram.description}. Taxa aplicada: <strong>{formatRate(detectedProgram.rate)}% a.a.</strong>
                  {detectedProgram.id === 'mcmv_1' && ' — possibilidade de subsídio na entrada.'}
                  {detectedProgram.id === 'mcmv_2' && ' — juros reduzidos com subsídio parcial.'}
                  {detectedProgram.id === 'mcmv_3' && ' — juros abaixo do mercado.'}
                  {detectedProgram.id === 'mcmv_estimado' && ' — preencha sua renda para encontrar uma taxa ainda menor (a partir de 4% a.a.).'}
                  {detectedProgram.id === 'associativo' && ' — condições especiais via cooperativas.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key metric */}
        <div className="bg-white border border-gray-200 p-5 group hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-100 flex items-center justify-center">
              <FiDollarSign size={12} className="text-blue-600" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-bold">Valor financiado</p>
          </div>
          <p className="text-xl font-black text-dark">
            <AnimatedValue value={result.financedAmount} formatter={formatBRL} />
          </p>
        </div>

        {/* Upfront costs */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <span className="w-6 h-1 bg-primary flex-shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-dark">
                Custos iniciais
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Pagos na assinatura do contrato
              </p>
            </div>
          </div>

          {/* Entrada destacada */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-primary">
                  Entrada
                </p>
                <span className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary">
                  {downPercent}%
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-black text-dark leading-none">
                <AnimatedValue value={Math.min(downPayment, propertyValue)} formatter={formatBRL} />
              </p>
            </div>

            <div className="space-y-2.5 bg-primary/5 border border-primary/15 px-3.5 py-3">
              <div className="flex items-start gap-2.5">
                <FiCheckCircle size={13} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-700 leading-snug">
                  <strong className="text-dark">Pode ser parcelada</strong> diretamente com a construtora em imóveis na planta.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <FiCheckCircle size={13} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-700 leading-snug">
                  <strong className="text-dark">FGTS aceito</strong> como parte da entrada em imóveis residenciais dentro do SFH.
                </p>
              </div>
            </div>
          </div>

          {/* Taxas e impostos */}
          <div className="px-6 py-4 bg-gray-50/60 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">ITBI <span className="text-gray-400">(2% do valor)</span></span>
              <span className="font-bold text-dark">
                <AnimatedValue value={result.itbiEstimate} formatter={formatBRL} />
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Registro em cartório <span className="text-gray-400">(~2,5%)</span></span>
              <span className="font-bold text-dark">
                <AnimatedValue value={result.registrationEstimate} formatter={formatBRL} />
              </span>
            </div>
          </div>

        </div>

        {/* Budget check */}
        {monthlyIncome > 0 && (
          <div className={`overflow-hidden border ${
            installmentExceedsBudget ? 'border-red-200' : 'border-green-200'
          }`}>
            <div className={`px-6 py-5 flex items-start gap-3 ${
              installmentExceedsBudget ? 'bg-red-50' : 'bg-green-50'
            }`}>
              {installmentExceedsBudget ? (
                <div className="w-8 h-8 bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiAlertCircle size={16} className="text-red-700" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheckCircle size={16} className="text-green-700" />
                </div>
              )}
              <div>
                <p className={`text-sm font-black uppercase tracking-wider ${
                  installmentExceedsBudget ? 'text-red-800' : 'text-green-800'
                }`}>
                  {installmentExceedsBudget
                    ? 'Parcela acima do limite'
                    : 'Parcela dentro do orçamento'}
                </p>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Bancos limitam parcela a 30% da renda. Teto para sua renda:{' '}
                  <strong className="text-dark">{formatBRL(maxInstallment)}/mês</strong>
                </p>
                {installmentExceedsBudget && (
                  <p className="text-[11px] text-red-700 mt-2 font-semibold">
                    Excede em {formatBRL(result.firstInstallment - maxInstallment)} — aumente a entrada ou o prazo.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="relative bg-dark overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/10 rounded-full translate-y-1/2 translate-x-1/4" />

          <div className="relative p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-2">
              Próximo passo
            </p>
            <p className="font-black text-xl text-white uppercase tracking-wide mb-2">
              Quer taxas reais dos bancos?
            </p>
            <p className="text-sm text-white/70 mb-6 max-w-md leading-relaxed">
              Simulo gratuitamente no seu nome com Caixa, Itaú, Bradesco e Santander.
              Sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <WhatsAppLink
                href={PHONE_WA}
                source="simulador"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-[0.2em] text-xs py-4 px-7 transition-all hover:shadow-lg hover:shadow-green-500/25"
              >
                <FaWhatsapp size={18} /> Falar no WhatsApp
              </WhatsAppLink>
              <Link
                href="/imoveis"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white font-bold uppercase tracking-[0.15em] text-xs py-4 px-7 hover:border-white/50 transition-colors"
              >
                Ver imóveis
              </Link>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 leading-relaxed tracking-wide">
          Simulação ilustrativa pelo sistema SAC. Taxas reais variam por banco,
          relacionamento e perfil de crédito. ITBI e registro variam por município.
          Não é proposta de crédito.
        </p>
      </div>
      </div>
    </>
  )
}
