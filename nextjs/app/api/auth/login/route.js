import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const attempts = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now })
    return false
  }
  record.count++
  return record.count > MAX_ATTEMPTS
}

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

  attempts.delete(ip)

  const token = jwt.sign(
    { sub: usuario, role: 'admin' },
    jwtSecret,
    { expiresIn: '8h' }
  )

  return NextResponse.json({ token, expiresIn: 8 * 3600 })
}
