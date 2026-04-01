import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request) {
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

  const token = jwt.sign(
    { sub: usuario, role: 'admin' },
    jwtSecret,
    { expiresIn: '8h' }
  )

  return NextResponse.json({ token, expiresIn: 8 * 3600 })
}
