/**
 * Shared cache tags and revalidate windows used across the data layer.
 * Kept here so every domain module references the same identifiers and
 * so Next.js revalidate calls invalidate the same cache buckets.
 */

export const CACHE_TAG_IMOVEIS = 'imoveis'
export const CACHE_TAG_SITE_CONFIG = 'site-config'
export const CACHE_TAG_BLOG = 'blog'

export const LISTING_REVALIDATE_SECONDS = 300
export const STATIC_DATA_REVALIDATE_SECONDS = 3600
export const SITE_CONFIG_REVALIDATE_SECONDS = 86400
