import { notFound, permanentRedirect } from 'next/navigation'
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
  type AcaoSlug,
} from '../../../../../../lib/navigation'
import {
  getAllPriceRanges,
  BEDROOM_FILTERS,
} from '../../../../../../data/priceRanges'
import { AMENITY_FILTERS } from '../../../../../../data/amenityFilters'
import { resolveListingFilter, filterToFetchOptions, filterLabel, type ResolvedFilter } from '../../../../../../lib/listingFilter'
import { expandFilterSlugsForRow } from '../../../../../../lib/listingStaticParams'
import { SITE_URL } from '../../../../../../lib/config'
import { SEO_MIN_PROPERTIES_FOR_FILTER, ITBI_RATE_BY_CITY } from '../../../../../../lib/constants'
import { buildBreadcrumb, buildCollectionPage, buildFaqPageSchema, buildPropertyProduct } from '../../../../../../lib/jsonLd'
import { buildListingMetadata } from '../../../../../../lib/seo'
import FaqAccordion from '../../../../../../components/FaqAccordion'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string; filtro: string }>
}

interface FilterFaq {
  q: string
  a: string
}

function buildFilterFaqs(args: {
  acao: AcaoSlug
  cidadeName: string
  categoriaData: { singular: string; plural: string }
  label: string
  filter: ResolvedFilter
  filterLabel: string
  filterConnector: string
  total: number
}): FilterFaq[] {
  const { acao, cidadeName, categoriaData, label, filter, filterLabel, filterConnector, total } = args
  const pluralLc = categoriaData.plural.toLowerCase()
  const labelLc = label.toLowerCase()
  const filterPhraseLc = `${filterConnector}${filterLabel.toLowerCase()}`.trim()
  const itbi = ITBI_RATE_BY_CITY[cidadeName]
  const faqs: FilterFaq[] = []

  faqs.push({
    q: `Quantos ${pluralLc} ${labelLc} ${filterPhraseLc} há em ${cidadeName}?`,
    a: total > 0
      ? `Hoje temos ${total} ${pluralLc} ${labelLc} ${filterPhraseLc} em ${cidadeName}, SP. O estoque é atualizado diariamente; fale com o Corretor Yuri pelo WhatsApp para receber opções ainda não publicadas.`
      : `O estoque muda diariamente. Fale com o Corretor Yuri pelo WhatsApp para receber novidades de ${pluralLc} ${labelLc} ${filterPhraseLc} em ${cidadeName} assim que aparecerem.`,
  })

  if (filter.kind === 'price' && acao === 'comprar') {
    const maxValue = filter.price.max
    if (maxValue && maxValue <= 600_000) {
      faqs.push({
        q: `Esses ${pluralLc} se enquadram no Minha Casa Minha Vida 2026?`,
        a: `A faixa de preço ${filterLabel.toLowerCase()} fica dentro dos tetos do MCMV 2026 — Faixa 3 vai até R$ 400 mil e Faixa 4 até R$ 600 mil. Use o simulador do site para verificar elegibilidade, parcela e subsídio para cada imóvel.`,
      })
    }
  }

  if (filter.kind === 'bedroom') {
    faqs.push({
      q: `Em quais bairros de ${cidadeName} há mais ${pluralLc} com ${filter.bedroom.label.toLowerCase()}?`,
      a: `A distribuição por bairro varia conforme o estoque ativo. Use o filtro de bairro logo acima ou navegue pelos guias de bairro para refinar por combinação bairro + ${filter.bedroom.label.toLowerCase()}.`,
    })
  }

  if (filter.kind === 'amenity') {
    faqs.push({
      q: `O que conta como ${filter.amenity.label.toLowerCase()}?`,
      a: `Marcamos como ${filter.amenity.label.toLowerCase()} qualquer ${categoriaData.singular.toLowerCase()} cujo anúncio descreve explicitamente esse diferencial entre as amenidades do condomínio ou da unidade.`,
    })
  }

  if (acao === 'comprar') {
    faqs.push({
      q: 'Posso financiar pela Caixa ou pelo Minha Casa Minha Vida?',
      a: 'Sim. Atendemos com SBPE da Caixa e Minha Casa Minha Vida para renda até R$ 13 mil. O simulador do site mostra parcela estimada e elegibilidade ao MCMV para cada imóvel.',
    })
    if (itbi) {
      faqs.push({
        q: `Quanto custa o ITBI ao comprar um imóvel em ${cidadeName}?`,
        a: `A alíquota de ITBI em ${cidadeName} é de ${itbi} sobre o valor de compra (ou o valor venal, o que for maior). Confira o guia completo de ITBI no blog.`,
      })
    }
  }

  return faqs
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

    for (const slug of expandFilterSlugsForRow(row)) {
      const key = `${acao}|${cidade}|${row.categoria}|${slug}`
      if (seen.has(key)) continue
      seen.add(key)
      params.push({ acao, cidade, categoria: row.categoria, filtro: slug })
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
  const filter = resolveListingFilter(filtro, tipo)
  if (!filter) return {}

  const label = ACAO_LABELS[acao].preposicao
  const { label: filterLabelText, connector: filterConnector } = filterLabel(filter)

  const { total } = await fetchProperties({
    tipo,
    categoria,
    cidade: cidadeName,
    ...filterToFetchOptions(filter),
    limit: 50,
  })

  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${categoriaData.plural} ${label} ${filterConnector}${filterLabelText} em ${cidadeName} SP`
  const description = `${categoriaData.plural} ${label.toLowerCase()} ${filterConnector}${filterLabelText} em ${cidadeName}, SP. Financiamento, documentação e atendimento com o Corretor Yuri (CRECI 235509).`
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
  const filter = resolveListingFilter(filtro, tipo)
  if (!filter) notFound()

  const label = ACAO_LABELS[acao].preposicao
  const { label: filterLabelText, connector: filterConnector } = filterLabel(filter)

  const { imoveis, total } = await fetchProperties({
    tipo,
    categoria,
    cidade: cidadeName,
    ...filterToFetchOptions(filter),
    limit: 50,
  })

  if (total === 0) {
    permanentRedirect(buildHierarchicalUrl({ acao, cidade, categoria }))
  }

  const h1 = `${categoriaData.plural} ${label} ${filterConnector}${filterLabelText} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildCategoryFilterUrl(acao, cidade, categoria, filtro)}`
  const categoryUrl = buildHierarchicalUrl({ acao: acao, cidade, categoria })

  const relatedFilters = filter.kind === 'price' ? BEDROOM_FILTERS : getAllPriceRanges(tipo)
  const relatedSectionTitle = filter.kind === 'price' ? 'Filtrar por quartos' : 'Filtrar por preço'

  const faqs = buildFilterFaqs({
    acao,
    cidadeName,
    categoriaData,
    label,
    filter,
    filterLabel: filterLabelText,
    filterConnector,
    total,
  })

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início', path: '/' },
      { name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, path: buildHierarchicalUrl({ acao, cidade }) },
      { name: `${categoriaData.plural} ${label}`,                              path: categoryUrl },
      { name: filterLabelText,                                                 path: buildCategoryFilterUrl(acao, cidade, categoria, filtro) },
    ]),
    buildCollectionPage({
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      description: `${categoriaData.plural} ${label.toLowerCase()} ${filterConnector}${filterLabelText} em ${cidadeName}, SP.`,
      items: imoveis.map(buildPropertyProduct),
    }),
    buildFaqPageSchema(faqs.map(f => ({ question: f.q, answer: f.a }))),
  ]

  const breadcrumb: BreadcrumbItem[] = [
    { name: 'Início',                              path: '/' },
    { name: cidadeName,                            path: buildHierarchicalUrl({ acao, cidade }) },
    { name: `${categoriaData.plural} ${label}`,    path: categoryUrl },
    { name: filterLabelText,                       path: buildCategoryFilterUrl(acao, cidade, categoria, filtro) },
  ]

  return (
    <ListingPageShell jsonLd={jsonLd} breadcrumb={breadcrumb} label={label} h1={h1} total={total}>
      <div className="container mx-auto px-6 py-10">
      <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
        <p className="text-gray-700 text-sm leading-relaxed">
          {filter.kind === 'price' ? (
            <>
              Encontre {categoriaData.plural.toLowerCase()} {label.toLowerCase()} com preço {filterLabelText} em {cidadeName}, SP.
              Todas as opções com documentação verificada e atendimento personalizado do Corretor Yuri.
            </>
          ) : filter.kind === 'amenity' ? (
            <>
              {categoriaData.plural} {label.toLowerCase()} {filterLabelText} em {cidadeName}, SP.
              Listagens com {filter.amenity.heroLabel} no condomínio, em vários bairros da cidade.
              Documentação verificada e atendimento personalizado do Corretor Yuri.
            </>
          ) : (
            <>
              Encontre {categoriaData.plural.toLowerCase()} {label.toLowerCase()} com {filterLabelText} em {cidadeName}, SP.
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
        <h2 className="heading-section">{relatedSectionTitle}</h2>
        <FilterChipList>
          {relatedFilters.map(f => (
            <FilterChip key={f.slug} href={buildCategoryFilterUrl(acao, cidade, categoria, f.slug)} active={f.slug === filtro}>
              {f.shortLabel || f.label}
            </FilterChip>
          ))}
        </FilterChipList>
      </section>

      <section className="mt-10">
        <h2 className="heading-section">Filtrar por comodidade</h2>
        <FilterChipList>
          {AMENITY_FILTERS.map(a => (
            <FilterChip key={a.slug} href={buildCategoryFilterUrl(acao, cidade, categoria, a.slug)} active={a.slug === filtro}>
              {a.shortLabel}
            </FilterChip>
          ))}
        </FilterChipList>
      </section>

      <FaqAccordion faqs={faqs} />
      </div>
    </ListingPageShell>
  )
}
