import { stripDiacritics } from '../textNormalization'
import type { Imovel } from '../../types'

export function slugify(text: string): string {
  return stripDiacritics(String(text).toLowerCase())
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function imovelSlug(imovel: Pick<Imovel, 'titulo' | 'id'>): string {
  return `${slugify(imovel.titulo)}-${imovel.id}`
}

export function formatNeighborhoodName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
