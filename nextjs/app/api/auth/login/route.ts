import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { rateLimit, rateLimitClear } from '../../../../lib/rateLimit'
import { loginSchema } from '../../../../lib/schemas'
import { badRequest, parseSchema, tooManyRequests, withErrorHandler } from '../../../../lib/apiHandler'
import { requireServerEnv } from '../../../../lib/env'
import { verifyCredentials } from '../../../../lib/auth/adminAccount'

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

  const account = await verifyCredentials(usuario, senha)
  if (!account) {
    return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
  }

  await rateLimitClear('login', ip)

  const token = jwt.sign(
    { sub: account.username, role: 'admin' },
    requireServerEnv('JWT_SECRET'),
    { expiresIn: '8h' },
  )

  return NextResponse.json({ token, expiresIn: 8 * 3600 })
})
