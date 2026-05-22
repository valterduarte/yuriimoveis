import {
  MCMV_FAIXA_1_INCOME_LIMIT,
  MCMV_FAIXA_2_INCOME_LIMIT,
  MCMV_FAIXA_3_INCOME_LIMIT,
  MCMV_FAIXA_4_INCOME_LIMIT,
  MCMV_PROPERTY_LIMIT,
  MCMV_FAIXA_4_PROPERTY_LIMIT,
  SAC_RATE_DEFAULT_ANNUAL,
} from '../lib/financiamento'

export interface McmvFaixa {
  id: 'faixa-1' | 'faixa-2' | 'faixa-3' | 'faixa-4'
  nome: string
  incomeMin: number
  incomeMax: number
  propertyLimit: number
  rate: number
  rateFormatted: string
  incomeRangeFormatted: string
  propertyLimitFormatted: string
  audience: string
  shortDescription: string
}

const fmtBRL = (value: number) =>
  value >= 1000 ? `R$ ${(value / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} mil` : `R$ ${value}`

function incomeRange(min: number, max: number): string {
  if (min === 0) return `até R$ ${max.toLocaleString('pt-BR')}/mês`
  return `R$ ${min.toLocaleString('pt-BR')} a R$ ${max.toLocaleString('pt-BR')}/mês`
}

function rateText(rate: number): string {
  return `${rate.toFixed(2).replace('.', ',')}% a.a.`
}

export const MCMV_FAIXAS: readonly McmvFaixa[] = [
  {
    id:                     'faixa-1',
    nome:                   'Faixa 1',
    incomeMin:              0,
    incomeMax:              MCMV_FAIXA_1_INCOME_LIMIT,
    propertyLimit:          MCMV_PROPERTY_LIMIT,
    rate:                   4.0,
    rateFormatted:          rateText(4.0),
    incomeRangeFormatted:   incomeRange(0, MCMV_FAIXA_1_INCOME_LIMIT),
    propertyLimitFormatted: fmtBRL(MCMV_PROPERTY_LIMIT),
    audience:               'Subsidio direto na entrada · juros mais baixos do programa',
    shortDescription:       'Renda até R$ 3.200 · Juros subsidiados',
  },
  {
    id:                     'faixa-2',
    nome:                   'Faixa 2',
    incomeMin:              MCMV_FAIXA_1_INCOME_LIMIT,
    incomeMax:              MCMV_FAIXA_2_INCOME_LIMIT,
    propertyLimit:          MCMV_PROPERTY_LIMIT,
    rate:                   5.5,
    rateFormatted:          rateText(5.5),
    incomeRangeFormatted:   incomeRange(MCMV_FAIXA_1_INCOME_LIMIT, MCMV_FAIXA_2_INCOME_LIMIT),
    propertyLimitFormatted: fmtBRL(MCMV_PROPERTY_LIMIT),
    audience:               'Possível subsídio parcial · público mais frequente em Osasco',
    shortDescription:       'Renda de R$ 3.200 a R$ 5.000',
  },
  {
    id:                     'faixa-3',
    nome:                   'Faixa 3',
    incomeMin:              MCMV_FAIXA_2_INCOME_LIMIT,
    incomeMax:              MCMV_FAIXA_3_INCOME_LIMIT,
    propertyLimit:          MCMV_PROPERTY_LIMIT,
    rate:                   7.66,
    rateFormatted:          rateText(7.66),
    incomeRangeFormatted:   incomeRange(MCMV_FAIXA_2_INCOME_LIMIT, MCMV_FAIXA_3_INCOME_LIMIT),
    propertyLimitFormatted: fmtBRL(MCMV_PROPERTY_LIMIT),
    audience:               'Sem subsídio · juros ainda muito abaixo do mercado livre',
    shortDescription:       'Renda de R$ 5.000 a R$ 9.600 · Imóvel até R$ 400 mil',
  },
  {
    id:                     'faixa-4',
    nome:                   'Faixa 4',
    incomeMin:              MCMV_FAIXA_3_INCOME_LIMIT,
    incomeMax:              MCMV_FAIXA_4_INCOME_LIMIT,
    propertyLimit:          MCMV_FAIXA_4_PROPERTY_LIMIT,
    rate:                   9.9,
    rateFormatted:          rateText(9.9),
    incomeRangeFormatted:   incomeRange(MCMV_FAIXA_3_INCOME_LIMIT, MCMV_FAIXA_4_INCOME_LIMIT),
    propertyLimitFormatted: fmtBRL(MCMV_FAIXA_4_PROPERTY_LIMIT),
    audience:               'Novidade 2026 · teto ampliado para classe média',
    shortDescription:       'Renda de R$ 9.600 a R$ 13.000 · Imóvel até R$ 600 mil',
  },
]

export interface FinancingProgramRow {
  programa: string
  taxa: string
  perfil: string
}

function perfilFromFaixa(faixa: McmvFaixa): string {
  const renda = faixa.incomeMin === 0
    ? `Renda até R$ ${faixa.incomeMax.toLocaleString('pt-BR')}`
    : `Renda R$ ${faixa.incomeMin.toLocaleString('pt-BR')} a R$ ${faixa.incomeMax.toLocaleString('pt-BR')}`
  return `${renda}. Imóvel até ${faixa.propertyLimitFormatted}.`
}

export const FINANCING_PROGRAMS: readonly FinancingProgramRow[] = [
  ...MCMV_FAIXAS.map(faixa => ({
    programa: `MCMV — ${faixa.nome}`,
    taxa:     faixa.rateFormatted,
    perfil:   perfilFromFaixa(faixa),
  })),
  {
    programa: 'Crédito Associativo',
    taxa:     rateText(8.5),
    perfil:   'Cooperativas e programas habitacionais. Renda até R$ 13 mil.',
  },
  {
    programa: 'Caixa SBPE — imóvel elegível MCMV',
    taxa:     rateText(9.9),
    perfil:   'SBPE com relacionamento, imóvel dentro do teto MCMV.',
  },
  {
    programa: 'SBPE — mercado livre',
    taxa:     rateText(SAC_RATE_DEFAULT_ANNUAL),
    perfil:   'Financiamento tradicional dos bancos, fora do MCMV.',
  },
]

export interface IncomePreset {
  label: string
  min:   number
  max:   number
  value: number
}

export const INCOME_PRESETS: readonly IncomePreset[] = [
  { label: 'Até R$ 3.200',         min: 1,                                  max: MCMV_FAIXA_1_INCOME_LIMIT, value: 2500 },
  { label: 'R$ 3.200 – 5.000',     min: MCMV_FAIXA_1_INCOME_LIMIT + 1,      max: MCMV_FAIXA_2_INCOME_LIMIT, value: 4200 },
  { label: 'R$ 5.000 – 9.600',     min: MCMV_FAIXA_2_INCOME_LIMIT + 1,      max: MCMV_FAIXA_3_INCOME_LIMIT, value: 7500 },
  { label: 'R$ 9.600 – 13.000',    min: MCMV_FAIXA_3_INCOME_LIMIT + 1,      max: MCMV_FAIXA_4_INCOME_LIMIT, value: 11000 },
  { label: 'Acima de R$ 13.000',   min: MCMV_FAIXA_4_INCOME_LIMIT + 1,      max: Infinity,                  value: 18000 },
]
