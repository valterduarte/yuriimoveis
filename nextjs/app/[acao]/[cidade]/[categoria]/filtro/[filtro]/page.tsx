import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import PropertyCard from '../../../../../../components/PropertyCard'
import { fetchProperties, fetchPriceBedroomMatrix } from '../../../../../../lib/api'
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
  getPriceRangeBySlug,
  getBedroomFilterBySlug,
  getAllPriceRanges,
  BEDROOM_FILTERS,
  type PriceRange,
  type BedroomFilter,
} from '../../../../../../data/priceRanges'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../../../lib/config'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string; filtro: string }>
}

function parseFilter(filtro: string, tipo: 'venda' | 'aluguel'): { price?: PriceRange; bedroom?: BedroomFilter } | null {
  const priceRange = getPriceRangeBySlug(filtro, tipo)
  if (priceRange) return { price: priceRange }

  const bedroomFilter = getBedroomFilterBySlug(filtro)
  if (bedroomFilter) return { bedroom: bedroomFilter }

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
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { acao, cidade, categoria, filtro } = await params
  if (!isValidAcao(acao)) return {}
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) return {}

  const tipo = acaoToTipo(acao as AcaoSlug)
  const filter = parseFilter(filtro, tipo)
  if (!filter) return {}

  const label = ACAO_LABELS[acao].preposicao
  const filterLabel = filter.price?.label || filter.bedroom?.label || ''
  const filterConnector = filter.bedroom ? 'com ' : ''

  const { total } = await fetchProperties({
    tipo,
    categoria,
    cidade: cidadeName,
    precoMin: filter.price?.min ? String(filter.price.min) : undefined,
    precoMax: filter.price?.max ? String(filter.price.max) : undefined,
    quartos: filter.bedroom ? String(filter.bedroom.value) : undefined,
    limit: 50,
  })

  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${categoriaData.plural} ${label} ${filterConnector}${filterLabel} em ${cidadeName} SP | Corretor Yuri`
  const description = `${categoriaData.plural} ${label.toLowerCase()} ${filterConnector}${filterLabel} em ${cidadeName}, SP. Financiamento, documentação e atendimento com o Corretor Yuri (CRECI 235509).`
  const url = `${SITE_URL}${buildCategoryFilterUrl(acao, cidade, categoria, filtro)}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      siteName: 'Corretor Yuri Imóveis',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_DEFAULT_IMAGE] },
  }
}

export default async function CategoryFilterPage({ params }: PageProps) {
  const { acao, cidade, categoria, filtro } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) notFound()

  const tipo = acaoToTipo(acao as AcaoSlug)
  const filter = parseFilter(filtro, tipo)
  if (!filter) notFound()

  const label = ACAO_LABELS[acao as AcaoSlug].preposicao
  const filterLabel = filter.price?.label || filter.bedroom?.label || ''
  const filterConnector = filter.bedroom ? 'com ' : ''

  const { imoveis, total } = await fetchProperties({
    tipo,
    categoria,
    cidade: cidadeName,
    precoMin: filter.price?.min ? String(filter.price.min) : undefined,
    precoMax: filter.price?.max ? String(filter.price.max) : undefined,
    quartos: filter.bedroom ? String(filter.bedroom.value) : undefined,
    limit: 50,
  })

  if (total === 0) notFound()

  const h1 = `${categoriaData.plural} ${label} ${filterConnector}${filterLabel} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildCategoryFilterUrl(acao, cidade, categoria, filtro)}`
  const categoryUrl = buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade, categoria })

  const relatedFilters = filter.price
    ? BEDROOM_FILTERS
    : getAllPriceRanges(tipo)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade })}` },
        { '@type': 'ListItem', position: 3, name: `${categoriaData.plural} ${label}`, item: `${SITE_URL}${categoryUrl}` },
        { '@type': 'ListItem', position: 4, name: filterLabel, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      description: `${categoriaData.plural} ${label.toLowerCase()} ${filterConnector}${filterLabel} em ${cidadeName}, SP.`,
      itemListElement: imoveis.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo })),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade })} className="hover:text-white transition-colors">{cidadeName}</Link>
            <span aria-hidden="true">/</span>
            <Link href={categoryUrl} className="hover:text-white transition-colors">{categoriaData.plural} {label}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{filterLabel}</span>
          </nav>
          <span className="section-label">{label}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{h1}</h1>
          <p className="text-gray-400 text-sm mt-2">{total} imóve{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            {filter.price ? (
              <>
                Encontre {categoriaData.plural.toLowerCase()} {label.toLowerCase()} com preço {filterLabel} em {cidadeName}, SP.
                Todas as opções com documentação verificada e atendimento personalizado do Corretor Yuri.
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {imoveis.map(property => (
            <PropertyCard key={property.id} imovel={property} />
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">
            {filter.price ? 'Filtrar por quartos' : 'Filtrar por preço'}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedFilters.map(f => (
              <li key={f.slug}>
                <Link
                  href={buildCategoryFilterUrl(acao, cidade, categoria, f.slug)}
                  className={`inline-block border px-3 py-2 text-xs transition-colors ${
                    f.slug === filtro
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {f.shortLabel || f.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
