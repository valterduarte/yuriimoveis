import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'
import { contatoSchema } from '../../../lib/schemas'
import { rateLimit } from '../../../lib/rateLimit'
import { parseSchema, requireUser, tooManyRequests, withErrorHandler } from '../../../lib/apiHandler'

const isRateLimited = rateLimit({ name: 'contato', maxAttempts: 5, windowMs: 15 * 60 * 1000 })

export const POST = withErrorHandler('POST /api/contato', async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return tooManyRequests('Muitas mensagens enviadas. Tente novamente em 15 minutos.')
  }

  const data = parseSchema(contatoSchema, await request.json())
  if (data instanceof NextResponse) return data
  const { nome, email, telefone, assunto, mensagem, imovel_id } = data

  const result = await getDb().query(`
    INSERT INTO contatos (nome, email, telefone, assunto, mensagem, imovel_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `, [nome, email, telefone, assunto, mensagem, imovel_id ?? null])

  return NextResponse.json(
    { id: result.rows[0].id, message: 'Mensagem enviada com sucesso!' },
    { status: 201 }
  )
})

export const GET = withErrorHandler('GET /api/contato', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const { searchParams } = new URL(request.url)
  const page  = Math.max(1, Number(searchParams.get('page'))  || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20))
  const offset = (page - 1) * limit

  const countResult = await getDb().query('SELECT COUNT(*) as total FROM contatos')
  const total = parseInt(countResult.rows[0].total)

  const result = await getDb().query(
    'SELECT * FROM contatos ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  )

  return NextResponse.json({
    contatos: result.rows,
    total, page, limit,
    pages: Math.ceil(total / limit),
  })
})
