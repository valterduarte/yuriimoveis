import { slugify } from '../../../../utils/imovelUtils'
import { CATEGORIAS } from '../../../../data/categorias'
import {
  bairroDbNameToSlug,
  buildHierarchicalUrl,
  cidadeNameToSlug,
  cidadeSlugToName,
  hasRichBairroContent,
  tipoToAcao,
} from '../../../../lib/navigation'
import type { Imovel } from '../../../../types'
import type { detectEmpreendimento } from '../../../../lib/empreendimento'

export interface ExploreLink {
  href: string
  label: string
}

/**
 * Build the "Continue sua busca" link list shown under a single property.
 *
 * Order matters: empreendimento first (most specific), then bairro guide,
 * bairro listing, city+category, city. Each step is gated by what the
 * imovel actually has so the section stays useful and not duplicative.
 */
export function buildExploreLinks(args: {
  imovel: Imovel
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

/**
 * Rewrite a Cloudinary image URL to a 1920-wide auto-optimized variant for
 * the LCP preload hint. Non-Cloudinary URLs are returned unchanged.
 */
export function buildLcpImageHref(images: string[]): string | undefined {
  const first = images[0]
  if (!first) return undefined
  if (first.includes('res.cloudinary.com')) {
    return first.replace('/upload/', '/upload/f_auto,q_auto,w_1920/')
  }
  return first
}
