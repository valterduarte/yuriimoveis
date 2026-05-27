import { fetchImovel } from '../../../../lib/api'
import { imovelSlug, formatNeighborhoodName, buildSeoDescription, ogImageUrl } from '../../../../utils/imovelUtils'
import { getBairroBySlug } from '../../../../data/bairros'
import { findLandingPage } from '../../../../data/landingPages'
import { PLACEHOLDER_IMAGE } from '../../../../lib/constants'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../../../../lib/config'
import type { Metadata } from 'next'

const SITE_NAME = 'Corretor Yuri Imóveis'

export async function buildPropertyMetadata(id: string): Promise<Metadata> {
  const imovel = await fetchImovel(id)
  if (!imovel) return { title: 'Imóvel não encontrado' }

  const description = buildSeoDescription(imovel)
  const pageUrl = `${SITE_URL}/imoveis/${imovelSlug(imovel)}`
  const rawImage = imovel.imagens?.[0] ?? PLACEHOLDER_IMAGE
  const socialImage = ogImageUrl(rawImage)

  return {
    title: imovel.titulo,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${imovel.titulo} — ${SITE_NAME}`,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: socialImage, width: 1200, height: 630, alt: imovel.titulo, type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: imovel.titulo,
      description,
      images: [socialImage],
    },
  }
}

export function buildLandingMetadata(slug: string): Metadata {
  const landingPage = findLandingPage(slug)
  if (!landingPage) return {}

  const url = `${SITE_URL}/imoveis/${slug}`
  return {
    title: landingPage.titulo,
    description: landingPage.descricaoMeta,
    alternates: { canonical: url },
    openGraph: {
      title: landingPage.titulo,
      description: landingPage.descricaoMeta,
      url,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: landingPage.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: landingPage.titulo,
      description: landingPage.descricaoMeta,
      images: [OG_DEFAULT_IMAGE],
    },
  }
}

export function buildBairroMetadata(slug: string): Metadata {
  const bairroData = getBairroBySlug(slug)
  const neighborhoodName = bairroData?.nome || formatNeighborhoodName(slug)
  const title = bairroData?.titulo || `Imóveis em ${neighborhoodName}, Osasco SP`
  const description =
    bairroData?.descricaoMeta ||
    `Veja todos os imóveis disponíveis no ${neighborhoodName} em Osasco, SP. Casas, apartamentos e terrenos à venda e para alugar. Atendimento com o Corretor Yuri.`

  const url = `${SITE_URL}/imoveis/${slug}`
  const bairroImage = bairroData?.imagem ? ogImageUrl(bairroData.imagem) : OG_DEFAULT_IMAGE

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: bairroImage, width: 1200, height: 630, alt: `Imóveis em ${neighborhoodName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bairroImage],
    },
  }
}
