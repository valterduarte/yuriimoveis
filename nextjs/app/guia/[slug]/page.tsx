import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowRight, FiBookOpen, FiTool, FiHome, FiList } from 'react-icons/fi'
import { getGuiaBySlug, GUIA_SLUGS, GUIAS } from '../../../data/guias'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../lib/config'
import { buildBreadcrumb, buildFaqPageSchema, buildArticleSchema } from '../../../lib/jsonLd'
import type { GuiaLink } from '../../../data/guias'
import type { Metadata } from 'next'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return GUIA_SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guia = getGuiaBySlug(slug)
  if (!guia) return {}

  const url = `${SITE_URL}/guia/${guia.slug}`
  return {
    title: guia.titulo,
    description: guia.descricaoMeta,
    alternates: { canonical: url },
    openGraph: {
      title: guia.titulo,
      description: guia.descricaoMeta,
      url,
      siteName: 'Corretor Yuri Imóveis',
      locale: 'pt_BR',
      type: 'article',
      images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: guia.titulo }],
    },
    twitter: { card: 'summary_large_image', title: guia.titulo, description: guia.descricaoMeta, images: [OG_DEFAULT_IMAGE] },
  }
}

function linkIcon(type: GuiaLink['type']) {
  switch (type) {
    case 'tool':    return <FiTool size={14} className="shrink-0" />
    case 'listing': return <FiHome size={14} className="shrink-0" />
    case 'ajuda':   return <FiList size={14} className="shrink-0" />
    default:        return <FiBookOpen size={14} className="shrink-0" />
  }
}

export default async function GuiaPage({ params }: PageProps) {
  const { slug } = await params
  const guia = getGuiaBySlug(slug)
  if (!guia) notFound()

  const canonicalUrl = `${SITE_URL}/guia/${guia.slug}`

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início',  path: '/' },
      { name: 'Guias',   path: '/guia' },
      { name: guia.titulo, path: `/guia/${guia.slug}` },
    ]),
    buildArticleSchema({
      headline: guia.titulo,
      description: guia.descricaoMeta,
      url: canonicalUrl,
      datePublished: guia.publishedAt,
      dateModified: guia.updatedAt,
    }),
    buildFaqPageSchema(guia.faqs),
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
            <Link href="/guia" className="hover:text-white transition-colors">Guias</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">{guia.titulo}</span>
          </nav>
          <span className="section-label">{guia.subtitulo}</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">{guia.titulo}</h1>
          <p className="text-gray-400 text-sm mt-3 max-w-3xl leading-relaxed">{guia.intro}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <article className="space-y-10">
          {guia.sections.map((section, i) => (
            <section key={i} className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">{section.heading}</h2>
              <div className="space-y-3">
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="text-gray-700 text-sm md:text-base leading-relaxed">{para}</p>
                ))}
              </div>
              {section.links && section.links.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {section.links.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-start gap-3 p-3.5 border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
                      >
                        <span className="mt-0.5 text-primary">{linkIcon(link.type)}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-dark group-hover:text-primary leading-snug">
                            {link.label}
                          </span>
                          <span className="block text-xs text-gray-500 mt-0.5 leading-relaxed">{link.description}</span>
                        </span>
                        <FiArrowRight size={14} className="shrink-0 mt-1 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Perguntas frequentes</h2>
          <div className="space-y-3">
            {guia.faqs.map(faq => (
              <details key={faq.question} className="group bg-white border border-gray-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-dark list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-primary text-xs group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-700 text-sm leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide">Outros guias completos</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(GUIAS)
              .filter(g => g.slug !== guia.slug)
              .map(g => (
                <li key={g.slug}>
                  <Link
                    href={`/guia/${g.slug}`}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
                  >
                    <FiBookOpen size={14} className="shrink-0 text-primary mt-0.5" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-dark group-hover:text-primary leading-snug">{g.titulo}</span>
                      <span className="block text-xs text-gray-500 mt-1 leading-relaxed">{g.descricaoMeta}</span>
                    </span>
                    <FiArrowRight size={14} className="shrink-0 mt-1 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        <div className="mt-12 bg-dark text-white p-8 text-center">
          <p className="text-sm text-gray-300 mb-4">Pronto para o próximo passo?</p>
          <Link
            href={guia.ctaHref}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            {guia.ctaLabel} <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
