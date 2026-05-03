import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { requireAuth } from './requireAuth'

const TEST_SECRET = 'test-secret-key-for-vitest'

function buildRequest(authHeader?: string): NextRequest {
  const headers = new Headers()
  if (authHeader) headers.set('authorization', authHeader)
  return new NextRequest('http://localhost/api/test', { headers })
}

describe('requireAuth', () => {
  let originalSecret: string | undefined

  beforeEach(() => {
    originalSecret = process.env.JWT_SECRET
    process.env.JWT_SECRET = TEST_SECRET
  })

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  })

  it('returns the decoded payload for a valid Bearer token', () => {
    const token = jwt.sign({ sub: 'admin', role: 'admin' }, TEST_SECRET, { expiresIn: '1h' })
    const result = requireAuth(buildRequest(`Bearer ${token}`))
    expect(result).not.toBeNull()
    expect(result?.sub).toBe('admin')
    expect((result as { role?: string }).role).toBe('admin')
  })

  it('returns null when the Authorization header is missing', () => {
    expect(requireAuth(buildRequest())).toBeNull()
  })

  it('returns null when the header does not start with "Bearer "', () => {
    const token = jwt.sign({ sub: 'admin' }, TEST_SECRET)
    expect(requireAuth(buildRequest(`Token ${token}`))).toBeNull()
    expect(requireAuth(buildRequest(token))).toBeNull()
  })

  it('returns null for a malformed token', () => {
    expect(requireAuth(buildRequest('Bearer not-a-real-jwt'))).toBeNull()
  })

  it('returns null for a token signed with a different secret', () => {
    const token = jwt.sign({ sub: 'admin' }, 'other-secret')
    expect(requireAuth(buildRequest(`Bearer ${token}`))).toBeNull()
  })

  it('returns null for an expired token', () => {
    const token = jwt.sign({ sub: 'admin' }, TEST_SECRET, { expiresIn: '-1h' })
    expect(requireAuth(buildRequest(`Bearer ${token}`))).toBeNull()
  })

  it('returns null when JWT_SECRET is not configured', () => {
    delete process.env.JWT_SECRET
    const token = jwt.sign({ sub: 'admin' }, TEST_SECRET)
    expect(requireAuth(buildRequest(`Bearer ${token}`))).toBeNull()
  })
})
