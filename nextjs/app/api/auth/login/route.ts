import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { rateLimit, rateLimitClear } from '../../../../lib/rateLimit'

function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

const isRateLimited = rateLimit({ name: 'login', maxAttempts: 5, windowMs: 15 * 60 * 1000 })

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { usuario, senha } = body

  if (!usuario || !senha) {
    return NextResponse.json({ error: 'Informe usuário e senha' }, { status: 400 })
  }

  const adminUser     = process.env.ADMIN_USER
  const adminPassword = process.env.ADMIN_PASSWORD
  const jwtSecret     = process.env.JWT_SECRET

  if (!adminUser || !adminPassword || !jwtSecret) {
    return NextResponse.json({ error: 'Configuração de autenticação ausente no servidor' }, { status: 500 })
  }

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
}
