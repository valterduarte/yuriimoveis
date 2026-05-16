import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { fetchProperties, fetchPriceBedroomMatrix } from '../../../../../../../lib/api'
import ListingPageShell, { type BreadcrumbItem } from '../../../../../../../components/ListingPageShell'
import PropertyResultsGrid from '../../../../../../../components/PropertyResultsGrid'
import { FilterChip, FilterChipList } from '../../../../../../../components/FilterChip'
import { formatNeighborhoodName } from '../../../../../../../utils/imovelUtils'
import { getBairroBySlug } from '../../../../../../../data/bairros'
import {
  acaoToTipo,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  getCategoriaBySlug,
  bairroSlugToDbName,
  bairroDbNameToSlug,
  buildHierarchicalUrl,
  ACAO_LABELS,
} from '../../../../../../../lib/navigation'
import {
  getBedroomFilterBySlug,
  getPriceRangeBySlug,
  getAllPriceRanges,
  BEDROOM_FILTERS,
  type PriceRange,
  type BedroomFilter,
} from '../../../../../../../data/priceRanges'
import {
  AMENITY_FILTERS,
  getAmenityFilterBySlug,
  imovelMatchesAmenity,
  type AmenityFilter,
} from '../../../../../../../data/amenityFilters'
import { SITE_URL } from '../../../../../../../lib/config'
import { SEO_MIN_PROPERTIES_FOR_FILTER } from '../../../../../../../lib/constants'
import { buildBreadcrumb, buildCollectionPage, buildPropertyProduct } from '../../../../../../../lib/jsonLd'
import { buildListingMetadata } from '../../../../../../../lib/seo'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string; bairro: string; filtro: string }>
}

function buildBairroFilterUrl(acao: string, cidade: string, categoria: string, bairro: string, filtro: string): string {
  return `/${acao}/${cidade}/${categoria}/${bairro}/filtro/${filtro}`
}

export async function generateStaticParams() {
  const matrix = await fetchPriceBedroomMatrix()
  const params: { acao: string; cidade: string; categoria: string; bairro: string; filtro: string }[] = []
  const seen = new Set<string>()

  for (const row of matrix) {
    const acao = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidade = cidadeNameToSlug(row.cidade)
    if (!cidadeSlugToName(cidade)) continue
    if (!getCategoriaBySlug(row.categoria)) continue
    const bairro = bairroDbNameToSlug(row.bairro)
    if (!bairro) continue

    for (const bf of BEDROOM_FILTERS) {
      const minBedrooms = bf.value === '4+' ? 4 : bf.value
      if (row.quartos < minBedrooms) continue

      const key = `${acao}|${cidade}|${row.categoria}|${bairro}|${bf.slug}`
      if (seen.has(key)) continue
      seen.add(key)
      params.push({ acao, cidade, categoria: row.categoria, bairro, filtro: bf.slug })
    }

    for (const range of getAllPriceRanges(row.tipo as 'venda' | 'aluguel')) {
      const inRange = (!range.min || row.preco >= range.min) && (!range.max || row.preco <= range.max)
      if (!inRange) continue

      const key = `${acao}|${cidade}|${row.categoria}|${bairro}|${range.slug}`
      if (seen.has(key)) continue
      seen.add(key)
      params.push({ acao, cidade, categoria: row.categoria, bairro, filtro: range.slug })
    }

    for (const amenity of AMENITY_FILTERS) {
      if (!imovelMatchesAmenity(row.diferenciais, amenity)) continue
      const key = `${acao}|${cidade}|${row.categoria}|${bairro}|${amenity.slug}`
      if (seen.has(key)) continue
      seen.add(key)
      params.push({ acao, cidade, categoria: row.categoria, bairro, filtro: amenity.slug })
    }
  }

  return params
}

type ResolvedFilter =
  | { kind: 'bedroom'; bedroom: BedroomFilter; label: string; fragment: string }
  | { kind: 'price';   price:   PriceRange;    label: string; fragment: string }
  | { kind: 'amenity'; amenity: AmenityFilter; label: string; fragment: string }

function resolveFilter(filtro: string, tipo: ReturnType<typeof acaoToTipo>): ResolvedFilter | null {
  const bedroom = getBedroomFilterBySlug(filtro)
  if (bedroom) return { kind: 'bedroom', bedroom, label: bedroom.label, fragment: `com ${bedroom.label}` }
  const price = getPriceRangeBySlug(filtro, tipo)
  if (price)   return { kind: 'price',   price,   label: price.label,   fragment: `com preço ${price.label}` }
  const amenity = getAmenityFilterBySlug(filtro)
  if (amenity) return { kind: 'amenity', amenity, label: amenity.label, fragment: amenity.label }
  return null
}

type ResolvedContext = NonNullable<Awaited<ReturnType<typeof resolveParams>>>

function buildFetchFilters(ctx: ResolvedContext) {
  const base = {
    tipo: acaoToTipo(ctx.acao),
    categoria: ctx.categoria,
    cidade: ctx.cidadeName,
    bairro: ctx.bairroDbName,
    limit: 50,
  } as const
  switch (ctx.filter.kind) {
    case 'bedroom': return { ...base, quartos: String(ctx.filter.bedroom.value) }
    case 'price':   return {
      ...base,
      precoMin: ctx.filter.price.min ? String(ctx.filter.price.min) : undefined,
      precoMax: ctx.filter.price.max ? String(ctx.filter.price.max) : undefined,
    }
    case 'amenity': return { ...base, amenity: ctx.filter.amenity.matchTerms.join('|') }
  }
}

async function resolveParams(p: { acao: string; cidade: string; categoria: string; bairro: string; filtro: string }) {
  if (!isValidAcao(p.acao)) return null
  const cidadeName = cidadeSlugToName(p.cidade)
  const categoriaData = getCategoriaBySlug(p.categoria)
  if (!cidadeName || !categoriaData) return null
  const bairroData = getBairroBySlug(p.bairro)
  const bairroName = bairroData?.nome || formatNeighborhoodName(p.bairro)
  const bairroDbName = bairroSlugToDbName(p.bairro) || bairroName
  const tipo = acaoToTipo(p.acao)
  const filter = resolveFilter(p.filtro, tipo)
  if (!filter) return null
  return {
    acao: p.acao,
    cidade: p.cidade,
    categoria: p.categoria,
    bairro: p.bairro,
    cidadeName,
    categoriaData,
    bairroDbName,
    bairroName,
    filter,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = await params
  const ctx = await resolveParams(raw)
  if (!ctx) return {}

  const { total } = await fetchProperties(buildFetchFilters(ctx))

  const label = ACAO_LABELS[ctx.acao].preposicao
  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${ctx.categoriaData.plural} ${label} ${ctx.filter.fragment} no ${ctx.bairroName}, ${ctx.cidadeName} SP`
  const description = `${ctx.categoriaData.plural} ${label.toLowerCase()} ${ctx.filter.fragment} no ${ctx.bairroName}, ${ctx.cidadeName} SP. Financiamento, documentação e atendimento com o Corretor Yuri (CRECI 235509).`
  return buildListingMetadata({
    title,
    description,
    url: `${SITE_URL}${buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro)}`,
    noindex: total < SEO_MIN_PROPERTIES_FOR_FILTER,
  })
}

export default async function BairroFilterPage({ params }: PageProps) {
  const raw = await params
  const ctx = await resolveParams(raw)
  if (!ctx) notFound()

  const { imoveis, total } = await fetchProperties(buildFetchFilters(ctx))

  if (total === 0) notFound()

  const label = ACAO_LABELS[ctx.acao].preposicao
  const h1 = `${ctx.categoriaData.plural} ${label} ${ctx.filter.fragment} no ${ctx.bairroName}, ${ctx.cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro)}`
  const bairroUrl = buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria, bairro: raw.bairro })

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início', path: '/' },
      { name: `${ctx.acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${ctx.cidadeName}`, path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade }) },
      { name: `${ctx.categoriaData.plural} ${label}`,                                  path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria }) },
      { name: ctx.bairroName,                                                          path: bairroUrl },
      { name: ctx.filter.label,                                                        path: buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro) },
    ]),
    buildCollectionPage({
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      description: `${ctx.categoriaData.plural} ${label.toLowerCase()} ${ctx.filter.fragment} no ${ctx.bairroName}, ${ctx.cidadeName} SP.`,
      items: imoveis.map(buildPropertyProduct),
    }),
  ]

  const breadcrumb: BreadcrumbItem[] = [
    { name: 'Início',                                  path: '/' },
    { name: ctx.cidadeName,                            path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade }) },
    { name: `${ctx.categoriaData.plural} ${label}`,    path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria }) },
    { name: ctx.bairroName,                            path: bairroUrl },
    { name: ctx.filter.label,                          path: buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro) },
  ]

  return (
    <ListingPageShell jsonLd={jsonLd} breadcrumb={breadcrumb} label={label} h1={h1} total={total}>
      <div className="container mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            {ctx.filter.kind === 'bedroom' ? (
              <>
                Encontre {ctx.categoriaData.plural.toLowerCase()} {label.toLowerCase()} com {ctx.filter.bedroom.label} no {ctx.bairroName}, {ctx.cidadeName} SP.
                Todas as opções com documentação verificada e atendimento personalizado do Corretor Yuri.
              </>
            ) : ctx.filter.kind === 'price' ? (
              <>
                {ctx.categoriaData.plural} {label.toLowerCase()} com preço {ctx.filter.price.label} no {ctx.bairroName}, {ctx.cidadeName} SP.
                Documentação verificada e atendimento personalizado do Corretor Yuri.
              </>
            ) : (
              <>
                {ctx.categoriaData.plural} {label.toLowerCase()} {ctx.filter.amenity.label} no {ctx.bairroName}, {ctx.cidadeName} SP.
                Listagens com {ctx.filter.amenity.heroLabel} no condomínio, documentação verificada e atendimento personalizado do Corretor Yuri.
              </>
            )}
          </p>
        </div>

        <div className="mb-6">
          <Link href={bairroUrl} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os {ctx.categoriaData.plural.toLowerCase()} {label.toLowerCase()} no {ctx.bairroName}
          </Link>
        </div>

        <PropertyResultsGrid imoveis={imoveis} />

        <section className="mt-14">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por quartos no {ctx.bairroName}</h2>
          <FilterChipList>
            {BEDROOM_FILTERS.map(f => (
              <FilterChip key={f.slug} href={buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, f.slug)} active={f.slug === raw.filtro}>
                {f.shortLabel || f.label}
              </FilterChip>
            ))}
          </FilterChipList>
        </section>

        <section className="mt-10">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por preço no {ctx.bairroName}</h2>
          <FilterChipList>
            {getAllPriceRanges(acaoToTipo(ctx.acao)).map(r => (
              <FilterChip key={r.slug} href={buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, r.slug)} active={r.slug === raw.filtro}>
                {r.shortLabel || r.label}
              </FilterChip>
            ))}
          </FilterChipList>
        </section>

        <section className="mt-10">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por comodidade no {ctx.bairroName}</h2>
          <FilterChipList>
            {AMENITY_FILTERS.map(a => (
              <FilterChip key={a.slug} href={buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, a.slug)} active={a.slug === raw.filtro}>
                {a.shortLabel}
              </FilterChip>
            ))}
          </FilterChipList>
        </section>
      </div>
    </ListingPageShell>
  )
}
