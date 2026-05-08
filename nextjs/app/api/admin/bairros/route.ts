import { NextRequest, NextResponse } from 'next/server'
import { fetchDistinctBairros, fetchDistinctCidades } from '../../../../lib/api'
import { requireUser, withErrorHandler } from '../../../../lib/apiHandler'

export const GET = withErrorHandler('GET /api/admin/bairros', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const [bairros, cidades] = await Promise.all([
    fetchDistinctBairros(),
    fetchDistinctCidades(),
  ])
  return NextResponse.json({ bairros, cidades }, {
    headers: { 'Cache-Control': 'private, max-age=60' },
  })
})
