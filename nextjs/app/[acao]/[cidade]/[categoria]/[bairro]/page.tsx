import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import PropertyCard from '../../../../../components/PropertyCard'
import { fetchProperties, fetchNavigationMatrix, fetchBairroStats } from '../../../../../lib/api'
import { getBairroBySlug, BAIRROS } from '../../../../../data/bairros'
import {
  acaoToTipo,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  getCategoriaBySlug,
  bairroSlugToDbName,
  bairroDbNameToSlug,
  hasRichBairroContent,
  buildHierarchicalUrl,
  ACAO_LABELS,
  type AcaoSlug,
} from '../../../../../lib/navigation'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../../lib/config'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string; bairro: string }>
}

function threshold(count: number, bairroSlug: string): boolean {
  return count >= 3 || (count >= 1 && hasRichBairroContent(bairroSlug))
}

export async function generateStaticParams() {
  const matrix = await fetchNavigationMatrix()
  return matrix
    .map(row => ({
      acao:      row.tipo === 'venda' ? 'comprar' : 'alugar',
      cidade:    cidadeNameToSlug(row.cidade),
      categoria: row.categoria,
      bairro:    bairroDbNameToSlug(row.bairro),
      count:     row.count,
    }))
    .filter(p => cidadeSlugToName(p.cidade) && getCategoriaBySlug(p.categoria) && threshold(p.count, p.bairro))
    .map(({ count: _count, ...rest }) => rest)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { acao, cidade, categoria, bairro } = await params
  if (!isValidAcao(acao)) return {}
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  const bairroData = getBairroBySlug(bairro)
  if (!cidadeName || !categoriaData) return {}

  const bairroName = bairroData?.nome || bairro
  const label = ACAO_LABELS[acao].preposicao
  const title = `${categoriaData.plural} ${label} no ${bairroName}, ${cidadeName} SP — Corretor Yuri`
  const description = `${categoriaData.plural} ${label.toLowerCase()} no ${bairroName} em ${cidadeName}, SP. Atendimento com o Corretor Yuri, CRECI 235509.`
  const url = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria, bairro })}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Corretor Yuri Imóveis',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_DEFAULT_IMAGE] },
  }
}

export default async function BairroCategoriaAcaoPage({ params }: PageProps) {
  const { acao, cidade, categoria, bairro } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) notFound()

  const bairroData = getBairroBySlug(bairro)
  const bairroDbName = bairroSlugToDbName(bairro)
  const bairroName = bairroData?.nome || bairro

  const tipoFilter = acaoToTipo(acao as AcaoSlug)
  const [{ imoveis, total }, stats] = await Promise.all([
    fetchProperties({
      tipo: tipoFilter,
      categoria,
      cidade: cidadeName,
      bairro: bairroDbName,
      limit: 50,
    }),
    bairroDbName ? fetchBairroStats(bairroDbName, tipoFilter) : Promise.resolve({
      count: 0, saleCount: 0, rentCount: 0,
      avgPrice: 0, minPrice: 0, maxPrice: 0,
      avgArea: 0, avgPricePerM2: 0,
    }),
  ])

  if (!threshold(total, bairro)) notFound()

  const formatBRL = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  const label = ACAO_LABELS[acao as AcaoSlug].preposicao
  const h1 = `${categoriaData.plural} ${label} no ${bairroName}, ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria, bairro })}`

  const siblingBairros = Object.values(BAIRROS)
    .filter(b => b.slug !== bairro)
    .slice(0, 8)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade })}` },
        { '@type': 'ListItem', position: 3, name: `${categoriaData.plural} ${label}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade, categoria })}` },
        { '@type': 'ListItem', position: 4, name: bairroName, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      itemListElement: imoveis.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo, url: `${SITE_URL}/imoveis/${p.titulo.toLowerCase().replace(/\s+/g, '-')}-${p.id}` })),
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
            <Link href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade, categoria })} className="hover:text-white transition-colors">{categoriaData.plural} {label}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{bairroName}</span>
          </nav>
          <span className="section-label">{label}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{h1}</h1>
          <p className="text-gray-400 text-sm mt-2">{total} imóve{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}</p>
        </div>
      </div>

      {stats.count > 0 && (
        <section className="container mx-auto px-6 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white border border-gray-200">
            <div className="py-6 px-5 border-r border-gray-200 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Imóveis ativos</p>
              <p className="text-2xl md:text-3xl font-black text-dark leading-none">{stats.count}</p>
            </div>
            <div className="py-6 px-5 border-r border-gray-200 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Preço médio</p>
              <p className="text-base md:text-xl font-black text-dark leading-none">{formatBRL(Math.round(stats.avgPrice))}</p>
            </div>
            <div className="py-6 px-5 border-r border-gray-200 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Faixa de preço</p>
              <p className="text-xs md:text-sm font-bold text-dark leading-none">
                {stats.minPrice > 0 ? formatBRL(stats.minPrice) : '—'}
                <span className="mx-1 text-gray-400">→</span>
                {formatBRL(stats.maxPrice)}
              </p>
            </div>
            <div className="py-6 px-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Preço médio por m²</p>
              <p className="text-base md:text-xl font-black text-dark leading-none">
                {stats.avgPricePerM2 > 0 ? formatBRL(Math.round(stats.avgPricePerM2)) : '—'}
              </p>
            </div>
          </div>
          {stats.avgArea > 0 && (
            <p className="text-[11px] text-gray-500 mt-2 text-center md:text-left">
              Área média dos {categoriaData.plural.toLowerCase()} {label.toLowerCase()} no {bairroName}: <strong>{Math.round(stats.avgArea)} m²</strong>
            </p>
          )}
        </section>
      )}

      {bairroData && (
        <section className="container mx-auto px-6 pt-10 pb-2">
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Sobre o {bairroName}</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.sobre}</p>
            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Infraestrutura</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.infraestrutura}</p>
            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Transporte e Acesso</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{bairroData.conteudo.transporte}</p>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade, categoria })} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os {categoriaData.plural.toLowerCase()} {label.toLowerCase()}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {imoveis.map(property => (
            <PropertyCard key={property.id} imovel={property} />
          ))}
        </div>

        {siblingBairros.length > 0 && (
          <section className="mt-14">
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Outros bairros em {cidadeName}</h2>
            <ul className="flex flex-wrap gap-2">
              {siblingBairros.map(b => (
                <li key={b.slug}>
                  <Link
                    href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade, categoria, bairro: b.slug })}
                    className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {categoriaData.plural} {label.toLowerCase()} no {b.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
