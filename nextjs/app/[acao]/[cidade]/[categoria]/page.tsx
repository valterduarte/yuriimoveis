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
import { BEDROOM_FILTERS, getAllPriceRanges } from '../../../../data/priceRanges'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../lib/config'
import type { Metadata } from 'next'

const ITBI_RATE_BY_CITY: Record<string, string> = {
  Osasco: '2%',
  Barueri: '3%',
}

interface Faq {
  q: string
  a: string
}

function buildFaqs(args: {
  acao: AcaoSlug
  cidadeName: string
  categoriaData: { singular: string; plural: string }
  label: string
  total: number
  topBairros: { slug: string; count: number }[]
}): Faq[] {
  const { acao, cidadeName, categoriaData, label, total, topBairros } = args
  const pluralLc = categoriaData.plural.toLowerCase()
  const labelLc = label.toLowerCase()

  const topBairroNames = topBairros
    .slice(0, 3)
    .map(b => getBairroBySlug(b.slug)?.nome || b.slug)

  const bairrosAnswer = topBairroNames.length > 0
    ? `Atualmente os bairros com mais ${pluralLc} ${labelLc} em ${cidadeName} são ${topBairroNames.join(', ')}. Veja a lista completa de bairros logo abaixo.`
    : `Temos ${pluralLc} ${labelLc} distribuídos por vários bairros de ${cidadeName}. Confira a lista de bairros abaixo.`

  const countAnswer = total > 0
    ? `Hoje temos ${total} ${pluralLc} ${labelLc} em ${cidadeName} no site. O estoque é atualizado diariamente e você pode falar com o corretor pelo WhatsApp para opções ainda não publicadas.`
    : `O estoque muda todos os dias. Fale com o Corretor Yuri pelo WhatsApp para receber opções de ${pluralLc} ${labelLc} em ${cidadeName} assim que aparecerem.`

  if (acao === 'comprar') {
    const itbi = ITBI_RATE_BY_CITY[cidadeName] || 'varia por município'
    return [
      { q: `Quantos ${pluralLc} ${labelLc} há em ${cidadeName}?`, a: countAnswer },
      { q: `Quais bairros de ${cidadeName} têm mais ${pluralLc} ${labelLc}?`, a: bairrosAnswer },
      {
        q: `Posso financiar pela Caixa ou pelo Minha Casa Minha Vida?`,
        a: `Sim. Trabalhamos com SBPE da Caixa e Minha Casa Minha Vida para renda até R$ 12 mil. Use o simulador para ver a parcela estimada do imóvel de interesse.`,
      },
      {
        q: `Quanto custa o ITBI ao comprar um imóvel em ${cidadeName}?`,
        a: `A alíquota de ITBI em ${cidadeName} é de ${itbi} sobre o valor de compra (ou o valor venal, o que for maior). Confira o guia completo de ITBI no blog.`,
      },
      {
        q: `Como funciona a negociação com o Corretor Yuri?`,
        a: `Todas as negociações são conduzidas pelo Corretor Yuri (CRECI-SP 235509): verificação de documentação, assessoria no cartório e orientação completa sobre financiamento, sem custo para o comprador.`,
      },
    ]
  }

  return [
    { q: `Quantos ${pluralLc} ${labelLc} há em ${cidadeName}?`, a: countAnswer },
    { q: `Quais bairros de ${cidadeName} têm mais ${pluralLc} ${labelLc}?`, a: bairrosAnswer },
    {
      q: `Quais garantias locatícias são aceitas?`,
      a: `Aceitamos fiador, seguro-fiança, caução e título de capitalização. A garantia exigida depende do imóvel e do perfil do locatário.`,
    },
    {
      q: `Qual é o prazo mínimo do contrato de locação?`,
      a: `Contratos residenciais costumam ter prazo de 30 meses, com reajuste anual pelo índice definido em contrato (geralmente IGPM ou IPCA).`,
    },
    {
      q: `Como funciona a negociação com o Corretor Yuri?`,
      a: `Todas as locações são intermediadas pelo Corretor Yuri (CRECI-SP 235509), com verificação de documentação do imóvel e orientação completa sobre garantias, vistoria e assinatura do contrato.`,
    },
  ]
}

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
  const { total } = await fetchProperties({
    tipo: acaoToTipo(acao as AcaoSlug),
    categoria,
    cidade: cidadeName,
    limit: 50,
  })

  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${categoriaData.plural} ${label} em ${cidadeName} SP`
  const description = total > 0
    ? `${total} ${categoriaData.plural.toLowerCase()} ${label.toLowerCase()} em ${cidadeName}, SP. Financiamento Caixa, Minha Casa Minha Vida e atendimento com o Corretor Yuri (CRECI 235509).`
    : `${categoriaData.plural} ${label.toLowerCase()} em ${cidadeName}, SP. Encontre imóveis nos melhores bairros com o Corretor Yuri, CRECI 235509.`
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

  const topBairros = [...bairrosWithCount].sort((a, b) => b.count - a.count)

  const faqs = buildFaqs({
    acao: acao as AcaoSlug,
    cidadeName,
    categoriaData,
    label,
    total,
    topBairros,
  })

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
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
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

        <section className="mt-14 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">
              {categoriaData.plural} {label} por quartos
            </h2>
            <ul className="flex flex-wrap gap-2">
              {BEDROOM_FILTERS.map(bf => (
                <li key={bf.slug}>
                  <Link
                    href={`/${acao}/${cidade}/${categoria}/filtro/${bf.slug}`}
                    className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {bf.shortLabel || bf.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">
              {categoriaData.plural} {label} por preço
            </h2>
            <ul className="flex flex-wrap gap-2">
              {getAllPriceRanges(acaoToTipo(acao as AcaoSlug)).map(pr => (
                <li key={pr.slug}>
                  <Link
                    href={`/${acao}/${cidade}/${categoria}/filtro/${pr.slug}`}
                    className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {pr.shortLabel || pr.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

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

        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-base font-bold text-dark mb-4 uppercase tracking-wide">
            Perguntas frequentes
          </h2>
          <div className="divide-y divide-gray-200 border border-gray-200 bg-white">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-bold text-dark hover:text-primary">
                  <span>{faq.q}</span>
                  <span className="text-primary text-lg leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-700 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
