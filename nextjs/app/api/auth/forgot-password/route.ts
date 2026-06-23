import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../../lib/rateLimit'
import { forgotPasswordSchema } from '../../../../lib/schemas'
import { badRequest, parseSchema, tooManyRequests, withErrorHandler } from '../../../../lib/apiHandler'
import { ensureAdminSeeded, getAdminByRecoveryEmail } from '../../../../lib/auth/adminAccount'
import { createResetToken } from '../../../../lib/auth/passwordReset'
import { sendPasswordResetEmail } from '../../../../lib/email'
import { SITE_URL } from '../../../../lib/config'

const isRateLimited = rateLimit({ name: 'forgot-password', maxAttempts: 5, windowMs: 15 * 60 * 1000 })

// Always answered with the same generic 200, whether or not the email matches an
// account, so the endpoint cannot be used to discover the recovery address.
const GENERIC_RESPONSE = {
  message: 'Se o e-mail estiver cadastrado, enviaremos um link de redefinição.',
}

export const POST = withErrorHandler('POST /api/auth/forgot-password', async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (await isRateLimited(ip)) {
    return tooManyRequests('Muitas tentativas. Tente novamente em 15 minutos.')
  }

  const body = await request.json().catch(() => null)
  if (!body) return badRequest('Requisição inválida')

  const data = parseSchema(forgotPasswordSchema, body)
  if (data instanceof NextResponse) return data

  await ensureAdminSeeded()
  const account = await getAdminByRecoveryEmail(data.email)
  if (account?.recoveryEmail) {
    const token = await createResetToken(account.id)
    const resetUrl = `${SITE_URL}/redefinir-senha?token=${token}`
    await sendPasswordResetEmail(account.recoveryEmail, resetUrl)
  }

  return NextResponse.json(GENERIC_RESPONSE)
})
