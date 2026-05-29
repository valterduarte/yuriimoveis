import { fetchImovel } from '../../../../lib/api'
import { imovelSlug, formatNeighborhoodName, buildSeoDescription, ogImageUrl } from '../../../../utils/imovelUtils'
import { getBairroBySlug } from '../../../../data/bairros'
import { findLandingPage } from '../../../../data/landingPages'
import { PLACEHOLDER_IMAGE } from '../../../../lib/constants'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../lib/config'
import { buildPageMetadata, SITE_NAME } from '../../../../lib/seo'
import type { Metadata } from 'next'

export async function buildPropertyMetadata(id: string): Promise<Metadata> {
  const imovel = await fetchImovel(id)
  if (!imovel) return { title: 'Imóvel não encontrado' }

  const description = buildSeoDescription(imovel)
  const rawImage = imovel.imagens?.[0] ?? PLACEHOLDER_IMAGE

  return buildPageMetadata({
    title: imovel.titulo,
    description,
    url: `${SITE_URL}/imoveis/${imovelSlug(imovel)}`,
    socialTitle: `${imovel.titulo} — ${SITE_NAME}`,
    ogImage: ogImageUrl(rawImage),
    ogImageAlt: imovel.titulo,
  })
}

export function buildLandingMetadata(slug: string): Metadata {
  const landingPage = findLandingPage(slug)
  if (!landingPage) return {}

  return buildPageMetadata({
    title: landingPage.titulo,
    description: landingPage.descricaoMeta,
    url: `${SITE_URL}/imoveis/${slug}`,
    ogImage: OG_DEFAULT_IMAGE,
    ogImageAlt: landingPage.h1,
  })
}

export function buildBairroMetadata(slug: string): Metadata {
  const bairroData = getBairroBySlug(slug)
  const neighborhoodName = bairroData?.nome || formatNeighborhoodName(slug)
  const title = bairroData?.titulo || `Imóveis em ${neighborhoodName}, Osasco SP`
  const description =
    bairroData?.descricaoMeta ||
    `Veja todos os imóveis disponíveis no ${neighborhoodName} em Osasco, SP. Casas, apartamentos e terrenos à venda e para alugar. Atendimento com o Corretor Yuri.`

  return buildPageMetadata({
    title,
    description,
    url: `${SITE_URL}/imoveis/${slug}`,
    noindex: true,
    ogImage: bairroData?.imagem ? ogImageUrl(bairroData.imagem) : OG_DEFAULT_IMAGE,
    ogImageAlt: `Imóveis em ${neighborhoodName}`,
  })
}
