import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import PropertyCard from '../../../../components/PropertyCard'
import { fetchProperties, fetchNavigationMatrix } from '../../../../lib/api'
import {
  acaoToTipo,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  getCategoriaBySlug,
  bairroDbNameToSlug,
  buildHierarchicalUrl,
  ACAO_LABELS,
  type AcaoSlug,
} from '../../../../lib/navigation'
import { getBairroBySlug } from '../../../../data/bairros'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../lib/config'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string }>
}

export async function generateStaticParams() {
  const matrix = await fetchNavigationMatrix()
  const seen = new Set<string>()
  const params: { acao: string; cidade: string; categoria: string }[] = []

  for (const row of matrix) {
    const acao = row.tipo === 'venda' ? 'comprar' : 'alugar'
    const cidade = cidadeNameToSlug(row.cidade)
    if (!cidadeSlugToName(cidade)) continue
    if (!getCategoriaBySlug(row.categoria)) continue
    const key = `${acao}|${cidade}|${row.categoria}`
    if (seen.has(key)) continue
    seen.add(key)
    params.push({ acao, cidade, categoria: row.categoria })
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { acao, cidade, categoria } = await params
  if (!isValidAcao(acao)) return {}
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) return {}

  const label = ACAO_LABELS[acao].preposicao
  const title = `${categoriaData.plural} ${label} em ${cidadeName} SP — Corretor Yuri`
  const description = `${categoriaData.plural} ${label.toLowerCase()} em ${cidadeName}, SP. Encontre imóveis nos melhores bairros com o Corretor Yuri, CRECI 235509.`
  const url = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria })}`

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

export default async function CategoriaAcaoPage({ params }: PageProps) {
  const { acao, cidade, categoria } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) notFound()

  const { imoveis, total } = await fetchProperties({
    tipo: acaoToTipo(acao as AcaoSlug),
    categoria,
    cidade: cidadeName,
    limit: 50,
  })

  if (total === 0) notFound()

  const label = ACAO_LABELS[acao as AcaoSlug].preposicao
  const h1 = `${categoriaData.plural} ${label} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria })}`

  const matrix = await fetchNavigationMatrix()
  const bairrosWithCount = matrix
    .filter(r =>
      r.tipo === acaoToTipo(acao as AcaoSlug) &&
      r.categoria === categoria &&
      cidadeNameToSlug(r.cidade) === cidade
    )
    .map(r => ({ slug: bairroDbNameToSlug(r.bairro), count: r.count }))
    .filter(b => !!getBairroBySlug(b.slug) || b.count >= 3)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade })}` },
        { '@type': 'ListItem', position: 3, name: `${categoriaData.plural} ${label}`, item: canonicalUrl },
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
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade })} className="hover:text-white transition-colors">{cidadeName}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{categoriaData.plural} {label}</span>
          </nav>
          <span className="section-label">{label}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{h1}</h1>
          <p className="text-gray-400 text-sm mt-2">{total} imóve{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade })} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os imóveis {label.toLowerCase()} em {cidadeName}
          </Link>
        </div>

        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            Encontre {categoriaData.plural.toLowerCase()} {label.toLowerCase()} em {cidadeName} nos melhores bairros da cidade.
            Temos opções em diversas faixas de preço e metragens, todas com atendimento personalizado do Corretor Yuri e
            documentação verificada. Navegue pelos bairros abaixo ou veja todos os imóveis disponíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {imoveis.map(property => (
            <PropertyCard key={property.id} imovel={property} />
          ))}
        </div>

        {bairrosWithCount.length > 0 && (
          <section className="mt-14">
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">
              {categoriaData.plural} {label} por bairro
            </h2>
            <ul className="flex flex-wrap gap-2">
              {bairrosWithCount.map(b => {
                const bairroData = getBairroBySlug(b.slug)
                const displayName = bairroData?.nome || b.slug
                return (
                  <li key={b.slug}>
                    <Link
                      href={buildHierarchicalUrl({ acao: acao as AcaoSlug, cidade, categoria, bairro: b.slug })}
                      className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {displayName} ({b.count})
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
