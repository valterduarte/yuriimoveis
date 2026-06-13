import { stripDiacritics } from './textNormalization'

/** Lowercased, accent-stripped, whitespace-collapsed text for matching. */
export function normalizeSearchText(text: string): string {
  return stripDiacritics(text.toLowerCase()).replace(/\s+/g, ' ').trim()
}

/** Joins arbitrary fields into a single normalized haystack string. */
export function buildSearchTerms(fields: Array<string | number | null | undefined>): string {
  return normalizeSearchText(
    fields.filter(value => value !== null && value !== undefined && value !== '').join(' '),
  )
}

/**
 * True when every whitespace-separated token of `query` appears somewhere in
 * `fields`. Accent-insensitive and order-independent, so "rochdale look",
 * "look rochdale" and "84" all match the same listing.
 *
 * Shared by the site search index and the admin list so both behave the same.
 */
export function matchesSearchQuery(
  fields: Array<string | number | null | undefined>,
  query: string,
): boolean {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true
  const haystack = buildSearchTerms(fields)
  return normalizedQuery.split(' ').every(token => haystack.includes(token))
}

export type SearchItemType = 'imovel' | 'empreendimento'

export interface SearchItem {
  type: SearchItemType
  label: string
  sublabel: string
  url: string
  /** Pre-normalized haystack, so client-side filtering stays cheap. */
  terms: string
}

/** Where the contiguous query first appears — earlier matches rank higher. */
function positionRank(terms: string, normalizedQuery: string): number {
  const index = terms.indexOf(normalizedQuery)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

/**
 * Filters a prebuilt index by `query`, ranking contiguous matches first and
 * returning at most `limit` items.
 */
export function filterSearchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []
  const tokens = normalizedQuery.split(' ')

  return items
    .filter(item => tokens.every(token => item.terms.includes(token)))
    .sort(
      (a, b) =>
        positionRank(a.terms, normalizedQuery) - positionRank(b.terms, normalizedQuery) ||
        a.label.length - b.label.length,
    )
    .slice(0, limit)
}
