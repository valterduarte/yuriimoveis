import { notFound, permanentRedirect } from 'next/navigation'
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
  getAllPriceRanges,
  BEDROOM_FILTERS,
} from '../../../../../../../data/priceRanges'
import { AMENITY_FILTERS } from '../../../../../../../data/amenityFilters'
import { resolveListingFilter, filterToFetchOptions, filterLabel, type ResolvedFilter } from '../../../../../../../lib/listingFilter'
import { expandFilterSlugsForRow } from '../../../../../../../lib/listingStaticParams'
import { SITE_URL } from '../../../../../../../lib/config'
import { SEO_MIN_PROPERTIES_FOR_FILTER } from '../../../../../../../lib/constants'
import { buildBreadcrumb, buildCollectionPage, buildPropertyProduct } from '../../../../../../../lib/jsonLd'
import { buildListingMetadata } from '../../../../../../../lib/seo'
import { buildListingInsight } from '../../../../../../../lib/listingInsight'
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

    for (const slug of expandFilterSlugsForRow(row)) {
      const key = `${acao}|${cidade}|${row.categoria}|${bairro}|${slug}`
      if (seen.has(key)) continue
      seen.add(key)
      params.push({ acao, cidade, categoria: row.categoria, bairro, filtro: slug })
    }
  }

  return params
}

type ResolvedContext = NonNullable<Awaited<ReturnType<typeof resolveParams>>>

function buildFetchFilters(ctx: ResolvedContext) {
  return {
    tipo: acaoToTipo(ctx.acao),
    categoria: ctx.categoria,
    cidade: ctx.cidadeName,
    bairro: ctx.bairroDbName,
    ...filterToFetchOptions(ctx.filter),
    limit: 50,
  } as const
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
  const filter: ResolvedFilter | null = resolveListingFilter(p.filtro, tipo)
  if (!filter) return null
  const { label: filterLabelText, fragment: filterFragment } = filterLabel(filter)
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
    filterLabel: filterLabelText,
    filterFragment,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = await params
  const ctx = await resolveParams(raw)
  if (!ctx) return {}

  const { total } = await fetchProperties(buildFetchFilters(ctx))

  const label = ACAO_LABELS[ctx.acao].preposicao
  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${ctx.categoriaData.plural} ${label} ${ctx.filterFragment} no ${ctx.bairroName}, ${ctx.cidadeName} SP`
  const description = `${ctx.categoriaData.plural} ${label.toLowerCase()} ${ctx.filterFragment} no ${ctx.bairroName}, ${ctx.cidadeName} SP. Financiamento, documentação e atendimento com o Corretor Yuri (CRECI 235509).`
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

  if (total === 0) {
    permanentRedirect(buildHierarchicalUrl({
      acao: ctx.acao,
      cidade: raw.cidade,
      categoria: raw.categoria,
      bairro: raw.bairro,
    }))
  }

  const label = ACAO_LABELS[ctx.acao].preposicao
  const cat = ctx.categoriaData.plural.toLowerCase()
  const insightSubject = ctx.filter.kind === 'amenity'
    ? `${cat} com ${ctx.filter.amenity.label.toLowerCase()}`
    : ctx.filter.kind === 'price'
      ? `${cat} com preço ${ctx.filter.price.label}`
      : `${cat} com ${ctx.filter.bedroom.label}`
  const listingInsight = ctx.acao === 'comprar'
    ? buildListingInsight(imoveis, { locationName: ctx.bairroName, total, subject: insightSubject, includeBairros: false })
    : null
  const h1 = `${ctx.categoriaData.plural} ${label} ${ctx.filterFragment} no ${ctx.bairroName}, ${ctx.cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro)}`
  const bairroUrl = buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria, bairro: raw.bairro })

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início', path: '/' },
      { name: `${ctx.acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${ctx.cidadeName}`, path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade }) },
      { name: `${ctx.categoriaData.plural} ${label}`,                                  path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria }) },
      { name: ctx.bairroName,                                                          path: bairroUrl },
      { name: ctx.filterLabel,                                                        path: buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro) },
    ]),
    buildCollectionPage({
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      description: `${ctx.categoriaData.plural} ${label.toLowerCase()} ${ctx.filterFragment} no ${ctx.bairroName}, ${ctx.cidadeName} SP.`,
      items: imoveis.map(buildPropertyProduct),
    }),
  ]

  const breadcrumb: BreadcrumbItem[] = [
    { name: 'Início',                                  path: '/' },
    { name: ctx.cidadeName,                            path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade }) },
    { name: `${ctx.categoriaData.plural} ${label}`,    path: buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria }) },
    { name: ctx.bairroName,                            path: bairroUrl },
    { name: ctx.filterLabel,                          path: buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro) },
  ]

  return (
    <ListingPageShell jsonLd={jsonLd} breadcrumb={breadcrumb} label={label} h1={h1} total={total}>
      <div className="container mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
          {listingInsight ? (
            <p className="text-gray-700 text-sm leading-relaxed">
              {listingInsight.paragraph} Todas as opções com documentação verificada e atendimento personalizado do Corretor Yuri.
            </p>
          ) : (
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
          )}
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
