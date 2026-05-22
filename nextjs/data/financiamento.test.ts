import { describe, it, expect } from 'vitest'
import { FINANCING_PROGRAMS, MCMV_FAIXAS, INCOME_PRESETS } from './financiamento'

describe('MCMV_FAIXAS', () => {
  it('covers the four 2026 income bands', () => {
    expect(MCMV_FAIXAS.map(f => f.nome)).toEqual(['Faixa 1', 'Faixa 2', 'Faixa 3', 'Faixa 4'])
  })

  it('applies the R$ 600 mil ceiling only to Faixa 4', () => {
    expect(MCMV_FAIXAS[0].propertyLimitFormatted).toBe('R$ 400 mil')
    expect(MCMV_FAIXAS[1].propertyLimitFormatted).toBe('R$ 400 mil')
    expect(MCMV_FAIXAS[2].propertyLimitFormatted).toBe('R$ 400 mil')
    expect(MCMV_FAIXAS[3].propertyLimitFormatted).toBe('R$ 600 mil')
  })
})

describe('FINANCING_PROGRAMS', () => {
  it('reproduces the legacy rate-table rows for the simulator', () => {
    const map = Object.fromEntries(FINANCING_PROGRAMS.map(r => [r.programa, r]))
    expect(map['MCMV — Faixa 1'].taxa).toBe('4,00% a.a.')
    expect(map['MCMV — Faixa 1'].perfil).toBe('Renda até R$ 3.200. Imóvel até R$ 400 mil.')
    expect(map['MCMV — Faixa 2'].perfil).toBe('Renda R$ 3.200 a R$ 5.000. Imóvel até R$ 400 mil.')
    expect(map['MCMV — Faixa 3'].perfil).toBe('Renda R$ 5.000 a R$ 9.600. Imóvel até R$ 400 mil.')
    expect(map['MCMV — Faixa 4'].perfil).toBe('Renda R$ 9.600 a R$ 13.000. Imóvel até R$ 600 mil.')
    expect(map['SBPE — mercado livre'].taxa).toBe('11,49% a.a.')
  })
})

describe('INCOME_PRESETS', () => {
  it('aligns preset boundaries with MCMV income limits', () => {
    expect(INCOME_PRESETS[0].max).toBe(MCMV_FAIXAS[0].incomeMax)
    expect(INCOME_PRESETS[1].max).toBe(MCMV_FAIXAS[1].incomeMax)
    expect(INCOME_PRESETS[2].max).toBe(MCMV_FAIXAS[2].incomeMax)
    expect(INCOME_PRESETS[3].max).toBe(MCMV_FAIXAS[3].incomeMax)
  })
})
