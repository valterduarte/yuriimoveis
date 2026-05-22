import { notFound } from 'next/navigation'
import Link from 'next/link'
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
import ListingPageShell, { type BreadcrumbItem } from '../../../components/ListingPageShell'
import PropertyResultsGrid from '../../../components/PropertyResultsGrid'
import type { PropertyCategory } from '../../../types'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string }>
}

export async function generateStaticParams() {
  // Aluguel: catálogo público fica vazio enquanto não houver inventário no banco.
  // O atendimento de aluguel acontece sob demanda pela landing /alugar/page.tsx; URLs
  // hierárquicas /alugar/{cidade}/* respondem 404 (total === 0) por design.
  const cidades = getAllCidadeSlugs()
  return cidades.map(cidade => ({ acao: 'comprar', cidade }))
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

  const breadcrumb: BreadcrumbItem[] = [
    { name: 'Início',  path: '/' },
    { name: cidadeName, path: buildHierarchicalUrl({ acao, cidade }) },
  ]

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
    <ListingPageShell jsonLd={jsonLd} breadcrumb={breadcrumb} label={label} h1={h1} total={total}>
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
          <h2 className="heading-section">Imóveis por categoria</h2>
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

      <PropertyResultsGrid imoveis={imoveis} />

      <section className="mt-14">
        <h2 className="heading-section">Filtrar por faixa de preço</h2>
        <FilterChipList>
          {getAllPriceRanges(acaoToTipo(acao)).map(range => (
            <FilterChip key={range.slug} href={`/${acao}/${cidade}/filtro/${range.slug}`}>
              {range.shortLabel}
            </FilterChip>
          ))}
        </FilterChipList>
      </section>

      <section className="mt-8">
        <h2 className="heading-section">Filtrar por quartos</h2>
        <FilterChipList>
          {BEDROOM_FILTERS.map(bf => (
            <FilterChip key={bf.slug} href={`/${acao}/${cidade}/filtro/${bf.slug}`}>
              {bf.shortLabel}
            </FilterChip>
          ))}
        </FilterChipList>
      </section>
      </div>
    </ListingPageShell>
  )
}
