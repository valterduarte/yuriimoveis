import { NextResponse } from 'next/server'

const INDEXABLE_PARAMS = new Set(['tipo', 'categoria'])

const BAIRRO_SLUG_REDIRECTS = {
  'jd-roberto': 'jardim-roberto',
}

const EMPREENDIMENTO_SLUG_REDIRECTS = {
  'vila-do-conde': 'vila-do-conde-viva-rsf',
}

export const LEGACY_LANDING_REDIRECTS = {
  'casas-a-venda-em-osasco':             '/comprar/osasco/casa',
  'apartamentos-a-venda-em-osasco':      '/comprar/osasco/apartamento',
  'terrenos-a-venda-em-osasco':          '/comprar/osasco/terreno',
  'imoveis-comerciais-a-venda-em-osasco':'/comprar/osasco/comercial',
  'casas-para-alugar-em-osasco':         '/alugar/osasco/casa',
  'apartamentos-para-alugar-em-osasco':  '/alugar/osasco/apartamento',
}

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl

  const legacyMatch = pathname.match(/^\/imoveis\/([^/]+)$/)
  if (legacyMatch) {
    const legacySlug = legacyMatch[1]
    const legacyTarget = LEGACY_LANDING_REDIRECTS[legacySlug]
    if (legacyTarget) {
      const url = request.nextUrl.clone()
      url.pathname = legacyTarget
      return NextResponse.redirect(url, 301)
    }
    const bairroTarget = BAIRRO_SLUG_REDIRECTS[legacySlug]
    if (bairroTarget) {
      const url = request.nextUrl.clone()
      url.pathname = `/imoveis/${bairroTarget}`
      return NextResponse.redirect(url, 301)
    }
  }

  const empreendimentoMatch = pathname.match(/^\/empreendimentos\/([^/]+)$/)
  if (empreendimentoMatch) {
    const empreendimentoTarget = EMPREENDIMENTO_SLUG_REDIRECTS[empreendimentoMatch[1]]
    if (empreendimentoTarget) {
      const url = request.nextUrl.clone()
      url.pathname = `/empreendimentos/${empreendimentoTarget}`
      return NextResponse.redirect(url, 301)
    }
  }

  const response = NextResponse.next()

  if (pathname === '/imoveis' && searchParams.size > 0) {
    const hasNonIndexable = [...searchParams.keys()].some(k => !INDEXABLE_PARAMS.has(k))
    if (hasNonIndexable) {
      response.headers.set('X-Robots-Tag', 'noindex, follow')
    }
  }

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  // CSP notes:
  // - 'unsafe-inline' in script-src is required by Next.js hydration scripts.
  //   Removing it breaks the site unless a full nonce pipeline is implemented in layout.jsx.
  // - 'unsafe-eval' in script-src is required by the Google Maps JS API (uses
  //   `new Function()` internally) and by Next.js HMR in development.
  // - maps.googleapis.com and maps.gstatic.com are added to script-src,
  //   img-src, and connect-src so the listing map can load tiles, marker
  //   sprites, and runtime API calls.
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://maps.googleapis.com https://maps.gstatic.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: blob: https://res.cloudinary.com https://valterduarte.github.io https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://www.google-analytics.com https://www.googletagmanager.com https://maps.googleapis.com https://maps.gstatic.com https://*.googleusercontent.com; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "connect-src 'self' https://api.cloudinary.com https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://vitals.vercel-insights.com https://maps.googleapis.com; " +
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
