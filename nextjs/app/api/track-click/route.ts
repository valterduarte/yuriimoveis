import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'
import { requireAuth } from '../../../lib/requireAuth'
import { rateLimit } from '../../../lib/rateLimit'

const isRateLimited = rateLimit({ name: 'track-click', maxAttempts: 30, windowMs: 60 * 1000 })

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { source, page, device } = await request.json()

    if (!source || !page || !device) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    await getDb().query(
      'INSERT INTO wa_clicks (source, page, device) VALUES ($1, $2, $3)',
      [
        String(source).slice(0, 50),
        String(page).slice(0, 255),
        String(device).slice(0, 10),
      ]
    )

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('POST /api/track-click error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const days = Math.min(90, Math.max(1, Number(searchParams.get('days')) || 30))

  try {
    const totalResult = await getDb().query(
      `SELECT COUNT(*) as total FROM wa_clicks WHERE created_at >= NOW() - INTERVAL '1 day' * $1`,
      [days]
    )

    const bySourceResult = await getDb().query(
      `SELECT source, COUNT(*) as clicks FROM wa_clicks WHERE created_at >= NOW() - INTERVAL '1 day' * $1 GROUP BY source ORDER BY clicks DESC`,
      [days]
    )

    const byDeviceResult = await getDb().query(
      `SELECT device, COUNT(*) as clicks FROM wa_clicks WHERE created_at >= NOW() - INTERVAL '1 day' * $1 GROUP BY device ORDER BY clicks DESC`,
      [days]
    )

    const byPageResult = await getDb().query(
      `SELECT page, COUNT(*) as clicks FROM wa_clicks WHERE created_at >= NOW() - INTERVAL '1 day' * $1 GROUP BY page ORDER BY clicks DESC LIMIT 20`,
      [days]
    )

    const byDayResult = await getDb().query(
      `SELECT DATE(created_at) as date, COUNT(*) as clicks FROM wa_clicks WHERE created_at >= NOW() - INTERVAL '1 day' * $1 GROUP BY DATE(created_at) ORDER BY date DESC`,
      [days]
    )

    return NextResponse.json({
      days,
      total: parseInt(totalResult.rows[0].total),
      bySource: bySourceResult.rows,
      byDevice: byDeviceResult.rows,
      byPage: byPageResult.rows,
      byDay: byDayResult.rows,
    })
  } catch (err) {
    console.error('GET /api/track-click error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
