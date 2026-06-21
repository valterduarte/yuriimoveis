import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { rateLimit, rateLimitClear } from '../../../../lib/rateLimit'
import { loginSchema } from '../../../../lib/schemas'
import { badRequest, parseSchema, tooManyRequests, withErrorHandler } from '../../../../lib/apiHandler'
import { requireServerEnv } from '../../../../lib/env'

function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

const isRateLimited = rateLimit({ name: 'login', maxAttempts: 5, windowMs: 15 * 60 * 1000 })

export const POST = withErrorHandler('POST /api/auth/login', async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (await isRateLimited(ip)) {
    return tooManyRequests('Muitas tentativas. Tente novamente em 15 minutos.')
  }

  const body = await request.json().catch(() => null)
  if (!body) return badRequest('Requisição inválida')

  const data = parseSchema(loginSchema, body)
  if (data instanceof NextResponse) return data
  const { usuario, senha } = data

  const adminUser     = requireServerEnv('ADMIN_USER')
  const adminPassword = requireServerEnv('ADMIN_PASSWORD')
  const jwtSecret     = requireServerEnv('JWT_SECRET')

  const userOk = constantTimeEqual(usuario, adminUser)
  const passOk = constantTimeEqual(senha, adminPassword)
  if (!userOk || !passOk) {
    return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
  }

  await rateLimitClear('login', ip)

  const token = jwt.sign(
    { sub: usuario, role: 'admin' },
    jwtSecret,
    { expiresIn: '8h' }
  )

  return NextResponse.json({ token, expiresIn: 8 * 3600 })
})
