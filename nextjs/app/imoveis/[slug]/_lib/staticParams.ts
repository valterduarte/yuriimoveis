import { fetchAllPropertySlugs, fetchDistinctBairros } from '../../../../lib/api'
import { imovelSlug, slugify } from '../../../../utils/imovelUtils'
import { BAIRROS } from '../../../../data/bairros'
import { LANDING_PAGES } from '../../../../data/landingPages'

export async function generateImoveisSlugParams(): Promise<{ slug: string }[]> {
  const [imoveis, bairros] = await Promise.all([
    fetchAllPropertySlugs(),
    fetchDistinctBairros(),
  ])
  const propertyParams = imoveis.map(imovel => ({ slug: imovelSlug(imovel) }))

  const configuredBairros = Object.values(BAIRROS)
  const overriddenDbNames = new Set(
    configuredBairros.map(b => b.dbMatch).filter(Boolean) as string[],
  )
  const configuredSlugs = new Set(configuredBairros.map(b => b.slug))

  const configuredBairroParams = configuredBairros.map(b => ({ slug: b.slug }))
  const dbBairroParams = bairros
    .filter(b => !overriddenDbNames.has(b) && !configuredSlugs.has(slugify(b)))
    .map(b => ({ slug: slugify(b) }))

  const landingParams = LANDING_PAGES.map(lp => ({ slug: lp.slug }))
  return [...landingParams, ...propertyParams, ...configuredBairroParams, ...dbBairroParams]
}
