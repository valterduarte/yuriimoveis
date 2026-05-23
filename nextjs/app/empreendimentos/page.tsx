import Link from 'next/link'
import Image from 'next/image'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'
import { listEmpreendimentos } from '../../lib/empreendimento'
import { SITE_URL } from '../../lib/config'
import { PLACEHOLDER_IMAGE } from '../../lib/constants'
import { formatPrice } from '../../utils/imovelUtils'
import { buildListingMetadata } from '../../lib/seo'
import { buildBreadcrumb } from '../../lib/jsonLd'
import type { Metadata } from 'next'

export const revalidate = 600

const TITLE = 'Lançamentos e Empreendimentos — Osasco, Barueri e Região'
const DESCRIPTION =
  'Lançamentos imobiliários em Osasco, Barueri e Carapicuíba: plantas, preços a partir e diferenciais de cada empreendimento. Atendimento Corretor Yuri (CRECI 235509).'

export const metadata: Metadata = buildListingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/empreendimentos`,
})

function formatPriceRange(min: number, max: number): string {
  if (min === max) return `a partir de ${formatPrice(min, 'venda')}`
  return `${formatPrice(min, 'venda')} a ${formatPrice(max, 'venda')}`
}

function formatAreaRange(min: number, max: number): string {
  if (min === max) return `${min.toFixed(0)}m²`
  return `${min.toFixed(0)} a ${max.toFixed(0)}m²`
}

export default async function EmpreendimentosIndexPage() {
  const empreendimentos = await listEmpreendimentos()

  const breadcrumbJsonLd = buildBreadcrumb([
    { name: 'Início',       path: '/' },
    { name: 'Lançamentos',  path: '/empreendimentos' },
  ])

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lançamentos e Empreendimentos',
    numberOfItems: empreendimentos.length,
    itemListElement: empreendimentos.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/empreendimentos/${e.slug}`,
      name: e.nome,
    })),
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <div className="bg-dark text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white" aria-current="page">Lançamentos</span>
          </nav>
          <span className="section-label">Catálogo de empreendimentos</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">Lançamentos</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl">
            Empreendimentos em construção e prontos para morar em Osasco, Barueri e Carapicuíba. Cada hub reúne todas as plantas, faixa de preço e localização do edifício.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        {empreendimentos.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 px-6">
            <div className="text-5xl mb-4" aria-hidden="true">🏗️</div>
            <h2 className="text-lg font-bold text-dark mb-2 uppercase tracking-wide">Nenhum lançamento ativo no momento</h2>
            <p className="text-gray-500 text-sm mb-6">Confira os imóveis disponíveis ou fale com o corretor para opções exclusivas.</p>
            <Link href="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {empreendimentos.map(emp => (
              <li key={emp.slug}>
                <Link
                  href={`/empreendimentos/${emp.slug}`}
                  className="group block bg-white border border-gray-200 hover:border-primary transition-colors h-full overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={emp.heroImage ?? PLACEHOLDER_IMAGE}
                      alt={emp.nome}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1">
                      {emp.totalUnidades} plantas
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-base font-bold text-dark group-hover:text-primary transition-colors leading-snug mb-2">
                      {emp.nome}
                    </h2>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <FiMapPin size={12} className="text-primary" />
                      {emp.bairro}, {emp.cidade} — SP
                    </p>
                    <p className="text-sm font-semibold text-dark mb-1">
                      {formatPriceRange(emp.precoMin, emp.precoMax)}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Áreas {formatAreaRange(emp.areaMin, emp.areaMax)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                      Ver empreendimento <FiArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
