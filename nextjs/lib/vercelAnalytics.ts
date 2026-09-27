import { optionalServerEnv } from './env'

const VERCEL_API_URL = 'https://api.vercel.com/v1/query/web-analytics'

const VERCEL_PROJECT_ID = 'prj_9KWGrVUjEZLNdfz1vBUiiGYXdYvK'
const VERCEL_TEAM_ID = 'team_COFWoYOIeVzQ8EdAE6c1H3iL'
const REQUEST_PATH_BATCH_SIZE = 20

export type PropertyAnalytics = {
  visitors: number
  pageviews: number
}

export type PropertyAnalyticsByPath = {
  requestPath: string
  visitors: number
  pageviews: number
}

type VercelCountResponse = {
  data?: {
    visitors?: number
    pageviews?: number
  }
}

type VercelAggregateResponse = {
  data?: Array<{
    requestPath?: string
    visitors?: number
    pageviews?: number
  }>
}

export async function getPropertyAnalytics(
  requestPath: string,
): Promise<PropertyAnalytics> {
  const token = optionalServerEnv('VERCEL_ANALYTICS_TOKEN')

  if (!token) {
    throw new Error('VERCEL_ANALYTICS_TOKEN não configurado')
  }

  const params = new URLSearchParams({
    teamId: VERCEL_TEAM_ID,
    projectId: VERCEL_PROJECT_ID,
    filter: `requestPath eq '${requestPath}'`,
  })

  const response = await fetch(
    `${VERCEL_API_URL}/visits/count?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error(
      `Vercel Analytics API retornou HTTP ${response.status}`,
    )
  }

  const result = (await response.json()) as VercelCountResponse

  return {
    visitors: result.data?.visitors ?? 0,
    pageviews: result.data?.pageviews ?? 0,
  }
}

export async function getPropertyAnalyticsByPath(
  requestPaths: string[],
  since: string,
  until: string,
): Promise<PropertyAnalyticsByPath[]> {
  const token = optionalServerEnv('VERCEL_ANALYTICS_TOKEN')

  if (!token) {
    throw new Error('VERCEL_ANALYTICS_TOKEN não configurado')
  }

  const results: PropertyAnalyticsByPath[] = []

  for (let index = 0; index < requestPaths.length; index += REQUEST_PATH_BATCH_SIZE) {
    const paths = requestPaths.slice(index, index + REQUEST_PATH_BATCH_SIZE)

    const filter = paths
      .map((requestPath) => `requestPath eq '${requestPath}'`)
      .join(' or ')

    const params = new URLSearchParams({
      teamId: VERCEL_TEAM_ID,
      projectId: VERCEL_PROJECT_ID,
      by: 'requestPath',
      since,
      until,
      limit: '100',
      filter,
    })

    const response = await fetch(
      `${VERCEL_API_URL}/visits/aggregate?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error(
        `Vercel Analytics API retornou HTTP ${response.status}`,
      )
    }

    const result = (await response.json()) as VercelAggregateResponse

    results.push(
      ...(result.data ?? []).flatMap((item) =>
        item.requestPath
          ? [
              {
                requestPath: item.requestPath,
                visitors: item.visitors ?? 0,
                pageviews: item.pageviews ?? 0,
              },
            ]
          : [],
      ),
    )
  }

  return results
}
