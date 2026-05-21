import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'
import { rateLimit } from '../../../lib/rateLimit'
import { badRequest, requireUser, tooManyRequests, withErrorHandler } from '../../../lib/apiHandler'

const isRateLimited = rateLimit({ name: 'track-click', maxAttempts: 30, windowMs: 60 * 1000 })

export const POST = withErrorHandler('POST /api/track-click', async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) return tooManyRequests('Too many requests')

  const { source, page, device } = await request.json()
  if (!source || !page || !device) return badRequest('Dados incompletos')

  await getDb().query(
    'INSERT INTO wa_clicks (source, page, device) VALUES ($1, $2, $3)',
    [
      String(source).slice(0, 50),
      String(page).slice(0, 255),
      String(device).slice(0, 10),
    ]
  )

  return NextResponse.json({ ok: true }, { status: 201 })
})

export const GET = withErrorHandler('GET /api/track-click', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const { searchParams } = new URL(request.url)
  const days = Math.min(90, Math.max(1, Number(searchParams.get('days')) || 30))

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
    `SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') as date, COUNT(*) as clicks FROM wa_clicks WHERE created_at >= NOW() - INTERVAL '1 day' * $1 GROUP BY created_at::date ORDER BY created_at::date DESC`,
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
})
