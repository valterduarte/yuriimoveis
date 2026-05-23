import { EMPREENDIMENTO_STATUS_FILTERS, listEmpreendimentos } from '../../../lib/empreendimento'
import EmpreendimentoIndex from '../../../components/EmpreendimentoIndex'
import { SITE_URL } from '../../../lib/config'
import { buildListingMetadata } from '../../../lib/seo'
import { buildBreadcrumb } from '../../../lib/jsonLd'
import type { Metadata } from 'next'

export const revalidate = 600

const ACTIVE_SLUG = 'pronto-para-morar'
const TITLE = 'Empreendimentos Prontos para Morar — Osasco, Barueri e Região'
const DESCRIPTION =
  'Empreendimentos prontos para morar em Osasco, Barueri e Carapicuíba: unidades disponíveis, preço e diferenciais. Atendimento Corretor Yuri (CRECI 235509).'

export const metadata: Metadata = buildListingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/empreendimentos/${ACTIVE_SLUG}`,
})

export default async function EmpreendimentosProntoParaMorarPage() {
  const empreendimentos = (await listEmpreendimentos()).filter(e => e.status === 'pronto')

  const breadcrumbJsonLd = buildBreadcrumb([
    { name: 'Início',           path: '/' },
    { name: 'Lançamentos',      path: '/empreendimentos' },
    { name: 'Pronto para Morar', path: `/empreendimentos/${ACTIVE_SLUG}` },
  ])

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Empreendimentos Prontos para Morar',
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
        heading="Empreendimentos Prontos para Morar"
        eyebrow="Disponíveis para mudança"
        description="Edifícios já entregues em Osasco, Barueri e Carapicuíba — entre direto na chave depois da assinatura do financiamento."
        breadcrumbCurrent="Pronto para Morar"
        tabs={tabs}
        emptyMessage="Nenhum empreendimento pronto disponível no momento"
      />
    </>
  )
}
