import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import PropertyCard from '../../../../../components/PropertyCard'
import { fetchProperties, fetchPriceBedroomMatrix } from '../../../../../lib/api'
import {
  acaoToTipo,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  buildHierarchicalUrl,
  ACAO_LABELS,
} from '../../../../../lib/navigation'
import { CATEGORIAS } from '../../../../../data/categorias'
import {
  getPriceRangeBySlug,
  getBedroomFilterBySlug,
  getAllPriceRanges,
  BEDROOM_FILTERS,
  type PriceRange,
  type BedroomFilter,
} from '../../../../../data/priceRanges'
import {
  AMENITY_FILTERS,
  getAmenityFilterBySlug,
  imovelMatchesAmenity,
  type AmenityFilter,
} from '../../../../../data/amenityFilters'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../../lib/config'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; filtro: string }>
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

function buildFilterUrl(acao: string, cidade: string, filtro: string): string {
  return `/${acao}/${cidade}/filtro/${filtro}`
}

export async function generateStaticParams() {
  const matrix = await fetchPriceBedroomMatrix()
  const params: { acao: string; cidade: string; filtro: string }[] = []
  const seen = new Set<string>()

  for (const row of matrix) {
    const acao = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidade = cidadeNameToSlug(row.cidade)
    if (!cidadeSlugToName(cidade)) continue

    const priceRanges = getAllPriceRanges(row.tipo as 'venda' | 'aluguel')
    for (const range of priceRanges) {
      const inRange =
        (!range.min || row.preco >= range.min) &&
        (!range.max || row.preco <= range.max)
      if (!inRange) continue

      const key = `${acao}|${cidade}|${range.slug}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ acao, cidade, filtro: range.slug })
      }
    }

    for (const bf of BEDROOM_FILTERS) {
      const minBedrooms = bf.value === '4+' ? 4 : bf.value
      const matches = row.quartos >= minBedrooms
      if (!matches) continue

      const key = `${acao}|${cidade}|${bf.slug}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ acao, cidade, filtro: bf.slug })
      }
    }

    for (const amenity of AMENITY_FILTERS) {
      if (!imovelMatchesAmenity(row.diferenciais, amenity)) continue
      const key = `${acao}|${cidade}|${amenity.slug}`
      if (!seen.has(key)) {
        seen.add(key)
        params.push({ acao, cidade, filtro: amenity.slug })
      }
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { acao, cidade, filtro } = await params
  if (!isValidAcao(acao)) return {}
  const cidadeName = cidadeSlugToName(cidade)
  if (!cidadeName) return {}

  const tipo = acaoToTipo(acao)
  const filter = parseFilter(filtro, tipo)
  if (!filter) return {}

  const label = ACAO_LABELS[acao].preposicao
  const filterLabel = filter.price?.label || filter.bedroom?.label || filter.amenity?.label || ''
  const title = `Imóveis ${label} ${filterLabel} em ${cidadeName} SP — Corretor Yuri`
  const description = `Imóveis ${label.toLowerCase()} ${filterLabel} em ${cidadeName}, SP. Encontre casas, apartamentos e terrenos com o Corretor Yuri, CRECI 235509.`
  const url = `${SITE_URL}${buildFilterUrl(acao, cidade, filtro)}`

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

export default async function FilterPage({ params }: PageProps) {
  const { acao, cidade, filtro } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  if (!cidadeName) notFound()

  const tipo = acaoToTipo(acao)
  const filter = parseFilter(filtro, tipo)
  if (!filter) notFound()

  const label = ACAO_LABELS[acao].preposicao
  const filterLabel = filter.price?.label || filter.bedroom?.label || filter.amenity?.label || ''

  const { imoveis, total } = await fetchProperties({
    tipo,
    cidade: cidadeName,
    precoMin: filter.price?.min ? String(filter.price.min) : undefined,
    precoMax: filter.price?.max ? String(filter.price.max) : undefined,
    quartos: filter.bedroom ? String(filter.bedroom.value) : undefined,
    amenity: filter.amenity ? filter.amenity.matchTerms.join('|') : undefined,
    limit: 50,
  })

  if (total === 0) notFound()

  const h1 = `Imóveis ${label} ${filterLabel} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildFilterUrl(acao, cidade, filtro)}`

  const relatedFilters = filter.price ? BEDROOM_FILTERS : getAllPriceRanges(tipo)
  const relatedSectionTitle = filter.price ? 'Filtrar por quartos' : 'Filtrar por preço'

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: acao, cidade })}` },
        { '@type': 'ListItem', position: 3, name: filterLabel, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      description: `Imóveis ${label.toLowerCase()} ${filterLabel} em ${cidadeName}, SP.`,
      itemListElement: imoveis.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo })),
    },
  ]

  const categoriasCounts = new Map<string, number>()
  for (const imovel of imoveis) {
    categoriasCounts.set(imovel.categoria, (categoriasCounts.get(imovel.categoria) || 0) + 1)
  }

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
            <Link href={buildHierarchicalUrl({ acao: acao, cidade })} className="hover:text-white transition-colors">{cidadeName}</Link>
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
                Encontre imóveis {label.toLowerCase()} com preço {filterLabel} em {cidadeName}, SP.
                Trabalhamos com diversas opções de casas, apartamentos e terrenos nessa faixa de preço,
                sempre com documentação verificada e atendimento personalizado do Corretor Yuri.
              </>
            ) : filter.amenity ? (
              <>
                Imóveis {label.toLowerCase()} {filterLabel} em {cidadeName}, SP. Listagens com {filter.amenity.heroLabel} no condomínio,
                de diversas construtoras e em vários bairros da cidade. Documentação verificada e atendimento do Corretor Yuri.
              </>
            ) : (
              <>
                Encontre imóveis {label.toLowerCase()} com {filterLabel} em {cidadeName}, SP.
                Confira nossas opções de casas, apartamentos e outros imóveis com essa configuração,
                em diversos bairros da cidade. Atendimento personalizado com o Corretor Yuri.
              </>
            )}
          </p>
        </div>

        <div className="mb-6">
          <Link href={buildHierarchicalUrl({ acao: acao, cidade })} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os imóveis {label.toLowerCase()} em {cidadeName}
          </Link>
        </div>

        {categoriasCounts.size > 1 && (
          <section className="mb-10">
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Por categoria</h2>
            <ul className="flex flex-wrap gap-2">
              {Array.from(categoriasCounts.entries()).map(([cat, count]) => {
                const catData = CATEGORIAS[cat as keyof typeof CATEGORIAS]
                if (!catData) return null
                return (
                  <li key={cat}>
                    <Link
                      href={buildHierarchicalUrl({ acao: acao, cidade, categoria: cat })}
                      className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {catData.plural} ({count})
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {imoveis.map(property => (
            <PropertyCard key={property.id} imovel={property} />
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">{relatedSectionTitle}</h2>
          <ul className="flex flex-wrap gap-2">
            {relatedFilters.map(f => (
              <li key={f.slug}>
                <Link
                  href={buildFilterUrl(acao, cidade, f.slug)}
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

        <section className="mt-10">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por comodidade</h2>
          <ul className="flex flex-wrap gap-2">
            {AMENITY_FILTERS.map(a => (
              <li key={a.slug}>
                <Link
                  href={buildFilterUrl(acao, cidade, a.slug)}
                  className={`inline-block border px-3 py-2 text-xs transition-colors ${
                    a.slug === filtro
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {a.shortLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
