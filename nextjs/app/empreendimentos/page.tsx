import { EMPREENDIMENTO_STATUS_FILTERS, listEmpreendimentos } from '../../lib/empreendimento'
import EmpreendimentoIndex from '../../components/EmpreendimentoIndex'
import { SITE_URL } from '../../lib/config'
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

export default async function EmpreendimentosIndexPage() {
  const empreendimentos = await listEmpreendimentos()

  const breadcrumbJsonLd = buildBreadcrumb([
    { name: 'Início',      path: '/' },
    { name: 'Lançamentos', path: '/empreendimentos' },
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

  const tabs = EMPREENDIMENTO_STATUS_FILTERS.map(filter => ({
    href: filter.href,
    label: filter.label,
    active: filter.slug === '',
  }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <EmpreendimentoIndex
        empreendimentos={empreendimentos}
        heading="Lançamentos"
        eyebrow="Catálogo de empreendimentos"
        description="Empreendimentos em construção e prontos para morar em Osasco, Barueri e Carapicuíba. Cada hub reúne todas as plantas, faixa de preço e localização do edifício."
        breadcrumbCurrent=""
        tabs={tabs}
        emptyMessage="Nenhum lançamento ativo no momento"
      />
    </>
  )
}
