import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { fetchProperties, fetchPriceBedroomMatrix } from '../../../../../../lib/api'
import ListingPageShell, { type BreadcrumbItem } from '../../../../../../components/ListingPageShell'
import PropertyResultsGrid from '../../../../../../components/PropertyResultsGrid'
import { FilterChip, FilterChipList } from '../../../../../../components/FilterChip'
import {
  acaoToTipo,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  getCategoriaBySlug,
  buildHierarchicalUrl,
  ACAO_LABELS,
} from '../../../../../../lib/navigation'
import {
  getPriceRangeBySlug,
  getBedroomFilterBySlug,
  getAllPriceRanges,
  BEDROOM_FILTERS,
  type PriceRange,
  type BedroomFilter,
} from '../../../../../../data/priceRanges'
import {
  AMENITY_FILTERS,
  getAmenityFilterBySlug,
  imovelMatchesAmenity,
  type AmenityFilter,
} from '../../../../../../data/amenityFilters'
import { SITE_URL } from '../../../../../../lib/config'
import { SEO_MIN_PROPERTIES_FOR_FILTER } from '../../../../../../lib/constants'
import { buildBreadcrumb, buildCollectionPage, buildPropertyProduct } from '../../../../../../lib/jsonLd'
import { buildListingMetadata } from '../../../../../../lib/seo'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string; filtro: string }>
}

type ParsedFilter = { price?: PriceRange; bedroom?: BedroomFilter; amenity?: AmenityFilter }

function parseFilter(filtro: string, tipo: 'venda' | 'aluguel'): ParsedFilter | null {
  const priceRange = getPriceRangeBySlug(filtro, tipo)
  if (priceRange) return { price: priceRange }

  const bedroomFilter = getBedroomFilterBySlug(filtro)
  if (bedroomFilter) return { bedroom: bedroomFilter }

  const amenityFilter = getAmenityFilterBySlug(filtro)
  if (amenityFilter) return { amenity: amenityFilter }

  return null
}

function buildCategoryFilterUrl(acao: string, cidade: string, categoria: string, filtro: string): string {
  return `/${acao}/${cidade}/${categoria}/filtro/${filtro}`
}

export async function generateStaticParams() {
  const matrix = await fetchPriceBedroomMatrix()
  const params: { acao: string; cidade: string; categoria: string; filtro: string }[] = []
  const seen = new Set<string>()

  for (const row of matrix) {
    const acao = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidade = cidadeNameToSlug(row.cidade)
    if (!cidadeSlugToName(cidade)) continue
    if (!getCategoriaBySlug(row.categoria)) continue

    const priceRanges = getAllPriceRanges(row.tipo as 'venda' | 'aluguel')
    for (const range of priceRanges) {
      const inRange =
        (!range.min || row.preco >= range.min) &&
        (!range.max || row.preco <= range.max)
      if (!inRange) continue

      const key = `${acao}|${cidade}|${row.categoria}|${range.slug}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ acao, cidade, categoria: row.categoria, filtro: range.slug })
      }
    }

    for (const bf of BEDROOM_FILTERS) {
      const minBedrooms = bf.value === '4+' ? 4 : bf.value
      const matches = row.quartos >= minBedrooms
      if (!matches) continue

      const key = `${acao}|${cidade}|${row.categoria}|${bf.slug}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ acao, cidade, categoria: row.categoria, filtro: bf.slug })
      }
    }

    for (const amenity of AMENITY_FILTERS) {
      if (!imovelMatchesAmenity(row.diferenciais, amenity)) continue
      const key = `${acao}|${cidade}|${row.categoria}|${amenity.slug}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ acao, cidade, categoria: row.categoria, filtro: amenity.slug })
      }
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { acao, cidade, categoria, filtro } = await params
  if (!isValidAcao(acao)) return {}
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) return {}

  const tipo = acaoToTipo(acao)
  const filter = parseFilter(filtro, tipo)
  if (!filter) return {}

  const label = ACAO_LABELS[acao].preposicao
  const filterLabel = filter.price?.label || filter.bedroom?.label || filter.amenity?.label || ''
  const filterConnector = filter.bedroom ? 'com ' : ''

  const { total } = await fetchProperties({
    tipo,
    categoria,
    cidade: cidadeName,
    precoMin: filter.price?.min ? String(filter.price.min) : undefined,
    precoMax: filter.price?.max ? String(filter.price.max) : undefined,
    quartos: filter.bedroom ? String(filter.bedroom.value) : undefined,
    amenity: filter.amenity ? filter.amenity.matchTerms.join('|') : undefined,
    limit: 50,
  })

  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${categoriaData.plural} ${label} ${filterConnector}${filterLabel} em ${cidadeName} SP`
  const description = `${categoriaData.plural} ${label.toLowerCase()} ${filterConnector}${filterLabel} em ${cidadeName}, SP. Financiamento, documentação e atendimento com o Corretor Yuri (CRECI 235509).`
  return buildListingMetadata({
    title,
    description,
    url: `${SITE_URL}${buildCategoryFilterUrl(acao, cidade, categoria, filtro)}`,
    noindex: total < SEO_MIN_PROPERTIES_FOR_FILTER,
  })
}

export default async function CategoryFilterPage({ params }: PageProps) {
  const { acao, cidade, categoria, filtro } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) notFound()

  const tipo = acaoToTipo(acao)
  const filter = parseFilter(filtro, tipo)
  if (!filter) notFound()

  const label = ACAO_LABELS[acao].preposicao
  const filterLabel = filter.price?.label || filter.bedroom?.label || filter.amenity?.label || ''
  const filterConnector = filter.bedroom ? 'com ' : ''

  const { imoveis, total } = await fetchProperties({
    tipo,
    categoria,
    cidade: cidadeName,
    precoMin: filter.price?.min ? String(filter.price.min) : undefined,
    precoMax: filter.price?.max ? String(filter.price.max) : undefined,
    quartos: filter.bedroom ? String(filter.bedroom.value) : undefined,
    amenity: filter.amenity ? filter.amenity.matchTerms.join('|') : undefined,
    limit: 50,
  })

  if (total === 0) notFound()

  const h1 = `${categoriaData.plural} ${label} ${filterConnector}${filterLabel} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildCategoryFilterUrl(acao, cidade, categoria, filtro)}`
  const categoryUrl = buildHierarchicalUrl({ acao: acao, cidade, categoria })

  const relatedFilters = filter.price ? BEDROOM_FILTERS : getAllPriceRanges(tipo)
  const relatedSectionTitle = filter.price ? 'Filtrar por quartos' : 'Filtrar por preço'

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início', path: '/' },
      { name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, path: buildHierarchicalUrl({ acao, cidade }) },
      { name: `${categoriaData.plural} ${label}`,                              path: categoryUrl },
      { name: filterLabel,                                                     path: buildCategoryFilterUrl(acao, cidade, categoria, filtro) },
    ]),
    buildCollectionPage({
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      description: `${categoriaData.plural} ${label.toLowerCase()} ${filterConnector}${filterLabel} em ${cidadeName}, SP.`,
      items: imoveis.map(buildPropertyProduct),
    }),
  ]

  const breadcrumb: BreadcrumbItem[] = [
    { name: 'Início',                              path: '/' },
    { name: cidadeName,                            path: buildHierarchicalUrl({ acao, cidade }) },
    { name: `${categoriaData.plural} ${label}`,    path: categoryUrl },
    { name: filterLabel,                           path: buildCategoryFilterUrl(acao, cidade, categoria, filtro) },
  ]

  return (
    <ListingPageShell jsonLd={jsonLd} breadcrumb={breadcrumb} label={label} h1={h1} total={total}>
      <div className="container mx-auto px-6 py-10">
      <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
        <p className="text-gray-700 text-sm leading-relaxed">
          {filter.price ? (
            <>
              Encontre {categoriaData.plural.toLowerCase()} {label.toLowerCase()} com preço {filterLabel} em {cidadeName}, SP.
              Todas as opções com documentação verificada e atendimento personalizado do Corretor Yuri.
            </>
          ) : filter.amenity ? (
            <>
              {categoriaData.plural} {label.toLowerCase()} {filterLabel} em {cidadeName}, SP.
              Listagens com {filter.amenity.heroLabel} no condomínio, em vários bairros da cidade.
              Documentação verificada e atendimento personalizado do Corretor Yuri.
            </>
          ) : (
            <>
              Encontre {categoriaData.plural.toLowerCase()} {label.toLowerCase()} com {filterLabel} em {cidadeName}, SP.
              Opções em diversos bairros, com documentação verificada e atendimento do Corretor Yuri.
            </>
          )}
        </p>
      </div>

      <div className="mb-6">
        <Link href={categoryUrl} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
          <FiArrowLeft size={13} /> Ver todos os {categoriaData.plural.toLowerCase()} {label.toLowerCase()} em {cidadeName}
        </Link>
      </div>

      <PropertyResultsGrid imoveis={imoveis} />

      <section className="mt-14">
        <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">{relatedSectionTitle}</h2>
        <FilterChipList>
          {relatedFilters.map(f => (
            <FilterChip key={f.slug} href={buildCategoryFilterUrl(acao, cidade, categoria, f.slug)} active={f.slug === filtro}>
              {f.shortLabel || f.label}
            </FilterChip>
          ))}
        </FilterChipList>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por comodidade</h2>
        <FilterChipList>
          {AMENITY_FILTERS.map(a => (
            <FilterChip key={a.slug} href={buildCategoryFilterUrl(acao, cidade, categoria, a.slug)} active={a.slug === filtro}>
              {a.shortLabel}
            </FilterChip>
          ))}
        </FilterChipList>
      </section>
      </div>
    </ListingPageShell>
  )
}
