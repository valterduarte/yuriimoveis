import { OG_DEFAULT_IMAGE } from './config'
import type { Metadata } from 'next'

export const SITE_NAME = 'Corretor Yuri Imóveis'

interface PageMetadataInput {
  title: string | { absolute: string }
  description: string
  url: string
  type?: 'website' | 'article'
  ogImage?: string
  ogImageAlt?: string
  ogImageWidth?: number
  ogImageHeight?: number
  socialTitle?: string
  socialDescription?: string
  noindex?: boolean
  keywords?: string
  publishedTime?: string
  modifiedTime?: string
  /** When set, the page is treated as a priced product: og:type becomes
   *  "product" and the formatted label leads the share description so the
   *  price is visible in WhatsApp/Instagram previews (which ignore the
   *  product:price:* tags). `amount` feeds those structured tags upstream. */
  productPrice?: { amount: number; label: string }
}

export function buildPageMetadata({
  title,
  description,
  url,
  type = 'website',
  ogImage = OG_DEFAULT_IMAGE,
  ogImageAlt,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  socialTitle,
  socialDescription,
  noindex = false,
  keywords,
  publishedTime,
  modifiedTime,
  productPrice,
}: PageMetadataInput): Metadata {
  const titleText = typeof title === 'string' ? title : title.absolute
  const ogTitle = socialTitle ?? titleText
  const baseOgDescription = socialDescription ?? description
  const ogDescription = productPrice
    ? `${productPrice.label} · ${baseOgDescription}`
    : baseOgDescription
  const ogAlt = ogImageAlt ?? titleText

  const openGraph: NonNullable<Metadata['openGraph']> = {
    title: ogTitle,
    description: ogDescription,
    url,
    siteName: SITE_NAME,
    locale: 'pt_BR',
    type,
    images: [{ url: ogImage, width: ogImageWidth, height: ogImageHeight, alt: ogAlt }],
  }
  // og:type "product" is outside Next's typed OpenGraph union, so assign it past
  // the type. Next still emits whatever string it finds on `type`.
  if (productPrice) (openGraph as { type?: string }).type = 'product'
  if (type === 'article') {
    if (publishedTime) (openGraph as { publishedTime?: string }).publishedTime = publishedTime
    if (modifiedTime) (openGraph as { modifiedTime?: string }).modifiedTime = modifiedTime
  }

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  }
}

interface ListingMetadataInput {
  title: string
  description: string
  url: string
  ogImage?: string
  ogImageAlt?: string
  noindex?: boolean
}

export function buildListingMetadata(input: ListingMetadataInput): Metadata {
  return buildPageMetadata(input)
}
