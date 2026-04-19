import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import PropertyCard from '../../../../../../../components/PropertyCard'
import { fetchProperties, fetchPriceBedroomMatrix } from '../../../../../../../lib/api'
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
  type AcaoSlug,
} from '../../../../../../../lib/navigation'
import {
  getBedroomFilterBySlug,
  BEDROOM_FILTERS,
  type BedroomFilter,
} from '../../../../../../../data/priceRanges'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../../../../lib/config'
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
  }

  return params
}

async function resolveParams(p: { acao: string; cidade: string; categoria: string; bairro: string; filtro: string }) {
  if (!isValidAcao(p.acao)) return null
  const cidadeName = cidadeSlugToName(p.cidade)
  const categoriaData = getCategoriaBySlug(p.categoria)
  if (!cidadeName || !categoriaData) return null
  const bairroData = getBairroBySlug(p.bairro)
  const bairroDbName = bairroSlugToDbName(p.bairro)
  const bairroName = bairroData?.nome || p.bairro
  const bedroom: BedroomFilter | undefined = getBedroomFilterBySlug(p.filtro)
  if (!bedroom) return null
  return {
    acao: p.acao as AcaoSlug,
    cidade: p.cidade,
    categoria: p.categoria,
    bairro: p.bairro,
    cidadeName,
    categoriaData,
    bairroDbName,
    bairroName,
    bedroom,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = await params
  const ctx = await resolveParams(raw)
  if (!ctx) return {}

  const { total } = await fetchProperties({
    tipo: acaoToTipo(ctx.acao),
    categoria: ctx.categoria,
    cidade: ctx.cidadeName,
    bairro: ctx.bairroDbName,
    quartos: String(ctx.bedroom.value),
    limit: 50,
  })

  const label = ACAO_LABELS[ctx.acao].preposicao
  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${ctx.categoriaData.plural} ${label} com ${ctx.bedroom.label} no ${ctx.bairroName}, ${ctx.cidadeName} SP`
  const description = `${ctx.categoriaData.plural} ${label.toLowerCase()} com ${ctx.bedroom.label} no ${ctx.bairroName}, ${ctx.cidadeName} SP. Financiamento, documentação e atendimento com o Corretor Yuri (CRECI 235509).`
  const url = `${SITE_URL}${buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro)}`

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

export default async function BairroFilterPage({ params }: PageProps) {
  const raw = await params
  const ctx = await resolveParams(raw)
  if (!ctx) notFound()

  const { imoveis, total } = await fetchProperties({
    tipo: acaoToTipo(ctx.acao),
    categoria: ctx.categoria,
    cidade: ctx.cidadeName,
    bairro: ctx.bairroDbName,
    quartos: String(ctx.bedroom.value),
    limit: 50,
  })

  if (total === 0) notFound()

  const label = ACAO_LABELS[ctx.acao].preposicao
  const h1 = `${ctx.categoriaData.plural} ${label} com ${ctx.bedroom.label} no ${ctx.bairroName}, ${ctx.cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, raw.filtro)}`
  const bairroUrl = buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria, bairro: raw.bairro })

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: `${ctx.acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${ctx.cidadeName}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade })}` },
        { '@type': 'ListItem', position: 3, name: `${ctx.categoriaData.plural} ${label}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria })}` },
        { '@type': 'ListItem', position: 4, name: ctx.bairroName, item: `${SITE_URL}${bairroUrl}` },
        { '@type': 'ListItem', position: 5, name: ctx.bedroom.label, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      description: `${ctx.categoriaData.plural} ${label.toLowerCase()} com ${ctx.bedroom.label} no ${ctx.bairroName}, ${ctx.cidadeName} SP.`,
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
            <Link href={buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade })} className="hover:text-white transition-colors">{ctx.cidadeName}</Link>
            <span aria-hidden="true">/</span>
            <Link href={buildHierarchicalUrl({ acao: ctx.acao, cidade: raw.cidade, categoria: raw.categoria })} className="hover:text-white transition-colors">{ctx.categoriaData.plural} {label}</Link>
            <span aria-hidden="true">/</span>
            <Link href={bairroUrl} className="hover:text-white transition-colors">{ctx.bairroName}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{ctx.bedroom.label}</span>
          </nav>
          <span className="section-label">{label}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{h1}</h1>
          <p className="text-gray-400 text-sm mt-2">{total} imóve{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">
            Encontre {ctx.categoriaData.plural.toLowerCase()} {label.toLowerCase()} com {ctx.bedroom.label} no {ctx.bairroName}, {ctx.cidadeName} SP.
            Todas as opções com documentação verificada e atendimento personalizado do Corretor Yuri.
          </p>
        </div>

        <div className="mb-6">
          <Link href={bairroUrl} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os {ctx.categoriaData.plural.toLowerCase()} {label.toLowerCase()} no {ctx.bairroName}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {imoveis.map(property => (
            <PropertyCard key={property.id} imovel={property} />
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por quartos no {ctx.bairroName}</h2>
          <ul className="flex flex-wrap gap-2">
            {BEDROOM_FILTERS.map(f => (
              <li key={f.slug}>
                <Link
                  href={buildBairroFilterUrl(raw.acao, raw.cidade, raw.categoria, raw.bairro, f.slug)}
                  className={`inline-block border px-3 py-2 text-xs transition-colors ${
                    f.slug === raw.filtro
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
