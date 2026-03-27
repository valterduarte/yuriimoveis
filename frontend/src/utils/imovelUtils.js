export function formatPrice(price, tipo) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
  return tipo === 'aluguel' ? `${formatted}/mês` : formatted
}

export function calcParcela(preco) {
  const financiado = preco * 0.8
  const taxa = preco < 264000 ? 0.055 : 0.0816
  const r = taxa / 12
  const n = 360
  const parcela = financiado * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(parcela)
}
