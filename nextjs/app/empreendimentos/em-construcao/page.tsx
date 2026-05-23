import { EMPREENDIMENTO_STATUS_FILTERS, listEmpreendimentos } from '../../../lib/empreendimento'
import EmpreendimentoIndex from '../../../components/EmpreendimentoIndex'
import { SITE_URL } from '../../../lib/config'
import { buildListingMetadata } from '../../../lib/seo'
import { buildBreadcrumb } from '../../../lib/jsonLd'
import type { Metadata } from 'next'

export const revalidate = 600

const ACTIVE_SLUG = 'em-construcao'
const TITLE = 'Empreendimentos em Construção — Osasco, Barueri e Região'
const DESCRIPTION =
  'Empreendimentos em construção em Osasco, Barueri e Carapicuíba: plantas, preços a partir e prazo de entrega. Atendimento Corretor Yuri (CRECI 235509).'

export const metadata: Metadata = buildListingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/empreendimentos/${ACTIVE_SLUG}`,
})

export default async function EmpreendimentosEmConstrucaoPage() {
  const empreendimentos = (await listEmpreendimentos()).filter(e => e.status === 'construcao')

  const breadcrumbJsonLd = buildBreadcrumb([
    { name: 'Início',          path: '/' },
    { name: 'Lançamentos',     path: '/empreendimentos' },
    { name: 'Em Construção',   path: `/empreendimentos/${ACTIVE_SLUG}` },
  ])

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Empreendimentos em Construção',
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
    active: filter.slug === ACTIVE_SLUG,
  }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <EmpreendimentoIndex
        empreendimentos={empreendimentos}
        heading="Empreendimentos em Construção"
        eyebrow="Obras em andamento"
        description="Edifícios em construção em Osasco, Barueri e Carapicuíba. Garanta sua unidade antes da entrega e acompanhe o cronograma da obra."
        breadcrumbCurrent="Em Construção"
        tabs={tabs}
        emptyMessage="Nenhum empreendimento em construção no momento"
      />
    </>
  )
}
