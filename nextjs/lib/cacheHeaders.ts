/**
 * Centralized Cache-Control header presets for API route handlers.
 *
 * On Vercel, `Vercel-CDN-Cache-Control` takes precedence on the edge CDN,
 * `CDN-Cache-Control` is the generic CDN header, and `Cache-Control` is what
 * the browser sees. The browser TTL is intentionally short — the long TTL
 * lives on the CDN, which is invalidated via revalidateTag on writes.
 */

interface PublicCacheOptions {
  /** Browser max-age in seconds. Defaults to 60. */
  browserMaxAge?: number
  /** CDN edge cache duration in seconds. */
  cdnMaxAge: number
  /** Stale-while-revalidate window in seconds. */
  swr: number
}

export function publicCacheHeaders({
  browserMaxAge = 60,
  cdnMaxAge,
  swr,
}: PublicCacheOptions): Record<string, string> {
  const cdnPolicy = `public, s-maxage=${cdnMaxAge}, stale-while-revalidate=${swr}`
  return {
    'Cache-Control': `public, max-age=${browserMaxAge}`,
    'CDN-Cache-Control': cdnPolicy,
    'Vercel-CDN-Cache-Control': cdnPolicy,
  }
}

export const PRIVATE_NO_STORE: Record<string, string> = {
  'Cache-Control': 'private, no-store',
}
