import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { rateLimit, rateLimitClear } from '../../../../lib/rateLimit'

const isRateLimited = rateLimit({ name: 'login', maxAttempts: 5, windowMs: 15 * 60 * 1000 })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (isRateLimited(ip)) {
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

  if (usuario !== adminUser || senha !== adminPassword) {
    return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
  }

  rateLimitClear('login', ip)

  const token = jwt.sign(
    { sub: usuario, role: 'admin' },
    jwtSecret,
    { expiresIn: '8h' }
  )

  return NextResponse.json({ token, expiresIn: 8 * 3600 })
}
