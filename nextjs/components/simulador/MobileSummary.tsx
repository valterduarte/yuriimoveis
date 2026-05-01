'use client'

import { formatBRL, formatRate } from '../../lib/formatters'
import AnimatedValue from './AnimatedValue'

interface MobileSummaryProps {
  propertyValue: number
  annualRate: number
  firstInstallment: number
}

export default function MobileSummary({ propertyValue, annualRate, firstInstallment }: MobileSummaryProps) {
  return (
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
            <AnimatedValue value={firstInstallment} formatter={formatBRL} />
            <span className="text-[10px] font-bold text-gray-400 ml-1">/mês</span>
          </p>
        </div>
      </div>
    </div>
  )
}
