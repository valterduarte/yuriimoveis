import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowRight, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import {
  SITE_URL,
  OG_DEFAULT_IMAGE,
  PHONE_WA_BASE,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '../../../lib/config'
import WhatsAppLink from '../../../components/WhatsAppLink'
import { AJUDA_ARTIGOS, getAjudaArtigoBySlug, type ArticleBlock, type Cartorio } from '../../../data/ajudaArtigos'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return AJUDA_ARTIGOS.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artigo = getAjudaArtigoBySlug(slug)
  if (!artigo) return {}

  const url = `${SITE_URL}/ajuda/${artigo.slug}`
  return {
    title: artigo.titulo,
    description: artigo.descricaoMeta,
    alternates: { canonical: url },
    openGraph: {
      title: artigo.titulo,
      description: artigo.descricaoMeta,
      url,
      siteName: 'Corretor Yuri Imóveis',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: artigo.atualizadoEm,
      modifiedTime: artigo.atualizadoEm,
      images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: artigo.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: artigo.titulo,
      description: artigo.descricaoMeta,
      images: [OG_DEFAULT_IMAGE],
    },
  }
}

function renderBlock(block: ArticleBlock, key: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={key} className="text-2xl md:text-3xl font-black text-dark uppercase tracking-tight mt-12 mb-5">
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={key} className="text-lg font-bold text-dark mt-8 mb-3">
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p key={key} className="text-gray-700 text-sm md:text-base leading-relaxed mb-5">
          {block.text}
        </p>
      )
    case 'ul':
      return (
        <ul key={key} className="list-disc pl-5 space-y-2 mb-6 text-gray-700 text-sm md:text-base">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={key} className="list-decimal pl-5 space-y-2 mb-6 text-gray-700 text-sm md:text-base">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ol>
      )
    case 'callout':
      return (
        <aside key={key} className="border-l-4 border-primary bg-gray-50 px-5 py-4 my-8 text-sm text-dark leading-relaxed">
          {block.text}
        </aside>
      )
  }
}

const TIPO_CARTORIO_LABEL: Record<Cartorio['tipo'], string> = {
  'registro-imoveis': 'Registro de Imóveis',
  'tabeliao-notas': 'Tabelionato de Notas',
  'registro-civil': 'Registro Civil',
}

function CartoriosList({ cartorios }: { cartorios: Cartorio[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      {cartorios.map(c => (
        <article key={c.nome} className="border border-gray-200 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            {TIPO_CARTORIO_LABEL[c.tipo]}
          </p>
          <h3 className="text-sm font-bold text-dark mb-3 leading-snug">{c.nome}</h3>
          <p className="text-xs text-gray-600 leading-relaxed mb-1">
            {c.endereco}{c.bairro ? ` — ${c.bairro}` : ''}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            {c.cidade} / {c.uf}
          </p>
          <a
            href={`tel:+55${c.telefone.replace(/\D/g, '')}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-dark hover:text-primary transition-colors"
          >
            <FiPhone size={12} /> {c.telefone}
          </a>
        </article>
      ))}
    </div>
  )
}

export default async function AjudaArtigoPage({ params }: PageProps) {
  const { slug } = await params
  const artigo = getAjudaArtigoBySlug(slug)
  if (!artigo) notFound()

  const url = `${SITE_URL}/ajuda/${artigo.slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Ajuda', item: `${SITE_URL}/ajuda` },
      { '@type': 'ListItem', position: 3, name: artigo.h1, item: url },
    ],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: artigo.h1,
    description: artigo.descricaoMeta,
    url,
    inLanguage: 'pt-BR',
    datePublished: artigo.atualizadoEm,
    dateModified: artigo.atualizadoEm,
    image: OG_DEFAULT_IMAGE,
    author: {
      '@type': 'Person',
      name: 'Corretor Yuri',
      url: `${SITE_URL}/sobre`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Corretor Yuri Imóveis',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const faqJsonLd = artigo.faq && artigo.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: artigo.faq.map(f => ({
          '@type': 'Question',
          name: f.pergunta,
          acceptedAnswer: { '@type': 'Answer', text: f.resposta },
        })),
      }
    : null

  const cartoriosJsonLd = artigo.cartorios && artigo.cartorios.length > 0
    ? artigo.cartorios.map(c => ({
        '@context': 'https://schema.org',
        '@type': 'GovernmentOffice',
        name: c.nome,
        telephone: `+55${c.telefone.replace(/\D/g, '')}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: c.endereco,
          addressLocality: c.cidade,
          addressRegion: c.uf,
          addressCountry: 'BR',
        },
      }))
    : null

  const outrosArtigos = AJUDA_ARTIGOS.filter(a => a.slug !== artigo.slug).slice(0, 2)

  return (
    <article className="min-h-screen pb-16 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {cartoriosJsonLd?.map((c, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(c) }} />
      ))}

      <header className="py-20 md:py-24 bg-dark text-white">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/ajuda" className="hover:text-white transition-colors">Ajuda</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{artigo.h1}</span>
          </nav>
          <span className="section-label">Guia Prático</span>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight max-w-4xl">
            {artigo.h1}
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-6">
            Atualizado em {new Date(artigo.atualizadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            {artigo.blocks.map(renderBlock)}

            {artigo.cartorios && <CartoriosList cartorios={artigo.cartorios} />}

            {artigo.faq && artigo.faq.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl md:text-3xl font-black text-dark uppercase tracking-tight mb-8">
                  Perguntas frequentes
                </h2>
                <div className="space-y-6">
                  {artigo.faq.map((item, i) => (
                    <div key={i} className="border-l-4 border-primary pl-5">
                      <h3 className="text-sm font-bold text-dark mb-2">{item.pergunta}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{item.resposta}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <span className="section-label !text-gray-400">Precisa de ajuda?</span>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">
            Tire suas dúvidas comigo
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
            Atendimento personalizado para compradores e investidores em Osasco e região.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppLink
              href={`${PHONE_WA_BASE}?text=${encodeURIComponent(`Olá Yuri! Vi o guia "${artigo.h1}" no seu site e gostaria de tirar uma dúvida.`)}`}
              source={`ajuda-${artigo.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-[0.15em] text-sm py-4 px-8 transition-colors"
            >
              <FaWhatsapp size={20} /> WhatsApp
            </WhatsAppLink>
            <a
              href={PHONE_TEL}
              className="flex items-center justify-center gap-3 border border-white/30 hover:border-primary hover:text-primary text-white font-bold uppercase tracking-[0.15em] text-sm py-4 px-8 transition-colors"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {outrosArtigos.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <span className="section-label">Continue lendo</span>
            <h2 className="section-title mb-10">Outros guias úteis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
              {outrosArtigos.map(a => (
                <Link
                  key={a.slug}
                  href={`/ajuda/${a.slug}`}
                  className="group block bg-white border border-gray-200 hover:border-primary p-6 transition-colors"
                >
                  <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                    {a.h1}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{a.resumo}</p>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary">
                    Ler guia <FiArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  )
}
