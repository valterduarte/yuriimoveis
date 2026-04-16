import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../../lib/db'
import { requireAuth } from '../../../../lib/requireAuth'
import { blogPostUpdateSchema } from '../../../../lib/schemas'
import { CACHE_TAG_BLOG } from '../../../../lib/api'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params
  try {
    const result = await getDb().query('SELECT * FROM blog_posts WHERE id = $1', [id])
    if (!result.rows[0]) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    const row = result.rows[0]
    return NextResponse.json({ ...row, tags: JSON.parse(row.tags || '[]') })
  } catch (err) {
    console.error('GET /api/blog/[id] error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await context.params
  const body = await request.json()
  const parsed = blogPostUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const updates = parsed.data
  const fields: string[] = []
  const values: unknown[] = []
  let idx = 1

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue
    if (key === 'tags') {
      fields.push(`${key} = $${idx++}`)
      values.push(JSON.stringify(value))
    } else {
      fields.push(`${key} = $${idx++}`)
      values.push(value)
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
  }

  fields.push(`updated_at = NOW()`)

  try {
    const result = await getDb().query(
      `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id`,
      [...values, id]
    )
    if (!result.rows[0]) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    revalidateTag(CACHE_TAG_BLOG)
    return NextResponse.json({ message: 'Post atualizado com sucesso' })
  } catch (err) {
    console.error('PUT /api/blog/[id] error:', err)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}
