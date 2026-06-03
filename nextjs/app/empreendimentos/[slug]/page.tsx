import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { EMPREENDIMENTO_RESERVED_SLUGS, listEmpreendimentos, fetchEmpreendimentoBySlug, buildEmpreendimentoTitle, type EmpreendimentoDetail } from '../../../lib/empreendimento'
import PropertyCard from '../../../components/PropertyCard'
import WhatsAppLink from '../../../components/WhatsAppLink'
import EmpreendimentoFinancingCard from '../../../components/EmpreendimentoFinancingCard'
import EmpreendimentoEnrichmentSections from '../../../components/EmpreendimentoEnrichmentSections'
import { buildEmpreendimentoFinancingExample } from '../../../lib/empreendimentoFinance'
import { getEmpreendimentoEnrichment } from '../../../data/empreendimentoEnrichment'
import { SITE_URL, PHONE_WA_BASE, PHONE_DISPLAY, CRECI } from '../../../lib/config'
import { formatPrice, imovelSlug, slugify } from '../../../utils/imovelUtils'
import { buildHierarchicalUrl, cidadeNameToSlug } from '../../../lib/navigation'
import { BAIRROS } from '../../../data/bairros'
import { buildListingMetadata } from '../../../lib/seo'
import { buildBreadcrumb, buildFaqPageSchema, AGENT_ID } from '../../../lib/jsonLd'
import type { Metadata } from 'next'

export const revalidate = 300

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const empreendimentos = await listEmpreendimentos()
  return empreendimentos
    .filter(e => !EMPREENDIMENTO_RESERVED_SLUGS.has(e.slug))
    .map(e => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const emp = await fetchEmpreendimentoBySlug(slug)
  if (!emp) return { title: 'Empreendimento não encontrado' }

  const priceText = emp.precoMin === emp.precoMax
    ? `a partir de ${formatPrice(emp.precoMin, 'venda')}`
    : `de ${formatPrice(emp.precoMin, 'venda')} a ${formatPrice(emp.precoMax, 'venda')}`

  // City + price-forward title: branded queries are local ("ocean park osasco"),
  // so the city is part of the match; the price lifts CTR. See buildEmpreendimentoTitle.
  const title = buildEmpreendimentoTitle(emp.nome, emp.cidade, formatPrice(emp.precoMin, 'venda'))
  const description = `${emp.nome} em ${emp.bairro}, ${emp.cidade}: ${emp.totalUnidades} plantas ${priceText}. Veja valores, plantas disponíveis e fale direto com o Corretor Yuri (CRECI 235509).`

  return buildListingMetadata({
    title,
    description,
    url: `${SITE_URL}/empreendimentos/${slug}`,
    ogImage: emp.heroImage ?? undefined,
    ogImageAlt: emp.nome,
  })
}

function formatPriceRange(min: number, max: number): string {
  if (min === max) return `a partir de ${formatPrice(min, 'venda')}`
  return `de ${formatPrice(min, 'venda')} a ${formatPrice(max, 'venda')}`
}

function formatAreaRange(min: number, max: number): string {
  if (min === max) return `${min.toFixed(2).replace('.', ',')} m²`
  return `${min.toFixed(2).replace('.', ',')} a ${max.toFixed(2).replace('.', ',')} m²`
}

const STATUS_PHRASE: Record<string, string> = {
  pronto: 'pronto para morar',
  construcao: 'em construção',
  planta: 'na planta',
}

/** Highest unit price (R$) still eligible for the Minha Casa Minha Vida cap. */
const MCMV_PRICE_CAP = 600_000

/**
 * FAQs derived entirely from real development data — every answer is rendered
 * visibly on the page and mirrored in FAQPage JSON-LD (no schema-only content).
 */
function buildEmpreendimentoFaqs(
  emp: EmpreendimentoDetail,
  statusPhrase: string,
  fitsMcmv: boolean,
): { q: string; a: string }[] {
  const precoText = emp.precoMin === emp.precoMax
    ? `custam ${formatPrice(emp.precoMin, 'venda')}`
    : `vão de ${formatPrice(emp.precoMin, 'venda')} a ${formatPrice(emp.precoMax, 'venda')}`

  const faqs = [
    {
      q: `Quanto custa um apartamento no ${emp.nome}?`,
      a: `Os apartamentos no ${emp.nome} ${precoText}, conforme a planta e a metragem escolhidas. Fale com o Corretor Yuri para valores e condições de financiamento atualizados.`,
    },
    {
      q: `Onde fica o ${emp.nome}?`,
      a: `O ${emp.nome} fica na ${emp.endereco}, no bairro ${emp.bairro}, em ${emp.cidade} (SP).`,
    },
    {
      q: `Quais plantas e tamanhos o ${emp.nome} oferece?`,
      a: `São ${emp.totalUnidades} ${emp.totalUnidades === 1 ? 'planta' : 'plantas'}, com metragem de ${formatAreaRange(emp.areaMin, emp.areaMax)}.`,
    },
    {
      q: `O ${emp.nome} está pronto ou em construção?`,
      a: `O empreendimento está ${statusPhrase}.`,
    },
  ]

  if (fitsMcmv) {
    faqs.push({
      q: `O ${emp.nome} pode ser financiado pelo Minha Casa Minha Vida?`,
      a: `Unidades a partir de ${formatPrice(emp.precoMin, 'venda')} podem se enquadrar no Minha Casa Minha Vida, conforme a renda familiar. Simule o financiamento ou fale com o Corretor Yuri para confirmar as condições.`,
    })
  }

  faqs.push({
    q: `Como agendar uma visita ao ${emp.nome}?`,
    a: `O atendimento é feito diretamente pelo Corretor Yuri (CRECI-SP ${CRECI}), pelo WhatsApp ${PHONE_DISPLAY} — sem compromisso e sem custo para o comprador.`,
  })

  return faqs
}

export default async function EmpreendimentoDetailPage({ params }: PageProps) {
  const { slug } = await params
  if (EMPREENDIMENTO_RESERVED_SLUGS.has(slug)) notFound()
  const emp = await fetchEmpreendimentoBySlug(slug)
  if (!emp) notFound()

  const canonicalUrl = `${SITE_URL}/empreendimentos/${slug}`
  const complexId = `${canonicalUrl}#complex`

  const waMessage = encodeURIComponent(
    `Olá Yuri! Tenho interesse no ${emp.nome} (${emp.bairro}, ${emp.cidade}). Pode me passar valores, plantas disponíveis e condições de financiamento?`,
  )
  const waHref = `${PHONE_WA_BASE}?text=${waMessage}`

  const statusPhrase = STATUS_PHRASE[emp.status] ?? 'disponível'
  const bairroSlug = slugify(emp.bairro)
  const bairroGuideHref = BAIRROS[bairroSlug] ? `/bairros/${bairroSlug}` : null
  const listagemHref = buildHierarchicalUrl({
    acao: 'comprar',
    cidade: cidadeNameToSlug(emp.cidade),
    categoria: 'apartamento',
    bairro: bairroSlug,
  })
  const fitsMcmv = emp.precoMin <= MCMV_PRICE_CAP
  const faqs = buildEmpreendimentoFaqs(emp, statusPhrase, fitsMcmv)
  const faqJsonLd = buildFaqPageSchema(faqs.map(f => ({ question: f.q, answer: f.a })))

  const financingExample = buildEmpreendimentoFinancingExample(emp.precoMin)
  const enrichment = getEmpreendimentoEnrichment(slug)
  const bairroData = BAIRROS[bairroSlug] ?? null
  const amenityFeature = enrichment?.lazer?.length
    ? enrichment.lazer.map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true }))
    : undefined

  const breadcrumbJsonLd = buildBreadcrumb([
    { name: 'Início',       path: '/' },
    { name: 'Lançamentos',  path: '/empreendimentos' },
    { name: emp.nome,       path: `/empreendimentos/${slug}` },
  ])

  const complexJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    '@id': complexId,
    name: emp.nome,
    url: canonicalUrl,
    image: emp.heroImage ?? undefined,
    numberOfAccommodationUnits: emp.totalUnidades,
    amenityFeature,
    address: {
      '@type': 'PostalAddress',
      streetAddress: emp.endereco,
      addressLocality: emp.cidade,
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    containsPlace: emp.imoveis.map(p => ({
      '@type': 'RealEstateListing',
      '@id': `${SITE_URL}/imoveis/${imovelSlug(p)}#listing`,
      name: p.titulo,
      url: `${SITE_URL}/imoveis/${imovelSlug(p)}`,
      floorSize: p.area
        ? { '@type': 'QuantitativeValue', value: p.area, unitCode: 'MTK' }
        : undefined,
      numberOfBedrooms: p.quartos || undefined,
      offers: {
        '@type': 'Offer',
        price: p.preco,
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        seller: { '@id': AGENT_ID },
      },
    })),
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(complexJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/empreendimentos" className="hover:text-white transition-colors">Lançamentos</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{emp.nome}</span>
          </nav>
          <span className="section-label">Empreendimento</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{emp.nome}</h1>
          <p className="flex items-center gap-2 text-gray-300 text-sm mt-3">
            <FiMapPin size={14} className="text-primary" />
            <span>{emp.endereco} — {emp.bairro}, {emp.cidade} SP</span>
          </p>
          <div className="flex flex-wrap gap-4 mt-5 text-xs uppercase tracking-wider">
            <span className="bg-white/10 px-3 py-1.5">{emp.totalUnidades} plantas</span>
            <span className="bg-white/10 px-3 py-1.5">{formatAreaRange(emp.areaMin, emp.areaMax)}</span>
            <span className="bg-primary text-white px-3 py-1.5 font-bold">{formatPriceRange(emp.precoMin, emp.precoMax)}</span>
          </div>
          <div className="mt-6">
            <WhatsAppLink
              href={waHref}
              source="empreendimento-hero"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 transition-colors"
              aria-label={`Falar com o Corretor Yuri sobre o ${emp.nome} pelo WhatsApp (abre em nova aba)`}
            >
              <FaWhatsapp size={18} /> Falar sobre o {emp.nome}
            </WhatsAppLink>
            <p className="text-gray-400 text-xs mt-2">
              Resposta rápida · sem compromisso · direto com o Corretor Yuri (CRECI {CRECI})
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <Link
          href="/empreendimentos"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <FiArrowLeft size={13} /> Ver todos os lançamentos
        </Link>

        <section className="mb-12 max-w-3xl">
          <span className="section-label">Sobre o empreendimento</span>
          <h2 className="section-title mb-4">Sobre o {emp.nome}</h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            O {emp.nome} é um empreendimento {statusPhrase} no bairro {emp.bairro}, em {emp.cidade} (SP),
            localizado na {emp.endereco}. São {emp.totalUnidades} {emp.totalUnidades === 1 ? 'planta' : 'plantas'}{' '}
            de {formatAreaRange(emp.areaMin, emp.areaMax)}, com valores {formatPriceRange(emp.precoMin, emp.precoMax)}.
            {fitsMcmv && ' Há unidades que podem se enquadrar no programa Minha Casa Minha Vida — vale simular as condições de financiamento.'}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mt-5">
            <Link href={listagemHref} className="font-semibold text-primary hover:underline">
              Apartamentos no {emp.bairro} →
            </Link>
            {bairroGuideHref && (
              <Link href={bairroGuideHref} className="font-semibold text-primary hover:underline">
                Guia do bairro {emp.bairro} →
              </Link>
            )}
            {emp.status !== 'pronto' && (
              <Link href="/guia/comprar-apartamento-na-planta-osasco" className="font-semibold text-primary hover:underline">
                Vale a pena comprar na planta? →
              </Link>
            )}
            <Link href="/simulador" className="font-semibold text-primary hover:underline">
              Simular financiamento →
            </Link>
          </div>
        </section>

        {financingExample && <EmpreendimentoFinancingCard example={financingExample} nome={emp.nome} />}

        {enrichment && <EmpreendimentoEnrichmentSections enrichment={enrichment} nome={emp.nome} />}

        {bairroData && (
          <section className="mb-12 max-w-3xl">
            <span className="section-label">A região</span>
            <h2 className="section-title mb-4">Como é morar no {emp.bairro}</h2>
            <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
              <p>{bairroData.conteudo.infraestrutura}</p>
              <p>{bairroData.conteudo.transporte}</p>
              <p>{bairroData.conteudo.educacao}</p>
            </div>
            {bairroGuideHref && (
              <Link href={bairroGuideHref} className="inline-block mt-5 font-semibold text-primary hover:underline">
                Guia completo do bairro {emp.bairro} →
              </Link>
            )}
          </section>
        )}

        <span className="section-label">Plantas disponíveis</span>
        <h2 className="section-title mb-6">{emp.totalUnidades} opções no {emp.nome}</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-3xl">
          Cada planta abaixo é uma unidade distinta no edifício, com metragem, número de dormitórios e preço próprios. Clique para ver detalhes, galeria completa e simulador de financiamento.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {emp.imoveis.map((imovel, i) => (
            <PropertyCard key={imovel.id} imovel={imovel} priority={i < 3} />
          ))}
        </div>

        <section className="mt-16 max-w-3xl">
          <span className="section-label">Perguntas frequentes</span>
          <h2 className="section-title mb-6">Dúvidas sobre o {emp.nome}</h2>
          <div className="space-y-3">
            {faqs.map(faq => (
              <details key={faq.q} className="group bg-white border border-gray-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-dark list-none flex items-center justify-between gap-3">
                  {faq.q}
                  <span className="text-primary text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-700 text-sm leading-relaxed mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 bg-dark text-white p-8 md:p-10">
          <div className="max-w-3xl">
            <span className="section-label">Atendimento</span>
            <h2 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3">
              Ainda na dúvida entre as plantas do {emp.nome}?
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              O Corretor Yuri te ajuda a escolher a unidade certa, simula o financiamento e confirma
              valores e disponibilidade atualizados — sem compromisso e sem custo.
            </p>
            <WhatsAppLink
              href={waHref}
              source="empreendimento-cta"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 transition-colors"
              aria-label={`Falar com o Corretor Yuri sobre o ${emp.nome} pelo WhatsApp (abre em nova aba)`}
            >
              <FaWhatsapp size={18} /> Quero falar com o Yuri
            </WhatsAppLink>
          </div>
        </section>
      </div>
    </div>
  )
}
