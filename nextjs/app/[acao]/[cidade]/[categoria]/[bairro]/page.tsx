import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import PropertyCard from '../../../../../components/PropertyCard'
import LazyPropertyGrid from '../../../../../components/LazyPropertyGrid'
import { fetchProperties, fetchNavigationMatrix } from '../../../../../lib/api'
import { formatNeighborhoodName, emBairro, deBairro, sobreBairro, formatPrice } from '../../../../../utils/imovelUtils'
import { getBairroBySlug, BAIRROS } from '../../../../../data/bairros'
import { ITBI_RATE_BY_CITY } from '../../../../../lib/constants'
import {
  acaoToTipo,
  isValidAcao,
  type AcaoSlug,
  cidadeSlugToName,
  cidadeNameToSlug,
  getCategoriaBySlug,
  bairroSlugToDbName,
  bairroDbNameToSlug,
  hasRichBairroContent,
  buildHierarchicalUrl,
  inferCidadeFromBairro,
  ACAO_LABELS,
} from '../../../../../lib/navigation'
import { BEDROOM_FILTERS } from '../../../../../data/priceRanges'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../../lib/config'
import { buildPropertyProduct } from '../../../../../lib/jsonLd'
import type { Metadata } from 'next'

export const revalidate = 300

const INITIAL_VISIBLE = 12

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string; bairro: string }>
}

function threshold(count: number, bairroSlug: string): boolean {
  return count >= 3 || (count >= 1 && hasRichBairroContent(bairroSlug))
}

function formatPriceRange(prices: number[], tipo: 'venda' | 'aluguel'): string {
  if (prices.length === 0) return ''
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatPrice(min, tipo)
  return `de ${formatPrice(min, tipo)} a ${formatPrice(max, tipo)}`
}

interface BairroFaq {
  q: string
  a: string
}

function buildBairroFaqs(args: {
  acao: AcaoSlug
  cidadeName: string
  bairroName: string
  categoriaData: { singular: string; plural: string }
  label: string
  prep: 'no' | 'na'
  total: number
  priceRange: string
  transporte?: string
}): BairroFaq[] {
  const { acao, cidadeName, bairroName, categoriaData, label, prep, total, priceRange, transporte } = args
  const pluralLc = categoriaData.plural.toLowerCase()
  const labelLc = label.toLowerCase()
  const itbi = ITBI_RATE_BY_CITY[cidadeName]
  const faqs: BairroFaq[] = []

  faqs.push({
    q: `Quantos ${pluralLc} ${labelLc} há ${prep} ${bairroName}?`,
    a: total > 0
      ? `Hoje temos ${total} ${pluralLc} ${labelLc} ${prep} ${bairroName}, em ${cidadeName}. O estoque é atualizado diariamente; chame no WhatsApp para receber opções ainda não publicadas.`
      : `O estoque muda diariamente. Fale com o Corretor Yuri pelo WhatsApp para receber novidades de ${pluralLc} ${labelLc} ${prep} ${bairroName} assim que aparecerem.`,
  })

  if (priceRange) {
    faqs.push({
      q: `Qual a faixa de preço dos ${pluralLc} ${labelLc} ${prep} ${bairroName}?`,
      a: `Os ${pluralLc} ${labelLc} ${prep} ${bairroName} variam ${priceRange}. Use o simulador para projetar parcela, entrada e elegibilidade ao Minha Casa Minha Vida.`,
    })
  }

  if (transporte) {
    const sentence = transporte.split('. ')[0].trim()
    const trimmed = sentence.endsWith('.') ? sentence : `${sentence}.`
    faqs.push({
      q: `Como é o transporte público ${prep} ${bairroName}?`,
      a: trimmed,
    })
  }

  if (acao === 'comprar') {
    faqs.push({
      q: 'Posso financiar pela Caixa ou pelo Minha Casa Minha Vida?',
      a: 'Sim. Atendemos com SBPE da Caixa e Minha Casa Minha Vida para renda até R$ 12 mil. O simulador do site mostra a parcela estimada e a elegibilidade ao MCMV para cada imóvel.',
    })
    if (itbi) {
      faqs.push({
        q: `Quanto custa o ITBI ao comprar um imóvel em ${cidadeName}?`,
        a: `A alíquota de ITBI em ${cidadeName} é de ${itbi} sobre o valor de compra (ou o valor venal, o que for maior). Confira o guia completo de ITBI no blog.`,
      })
    }
  } else {
    faqs.push({
      q: 'Quais garantias locatícias são aceitas?',
      a: 'Aceitamos fiador, seguro-fiança, caução e título de capitalização. A garantia exigida varia conforme o imóvel e o perfil do locatário.',
    })
  }

  return faqs
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

  const bairroName = bairroData?.nome || formatNeighborhoodName(bairro)
  const bairroDbName = bairroSlugToDbName(bairro) || bairroName
  const label = ACAO_LABELS[acao].preposicao

  const tipoFilter = acaoToTipo(acao)
  const { imoveis, total } = await fetchProperties({
    tipo: tipoFilter,
    categoria,
    cidade: cidadeName,
    bairro: bairroDbName,
    limit: 50,
  })

  const nomeImovel = total === 1 ? categoriaData.singular : categoriaData.plural
  const countPrefix = total > 0 ? `${total} ` : ''
  const prep = emBairro(bairroName)
  const title = `${countPrefix}${nomeImovel} ${label} ${prep} ${bairroName}, ${cidadeName} SP`

  const priceRange = formatPriceRange(imoveis.map(p => p.preco), tipoFilter)
  const itbi = ITBI_RATE_BY_CITY[cidadeName]
  const itbiPart = acao === 'comprar' && itbi ? ` ITBI ${itbi}.` : ''
  const pricePart = priceRange ? `, ${priceRange}.` : '.'
  const description = total > 0
    ? `${total} ${nomeImovel.toLowerCase()} ${label.toLowerCase()} ${prep} ${bairroName} em ${cidadeName} SP${pricePart}${itbiPart} Atendimento Corretor Yuri (CRECI 235509).`
    : `${nomeImovel} ${label.toLowerCase()} ${prep} ${bairroName} em ${cidadeName} SP. Atendimento Corretor Yuri (CRECI 235509).`
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
  const bairroName = bairroData?.nome || formatNeighborhoodName(bairro)
  const bairroDbName = bairroSlugToDbName(bairro) || bairroName

  const tipoFilter = acaoToTipo(acao)
  const { imoveis, total } = await fetchProperties({
    tipo: tipoFilter,
    categoria,
    cidade: cidadeName,
    bairro: bairroDbName,
    limit: 50,
  })

  if (!threshold(total, bairro)) notFound()

  const label = ACAO_LABELS[acao].preposicao
  const nomeImovel = total === 1 ? categoriaData.singular : categoriaData.plural
  const prep = emBairro(bairroName)
  const h1 = `${nomeImovel} ${label} ${prep} ${bairroName}, ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria, bairro })}`

  const matrix = await fetchNavigationMatrix()
  const bairrosWithStock = new Set(
    matrix
      .filter(row =>
        row.cidade === cidadeName &&
        row.categoria === categoria &&
        row.tipo === tipoFilter &&
        row.count > 0
      )
      .map(row => bairroDbNameToSlug(row.bairro))
  )
  const siblingBairros = Object.values(BAIRROS)
    .filter(b => b.slug !== bairro && inferCidadeFromBairro(b) === cidadeName && bairrosWithStock.has(b.slug))
    .slice(0, 8)

  const bedroomCounts = new Map<string, number>()
  for (const p of imoveis) {
    for (const bf of BEDROOM_FILTERS) {
      const minBedrooms = bf.value === '4+' ? 4 : bf.value
      if (p.quartos >= minBedrooms) {
        bedroomCounts.set(bf.slug, (bedroomCounts.get(bf.slug) ?? 0) + 1)
      }
    }
  }
  const availableBedroomFilters = BEDROOM_FILTERS.filter(bf => (bedroomCounts.get(bf.slug) ?? 0) > 0)

  const priceRange = formatPriceRange(imoveis.map(p => p.preco), tipoFilter)
  const faqs = buildBairroFaqs({
    acao,
    cidadeName,
    bairroName,
    categoriaData,
    label,
    prep,
    total,
    priceRange,
    transporte: bairroData?.conteudo.transporte,
  })

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: acao, cidade })}` },
        { '@type': 'ListItem', position: 3, name: `${categoriaData.plural} ${label}`, item: `${SITE_URL}${buildHierarchicalUrl({ acao: acao, cidade, categoria })}` },
        { '@type': 'ListItem', position: 4, name: bairroName, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      itemListElement: imoveis.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: buildPropertyProduct(p) })),
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
            <Link href={buildHierarchicalUrl({ acao: acao, cidade })} className="hover:text-white transition-colors">{cidadeName}</Link>
            <span aria-hidden="true">/</span>
            <Link href={buildHierarchicalUrl({ acao: acao, cidade, categoria })} className="hover:text-white transition-colors">{categoriaData.plural} {label}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{bairroName}</span>
          </nav>
          <span className="section-label">{label}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{h1}</h1>
          <p className="text-gray-400 text-sm mt-2">{total} imóve{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}</p>
        </div>
      </div>

      {bairroData && (
        <section className="container mx-auto px-6 pt-10 pb-2">
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">{sobreBairro(bairroName)} {bairroName}</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.sobre}</p>
            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Infraestrutura</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{bairroData.conteudo.infraestrutura}</p>
            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Transporte e Acesso</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{bairroData.conteudo.transporte}</p>
            <Link
              href={`/bairros/${bairro}`}
              className="inline-flex items-center gap-1.5 mt-5 text-xs uppercase tracking-wider font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Ler guia completo {deBairro(bairroName)} {bairroName} →
            </Link>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href={buildHierarchicalUrl({ acao: acao, cidade, categoria })} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os {categoriaData.plural.toLowerCase()} {label.toLowerCase()}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {imoveis.slice(0, INITIAL_VISIBLE).map(property => (
            <PropertyCard key={property.id} imovel={property} />
          ))}
          <LazyPropertyGrid items={imoveis.slice(INITIAL_VISIBLE)} />
        </div>

        {availableBedroomFilters.length > 0 && (
          <section className="mt-14">
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Filtrar por quartos {emBairro(bairroName)} {bairroName}</h2>
            <ul className="flex flex-wrap gap-2">
              {availableBedroomFilters.map(bf => (
                <li key={bf.slug}>
                  <Link
                    href={`${buildHierarchicalUrl({ acao: acao, cidade, categoria, bairro })}/filtro/${bf.slug}`}
                    className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {categoriaData.plural} {label.toLowerCase()} com {bf.shortLabel || bf.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {siblingBairros.length > 0 && (
          <section className="mt-14">
            <h2 className="text-base font-bold text-dark mb-4 uppercase tracking-wide">Outros bairros em {cidadeName}</h2>
            <ul className="flex flex-wrap gap-2">
              {siblingBairros.map(b => (
                <li key={b.slug}>
                  <Link
                    href={buildHierarchicalUrl({ acao: acao, cidade, categoria, bairro: b.slug })}
                    className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {categoriaData.plural} {label.toLowerCase()} {emBairro(b.nome)} {b.nome}
                  </Link>
                </li>
              ))}
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
