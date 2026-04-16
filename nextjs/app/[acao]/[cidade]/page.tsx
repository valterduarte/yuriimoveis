import { notFound } from 'next/navigation'
import Link from 'next/link'
import PropertyCard from '../../../components/PropertyCard'
import { fetchProperties, fetchNavigationMatrix } from '../../../lib/api'
import {
  acaoToTipo,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  getCategoriaBySlug,
  buildHierarchicalUrl,
  ACAO_LABELS,
  getAllCidadeSlugs,
  type AcaoSlug,
} from '../../../lib/navigation'
import { CATEGORIAS } from '../../../data/categorias'
import { getAllPriceRanges, BEDROOM_FILTERS } from '../../../data/priceRanges'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../lib/config'
import type { PropertyCategory } from '../../../types'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string }>
}

export async function generateStaticParams() {
  const cidades = getAllCidadeSlugs()
  return (['comprar', 'alugar'] as const).flatMap(acao =>
    cidades.map(cidade => ({ acao, cidade }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { acao, cidade } = await params
  if (!isValidAcao(acao)) return {}
  const cidadeName = cidadeSlugToName(cidade)
  if (!cidadeName) return {}

  const label = ACAO_LABELS[acao].preposicao
  const title = `Imóveis ${label} em ${cidadeName} SP — Corretor Yuri`
  const description = `Imóveis ${label.toLowerCase()} em ${cidadeName}, SP. Casas, apartamentos, terrenos e imóveis comerciais. Atendimento com o Corretor Yuri, CRECI 235509.`
  const url = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade })}`

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

export default async function CidadeAcaoPage({ params }: PageProps) {
  const { acao, cidade } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  if (!cidadeName) notFound()

  const { imoveis, total } = await fetchProperties({
    tipo: acaoToTipo(acao as AcaoSlug),
    cidade: cidadeName,
    limit: 50,
  })

  if (total === 0) notFound()

  const label = ACAO_LABELS[acao as AcaoSlug].preposicao
  const h1 = `Imóveis ${label} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade })}`

  const matrix = await fetchNavigationMatrix()
  const categoriaCounts = new Map<PropertyCategory, number>()
  for (const row of matrix) {
    if (row.tipo !== acaoToTipo(acao as AcaoSlug)) continue
    if (cidadeNameToSlug(row.cidade) !== cidade) continue
    const categoriaData = getCategoriaBySlug(row.categoria)
    if (!categoriaData) continue
    categoriaCounts.set(categoriaData.slug, (categoriaCounts.get(categoriaData.slug) || 0) + row.count)
  }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: h1, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
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
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{cidadeName}</span>
          </nav>
          <span className="section-label">{label}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{h1}</h1>
          <p className="text-gray-400 text-sm mt-2">{total} imóve{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            Encontre imóveis {label.toLowerCase()} em {cidadeName} com o Corretor Yuri.
            Trabalhamos com casas, apartamentos, terrenos e imóveis comerciais em diversos bairros da cidade,
            sempre com documentação verificada e atendimento personalizado.
          </p>
        </div>

        {categoriaCounts.size > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Imóveis por categoria</h2>
            <ul className="flex flex-wrap gap-2">
              {Array.from(categoriaCounts.entries()).map(([catSlug, count]) => {
                const cat = CATEGORIAS[catSlug]
                return (
                  <li key={catSlug}>
                    <Link
                      href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade, categoria: catSlug })}
                      className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {cat.plural} {label.toLowerCase()} ({count})
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
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por faixa de preço</h2>
          <ul className="flex flex-wrap gap-2">
            {getAllPriceRanges(acaoToTipo(acao as AcaoSlug)).map(range => (
              <li key={range.slug}>
                <Link
                  href={`/${acao}/${cidade}/filtro/${range.slug}`}
                  className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {range.shortLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por quartos</h2>
          <ul className="flex flex-wrap gap-2">
            {BEDROOM_FILTERS.map(bf => (
              <li key={bf.slug}>
                <Link
                  href={`/${acao}/${cidade}/filtro/${bf.slug}`}
                  className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {bf.shortLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
