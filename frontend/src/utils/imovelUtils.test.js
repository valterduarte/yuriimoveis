import { describe, test, expect } from 'vitest'
import { calcParcela, formatPrice } from './imovelUtils'

describe('calcParcela', () => {
  test('usa taxa de 5,5% a.a. para imóveis abaixo de R$264.000', () => {
    // R$200.000 → financia 80% = R$160.000, taxa 5,5%a.a., 360 meses
    expect(calcParcela(200000)).toBe('R$\u00a0908')
  })

  test('usa taxa de 8,16% a.a. para imóveis a partir de R$264.000', () => {
    // R$300.000 → financia 80% = R$240.000, taxa 8,16%a.a., 360 meses
    expect(calcParcela(300000)).toBe('R$\u00a01.788')
  })

  test('aplica a taxa maior exatamente no limite de R$264.000', () => {
    // R$264.000 não é menor que 264000, então usa taxa 8,16%
    expect(calcParcela(264000)).toBe('R$\u00a01.573')
  })

  test('escala corretamente para imóvel de alto valor', () => {
    expect(calcParcela(500000)).toBe('R$\u00a02.980')
  })

  test('retorna string formatada em reais (começa com R$)', () => {
    const resultado = calcParcela(200000)
    expect(resultado).toMatch(/^R\$/)
  })
})

describe('formatPrice', () => {
  test('formata preço de venda sem sufixo', () => {
    const resultado = formatPrice(350000, 'venda')
    expect(resultado).toMatch(/350/)
    expect(resultado).not.toContain('/mês')
  })

  test('adiciona /mês para aluguel', () => {
    const resultado = formatPrice(2500, 'aluguel')
    expect(resultado).toContain('/mês')
  })
})
