import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { GUIAS } from '../../data/guias'
import { SITE_URL } from '../../lib/config'
import { buildBreadcrumb } from '../../lib/jsonLd'
import { buildPageMetadata } from '../../lib/seo'

const TITLE = 'Guias Imobiliários — Osasco e Região 2026'
const DESCRIPTION =
  'Guias completos sobre como comprar, financiar e alugar imóvel em Osasco e Barueri em 2026: passo a passo, custos, programas de financiamento e direitos do inquilino.'

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/guia`,
})

const breadcrumbJsonLd = buildBreadcrumb([
  { name: 'Início', path: '/' },
  { name: 'Guias',  path: '/guia' },
])

export default function GuiaIndexPage() {
  const guias = Object.values(GUIAS)

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Guias</span>
          </nav>
          <span className="section-label">Conteúdo educativo</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">Guias Imobiliários</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Tudo que você precisa saber para comprar, financiar ou alugar imóvel em Osasco e Barueri com segurança em 2026.
          </p>
        </div>
      </div>

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
