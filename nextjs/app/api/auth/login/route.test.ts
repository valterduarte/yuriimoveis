import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

const TEST_USER = 'admin-test'
const TEST_PASSWORD = 'super-secret-test'
const TEST_JWT_SECRET = 'test-jwt-secret-for-login-route'

// Credentials now live in the database behind verifyCredentials; mock it so the
// route can be tested without a real connection. Literals are inlined because
// vi.mock factories are hoisted above module-scope constants.
vi.mock('../../../../lib/auth/adminAccount', () => ({
  verifyCredentials: vi.fn(async (usuario: string, senha: string) =>
    usuario === 'admin-test' && senha === 'super-secret-test'
      ? { id: 1, username: 'admin-test', passwordHash: 'hash', recoveryEmail: null }
      : null,
  ),
}))

import { POST } from './route'

function buildLoginRequest(body: unknown, ip = '198.51.100.1'): NextRequest {
  return new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/login', () => {
  let originalSecret: string | undefined

  beforeEach(() => {
    originalSecret = process.env.JWT_SECRET
    process.env.JWT_SECRET = TEST_JWT_SECRET
  })

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = originalSecret
  })

  it('returns a token for valid credentials', async () => {
    const ip = '198.51.100.10'
    const response = await POST(buildLoginRequest({ usuario: TEST_USER, senha: TEST_PASSWORD }, ip))
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.token).toBeTypeOf('string')
    expect(body.expiresIn).toBe(8 * 3600)
  })

  it('returns 400 when usuario or senha is missing', async () => {
    const ip = '198.51.100.20'
    const response = await POST(buildLoginRequest({ usuario: TEST_USER }, ip))
    expect(response.status).toBe(400)
  })

  it('returns 401 for wrong password', async () => {
    const ip = '198.51.100.30'
    const response = await POST(buildLoginRequest({ usuario: TEST_USER, senha: 'wrong' }, ip))
    expect(response.status).toBe(401)
  })

  it('returns 500 when JWT_SECRET is not configured', async () => {
    delete process.env.JWT_SECRET
    const ip = '198.51.100.40'
    const response = await POST(buildLoginRequest({ usuario: TEST_USER, senha: TEST_PASSWORD }, ip))
    expect(response.status).toBe(500)
  })

  it('rate-limits after 5 wrong-password attempts from the same ip', async () => {
    const ip = '198.51.100.50'
    for (let i = 0; i < 5; i++) {
      const r = await POST(buildLoginRequest({ usuario: TEST_USER, senha: 'wrong' }, ip))
      expect(r.status).toBe(401)
    }
    const blocked = await POST(buildLoginRequest({ usuario: TEST_USER, senha: 'wrong' }, ip))
    expect(blocked.status).toBe(429)
  })

  it('clears the rate limit on successful login', async () => {
    const ip = '198.51.100.60'
    // 4 wrong attempts (under the limit)
    for (let i = 0; i < 4; i++) {
      const r = await POST(buildLoginRequest({ usuario: TEST_USER, senha: 'wrong' }, ip))
      expect(r.status).toBe(401)
    }
    // Successful login should clear the bucket
    const ok = await POST(buildLoginRequest({ usuario: TEST_USER, senha: TEST_PASSWORD }, ip))
    expect(ok.status).toBe(200)
    // Subsequent wrong attempts start fresh
    const wrongAgain = await POST(buildLoginRequest({ usuario: TEST_USER, senha: 'wrong' }, ip))
    expect(wrongAgain.status).toBe(401)
  })
})
