import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../../lib/rateLimit'
import { resetPasswordSchema } from '../../../../lib/schemas'
import { badRequest, parseSchema, tooManyRequests, withErrorHandler } from '../../../../lib/apiHandler'
import { resetPasswordWithToken } from '../../../../lib/auth/passwordReset'

const isRateLimited = rateLimit({ name: 'reset-password', maxAttempts: 10, windowMs: 15 * 60 * 1000 })

export const POST = withErrorHandler('POST /api/auth/reset-password', async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (await isRateLimited(ip)) {
    return tooManyRequests('Muitas tentativas. Tente novamente em 15 minutos.')
  }

  const body = await request.json().catch(() => null)
  if (!body) return badRequest('Requisição inválida')

  const data = parseSchema(resetPasswordSchema, body)
  if (data instanceof NextResponse) return data

  const ok = await resetPasswordWithToken(data.token, data.novaSenha)
  if (!ok) {
    return NextResponse.json(
      { error: 'Link inválido ou expirado. Solicite um novo.' },
      { status: 400 },
    )
  }

  return NextResponse.json({ message: 'Senha redefinida com sucesso' })
})
