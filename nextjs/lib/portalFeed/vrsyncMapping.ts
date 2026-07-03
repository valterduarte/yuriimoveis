/**
 * Traduz os enums/campos do imóvel para o vocabulário do VRSync (feed do Grupo
 * OLX — ZAP / Viva Real / OLX). Funções puras, sem I/O, testáveis isoladamente.
 *
 * Referência oficial da spec:
 * https://developers.grupozap.com/feeds/vrsync/elements/details.html
 */
import type { Imovel } from '../../types'

export type VrsyncPropertyMapping = {
  propertyType: string
  usageType: 'Residential' | 'Commercial'
  /** Qual elemento de área do VRSync usar para o campo `area` do imóvel. */
  areaField: 'LivingArea' | 'LotArea'
}

// categoria do site → tipo/uso do imóvel no VRSync.
const CATEGORIA_MAP: Record<Imovel['categoria'], VrsyncPropertyMapping> = {
  casa:        { propertyType: 'Residential / Home',       usageType: 'Residential', areaField: 'LivingArea' },
  apartamento: { propertyType: 'Residential / Apartment',  usageType: 'Residential', areaField: 'LivingArea' },
  terreno:     { propertyType: 'Residential / Land Lot',   usageType: 'Residential', areaField: 'LotArea' },
  chale:       { propertyType: 'Residential / Home',       usageType: 'Residential', areaField: 'LivingArea' },
  comercial:   { propertyType: 'Commercial / Building',    usageType: 'Commercial', areaField: 'LivingArea' },
  chacara:     { propertyType: 'Residential / Farm Ranch', usageType: 'Residential', areaField: 'LotArea' },
}

export function mapCategoria(categoria: Imovel['categoria']): VrsyncPropertyMapping {
  return CATEGORIA_MAP[categoria] ?? CATEGORIA_MAP.casa
}

export function mapTransactionType(tipo: Imovel['tipo']): 'For Sale' | 'For Rent' {
  return tipo === 'aluguel' ? 'For Rent' : 'For Sale'
}

/**
 * Diferenciais em texto livre (PT) → valores oficiais do enum `Feature` do VRSync.
 * Só labels confirmados na spec entram; termos não reconhecidos são descartados
 * para nunca emitir um Feature inválido que o portal rejeitaria.
 */
const FEATURE_MAP: Record<string, string> = {
  'piscina': 'Pool',
  'academia': 'Gym',
  'elevador': 'Elevator',
  'sauna': 'Sauna',
  'varanda': 'Balcony',
  'sacada': 'Balcony',
  'jardim': 'Garden Area',
  'area verde': 'Garden Area',
  'mobiliado': 'Furnished',
  'ar condicionado': 'Air conditioning',
  'aceita pet': 'Pets Allowed',
  'aceita pets': 'Pets Allowed',
  'portaria 24h': 'Security Guard on Duty',
  'portaria 24 horas': 'Security Guard on Duty',
  'seguranca 24h': 'Security Guard on Duty',
  'varanda gourmet': 'Gourmet Area',
  'area gourmet': 'Gourmet Area',
  'espaco gourmet': 'Gourmet Area',
  'lareira': 'Fireplace',
  'lavanderia': 'Laundry',
  'area de servico': 'Laundry',
  'salao de jogos': 'Game room',
  'garagem': 'Parking Garage',
  'vaga de garagem': 'Parking Garage',
}

function normalizeFeatureKey(raw: string): string {
  // Lowercase + remove acentos para casar "Piscina", "piscina", "PISCINA" etc.
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function mapFeatures(diferenciais: string[]): string[] {
  const out: string[] = []
  for (const term of diferenciais) {
    const mapped = FEATURE_MAP[normalizeFeatureKey(term)]
    if (mapped && !out.includes(mapped)) out.push(mapped)
  }
  return out
}
