const PRODUCTION_URL: string = 'https://corretoryuri.com.br'
export const SITE_URL: string =
  process.env.NODE_ENV === 'production'
    ? PRODUCTION_URL
    : (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL)
export const PHONE_NUMBER: string     = '5511972563420'
export const PHONE_DISPLAY: string    = '(11) 97256-3420'
export const PHONE_STRUCTURED: string = '+55-11-97256-3420'
export const PHONE_WA: string         = `https://wa.me/${PHONE_NUMBER}`
export const PHONE_TEL: string        = `tel:${PHONE_NUMBER}`
export const INSTAGRAM_URL: string    = 'https://www.instagram.com/valterrduarte/'
export const CRECI: string            = '235509'

export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || ''

export const OG_DEFAULT_IMAGE: string =
  'https://res.cloudinary.com/dfl3eskr9/image/upload/f_jpg,q_80,w_1200,h_630,c_fill/v1775083889/po3gf0daisooo1t7run5.jpg'

export const CLOUDINARY_CLOUD: string =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || 'dfl3eskr9'

export const CLOUDINARY_PRESET: string =
  process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'Yuri-upload'
