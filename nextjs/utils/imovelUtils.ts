import type { Imovel } from '../types'

export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  const transforms = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto'
  return url.replace('/upload/', `/upload/${transforms}/`)
}

export function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function imovelSlug(imovel: Pick<Imovel, 'titulo' | 'id'>): string {
  return `${slugify(imovel.titulo)}-${imovel.id}`
}

export function formatPrice(price: number, tipo: string): string {
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

export function calcParcela(preco: number): string {
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

export function buildSeoDescription(imovel: Imovel): string {
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

export function formatNeighborhoodName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const FEMININE_BAIRRO_FIRST_WORDS = new Set([
  'vila', 'aldeia', 'praia', 'rua', 'avenida', 'travessa', 'alameda', 'cruz',
  'conceição', 'conceicao', 'padroeira', 'bela', 'santa', 'chácara', 'chacara',
])

function isFeminineBairroName(nome: string): boolean {
  const first = nome.trim().split(/\s+/)[0].toLowerCase()
  return FEMININE_BAIRRO_FIRST_WORDS.has(first)
}

export function emBairro(nome: string): 'no' | 'na' {
  return isFeminineBairroName(nome) ? 'na' : 'no'
}

export function deBairro(nome: string): 'do' | 'da' {
  return isFeminineBairroName(nome) ? 'da' : 'do'
}

export function sobreBairro(nome: string): 'sobre o' | 'sobre a' {
  return isFeminineBairroName(nome) ? 'sobre a' : 'sobre o'
}

export function articuloBairro(nome: string): 'o' | 'a' {
  return isFeminineBairroName(nome) ? 'a' : 'o'
}

export function aoBairro(nome: string): 'ao' | 'à' {
  return isFeminineBairroName(nome) ? 'à' : 'ao'
}

export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function pluralizeImoveis(count: number): { noun: string; adjective: string } {
  return count === 1
    ? { noun: 'imóvel', adjective: 'disponível' }
    : { noun: 'imóveis', adjective: 'disponíveis' }
}

export function formatListingAge(createdAt: string | null | undefined): string | null {
  if (!createdAt) return null
  const created = new Date(createdAt)
  if (Number.isNaN(created.getTime())) return null

  const diffMs = Date.now() - created.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return null
  if (diffDays === 0) return 'Anunciado hoje'
  if (diffDays === 1) return 'Anunciado ontem'
  if (diffDays < 7) return `Anunciado há ${diffDays} dias`
  if (diffDays < 14) return 'Anunciado há 1 semana'
  if (diffDays < 30) return `Anunciado há ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 60) return 'Anunciado há 1 mês'
  if (diffDays < 365) return `Anunciado há ${Math.floor(diffDays / 30)} meses`
  return 'Anunciado há mais de 1 ano'
}

export function ogImageUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/f_jpg,q_80,w_1200,h_630,c_fill/')
}
