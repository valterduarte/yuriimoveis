'use client'

import { useState } from 'react'
import { FiInfo } from 'react-icons/fi'

interface CityRate {
  label: string
  padrao: number
  sfh: number
}

const CITY_RATES: Record<string, CityRate> = {
  osasco:      { label: 'Osasco',      padrao: 0.03,  sfh: 0.03  },
  barueri:     { label: 'Barueri',     padrao: 0.05,  sfh: 0.01  },
  carapicuiba: { label: 'Carapicuíba', padrao: 0.02,  sfh: 0.01  },
  sao_paulo:   { label: 'São Paulo',   padrao: 0.03,  sfh: 0.005 },
}

const FMT = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

function parseNumber(raw: string): number {
  return Number(raw.replace(/\D/g, '')) || 0
}

function formatInput(raw: string): string {
  const n = parseNumber(raw)
  if (!n) return ''
  return FMT.format(n)
}

export default function ItbiCalculator() {
  const [cidade, setCidade] = useState<keyof typeof CITY_RATES>('osasco')
  const [valor, setValor] = useState('')
  const [sfh, setSfh] = useState(true)

  const cityRate = CITY_RATES[cidade]
  const numericValor = parseNumber(valor)
  const aliquota = sfh ? cityRate.sfh : cityRate.padrao
  const itbi = numericValor * aliquota

  return (
    <div className="not-prose my-10 border border-gray-200 bg-gray-50 p-6 md:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Calculadora ITBI</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-gray-600 mb-1.5 block">Cidade</span>
          <select
            value={cidade}
            onChange={e => setCidade(e.target.value as keyof typeof CITY_RATES)}
            className="w-full border border-gray-300 bg-white text-sm text-dark px-3 py-2.5 focus:outline-none focus:border-primary"
          >
            {Object.entries(CITY_RATES).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-wider text-gray-600 mb-1.5 block">Valor do imóvel</span>
          <input
            type="text"
            inputMode="numeric"
            value={valor}
            onChange={e => setValor(formatInput(e.target.value))}
            placeholder="R$ 350.000"
            className="w-full border border-gray-300 bg-white text-sm text-dark px-3 py-2.5 focus:outline-none focus:border-primary"
          />
        </label>
      </div>

      <label className="inline-flex items-center gap-2 mt-4 text-xs text-gray-700">
        <input
          type="checkbox"
          checked={sfh}
          onChange={e => setSfh(e.target.checked)}
          className="accent-primary"
        />
        Imóvel residencial financiado pelo SFH (alíquota reduzida)
      </label>

      <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Alíquota</p>
          <p className="text-base font-bold text-dark">{(aliquota * 100).toFixed(aliquota < 0.01 ? 2 : 1)}%</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">ITBI estimado</p>
          <p className="text-base font-bold text-primary">
            {numericValor > 0 ? FMT.format(itbi) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Custo total estimado*</p>
          <p className="text-base font-bold text-dark">
            {numericValor > 0 ? FMT.format(itbi + numericValor * 0.025) : '—'}
          </p>
        </div>
      </div>

      <p className="mt-4 flex gap-2 text-[11px] text-gray-500 leading-relaxed">
        <FiInfo size={12} className="flex-shrink-0 mt-0.5" />
        <span>
          *Inclui ~2,5% de registro e emolumentos da tabela TJ-SP. Cálculo de referência: confirme a alíquota vigente
          na guia oficial da prefeitura antes da escritura. {cityRate.label === 'Osasco' && 'Osasco usa 3% pela LC 227/2026.'}
        </span>
      </p>
    </div>
  )
}
