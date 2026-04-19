export interface AmenityFilter {
  slug: string
  label: string
  shortLabel: string
  heroLabel: string
  connector: 'com' | 'pet'
  matchTerms: string[]
}

export const AMENITY_FILTERS: AmenityFilter[] = [
  {
    slug: 'com-piscina',
    label: 'com piscina',
    shortLabel: 'com piscina',
    heroLabel: 'piscina',
    connector: 'com',
    matchTerms: ['piscina'],
  },
  {
    slug: 'com-churrasqueira',
    label: 'com churrasqueira',
    shortLabel: 'com churrasqueira',
    heroLabel: 'churrasqueira',
    connector: 'com',
    matchTerms: ['churrasqueira', 'espaço gourmet', 'terraço gourmet', 'espaço grill', 'varanda gourmet', 'lounge gourmet'],
  },
  {
    slug: 'com-academia',
    label: 'com academia',
    shortLabel: 'com academia',
    heroLabel: 'academia',
    connector: 'com',
    matchTerms: ['academia', 'fitness', 'crossfit'],
  },
  {
    slug: 'com-playground',
    label: 'com playground',
    shortLabel: 'com playground',
    heroLabel: 'playground',
    connector: 'com',
    matchTerms: ['playground', 'brinquedoteca', 'play baby'],
  },
  {
    slug: 'pet-friendly',
    label: 'pet friendly',
    shortLabel: 'pet friendly',
    heroLabel: 'espaço pet',
    connector: 'pet',
    matchTerms: ['pet place', 'pet friendly', 'pet club', 'espaço pet', 'pet care', 'aceita pet'],
  },
  {
    slug: 'com-coworking',
    label: 'com coworking',
    shortLabel: 'com coworking',
    heroLabel: 'coworking',
    connector: 'com',
    matchTerms: ['coworking', 'sala de reunião', 'home office'],
  },
]

export function getAmenityFilterBySlug(slug: string): AmenityFilter | undefined {
  return AMENITY_FILTERS.find(a => a.slug === slug)
}

export function imovelMatchesAmenity(diferenciais: string[], amenity: AmenityFilter): boolean {
  for (const raw of diferenciais) {
    const lc = raw.toLowerCase()
    for (const term of amenity.matchTerms) {
      if (lc.includes(term)) return true
    }
  }
  return false
}
