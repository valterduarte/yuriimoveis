import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { fetchProperties, fetchNavigationMatrix } from '../../../../lib/api'
import ListingPageShell, { type BreadcrumbItem } from '../../../../components/ListingPageShell'
import { FilterChip, FilterChipList } from '../../../../components/FilterChip'
import BairrosRecomendados from '../../../../components/imoveis/BairrosRecomendados'
import CrossCategoryLinks from '../../../../components/imoveis/CrossCategoryLinks'
import AmplieChances from '../../../../components/imoveis/AmplieChances'
import ListingMapShell from '../../../../components/imoveis/listing-map/ListingMapShell'
import {
  acaoToTipo,
  isValidAcao,
  cidadeSlugToName,
  cidadeNameToSlug,
  getCategoriaBySlug,
  bairroDbNameToSlug,
  buildHierarchicalUrl,
  hasRichBairroContent,
  ACAO_LABELS,
  type AcaoSlug,
} from '../../../../lib/navigation'
import { getBairroBySlug } from '../../../../data/bairros'
import { getListingCopy } from '../../../../data/listingCopy'
import { SITE_URL } from '../../../../lib/config'
import { buildBreadcrumb, buildCollectionPage, buildFaqPageSchema, buildPropertyProduct } from '../../../../lib/jsonLd'
import { buildListingMetadata } from '../../../../lib/seo'
import FaqAccordion from '../../../../components/FaqAccordion'
import { ITBI_RATE_BY_CITY } from '../../../../lib/constants'
import type { PropertyCategory } from '../../../../types'
import type { Metadata } from 'next'

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
    tipo: acaoToTipo(acao),
    categoria,
    cidade: cidadeName,
    limit: 50,
  })

  const countPrefix = total > 0 ? `${total} ` : ''
  const title = `${countPrefix}${categoriaData.plural} ${label} em ${cidadeName} SP`
  const description = total > 0
    ? `${total} ${categoriaData.plural.toLowerCase()} ${label.toLowerCase()} em ${cidadeName}, SP, com fotos, preço e bairro. Financiamento Caixa SBPE e MCMV. Atendimento direto com Corretor Yuri (CRECI 235509).`
    : `${categoriaData.plural} ${label.toLowerCase()} em ${cidadeName}, SP. Catálogo curado por bairro, financiamento Caixa SBPE e MCMV, atendimento direto com Corretor Yuri (CRECI 235509).`
  return buildListingMetadata({
    title,
    description,
    url: `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria })}`,
  })
}

export default async function CategoriaAcaoPage({ params }: PageProps) {
  const { acao, cidade, categoria } = await params

  if (!isValidAcao(acao)) notFound()
  const cidadeName = cidadeSlugToName(cidade)
  const categoriaData = getCategoriaBySlug(categoria)
  if (!cidadeName || !categoriaData) notFound()

  const { imoveis, total } = await fetchProperties({
    tipo: acaoToTipo(acao),
    categoria,
    cidade: cidadeName,
    limit: 50,
  })

  if (total === 0) notFound()

  const label = ACAO_LABELS[acao].preposicao
  const h1 = `${categoriaData.plural} ${label} em ${cidadeName}`
  const canonicalUrl = `${SITE_URL}${buildHierarchicalUrl({ acao, cidade, categoria })}`

  const matrix = await fetchNavigationMatrix()
  const bairrosWithCount = matrix
    .filter(r =>
      r.tipo === acaoToTipo(acao) &&
      r.categoria === categoria &&
      cidadeNameToSlug(r.cidade) === cidade
    )
    .map(r => ({ slug: bairroDbNameToSlug(r.bairro), count: r.count }))
    .filter(b => !!getBairroBySlug(b.slug) || b.count >= 3)

  const topBairros = [...bairrosWithCount].sort((a, b) => b.count - a.count)

  const categoriaSlug = categoria as PropertyCategory
  const bairrosRecomendados = topBairros.filter(b => getBairroBySlug(b.slug)?.precoMedio)
  const bairrosSemPreco = topBairros.filter(b => !getBairroBySlug(b.slug)?.precoMedio)

  const sameTipo = acaoToTipo(acao)
  const oppositeTipo = sameTipo === 'venda' ? 'aluguel' : 'venda'

  const categoriasNaMesmaAcao = Array.from(
    new Set(
      matrix
        .filter(r => r.tipo === sameTipo && cidadeNameToSlug(r.cidade) === cidade && r.categoria !== categoria)
        .map(r => r.categoria),
    ),
  )
    .filter((c): c is PropertyCategory => !!getCategoriaBySlug(c))

  const categoriasNaAcaoOposta = Array.from(
    new Set(
      matrix
        .filter(r => r.tipo === oppositeTipo && cidadeNameToSlug(r.cidade) === cidade)
        .map(r => r.categoria),
    ),
  )
    .filter((c): c is PropertyCategory => !!getCategoriaBySlug(c))

  const faqs = buildFaqs({
    acao: acao,
    cidadeName,
    categoriaData,
    label,
    total,
    topBairros,
  })

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início', path: '/' },
      { name: `${acao === 'comprar' ? 'Comprar' : 'Alugar'} em ${cidadeName}`, path: buildHierarchicalUrl({ acao, cidade }) },
      { name: `${categoriaData.plural} ${label}`,                              path: buildHierarchicalUrl({ acao, cidade, categoria }) },
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
  ]

  return (
    <ListingPageShell jsonLd={jsonLd} breadcrumb={breadcrumb} label={label} h1={h1} total={total}>
      <div className="container mx-auto px-6 py-10">
      <div className="mb-6">
        <Link href={buildHierarchicalUrl({ acao, cidade })} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors">
          <FiArrowLeft size={13} /> Ver todos os imóveis {label.toLowerCase()} em {cidadeName}
        </Link>
      </div>

      <div className="bg-white border border-gray-200 p-6 md:p-8 mb-8">
        <p className="text-gray-700 text-sm leading-relaxed">
          {getListingCopy(cidade, categoria as PropertyCategory, acaoToTipo(acao)) ??
            `Encontre ${categoriaData.plural.toLowerCase()} ${label.toLowerCase()} em ${cidadeName} nos melhores bairros da cidade. Temos opções em diversas faixas de preço e metragens, todas com atendimento personalizado do Corretor Yuri e documentação verificada. Navegue pelos bairros abaixo ou veja todos os imóveis disponíveis.`}
        </p>
      </div>

      <ListingMapShell imoveis={imoveis} />

      <BairrosRecomendados
        acao={acao}
        cidade={cidade}
        cidadeName={cidadeName}
        categoria={categoriaSlug}
        categoriaPlural={categoriaData.plural}
        bairrosWithCount={bairrosRecomendados}
      />

      {bairrosSemPreco.length > 0 && (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 className="text-base font-bold text-dark uppercase tracking-wide">
              Procure por {categoriaData.plural.toLowerCase()} em outros bairros de {cidadeName}
            </h2>
            <Link href="/bairros" className="text-xs uppercase tracking-wider font-bold text-primary hover:underline whitespace-nowrap">
              Guias de bairro →
            </Link>
          </div>
          <FilterChipList>
            {bairrosSemPreco.map(b => {
              const bairroData = getBairroBySlug(b.slug)
              const displayName = bairroData?.nome || b.slug
              const hasGuide = hasRichBairroContent(b.slug)
              return (
                <FilterChip key={b.slug} href={buildHierarchicalUrl({ acao, cidade, categoria, bairro: b.slug })}>
                  <span>{displayName} ({b.count})</span>
                  {hasGuide && (
                    <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5">Guia</span>
                  )}
                </FilterChip>
              )
            })}
          </FilterChipList>
        </section>
      )}

      <CrossCategoryLinks
        acao={acao}
        cidade={cidade}
        cidadeName={cidadeName}
        categoria={categoriaSlug}
        categoriaPlural={categoriaData.plural}
        categoriasNaMesmaAcao={categoriasNaMesmaAcao}
        categoriasNaAcaoOposta={categoriasNaAcaoOposta}
      />

      <AmplieChances
        acao={acao}
        cidade={cidade}
        categoria={categoriaSlug}
        tipo={sameTipo}
      />

      <FaqAccordion faqs={faqs} />
      </div>
    </ListingPageShell>
  )
}
