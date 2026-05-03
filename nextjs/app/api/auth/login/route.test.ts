import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

const TEST_USER = 'admin-test'
const TEST_PASSWORD = 'super-secret-test'
const TEST_JWT_SECRET = 'test-jwt-secret-for-login-route'

function buildLoginRequest(body: unknown, ip = '198.51.100.1'): NextRequest {
  return new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/login', () => {
  let originalUser: string | undefined
  let originalPass: string | undefined
  let originalSecret: string | undefined

  beforeEach(() => {
    originalUser = process.env.ADMIN_USER
    originalPass = process.env.ADMIN_PASSWORD
    originalSecret = process.env.JWT_SECRET
    process.env.ADMIN_USER = TEST_USER
    process.env.ADMIN_PASSWORD = TEST_PASSWORD
    process.env.JWT_SECRET = TEST_JWT_SECRET
  })

  afterEach(() => {
    if (originalUser   === undefined) delete process.env.ADMIN_USER;     else process.env.ADMIN_USER     = originalUser
    if (originalPass   === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = originalPass
    if (originalSecret === undefined) delete process.env.JWT_SECRET;     else process.env.JWT_SECRET     = originalSecret
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

  it('returns 500 when admin env vars are not configured', async () => {
    delete process.env.ADMIN_USER
    const ip = '198.51.100.40'
    const response = await POST(buildLoginRequest({ usuario: 'x', senha: 'y' }, ip))
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
