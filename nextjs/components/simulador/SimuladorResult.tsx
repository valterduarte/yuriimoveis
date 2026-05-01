'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { FiAlertCircle, FiArrowDown, FiCheckCircle, FiClock, FiHome, FiShield, FiZap } from 'react-icons/fi'
import WhatsAppLink from '../WhatsAppLink'
import { CRECI } from '../../lib/config'
import { formatBRL, formatBRLInteger, formatCentsOnly, formatRate } from '../../lib/formatters'
import AnimatedValue from './AnimatedValue'
import type { CreditProgram, SimulationResult } from '../../lib/financiamento'

interface SimuladorResultProps {
  propertyValue: number
  downPayment: number
  downPercent: number
  termMonths: number
  annualRate: number
  monthlyIncome: number
  detectedProgram: CreditProgram
  result: SimulationResult
  maxInstallment: number
  installmentExceedsBudget: boolean
  whatsappHref: string
}

type BadgeColors = { bg: string; text: string; border: string; icon: string }

function programColors(id: CreditProgram['id']): BadgeColors {
  switch (id) {
    case 'mcmv_1':
    case 'mcmv_2':
    case 'mcmv_3':         return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: 'text-green-600' }
    case 'mcmv_estimado':  return { bg: 'bg-amber-50',  text: 'text-amber-800', border: 'border-amber-200', icon: 'text-amber-600' }
    case 'associativo':    return { bg: 'bg-blue-100',  text: 'text-blue-800',  border: 'border-blue-300',  icon: 'text-blue-600'  }
    case 'sbpe':           return { bg: 'bg-gray-100',  text: 'text-gray-700',  border: 'border-gray-300',  icon: 'text-gray-500'  }
  }
}

function programIconBg(id: CreditProgram['id']): string {
  if (id === 'mcmv_estimado') return 'bg-amber-200'
  if (id === 'sbpe')          return 'bg-gray-200'
  if (id === 'associativo')   return 'bg-blue-200'
  return 'bg-green-200'
}

function programDescriptionSuffix(id: CreditProgram['id']): string {
  switch (id) {
    case 'mcmv_1':         return ' — possibilidade de subsídio na entrada.'
    case 'mcmv_2':         return ' — juros reduzidos com subsídio parcial.'
    case 'mcmv_3':         return ' — juros abaixo do mercado.'
    case 'mcmv_estimado':  return ' — preencha sua renda para encontrar uma taxa ainda menor (a partir de 4% a.a.).'
    case 'associativo':    return ' — condições especiais via cooperativas.'
    case 'sbpe':           return ' — financiamento padrão do mercado. Com relacionamento bancário (conta salário, portabilidade, seguros) a taxa pode cair para ~9,9% a.a.'
  }
}

export default function SimuladorResult({
  propertyValue,
  downPayment,
  downPercent,
  termMonths,
  annualRate,
  monthlyIncome,
  detectedProgram,
  result,
  maxInstallment,
  installmentExceedsBudget,
  whatsappHref,
}: SimuladorResultProps) {
  const colors = programColors(detectedProgram.id)

  return (
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
            <div className="flex items-center justify-between gap-4 mb-7 flex-wrap">
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                Primeira parcela
                <span className="text-gray-600 font-normal normal-case tracking-normal ml-2">· Sistema SAC</span>
              </p>
              <p className="text-[11px] md:text-xs font-bold text-primary">{formatRate(annualRate)}% a.a.</p>
            </div>

            <div className="flex items-baseline flex-wrap">
              <p className="text-6xl md:text-7xl font-black text-white leading-none tracking-tight">
                <AnimatedValue value={result.firstInstallment} formatter={formatBRLInteger} />
              </p>
              <p className="text-base md:text-lg font-bold text-gray-500 leading-none">
                ,<AnimatedValue value={result.firstInstallment} formatter={formatCentsOnly} />
              </p>
              <p className="text-sm md:text-base font-bold text-gray-500 leading-none ml-2">/mês</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                  <FiArrowDown size={11} className="text-green-400" />
                  Última parcela
                </p>
                <p className="text-xl md:text-2xl font-black text-green-400 leading-none">
                  <AnimatedValue value={result.lastInstallment} formatter={formatBRL} />
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                  <FiClock size={11} className="text-gray-400" />
                  Duração
                </p>
                <p className="text-xl md:text-2xl font-black text-white leading-none">
                  {termMonths}<span className="text-sm md:text-base text-gray-500 font-bold ml-1.5">meses</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detected program card */}
      <div className={`border ${colors.border} overflow-hidden`}>
        <div className={`px-6 py-5 flex items-start gap-3 ${colors.bg}`}>
          <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 ${programIconBg(detectedProgram.id)}`}>
            <FiZap size={16} className={colors.icon} />
          </div>
          <div>
            <p className={`text-sm font-black uppercase tracking-wider ${colors.text}`}>{detectedProgram.label}</p>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              {detectedProgram.description}. Taxa aplicada: <strong>{formatRate(detectedProgram.rate)}% a.a.</strong>
              {programDescriptionSuffix(detectedProgram.id)}
            </p>
          </div>
        </div>
      </div>

      {/* What you need to have */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <span className="w-6 h-1 bg-primary flex-shrink-0" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-dark">O que você precisa ter</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Valores pagos na assinatura do contrato</p>
          </div>
        </div>

        <div className="bg-primary/5 border-l-[3px] border-primary px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base md:text-lg font-black uppercase tracking-[0.15em] text-primary">Entrada</span>
            <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 bg-primary/15 text-primary">{downPercent}%</span>
          </div>
          <p className="text-xl md:text-2xl font-black text-dark leading-none mb-5">
            <AnimatedValue value={Math.min(downPayment, propertyValue)} formatter={formatBRL} />
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/15">
            <div className="flex items-start gap-2.5">
              <FiCheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-black text-dark leading-tight">Parcelável</p>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">com a construtora em imóveis na planta</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <FiCheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-black text-dark leading-tight">FGTS aceito</p>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">em residenciais dentro do SFH</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-2.5 text-[11px]">
          <div className="flex items-baseline justify-between text-gray-500">
            <span>ITBI <span className="text-gray-400">(2%)</span></span>
            <span className="font-bold text-gray-700 tabular-nums">
              <AnimatedValue value={result.itbiEstimate} formatter={formatBRL} />
            </span>
          </div>
          <div className="flex items-baseline justify-between text-gray-500">
            <span>Registro em cartório <span className="text-gray-400">(~2,5%)</span></span>
            <span className="font-bold text-gray-700 tabular-nums">
              <AnimatedValue value={result.registrationEstimate} formatter={formatBRL} />
            </span>
          </div>
          <div className="flex items-baseline justify-between text-gray-500 pt-2.5 border-t border-gray-100">
            <span className="uppercase tracking-wider text-[10px] font-bold">Valor financiado · SAC</span>
            <span className="font-bold text-gray-700 tabular-nums">
              <AnimatedValue value={result.financedAmount} formatter={formatBRL} />
            </span>
          </div>
        </div>
      </div>

      {/* Budget check */}
      {monthlyIncome > 0 && (
        <div className={`overflow-hidden border ${installmentExceedsBudget ? 'border-red-200' : 'border-green-200'}`}>
          <div className={`px-6 py-5 flex items-start gap-3 ${installmentExceedsBudget ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`w-8 h-8 ${installmentExceedsBudget ? 'bg-red-200' : 'bg-green-200'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {installmentExceedsBudget
                ? <FiAlertCircle size={16} className="text-red-700" />
                : <FiCheckCircle size={16} className="text-green-700" />}
            </div>
            <div>
              <p className={`text-sm font-black uppercase tracking-wider ${installmentExceedsBudget ? 'text-red-800' : 'text-green-800'}`}>
                {installmentExceedsBudget ? 'Parcela acima do limite' : 'Parcela dentro do orçamento'}
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
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-2">Próximo passo</p>
          <p className="font-black text-xl md:text-2xl text-white uppercase tracking-wide mb-3 leading-tight">
            Quer que eu simule nos bancos pra você?
          </p>
          <p className="text-sm text-white/70 mb-6 max-w-md leading-relaxed">
            Envio a proposta no seu nome para Caixa, Itaú, Bradesco e Santander e
            volto com as taxas reais. Sem custo, sem compromisso.
          </p>

          <WhatsAppLink
            href={whatsappHref}
            source="simulador"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-[0.2em] text-xs py-4 px-7 transition-all hover:shadow-lg hover:shadow-green-500/25"
          >
            <FaWhatsapp size={18} /> Enviar esta simulação
          </WhatsAppLink>

          <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/15 flex items-center justify-center flex-shrink-0">
                <FiShield size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-black text-white leading-none">Corretor Yuri</p>
                <p className="text-[10px] text-gray-400 mt-1">CRECI-SP {CRECI}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-green-400" />
              </span>
              <p className="text-[11px] text-gray-300">Resposta rápida no WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] bg-dark border-t border-primary/30 shadow-2xl">
        <WhatsAppLink
          href={whatsappHref}
          source="simulador-floating"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-[0.15em] text-xs py-4"
        >
          <FaWhatsapp size={18} /> Enviar simulação para o Yuri
        </WhatsAppLink>
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed tracking-wide">
        Simulação ilustrativa pelo sistema SAC. Taxas reais variam por banco,
        relacionamento e perfil de crédito. ITBI e registro variam por município.
        Não é proposta de crédito.
      </p>
    </div>
  )
}
