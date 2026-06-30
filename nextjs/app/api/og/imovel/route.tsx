import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'

// Brand tokens mirrored from tailwind.config.js / components/Logo.tsx
const BRAND_RED = '#af1e23'
const MUTED = '#cbd1d8'

// House mark from components/Logo.tsx, shapes only (no <text>) so it rasterizes
// without depending on fonts being available to the SVG renderer.
const LOGO_MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="72" height="72">
  <rect width="52" height="52" fill="${BRAND_RED}"/>
  <line x1="14" y1="13" x2="26" y2="27" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <line x1="38" y1="13" x2="26" y2="27" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <line x1="26" y1="27" x2="26" y2="40" stroke="white" stroke-width="4" stroke-linecap="round"/>
</svg>`
const LOGO_MARK_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_MARK)}`

let fontCache: { bold: ArrayBuffer; semibold: ArrayBuffer } | null = null

async function loadGoogleFont(weight: number): Promise<ArrayBuffer> {
  // Default fetch UA makes Google Fonts serve TrueType, which Satori supports
  // (it cannot decode woff2).
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Montserrat:wght@${weight}`,
  ).then(res => res.text())
  const src = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype|woff)'\)/)?.[1]
  if (!src) throw new Error(`Montserrat ${weight} source not found`)
  return fetch(src).then(res => res.arrayBuffer())
}

async function getFonts() {
  if (!fontCache) {
    const [bold, semibold] = await Promise.all([loadGoogleFont(700), loadGoogleFont(600)])
    fontCache = { bold, semibold }
  }
  return fontCache
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const img = searchParams.get('img') || ''
  const price = searchParams.get('price') || ''
  const location = searchParams.get('loc') || ''

  try {
    const { bold, semibold } = await getFonts()

    return new ImageResponse(
      (
        <div style={{ position: 'relative', display: 'flex', width: '1200px', height: '630px', backgroundColor: '#1a1a1a' }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" width={1200} height={630} style={{ position: 'absolute', inset: 0, objectFit: 'cover' }} />
          ) : null}

          {/* Bottom scrim for legibility */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '420px',
              display: 'flex',
              backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 45%, rgba(0,0,0,0))',
            }}
          />

          {/* Foreground row */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: '56px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {price ? (
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: BRAND_RED,
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontWeight: 700,
                    fontSize: '66px',
                    lineHeight: 1,
                    padding: '18px 28px',
                    borderRadius: '14px',
                  }}
                >
                  {price}
                </div>
              ) : null}
              {location ? (
                <div
                  style={{
                    display: 'flex',
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontWeight: 600,
                    fontSize: '38px',
                    marginTop: '20px',
                  }}
                >
                  {location}
                </div>
              ) : null}
            </div>

            {/* Logo lockup */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_MARK_SRC} alt="" width={72} height={72} />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '16px' }}>
                <div style={{ display: 'flex', color: 'white', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '34px', letterSpacing: '4px' }}>
                  YURI
                </div>
                <div style={{ display: 'flex', color: MUTED, fontFamily: 'Montserrat', fontWeight: 600, fontSize: '15px', letterSpacing: '6px' }}>
                  CORRETOR
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Montserrat', data: bold, weight: 700, style: 'normal' },
          { name: 'Montserrat', data: semibold, weight: 600, style: 'normal' },
        ],
        headers: {
          'Cache-Control': 'public, immutable, no-transform, max-age=86400, s-maxage=604800',
        },
      },
    )
  } catch {
    // Never break the social preview: fall back to the plain property photo.
    if (img) return NextResponse.redirect(img)
    return new NextResponse('Unable to render image', { status: 500 })
  }
}
