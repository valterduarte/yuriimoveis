import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from './requireAuth'
import type { JwtPayload } from 'jsonwebtoken'
import type { ZodType } from 'zod'

export const unauthorized      = () => NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
export const badRequest        = (message: string) => NextResponse.json({ error: message }, { status: 400 })
export const notFoundJson      = (message = 'Não encontrado') => NextResponse.json({ error: message }, { status: 404 })
export const tooManyRequests   = (message: string) => NextResponse.json({ error: message }, { status: 429 })

export function serverError(name: string, err: unknown): NextResponse {
  console.error(`${name} error:`, err)
  return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
}

export function requireUser(request: NextRequest): JwtPayload | NextResponse {
  return requireAuth(request) ?? unauthorized()
}

export function parseSchema<T>(schema: ZodType<T>, body: unknown): T | NextResponse {
  const parsed = schema.safeParse(body)
  if (parsed.success) return parsed.data
  return badRequest(parsed.error.issues[0].message)
}

type RouteHandler<Args extends unknown[]> = (...args: Args) => Promise<NextResponse> | NextResponse

export function withErrorHandler<Args extends unknown[]>(
  name: string,
  handler: RouteHandler<Args>,
): (...args: Args) => Promise<NextResponse> {
  return async (...args) => {
    try {
      return await handler(...args)
    } catch (err) {
      return serverError(name, err)
    }
  }
}
