import jwt, { type JwtPayload } from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function requireAuth(request: NextRequest): JwtPayload | null {
  const auth = request.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return null
  try {
    return jwt.verify(auth.slice(7), process.env.JWT_SECRET!) as JwtPayload
  } catch {
    return null
  }
}
