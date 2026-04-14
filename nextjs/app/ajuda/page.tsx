import Link from 'next/link'
import { FiArrowRight, FiBookOpen } from 'react-icons/fi'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import { AJUDA_ARTIGOS, fullH1 } from '../../data/ajudaArtigos'
import type { Metadata } from 'next'

const PAGE_TITLE = 'Ajuda — Guia Prático para Comprar Imóvel em Osasco'
const PAGE_DESCRIPTION =
  'Guias completos sobre documentação, custos, ITBI, escritura, financiamento e cartórios para quem quer comprar imóvel em Osasco e Grande São Paulo.'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/ajuda` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/ajuda`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE],
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Ajuda', item: `${SITE_URL}/ajuda` },
  ],
}

const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/ajuda`,
  hasPart: AJUDA_ARTIGOS.map(a => ({
    '@type': 'Article',
    headline: fullH1(a),
    description: a.descricaoMeta,
    url: `${SITE_URL}/ajuda/${a.slug}`,
    dateModified: a.atualizadoEm,
  })),
}

export default function AjudaIndexPage() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <section className="py-24 bg-dark text-white">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Ajuda</span>
          </nav>
          <span className="section-label">Guias Práticos</span>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none">
            Ajuda<br />
            <span className="text-primary">Compra de Imóvel</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mt-6">
            Conteúdo prático sobre documentação, custos, financiamento e cartórios para quem quer comprar um imóvel em Osasco e Grande São Paulo com segurança.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl">
            {AJUDA_ARTIGOS.map(artigo => (
              <Link
                key={artigo.slug}
                href={`/ajuda/${artigo.slug}`}
                className="group block bg-white border border-gray-200 hover:border-primary p-6 transition-colors"
              >
                <div className="w-10 h-10 bg-primary flex items-center justify-center mb-4">
                  <FiBookOpen className="text-white" size={18} />
                </div>
                <h2 className="text-sm font-bold text-dark uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                  {fullH1(artigo)}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {artigo.resumo}
                </p>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary">
                  Ler guia <FiArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
