import Link from 'next/link'
import { FiMapPin, FiArrowRight } from 'react-icons/fi'
import { BAIRROS } from '../../data/bairros'
import { fetchNavigationMatrix } from '../../lib/api'
import { bairroSlugToDbName } from '../../lib/navigation'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../lib/config'
import type { Metadata } from 'next'
import type { BairroData } from '../../types'

export const revalidate = 300

const PAGE_TITLE = 'Guias de Bairro em Osasco e Barueri | Corretor Yuri'
const PAGE_DESCRIPTION =
  'Conheça os bairros de Osasco e Barueri com guias completos: infraestrutura, transporte, educação e imóveis disponíveis. Atendimento com o Corretor Yuri, CRECI 235509.'

function inferCidade(bairro: BairroData): string {
  return bairro.titulo.toLowerCase().includes('barueri') ? 'Barueri' : 'Osasco'
}

export function generateMetadata(): Metadata {
  const url = `${SITE_URL}/bairros`
  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url,
      siteName: 'Corretor Yuri Imóveis',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: PAGE_TITLE }],
    },
    twitter: { card: 'summary_large_image', title: PAGE_TITLE, description: PAGE_DESCRIPTION, images: [OG_DEFAULT_IMAGE] },
  }
}

export default async function BairrosIndexPage() {
  const matrix = await fetchNavigationMatrix()
  const countsByBairro = new Map<string, number>()
  for (const row of matrix) {
    countsByBairro.set(row.bairro, (countsByBairro.get(row.bairro) ?? 0) + row.count)
  }

  const guidesByCidade = new Map<string, Array<{ bairro: BairroData; count: number }>>()
  for (const bairro of Object.values(BAIRROS)) {
    const dbName = bairroSlugToDbName(bairro.slug) ?? bairro.nome
    const count = countsByBairro.get(dbName) ?? 0
    if (count === 0) continue
    const cidade = inferCidade(bairro)
    const list = guidesByCidade.get(cidade) ?? []
    list.push({ bairro, count })
    guidesByCidade.set(cidade, list)
  }
  for (const list of guidesByCidade.values()) {
    list.sort((a, b) => b.count - a.count)
  }

  const canonicalUrl = `${SITE_URL}/bairros`
  const totalGuides = Array.from(guidesByCidade.values()).reduce((acc, l) => acc + l.length, 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: PAGE_TITLE,
    url: canonicalUrl,
    description: PAGE_DESCRIPTION,
    numberOfItems: totalGuides,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Guias de bairro</span>
          </nav>
          <span className="section-label">Conheça a região</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">Guias de Bairro</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-3xl">
            Descubra como é morar nos principais bairros de Osasco e Barueri: infraestrutura, transporte, educação e imóveis disponíveis hoje.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {Array.from(guidesByCidade.entries()).map(([cidade, guides]) => (
          <section key={cidade} className="mb-12">
            <h2 className="text-lg font-bold text-dark mb-4 uppercase tracking-wide flex items-center gap-2">
              <FiMapPin size={16} className="text-primary" /> {cidade}, SP
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guides.map(({ bairro, count }) => (
                <li key={bairro.slug}>
                  <Link
                    href={`/bairros/${bairro.slug}`}
                    className="block bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors p-5 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-dark group-hover:text-primary">Morar no {bairro.nome}</h3>
                      <FiArrowRight size={16} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{count} imóve{count !== 1 ? 'is' : 'l'} disponíve{count !== 1 ? 'is' : 'l'}</p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{bairro.conteudo.sobre}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
