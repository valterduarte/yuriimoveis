// Adiciona f_auto,q_auto nas URLs do Cloudinary → WebP automático + compressão
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

export function calcParcela(preco) {
  const financiado = preco * 0.8
  const taxa = preco < 264000 ? 0.055 : 0.0816
  const r = taxa / 12
  const n = 360
  const parcela = financiado * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(parcela)
}
