import { NextRequest, NextResponse } from 'next/server'
import { requireUser, withErrorHandler } from '../../../../../lib/apiHandler'
import { getDb } from '../../../../../lib/db'
import { fetchAllPropertySlugs } from '../../../../../lib/properties'
import { imovelSlug } from '../../../../../lib/imovel/slug'
import { getPropertyAnalyticsByPath } from '../../../../../lib/vercelAnalytics'

const DEFAULT_DAYS = 31

export const GET = withErrorHandler(
  'GET /api/admin/analytics/properties',
  async (request: NextRequest) => {
    const user = requireUser(request)
    if (user instanceof NextResponse) return user

    const since =
      request.nextUrl.searchParams.get('since') ??
      new Date(
        Date.now() - DEFAULT_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString()

    const until =
      request.nextUrl.searchParams.get('until') ??
      new Date().toISOString()

    const properties = await fetchAllPropertySlugs()

    const requestPaths = properties.map(
      (property) => `/imoveis/${imovelSlug(property)}`,
    )

    const [analytics, clicksResult] = await Promise.all([
      getPropertyAnalyticsByPath(requestPaths, since, until),

      getDb().query(
        `
          SELECT page, COUNT(*)::int AS clicks
          FROM wa_clicks
          WHERE created_at >= $1
            AND created_at < $2
          GROUP BY page
        `,
        [since, until],
      ),
    ])

    const analyticsByPath = new Map(
      analytics.map((item) => [item.requestPath, item]),
    )

    const clicksByPath = new Map(
      clicksResult.rows.map((row) => [
        String(row.page),
        Number(row.clicks),
      ]),
    )

    const data = properties.map((property) => {
      const requestPath = `/imoveis/${imovelSlug(property)}`
      const metrics = analyticsByPath.get(requestPath)
      const clicks = clicksByPath.get(requestPath) ?? 0

      return {
        id: property.id,
        titulo: property.titulo,
        updated_at: property.updated_at,
        requestPath,
        visitors: metrics?.visitors ?? 0,
        pageviews: metrics?.pageviews ?? 0,
        clicks,
      }
    })

    return NextResponse.json(
      {
        since,
        until,
        data,
      },
      {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      },
    )
  },
)