'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import {
  calculateSacFinancing,
  isMcmvEligible,
  maxAffordableInstallment,
  MAX_TERM_MONTHS,
  MIN_DOWN_PAYMENT_RATE,
  SAC_RATE_DEFAULT_ANNUAL,
  TERM_OPTIONS,
} from '../../lib/financiamento'
import { PHONE_WA } from '../../lib/config'
import WhatsAppLink from '../WhatsAppLink'

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const formatBRLPrecise = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 })

export default function SimuladorClient() {
  const [propertyValue, setPropertyValue] = useState(450000)
  const [downPayment, setDownPayment] = useState(90000)
  const [termMonths, setTermMonths] = useState(360)
  const [annualRate, setAnnualRate] = useState(SAC_RATE_DEFAULT_ANNUAL)
  const [monthlyIncome, setMonthlyIncome] = useState(0)

  const minDown = Math.round(propertyValue * MIN_DOWN_PAYMENT_RATE)
  const downBelowMinimum = downPayment < minDown
  const downExceedsValue = downPayment >= propertyValue

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

  const eligibleMcmv = isMcmvEligible(propertyValue, monthlyIncome)
  const maxInstallment = monthlyIncome > 0 ? maxAffordableInstallment(monthlyIncome) : 0
  const installmentExceedsBudget =
    monthlyIncome > 0 && result.firstInstallment > maxInstallment

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <form className="lg:col-span-2 bg-white border border-gray-200 p-6 space-y-5">
        <div>
          <label htmlFor="propertyValue" className="block text-xs font-bold uppercase tracking-wider text-dark mb-2">
            Valor do imóvel
          </label>
          <input
            id="propertyValue"
            type="number"
            min={0}
            step={1000}
            value={propertyValue}
            onChange={(e) => setPropertyValue(Number(e.target.value) || 0)}
            className="input-field"
          />
          <p className="text-[11px] text-gray-500 mt-1">{formatBRL(propertyValue)}</p>
        </div>

        <div>
          <label htmlFor="downPayment" className="block text-xs font-bold uppercase tracking-wider text-dark mb-2">
            Entrada
          </label>
          <input
            id="downPayment"
            type="number"
            min={0}
            step={1000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
            className="input-field"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Mínimo recomendado: {formatBRL(minDown)} (20%)
          </p>
          {downBelowMinimum && !downExceedsValue && (
            <p className="text-[11px] text-amber-700 mt-1 flex items-start gap-1">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              Bancos costumam exigir entrada mínima de 20%.
            </p>
          )}
          {downExceedsValue && (
            <p className="text-[11px] text-red-700 mt-1 flex items-start gap-1">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              Entrada igual ou maior que o valor — não há financiamento.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="termMonths" className="block text-xs font-bold uppercase tracking-wider text-dark mb-2">
            Prazo
          </label>
          <select
            id="termMonths"
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value))}
            className="input-field"
          >
            {TERM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-500 mt-1">Prazo máximo permitido: {MAX_TERM_MONTHS} meses</p>
        </div>

        <div>
          <label htmlFor="annualRate" className="block text-xs font-bold uppercase tracking-wider text-dark mb-2">
            Juros anuais (%)
          </label>
          <input
            id="annualRate"
            type="number"
            min={0}
            step={0.01}
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
            className="input-field"
          />
          <p className="text-[11px] text-gray-500 mt-1">Taxa média Caixa SAC: {SAC_RATE_DEFAULT_ANNUAL}% a.a.</p>
        </div>

        <div>
          <label htmlFor="monthlyIncome" className="block text-xs font-bold uppercase tracking-wider text-dark mb-2">
            Renda familiar mensal (opcional)
          </label>
          <input
            id="monthlyIncome"
            type="number"
            min={0}
            step={500}
            value={monthlyIncome || ''}
            onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
            placeholder="Ex: 8000"
            className="input-field"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Usado para checar Minha Casa Minha Vida e capacidade de pagamento.
          </p>
        </div>
      </form>

      <div className="lg:col-span-3 space-y-4">
        <div className="bg-dark text-white p-6">
          <p className="text-[11px] uppercase tracking-widest text-white/60 mb-2">Primeira parcela</p>
          <p className="text-4xl md:text-5xl font-black">{formatBRLPrecise(result.firstInstallment)}</p>
          <p className="text-xs text-white/70 mt-2">
            Última parcela: {formatBRLPrecise(result.lastInstallment)} · sistema SAC, parcelas decrescentes
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 p-5">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Valor financiado</p>
            <p className="text-xl font-bold text-dark">{formatBRL(result.financedAmount)}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Total de juros</p>
            <p className="text-xl font-bold text-dark">{formatBRL(result.totalInterest)}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Total pago ao banco</p>
            <p className="text-xl font-bold text-dark">{formatBRL(result.totalPaid)}</p>
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Custo total da operação</p>
            <p className="text-xl font-bold text-dark">
              {formatBRL(result.totalPaid + result.itbiEstimate + result.registrationEstimate)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-dark mb-3">Custos iniciais (na assinatura)</p>
          <ul className="text-sm text-gray-700 space-y-1.5">
            <li className="flex justify-between">
              <span>Entrada</span>
              <span className="font-semibold">{formatBRL(downPayment)}</span>
            </li>
            <li className="flex justify-between">
              <span>ITBI (2% do valor)</span>
              <span className="font-semibold">{formatBRL(result.itbiEstimate)}</span>
            </li>
            <li className="flex justify-between">
              <span>Registro em cartório (≈ 2,5%)</span>
              <span className="font-semibold">{formatBRL(result.registrationEstimate)}</span>
            </li>
            <li className="flex justify-between border-t border-gray-300 pt-2 mt-2">
              <span className="font-bold">Total para fechar negócio</span>
              <span className="font-bold">{formatBRL(result.upfrontCostsTotal)}</span>
            </li>
          </ul>
        </div>

        {monthlyIncome > 0 && (
          <div
            className={`p-5 border ${
              installmentExceedsBudget ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {installmentExceedsBudget ? (
                <FiAlertCircle className="text-red-700 mt-0.5 flex-shrink-0" />
              ) : (
                <FiCheckCircle className="text-green-700 mt-0.5 flex-shrink-0" />
              )}
              <div className="text-sm">
                <p className={`font-bold ${installmentExceedsBudget ? 'text-red-800' : 'text-green-800'}`}>
                  {installmentExceedsBudget
                    ? 'Parcela acima do limite recomendado'
                    : 'Parcela cabe no seu orçamento'}
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  Bancos limitam parcela a 30% da renda. Para sua renda, o teto é{' '}
                  <strong>{formatBRL(maxInstallment)}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {eligibleMcmv && (
          <div className="bg-blue-50 border border-blue-200 p-5">
            <div className="flex items-start gap-2">
              <FiInfo className="text-blue-700 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-bold text-blue-900">Você pode se enquadrar no Minha Casa Minha Vida</p>
                <p className="text-xs text-gray-700 mt-1">
                  Renda até R$ 12.000 e imóvel até R$ 350.000 podem usar juros reduzidos e subsídios do programa.
                  As taxas reais costumam ser bem menores que a média de mercado.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-primary text-white p-6">
          <p className="font-bold text-lg mb-2">Quer simular com taxas reais?</p>
          <p className="text-sm text-white/90 mb-4">
            Posso pegar uma simulação de verdade no seu nome com Caixa, Itaú, Bradesco e Santander. Sem custo, sem
            compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <WhatsAppLink
              href={PHONE_WA}
              source="simulador"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold uppercase tracking-widest text-xs py-3 px-6 hover:bg-gray-100 transition-colors"
            >
              <FaWhatsapp size={16} /> Falar no WhatsApp
            </WhatsAppLink>
            <Link
              href="/imoveis"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold uppercase tracking-widest text-xs py-3 px-6 hover:bg-white/10 transition-colors"
            >
              Ver imóveis
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed">
          Simulação ilustrativa pelo sistema SAC (Sistema de Amortização Constante). Taxas reais variam por banco,
          relacionamento e perfil de crédito. ITBI e registro variam por município. Não é uma proposta de crédito.
        </p>
      </div>
    </div>
  )
}
