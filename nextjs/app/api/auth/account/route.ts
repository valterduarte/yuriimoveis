import { NextRequest, NextResponse } from 'next/server'
import { recoveryEmailSchema } from '../../../../lib/schemas'
import { badRequest, parseSchema, requireUser, withErrorHandler } from '../../../../lib/apiHandler'
import { getAdminByUsername, updateRecoveryEmail } from '../../../../lib/auth/adminAccount'
import { PRIVATE_NO_STORE } from '../../../../lib/cacheHeaders'

const sessionExpired = () =>
  NextResponse.json({ error: 'Sessão inválida. Faça login novamente.' }, { status: 401 })

export const GET = withErrorHandler('GET /api/auth/account', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const account = await getAdminByUsername(String(user.sub))
  if (!account) return sessionExpired()

  return NextResponse.json(
    { username: account.username, recoveryEmail: account.recoveryEmail },
    { headers: PRIVATE_NO_STORE },
  )
})

export const PUT = withErrorHandler('PUT /api/auth/account', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const body = await request.json().catch(() => null)
  if (!body) return badRequest('Requisição inválida')

  const data = parseSchema(recoveryEmailSchema, body)
  if (data instanceof NextResponse) return data

  const account = await getAdminByUsername(String(user.sub))
  if (!account) return sessionExpired()

  await updateRecoveryEmail(account.id, data.email)
  return NextResponse.json({ message: 'E-mail de recuperação atualizado' })
})
