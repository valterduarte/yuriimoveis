import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { fetchProperties, fetchNavigationMatrix } from '../../../../../lib/api'
import ListingPageShell, { type BreadcrumbItem } from '../../../../../components/ListingPageShell'
import PropertyResultsGrid from '../../../../../components/PropertyResultsGrid'
import { FilterChip, FilterChipList } from '../../../../../components/FilterChip'
import { formatNeighborhoodName, emBairro, deBairro, sobreBairro, formatPrice } from '../../../../../utils/imovelUtils'
import { getBairroBySlug, BAIRROS } from '../../../../../data/bairros'
import { ITBI_RATE_BY_CITY, SEO_MIN_PROPERTIES_FOR_INDEXING } from '../../../../../lib/constants'
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
import { SITE_URL } from '../../../../../lib/config'
import { buildBreadcrumb, buildCollectionPage, buildFaqPageSchema, buildPropertyProduct } from '../../../../../lib/jsonLd'
import { buildListingMetadata } from '../../../../../lib/seo'
import FaqAccordion from '../../../../../components/FaqAccordion'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = {
  params: Promise<{ acao: string; cidade: string; categoria: string; bairro: string }>
}

function threshold(count: number, bairroSlug: string): boolean {
  return count >= 3 || (count >= 1 && hasRichBairroContent(bairroSlug))
}

interface PriceRange {
  text: string
  isRange: boolean
}

function formatPriceRange(prices: number[], tipo: 'venda' | 'aluguel'): PriceRange | null {
  if (prices.length === 0) return null
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return { text: formatPrice(min, tipo), isRange: false }
  return { text: `${formatPrice(min, tipo)} a ${formatPrice(max, tipo)}`, isRange: true }
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
  priceRange: PriceRange | null
  transporte?: string
}): BairroFaq[] {
  const { acao, cidadeName, bairroName, categoriaData, label, prep, total, priceRange, transporte } = args
  const pluralLc = categoriaData.plural.toLowerCase()
  const singularLc = categoriaData.singular.toLowerCase()
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
    if (priceRange.isRange) {
      faqs.push({
        q: `Qual a faixa de preço dos ${pluralLc} ${labelLc} ${prep} ${bairroName}?`,
        a: `Os ${pluralLc} ${labelLc} ${prep} ${bairroName} variam de ${priceRange.text}. Use o simulador para projetar parcela, entrada e elegibilidade ao Minha Casa Minha Vida.`,
      })
    } else if (total === 1) {
      faqs.push({
        q: `Quanto custa o ${singularLc} ${labelLc} ${prep} ${bairroName}?`,
        a: `O ${singularLc} ${labelLc} disponível ${prep} ${bairroName} está anunciado por ${priceRange.text}. Use o simulador para projetar parcela, entrada e elegibilidade ao Minha Casa Minha Vida.`,
      })
    } else {
      faqs.push({
        q: `Quanto custam os ${pluralLc} ${labelLc} ${prep} ${bairroName}?`,
        a: `Os ${pluralLc} ${labelLc} ${prep} ${bairroName} estão anunciados por ${priceRange.text}. Use o simulador para projetar parcela, entrada e elegibilidade ao Minha Casa Minha Vida.`,
      })
    }
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
  const pricePart = priceRange
    ? `, ${priceRange.isRange ? 'de ' : ''}${priceRange.text}.`
    : '.'
  const description = total > 0
    ? `${total} ${nomeImovel.toLowerCase()} ${label.toLowerCase()} ${prep} ${bairroName} em ${cidadeName} SP${pricePart}${itbiPart} Atendimento Corretor Yuri (CRECI 235509).`
    : `${nomeImovel} ${label.toLowerCase()} ${prep} ${bairroName} em ${cidadeName} SP. Atendimento Corretor Yuri (CRECI 235509).`
  return buildListingMetadata({
    title,
    description,
    url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria, bairro })}`,
    noindex: total < SEO_MIN_PROPERTIES_FOR_INDEXING,
  })
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

  if (!threshold(total, bairro)) {
    permanentRedirect(buildHierarchicalUrl({ acao, cidade, categoria }))
  }

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
    buildBreadcrumb([
      { name: 'Início', path: '/' },
      { name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, path: buildHierarchicalUrl({ acao, cidade }) },
      { name: `${categoriaData.plural} ${label}`,                              path: buildHierarchicalUrl({ acao, cidade, categoria }) },
      { name: bairroName,                                                      path: buildHierarchicalUrl({ acao, cidade, categoria, bairro }) },
    ]),
    buildCollectionPage({
      name: h1,
      url: canonicalUrl,
      numberOfItems: total,
      items: imoveis.map(buildPropertyProduct),
    }),
    buildFaqPageSchema(faqs.map(f => ({ question: f.q, answer: f.a }))),
  ]

  const breadcrumb: BreadcrumbItem[] = [
    { name: 'Início',                              path: '/' },
    { name: cidadeName,                            path: buildHierarchicalUrl({ acao, cidade }) },
    { name: `${categoriaData.plural} ${label}`,    path: buildHierarchicalUrl({ acao, cidade, categoria }) },
    { name: bairroName,                            path: buildHierarchicalUrl({ acao, cidade, categoria, bairro }) },
  ]

  return (
    <ListingPageShell jsonLd={jsonLd} breadcrumb={breadcrumb} label={label} h1={h1} total={total}>
      {bairroData && (
        <section className="container mx-auto px-6 pt-10 pb-2">
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            <h2 className="heading-block">{sobreBairro(bairroName)} {bairroName}</h2>
            <p className="body-prose">{bairroData.conteudo.sobre}</p>
            <h3 className="text-sm font-bold text-dark mt-5 mb-2 uppercase tracking-wide">Infraestrutura</h3>
            <p className="body-prose">{bairroData.conteudo.infraestrutura}</p>
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
          <Link href={buildHierarchicalUrl({ acao, cidade, categoria })} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft size={13} /> Ver todos os {categoriaData.plural.toLowerCase()} {label.toLowerCase()}
          </Link>
        </div>

        <PropertyResultsGrid imoveis={imoveis} />

        {availableBedroomFilters.length > 0 && (
          <section className="mt-14">
            <h2 className="heading-section">Filtrar por quartos {emBairro(bairroName)} {bairroName}</h2>
            <FilterChipList>
              {availableBedroomFilters.map(bf => (
                <FilterChip key={bf.slug} href={`${buildHierarchicalUrl({ acao, cidade, categoria, bairro })}/filtro/${bf.slug}`}>
                  {categoriaData.plural} {label.toLowerCase()} com {bf.shortLabel || bf.label}
                </FilterChip>
              ))}
            </FilterChipList>
          </section>
        )}

        {siblingBairros.length > 0 && (
          <section className="mt-14">
            <h2 className="heading-section">Outros bairros em {cidadeName}</h2>
            <FilterChipList>
              {siblingBairros.map(b => (
                <FilterChip key={b.slug} href={buildHierarchicalUrl({ acao, cidade, categoria, bairro: b.slug })}>
                  {categoriaData.plural} {label.toLowerCase()} {emBairro(b.nome)} {b.nome}
                </FilterChip>
              ))}
            </FilterChipList>
          </section>
        )}

        <FaqAccordion faqs={faqs} />
      </div>
    </ListingPageShell>
  )
}
