import jwt from 'jsonwebtoken'

export function requireAuth(request) {
  const auth = request.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return null
  try {
    return jwt.verify(auth.slice(7), process.env.JWT_SECRET)
  } catch {
    return null
  }
}
