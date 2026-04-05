const PRODUCTION_URL = 'https://corretoryuri.com.br'
export const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? PRODUCTION_URL
    : (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL)
export const PHONE_NUMBER     = '5511972563420'
export const PHONE_DISPLAY    = '(11) 97256-3420'
export const PHONE_STRUCTURED = '+55-11-97256-3420'
export const PHONE_WA         = `https://wa.me/${PHONE_NUMBER}`
export const PHONE_TEL        = `tel:${PHONE_NUMBER}`
export const INSTAGRAM_URL    = 'https://www.instagram.com/valterrduarte/'
export const CRECI            = '235509'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || ''

export const OG_DEFAULT_IMAGE =
  'https://res.cloudinary.com/dfl3eskr9/image/upload/f_jpg,q_80,w_1200,h_630,c_fill/v1775083889/po3gf0daisooo1t7run5.jpg'

export const CLOUDINARY_CLOUD =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD || 'dfl3eskr9'

export const CLOUDINARY_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'Yuri-upload'
