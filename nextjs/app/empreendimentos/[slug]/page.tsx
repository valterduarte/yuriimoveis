import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiMapPin } from 'react-icons/fi'
import { EMPREENDIMENTO_RESERVED_SLUGS, listEmpreendimentos, fetchEmpreendimentoBySlug } from '../../../lib/empreendimento'
import PropertyCard from '../../../components/PropertyCard'
import { SITE_URL } from '../../../lib/config'
import { formatPrice, imovelSlug } from '../../../utils/imovelUtils'
import { buildListingMetadata } from '../../../lib/seo'
import { buildBreadcrumb, AGENT_ID } from '../../../lib/jsonLd'
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

  const title = `${emp.nome} — ${emp.totalUnidades} plantas em ${emp.bairro}, ${emp.cidade}`
  const description = `${emp.nome}: ${emp.totalUnidades} plantas disponíveis ${priceText}. Endereço ${emp.endereco}, ${emp.bairro}, ${emp.cidade} SP. Atendimento Corretor Yuri (CRECI 235509).`

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

export default async function EmpreendimentoDetailPage({ params }: PageProps) {
  const { slug } = await params
  if (EMPREENDIMENTO_RESERVED_SLUGS.has(slug)) notFound()
  const emp = await fetchEmpreendimentoBySlug(slug)
  if (!emp) notFound()

  const canonicalUrl = `${SITE_URL}/empreendimentos/${slug}`
  const complexId = `${canonicalUrl}#complex`

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
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <Link
          href="/empreendimentos"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <FiArrowLeft size={13} /> Ver todos os lançamentos
        </Link>

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
      </div>
    </div>
  )
}
