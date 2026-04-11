import { NextResponse } from 'next/server'

const INDEXABLE_PARAMS = new Set(['tipo', 'categoria'])

export function middleware(request) {
  const response = NextResponse.next()
  const { pathname, searchParams } = request.nextUrl

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
  // Note: 'unsafe-inline' in script-src is required by Next.js hydration scripts.
  // Removing it breaks the site unless a full nonce pipeline is implemented in layout.jsx.
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://valterduarte.github.io; font-src 'self' data:; connect-src 'self' https://api.cloudinary.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
