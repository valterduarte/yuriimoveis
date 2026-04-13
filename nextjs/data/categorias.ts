import type { PropertyCategory } from '../types'

export interface CategoriaData {
  slug: PropertyCategory
  singular: string
  plural: string
}

export const CATEGORIAS: Record<PropertyCategory, CategoriaData> = {
  apartamento: { slug: 'apartamento', singular: 'Apartamento', plural: 'Apartamentos' },
  casa:        { slug: 'casa',        singular: 'Casa',        plural: 'Casas' },
  terreno:     { slug: 'terreno',     singular: 'Terreno',     plural: 'Terrenos' },
  chale:       { slug: 'chale',       singular: 'Chalé',       plural: 'Chalés' },
  comercial:   { slug: 'comercial',   singular: 'Imóvel Comercial', plural: 'Imóveis Comerciais' },
  chacara:     { slug: 'chacara',     singular: 'Chácara',     plural: 'Chácaras' },
}

export function getCategoriaBySlug(slug: string): CategoriaData | undefined {
  return CATEGORIAS[slug as PropertyCategory]
}
