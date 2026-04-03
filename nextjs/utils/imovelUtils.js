export function optimizeCloudinaryUrl(url, width) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  const transforms = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto'
  return url.replace('/upload/', `/upload/${transforms}/`)
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function imovelSlug(imovel) {
  return `${slugify(imovel.titulo)}-${imovel.id}`
}

export function formatPrice(price, tipo) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price)
  return tipo === 'aluguel' ? `${formatted}/mês` : formatted
}

// Financiamento: Caixa Econômica Federal
// MCMV (Minha Casa Minha Vida): imóveis até R$264.000 — taxa 5,5% a.a.
// Demais imóveis: taxa 8,16% a.a. (SBPE)
// Entrada mínima: 20% (financia 80%), prazo: 360 meses
const FINANCING_DOWN_PAYMENT = 0.8
const MCMV_PRICE_LIMIT = 264000
const MCMV_ANNUAL_RATE = 0.055
const STANDARD_ANNUAL_RATE = 0.0816
const FINANCING_MONTHS = 360

export function calcParcela(preco) {
  const financiado = preco * FINANCING_DOWN_PAYMENT
  const taxa = preco < MCMV_PRICE_LIMIT ? MCMV_ANNUAL_RATE : STANDARD_ANNUAL_RATE
  const r = taxa / 12
  const n = FINANCING_MONTHS
  const parcela = financiado * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(parcela)
}

export function buildSeoDescription(imovel) {
  if (imovel.descricao_seo) return imovel.descricao_seo.slice(0, 155)
  if (imovel.descricao) {
    return imovel.descricao
      .replace(/[\u{1F000}-\u{1FFFF}]|[\u2600-\u27FF]/gu, '')
      .replace(/\n/g, ' ')
      .slice(0, 155)
      .trim()
  }
  return `${imovel.titulo} em ${imovel.cidade || 'Osasco'}, SP. ${imovel.tipo === 'aluguel' ? 'Aluguel' : 'Venda'}.`
}

export function formatNeighborhoodName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function ogImageUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/f_jpg,q_80,w_1200,h_630,c_fill/')
}
