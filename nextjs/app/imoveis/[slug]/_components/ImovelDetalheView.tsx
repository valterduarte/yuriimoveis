import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  fetchImovel,
  fetchSimilarProperties,
  fetchNavigationMatrix,
} from '../../../../lib/api'
import { detectEmpreendimento } from '../../../../lib/empreendimento'
import { imovelSlug, slugify, buildSeoDescription } from '../../../../utils/imovelUtils'
import { CATEGORIAS } from '../../../../data/categorias'
import { PLACEHOLDER_IMAGE } from '../../../../lib/constants'
import {
  bairroDbNameToSlug,
  buildHierarchicalUrl,
  cidadeNameToSlug,
  cidadeSlugToName,
  hasRichBairroContent,
  tipoToAcao,
} from '../../../../lib/navigation'
import { buildBreadcrumb, buildRealEstateListingSchema } from '../../../../lib/jsonLd'
import ImovelDetalheClient from '../../../../components/ImovelDetalheClient'
import PropertyCard from '../../../../components/PropertyCard'

interface ExploreLink {
  href: string
  label: string
}

function buildExploreLinks(args: {
  imovel: NonNullable<Awaited<ReturnType<typeof fetchImovel>>>
  empreendimento: Awaited<ReturnType<typeof detectEmpreendimento>>
  bairroInventoryForCategory: number
}): ExploreLink[] {
  const { imovel, empreendimento, bairroInventoryForCategory } = args
  const acao = tipoToAcao(imovel.tipo)
  const cidadeSlug = imovel.cidade ? cidadeNameToSlug(imovel.cidade) : ''
  const bairroSlug = imovel.bairro ? bairroDbNameToSlug(imovel.bairro) : ''
  const cidadeSupported = !!cidadeSlugToName(cidadeSlug)
  const categoriaData = CATEGORIAS[imovel.categoria]
  const categoriaPlural = categoriaData?.plural ?? 'Imóveis'
  const actionLabel = acao === 'alugar' ? 'aluguel' : 'venda'
  const bairroDisplay = imovel.bairro || ''
  const cidadeDisplay = imovel.cidade || ''
  const hasGuide = !!bairroSlug && hasRichBairroContent(bairroSlug)
  const bairroHasOwnPage =
    bairroInventoryForCategory >= 3 || (bairroInventoryForCategory >= 1 && hasGuide)

  const links: ExploreLink[] = []
  if (empreendimento) {
    links.push({
      href: `/empreendimentos/${slugify(empreendimento.nome)}`,
      label:
        empreendimento.totalUnidades >= 2
          ? `Ver todas as ${empreendimento.totalUnidades} plantas do ${empreendimento.nome}`
          : `Ver detalhes do empreendimento ${empreendimento.nome}`,
    })
  }
  if (hasGuide) {
    links.push({ href: `/bairros/${bairroSlug}`, label: `Guia do bairro ${bairroDisplay}` })
  }
  if (cidadeSupported && bairroSlug && bairroDisplay && bairroHasOwnPage) {
    links.push({
      href: buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: imovel.categoria, bairro: bairroSlug }),
      label: `${categoriaPlural} para ${actionLabel} no ${bairroDisplay}`,
    })
  }
  if (cidadeSupported && cidadeDisplay) {
    links.push({
      href: buildHierarchicalUrl({ acao, cidade: cidadeSlug, categoria: imovel.categoria }),
      label: `${categoriaPlural} para ${actionLabel} em ${cidadeDisplay}`,
    })
    links.push({
      href: buildHierarchicalUrl({ acao, cidade: cidadeSlug }),
      label: `Imóveis para ${actionLabel} em ${cidadeDisplay}`,
    })
  }
  return links
}

function buildLcpImageHref(images: string[]): string {
  const first = images[0]
  return first?.includes('res.cloudinary.com')
    ? first.replace('/upload/', '/upload/f_auto,q_auto,w_1920/')
    : first
}

export default async function ImovelDetalheView({ id }: { id: string }) {
  const imovel = await fetchImovel(id)
  if (!imovel) notFound()

  const [similarProperties, empreendimento, matrix] = await Promise.all([
    fetchSimilarProperties(imovel),
    detectEmpreendimento({
      id: imovel.id,
      titulo: imovel.titulo,
      endereco: imovel.endereco,
      bairro: imovel.bairro,
      cidade: imovel.cidade,
    }),
    fetchNavigationMatrix(),
  ])

  const bairroInventoryForCategory =
    matrix.find(
      row =>
        row.tipo === imovel.tipo &&
        row.cidade === imovel.cidade &&
        row.categoria === imovel.categoria &&
        row.bairro === imovel.bairro,
    )?.count ?? 0

  const exploreLinks = buildExploreLinks({ imovel, empreendimento, bairroInventoryForCategory })

  const images = imovel.imagens?.length > 0 ? imovel.imagens : [PLACEHOLDER_IMAGE]
  const lcpImage = buildLcpImageHref(images)
  const description = buildSeoDescription(imovel)

  const jsonLd = [
    buildBreadcrumb([
      { name: 'Início',      path: '/' },
      { name: 'Imóveis',     path: '/imoveis' },
      { name: imovel.titulo, path: `/imoveis/${imovelSlug(imovel)}` },
    ]),
    buildRealEstateListingSchema({ imovel, description, images, empreendimento }),
  ]

  return (
    <>
      <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ImovelDetalheClient imovel={imovel} />
      {similarProperties.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <span className="section-label">Veja também</span>
            <h2 className="section-title mb-8">Imóveis Semelhantes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarProperties.map(p => (
                <PropertyCard key={p.id} imovel={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      {exploreLinks.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <span className="section-label">Explore mais</span>
            <h2 className="section-title mb-6">Continue sua busca</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exploreLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between gap-3 border border-gray-200 px-4 py-3 text-sm text-dark hover:border-primary hover:text-primary transition-colors"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="text-xs">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
