const PRODUCTION_URL: string = 'https://corretoryuri.com.br'
export const SITE_URL: string =
  process.env.NODE_ENV === 'production'
    ? PRODUCTION_URL
    : (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL)
const PHONE_NUMBER: string            = '5511972563420'
export const PHONE_DISPLAY: string    = '(11) 97256-3420'
export const PHONE_STRUCTURED: string = '+5511972563420'
export const PHONE_WA_BASE: string     = `https://wa.me/${PHONE_NUMBER}`
export const PHONE_WA: string         = `${PHONE_WA_BASE}?text=${encodeURIComponent('Olá! Gostaria de mais informações sobre imóveis.')}`
export const PHONE_TEL: string        = `tel:${PHONE_NUMBER}`
export const INSTAGRAM_URL: string    = 'https://www.instagram.com/valterrduarte/'
// Canonical Google Maps place URL (CID) — stable entity reference for hasMap/sameAs.
export const GOOGLE_BUSINESS_URL: string = 'https://maps.google.com/?cid=17982882895268664003'
export const CRECI: string            = '235509'

// Broker identity for the trust card shown at the decision moment.
export const BROKER_NAME: string       = 'Yuri'
// Headshot URL. Empty string falls back to an initials avatar.
export const BROKER_PHOTO_URL: string  = '/images/yuri-corretor.webp'
// Real Google Business rating — keep null until wired to live reviews so we never
// publish fabricated numbers. Set both to the real values to light up the stars.
export const BROKER_RATING: number | null       = null
export const BROKER_REVIEW_COUNT: number | null = null

export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || ''

export const OG_DEFAULT_IMAGE: string =
  'https://res.cloudinary.com/dfl3eskr9/image/upload/f_jpg,q_80,w_1200,h_630,c_fill/v1775083889/po3gf0daisooo1t7run5.jpg'

export const CLOUDINARY_CLOUD: string =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || 'dfl3eskr9'

export const CLOUDINARY_PRESET: string =
  process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'Yuri-upload'
