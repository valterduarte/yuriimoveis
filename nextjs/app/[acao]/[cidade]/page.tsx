import { notFound } from 'next/navigation'
import Link from 'next/link'
import PropertyCard from '../../../components/PropertyCard'
import LazyPropertyGrid from '../../../components/LazyPropertyGrid'
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
  bairroDbNameToSlug,
  hasRichBairroContent,
} from '../../../lib/navigation'
import { CATEGORIAS } from '../../../data/categorias'
import { getAllPriceRanges, BEDROOM_FILTERS } from '../../../data/priceRanges'
import { SITE_URL } from '../../../lib/config'
import { buildBreadcrumb, buildCollectionPage, buildPropertyProduct } from '../../../lib/jsonLd'
import { buildListingMetadata } from '../../../lib/seo'
import { FilterChip, FilterChipList } from '../../../components/FilterChip'
import type { PropertyCategory } from '../../../types'
import type { Metadata } from 'next'

export const revalidate = 300

const INITIAL_VISIBLE = 12

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
  return buildListingMetadata({
    title,
    description,
    url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade })}`,
  })
}

export default async function CidadeAcaoPage({ params }: PageProps) {
  const { acao, cidade } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  if (!cidadeName) notFound()

  const { imoveis, total } = await fetchProperties({
    tipo: acaoToTipo(acao),
    cidade: cidadeName,
    limit: 50,
  })

  if (total === 0) notFound()

  const label = ACAO_LABELS[acao].preposicao
  const h1 = `Imóveis ${label} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade })}`

  const matrix = await fetchNavigationMatrix()
  const categoriaCounts = new Map<PropertyCategory, number>()
  const bairroCounts = new Map<string, number>()
  for (const row of matrix) {
    if (row.tipo !== acaoToTipo(acao)) continue
    if (cidadeNameToSlug(row.cidade) !== cidade) continue
    const categoriaData = getCategoriaBySlug(row.categoria)
    if (!categoriaData) continue
    categoriaCounts.set(categoriaData.slug, (categoriaCounts.get(categoriaData.slug) || 0) + row.count)
    if (row.bairro) {
      bairroCounts.set(row.bairro, (bairroCounts.get(row.bairro) || 0) + row.count)
    }
  }
  const topBairros = Array.from(bairroCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([nome, count]) => ({
      nome,
      count,
      slug: bairroDbNameToSlug(nome),
    }))
    .filter(b => b.slug)
    .map(b => ({ ...b, hasGuide: hasRichBairroContent(b.slug) }))

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início', path: '/' },
      { name: h1,       path: buildHierarchicalUrl({ acao, cidade }) },
    ]),
    buildCollectionPage({
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      items: imoveis.map(buildPropertyProduct),
    }),
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
            <FilterChipList>
              {Array.from(categoriaCounts.entries()).map(([catSlug, count]) => {
                const cat = CATEGORIAS[catSlug]
                return (
                  <FilterChip key={catSlug} href={buildHierarchicalUrl({ acao, cidade, categoria: catSlug })}>
                    {cat.plural} {label.toLowerCase()} ({count})
                  </FilterChip>
                )
              })}
            </FilterChipList>
          </section>
        )}

        {topBairros.length > 0 && (
          <section className="mb-10">
            <div className="flex items-end justify-between gap-4 mb-4">
              <h2 className="text-base font-bold text-dark uppercase tracking-wide">Imóveis por bairro em {cidadeName}</h2>
              <Link href="/bairros" className="text-xs uppercase tracking-wider font-bold text-primary hover:underline whitespace-nowrap">
                Todos os bairros →
              </Link>
            </div>
            <FilterChipList>
              {topBairros.map(b => (
                <FilterChip key={b.slug} href={buildHierarchicalUrl({ acao, cidade, bairro: b.slug })}>
                  <span>{b.nome} ({b.count})</span>
                  {b.hasGuide && (
                    <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5">Guia</span>
                  )}
                </FilterChip>
              ))}
            </FilterChipList>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {imoveis.slice(0, INITIAL_VISIBLE).map(property => (
            <PropertyCard key={property.id} imovel={property} />
          ))}
          <LazyPropertyGrid items={imoveis.slice(INITIAL_VISIBLE)} />
        </div>

        <section className="mt-14">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por faixa de preço</h2>
          <FilterChipList>
            {getAllPriceRanges(acaoToTipo(acao)).map(range => (
              <FilterChip key={range.slug} href={`/${acao}/${cidade}/filtro/${range.slug}`}>
                {range.shortLabel}
              </FilterChip>
            ))}
          </FilterChipList>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por quartos</h2>
          <FilterChipList>
            {BEDROOM_FILTERS.map(bf => (
              <FilterChip key={bf.slug} href={`/${acao}/${cidade}/filtro/${bf.slug}`}>
                {bf.shortLabel}
              </FilterChip>
            ))}
          </FilterChipList>
        </section>
      </div>
    </div>
  )
}
