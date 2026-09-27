import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('../../../../../lib/requireAuth', () => ({
  requireAuth: vi.fn(() => ({ sub: 'admin-test' })),
}))

import { GET } from './route'

function buildRequest(query: string): NextRequest {
  return new NextRequest(`http://localhost/api/admin/analytics/properties${query}`)
}

describe('GET /api/admin/analytics/properties', () => {
  it('returns 400 when since is invalid', async () => {
    const response = await GET(buildRequest('?since=not-a-timestamp'))
    expect(response.status).toBe(400)
  })

  it('returns 400 when until is invalid', async () => {
    const response = await GET(buildRequest('?until=not-a-timestamp'))
    expect(response.status).toBe(400)
  })
})
