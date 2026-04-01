import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'
import { requireAuth } from '../../../lib/requireAuth'
import { contatoSchema } from '../../../lib/schemas'

export async function POST(request) {
  const body = await request.json()
  const parsed = contatoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const { nome, email, telefone, assunto, mensagem, imovel_id } = parsed.data

  try {
    const result = await getDb().query(`
      INSERT INTO contatos (nome, email, telefone, assunto, mensagem, imovel_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [nome, email, telefone, assunto, mensagem, imovel_id ?? null])

    return NextResponse.json(
      { id: result.rows[0].id, message: 'Mensagem enviada com sucesso!' },
      { status: 201 }
    )
  } catch (err) {
    console.error('POST /api/contato error:', err)
    return NextResponse.json({ error: 'Erro ao processar mensagem' }, { status: 500 })
  }
}

export async function GET(request) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page  = Math.max(1, Number(searchParams.get('page'))  || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20))
  const offset = (page - 1) * limit

  try {
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
  } catch (err) {
    console.error('GET /api/contato error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
