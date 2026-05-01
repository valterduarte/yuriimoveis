import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiMapPin, FiHome, FiBookOpen, FiTruck, FiArrowRight } from 'react-icons/fi'
import PropertyCard from '../../../components/PropertyCard'
import { fetchProperties, fetchNavigationMatrix } from '../../../lib/api'
import { BAIRROS, getBairroBySlug } from '../../../data/bairros'
import {
  bairroSlugToDbName,
  buildHierarchicalUrl,
  cidadeNameToSlug,
  inferCidadeFromBairro,
  ACAO_LABELS,
  type AcaoSlug,
} from '../../../lib/navigation'
import { CATEGORIAS } from '../../../data/categorias'
import { emBairro, pluralizeImoveis } from '../../../utils/imovelUtils'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../lib/config'
import { AGENT_ID } from '../../../lib/jsonLd'
import { buildBairroFaqs } from '../../../lib/bairroFaqs'
import type { Metadata } from 'next'
import type { PropertyCategory } from '../../../types'

export const revalidate = 300

type PageProps = {
  params: Promise<{ slug: string }>
}

async function getCombosForBairro(bairroSlug: string, cidadeName: string) {
  const matrix = await fetchNavigationMatrix()
  const bairroDbName = bairroSlugToDbName(bairroSlug)
  return matrix
    .filter(row => row.cidade === cidadeName && row.bairro === bairroDbName && row.count > 0)
    .map(row => ({
      acao: row.tipo === 'venda' ? 'comprar' : 'alugar',
      categoria: row.categoria,
      count: row.count,
    } as const))
    .sort((a, b) => b.count - a.count)
}

export async function generateStaticParams() {
  const matrix = await fetchNavigationMatrix()
  const activeBairros = new Set(matrix.map(r => r.bairro.toLowerCase()))
  return Object.values(BAIRROS)
    .filter(b => {
      const dbName = (b.dbMatch || b.nome).toLowerCase()
      return activeBairros.has(dbName)
    })
    .map(b => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const bairro = getBairroBySlug(slug)
  if (!bairro) return {}

  const cidadeName = inferCidadeFromBairro(bairro)
  const title = `Morar no ${bairro.nome}, ${cidadeName}: Guia Completo`
  const description = bairro.descricaoMeta
  const url = `${SITE_URL}/bairros/${bairro.slug}`

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
      type: 'article',
      images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_DEFAULT_IMAGE] },
  }
}

export default async function BairroGuidePage({ params }: PageProps) {
  const { slug } = await params
  const bairro = getBairroBySlug(slug)
  if (!bairro) notFound()

  const cidadeName = inferCidadeFromBairro(bairro)
  const cidadeSlug = cidadeNameToSlug(cidadeName)
  const bairroDbName = bairroSlugToDbName(slug)

  const combos = await getCombosForBairro(slug, cidadeName)
  if (combos.length === 0) notFound()

  const totalImoveis = combos.reduce((acc, c) => acc + c.count, 0)
  const totalLabel = pluralizeImoveis(totalImoveis)

  const { imoveis: featured } = await fetchProperties({
    cidade: cidadeName,
    bairro: bairroDbName,
    limit: 6,
    ordem: 'recente',
  })

  const siblingBairros = Object.values(BAIRROS)
    .filter(b => b.slug !== slug && inferCidadeFromBairro(b) === cidadeName)
    .slice(0, 8)

  const canonicalUrl = `${SITE_URL}/bairros/${slug}`
  const guideTitle = `Morar no ${bairro.nome}, ${cidadeName}`

  const faqs = buildBairroFaqs({
    bairro,
    cidadeName,
    cidadeSlug,
    bairroDbName,
    combos,
  })

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Guias de bairro', item: `${SITE_URL}/bairros` },
        { '@type': 'ListItem', position: 3, name: bairro.nome, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${bairro.nome}, ${cidadeName}`,
      description: bairro.conteudo.sobre,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cidadeName,
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
      url: canonicalUrl,
      containedInPlace: { '@type': 'City', name: cidadeName, address: { '@type': 'PostalAddress', addressRegion: 'SP', addressCountry: 'BR' } },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guideTitle,
      description: bairro.descricaoMeta,
      author: { '@id': AGENT_ID },
      publisher: { '@id': AGENT_ID },
      mainEntityOfPage: canonicalUrl,
      image: OG_DEFAULT_IMAGE,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
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
            <Link href="/bairros" className="hover:text-white transition-colors">Guias de bairro</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{bairro.nome}</span>
          </nav>
          <span className="section-label flex items-center gap-2"><FiMapPin size={12} /> {cidadeName}, SP</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{guideTitle}</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-3xl">{bairro.descricaoMeta}</p>
          <p className="text-xs text-gray-500 mt-3">{totalImoveis} {totalLabel.noun} {totalLabel.adjective} no bairro</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <article className="bg-white border border-gray-200 p-6 md:p-10 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-dark mb-3 uppercase tracking-wide flex items-center gap-2">
              <FiBookOpen size={16} className="text-primary" /> Sobre o {bairro.nome}
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{bairro.conteudo.sobre}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3 uppercase tracking-wide flex items-center gap-2">
              <FiHome size={16} className="text-primary" /> Infraestrutura e comércio
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{bairro.conteudo.infraestrutura}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3 uppercase tracking-wide flex items-center gap-2">
              <FiTruck size={16} className="text-primary" /> Transporte e acesso
            </h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{bairro.conteudo.transporte}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-dark mb-3 uppercase tracking-wide">Educação</h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{bairro.conteudo.educacao}</p>
          </section>

          <section className="bg-gray-50 border border-gray-200 p-5 md:p-6">
            <h2 className="text-xl font-bold text-dark mb-3 uppercase tracking-wide">Por que morar no {bairro.nome}</h2>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{bairro.conteudo.porqueMorar}</p>
          </section>
        </article>

        {combos.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Encontre imóveis no {bairro.nome}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {combos.map(({ acao, categoria, count }) => {
                const categoriaData = CATEGORIAS[categoria as PropertyCategory]
                if (!categoriaData) return null
                const label = ACAO_LABELS[acao].preposicao.toLowerCase()
                const href = buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria, bairro: slug })
                return (
                  <li key={`${acao}-${categoria}`}>
                    <Link
                      href={href}
                      className="flex items-center justify-between bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors p-4 group"
                    >
                      <span className="text-sm font-semibold text-dark group-hover:text-primary">
                        {categoriaData.plural} {label} {emBairro(bairro.nome)} {bairro.nome}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-gray-500">
                        {count} imóve{count !== 1 ? 'is' : 'l'}
                        <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {featured.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Destaques no {bairro.nome}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {featured.map(property => (
                <PropertyCard key={property.id} imovel={property} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Perguntas frequentes sobre o {bairro.nome}</h2>
          <div className="space-y-3">
            {faqs.map(faq => (
              <details key={faq.question} className="group bg-white border border-gray-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-dark list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-primary text-xs group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-700 text-sm leading-relaxed mt-3">{faq.answerJsx ?? faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {siblingBairros.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Outros guias de bairro em {cidadeName}</h2>
            <ul className="flex flex-wrap gap-2">
              {siblingBairros.map(b => (
                <li key={b.slug}>
                  <Link
                    href={`/bairros/${b.slug}`}
                    className="inline-block bg-white border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    Morar no {b.nome}
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
