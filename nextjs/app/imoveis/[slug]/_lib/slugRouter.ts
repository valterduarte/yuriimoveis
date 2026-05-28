import { findLandingPage } from '../../../../data/landingPages'

export type SlugRoute =
  | { kind: 'property'; id: string }
  | { kind: 'landing' }
  | { kind: 'bairro' }

const TRAILING_ID = /-(\d+)$/

/**
 * Classifies an /imoveis/[slug] path into one of three concrete routes.
 *
 * - `property` — slug ends in `-{id}` (e.g. casa-jardim-piratininga-42)
 * - `landing`  — slug matches a configured landing page (casas-a-venda)
 * - `bairro`   — anything else is treated as a neighborhood page
 */
export function classifySlug(slug: string): SlugRoute {
  const propertyMatch = slug.match(TRAILING_ID)
  if (propertyMatch) return { kind: 'property', id: propertyMatch[1] }
  if (findLandingPage(slug)) return { kind: 'landing' }
  return { kind: 'bairro' }
}
