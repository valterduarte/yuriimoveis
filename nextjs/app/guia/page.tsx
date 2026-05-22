import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { GUIAS } from '../../data/guias'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import { buildBreadcrumb } from '../../lib/jsonLd'
import PageHero from '../../components/ui/PageHero'
import type { Metadata } from 'next'

const TITLE = 'Guias Imobiliários — Osasco e Região 2026'
const DESCRIPTION =
  'Guias completos sobre como comprar, financiar e alugar imóvel em Osasco e Barueri em 2026: passo a passo, custos, programas de financiamento e direitos do inquilino.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/guia` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/guia`,
    siteName: 'Corretor Yuri Imóveis',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_DEFAULT_IMAGE] },
}

const breadcrumbJsonLd = buildBreadcrumb([
  { name: 'Início', path: '/' },
  { name: 'Guias',  path: '/guia' },
])

export default function GuiaIndexPage() {
  const guias = Object.values(GUIAS)

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <PageHero
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Guias' }]}
        eyebrow="Conteúdo educativo"
        title="Guias Imobiliários"
        description="Tudo que você precisa saber para comprar, financiar ou alugar imóvel em Osasco e Barueri com segurança em 2026."
      />

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guias.map(guia => (
            <li key={guia.slug}>
              <Link
                href={`/guia/${guia.slug}`}
                className="group block bg-white border border-gray-200 hover:border-primary p-6 h-full transition-colors"
              >
                <h2 className="text-base font-bold text-dark group-hover:text-primary transition-colors leading-snug mb-2">
                  {guia.titulo}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{guia.descricaoMeta}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  Ler guia completo <FiArrowRight size={12} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
