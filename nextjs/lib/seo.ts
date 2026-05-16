import { OG_DEFAULT_IMAGE } from './config'
import type { Metadata } from 'next'

export const SITE_NAME = 'Corretor Yuri Imóveis'

interface ListingMetadataInput {
  title: string
  description: string
  url: string
  ogImage?: string
  ogImageAlt?: string
  noindex?: boolean
}

export function buildListingMetadata({
  title,
  description,
  url,
  ogImage = OG_DEFAULT_IMAGE,
  ogImageAlt = title,
  noindex = false,
}: ListingMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}
