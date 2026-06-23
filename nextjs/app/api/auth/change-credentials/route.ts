import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../../lib/rateLimit'
import { changeCredentialsSchema } from '../../../../lib/schemas'
import { badRequest, parseSchema, requireUser, tooManyRequests, withErrorHandler } from '../../../../lib/apiHandler'
import {
  getAdminByUsername,
  updatePassword,
  updateUsername,
  UsernameTakenError,
} from '../../../../lib/auth/adminAccount'
import { verifyPassword } from '../../../../lib/auth/password'

const isRateLimited = rateLimit({ name: 'change-credentials', maxAttempts: 10, windowMs: 15 * 60 * 1000 })

export const POST = withErrorHandler('POST /api/auth/change-credentials', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (await isRateLimited(`${user.sub}:${ip}`)) {
    return tooManyRequests('Muitas tentativas. Tente novamente em 15 minutos.')
  }

  const body = await request.json().catch(() => null)
  if (!body) return badRequest('Requisição inválida')

  const data = parseSchema(changeCredentialsSchema, body)
  if (data instanceof NextResponse) return data

  const account = await getAdminByUsername(String(user.sub))
  if (!account) {
    // The token is valid but the account it points to no longer exists (e.g.
    // it was renamed in another session). Force a fresh login.
    return NextResponse.json({ error: 'Sessão inválida. Faça login novamente.' }, { status: 401 })
  }

  const currentOk = await verifyPassword(data.senhaAtual, account.passwordHash)
  if (!currentOk) {
    return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 401 })
  }

  if (data.novoUsuario && data.novoUsuario !== account.username) {
    try {
      await updateUsername(account.id, data.novoUsuario)
    } catch (err) {
      if (err instanceof UsernameTakenError) {
        return NextResponse.json({ error: 'Esse usuário já está em uso' }, { status: 409 })
      }
      throw err
    }
  }

  if (data.novaSenha) {
    await updatePassword(account.id, data.novaSenha)
  }

  return NextResponse.json({ message: 'Credenciais atualizadas com sucesso' })
})
