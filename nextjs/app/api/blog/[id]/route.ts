import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../../lib/db'
import { blogPostUpdateSchema } from '../../../../lib/schemas'
import { CACHE_TAG_BLOG } from '../../../../lib/api'
import { badRequest, notFoundJson, parseSchema, requireUser, withErrorHandler } from '../../../../lib/apiHandler'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withErrorHandler('GET /api/blog/[id]', async (_request: NextRequest, context: RouteContext) => {
  const { id } = await context.params
  const result = await getDb().query('SELECT * FROM blog_posts WHERE id = $1', [id])
  if (!result.rows[0]) return notFoundJson('Post não encontrado')
  const row = result.rows[0]
  return NextResponse.json({ ...row, tags: JSON.parse(row.tags || '[]') })
})

export const PUT = withErrorHandler('PUT /api/blog/[id]', async (request: NextRequest, context: RouteContext) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const { id } = await context.params
  const updates = parseSchema(blogPostUpdateSchema, await request.json())
  if (updates instanceof NextResponse) return updates

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

  if (fields.length === 0) return badRequest('Nenhum campo para atualizar')

  fields.push(`updated_at = NOW()`)

  const result = await getDb().query(
    `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id`,
    [...values, id]
  )
  if (!result.rows[0]) return notFoundJson('Post não encontrado')
  revalidateTag(CACHE_TAG_BLOG)
  return NextResponse.json({ message: 'Post atualizado com sucesso' })
})
