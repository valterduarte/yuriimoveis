import { SITE_URL } from '../config'

export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  const transforms = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto'
  return url.replace('/upload/', `/upload/${transforms}/`)
}

// Serving the raw upload makes playback depend on whatever the user happened to
// export. Routing the <video> src through f_auto:video,q_auto lets Cloudinary
// deliver a browser-friendly codec at a sane bitrate instead of the original
// file verbatim.
export function optimizeCloudinaryVideo(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/f_auto:video,q_auto/')
}

// Cloudinary serves a generated still frame when a video asset is requested
// with an image extension, so the poster is just the same URL ending in .jpg.
export function deriveVideoPoster(videoUrl: string): string {
  if (!videoUrl || !videoUrl.includes('res.cloudinary.com')) return ''
  if (!/\.(mp4|mov|webm|m4v|ogv)$/i.test(videoUrl)) return ''
  return videoUrl.replace(/\.(mp4|mov|webm|m4v|ogv)$/i, '.jpg')
}

export function ogImageUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url
  return url.replace('/upload/', '/upload/f_jpg,q_80,w_1200,h_630,c_fill/')
}

/**
 * Builds the URL of the branded social-share card for a property. The card is
 * rendered on the fly by /api/og/imovel — the property photo with a brand-red
 * price badge, location and the Corretor Yuri logo lockup. The raw photo is
 * pre-sized to 1200x630 so the renderer fetches a light background.
 */
export function propertyOgImageUrl(
  rawUrl: string,
  { priceLabel, location }: { priceLabel?: string; location?: string } = {},
): string {
  const params = new URLSearchParams()
  if (rawUrl) params.set('img', ogImageUrl(rawUrl))
  if (priceLabel) params.set('price', priceLabel)
  if (location) params.set('loc', location)
  return `${SITE_URL}/api/og/imovel?${params.toString()}`
}
