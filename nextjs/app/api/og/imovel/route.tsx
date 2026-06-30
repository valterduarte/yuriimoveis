import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

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

// Re-encode at descending quality until the JPEG fits under the cap, so even a
// noisy photo can never produce an image too large for WhatsApp to thumbnail.
const MAX_CARD_BYTES = 250_000

async function encodeUnderCap(png: Buffer): Promise<Buffer> {
  let out = png
  for (const quality of [78, 70, 62, 54, 46, 40]) {
    out = await sharp(png).jpeg({ quality, mozjpeg: true }).toBuffer()
    if (out.byteLength <= MAX_CARD_BYTES) break
  }
  return out
}

let fontCache: { bold: Buffer; semibold: Buffer } | null = null

async function loadGoogleFont(weight: number): Promise<Buffer> {
  // Resilience fallback only — the default fetch UA makes Google Fonts serve
  // TrueType, which Satori supports (it cannot decode woff2).
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Montserrat:wght@${weight}`,
  ).then(res => res.text())
  const src = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype|woff)'\)/)?.[1]
  if (!src) throw new Error(`Montserrat ${weight} source not found`)
  const data = await fetch(src).then(res => res.arrayBuffer())
  return Buffer.from(data)
}

async function loadFont(weight: number): Promise<Buffer> {
  // Self-hosted fonts keep cold renders fast and remove the Google dependency;
  // fall back to fetching only if the bundled file is somehow unavailable.
  try {
    return await readFile(join(process.cwd(), 'app/api/og/imovel/fonts', `Montserrat-${weight}.ttf`))
  } catch {
    return loadGoogleFont(weight)
  }
}

async function getFonts() {
  if (!fontCache) {
    const [bold, semibold] = await Promise.all([loadFont(700), loadFont(600)])
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

    const image = new ImageResponse(
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
      },
    )

    // ImageResponse emits a large, streamed PNG (no Content-Length). WhatsApp
    // and other link-preview crawlers skip the thumbnail for oversized images
    // and dislike length-less responses, so re-encode to a compact JPEG buffer.
    const png = Buffer.from(await image.arrayBuffer())
    const jpeg = await encodeUnderCap(png)
    const body = new Uint8Array(jpeg.byteLength)
    body.set(jpeg)

    // A Blob body makes the Response set Content-Type and Content-Length, which
    // link-preview crawlers (WhatsApp) need to fetch the thumbnail.
    return new NextResponse(new Blob([body], { type: 'image/jpeg' }), {
      headers: {
        'Cache-Control': 'public, immutable, no-transform, max-age=86400, s-maxage=604800',
      },
    })
  } catch {
    // Never break the social preview: fall back to the plain property photo.
    if (img) return NextResponse.redirect(img)
    return new NextResponse('Unable to render image', { status: 500 })
  }
}
