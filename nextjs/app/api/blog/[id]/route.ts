import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../../lib/db'
import { blogPostUpdateSchema } from '../../../../lib/schemas'
import { CACHE_TAG_BLOG } from '../../../../lib/api'
import { parseBlogTags } from '../../../../lib/blog'
import { badRequest, notFoundJson, parseSchema, requireUser, withErrorHandler } from '../../../../lib/apiHandler'

type RouteContext = { params: Promise<{ id: string }> }

const UPDATABLE_COLUMNS = [
  'titulo', 'slug', 'resumo', 'conteudo', 'imagem_capa',
  'meta_titulo', 'meta_descricao', 'tags', 'publicado',
] as const
type UpdatableColumn = typeof UPDATABLE_COLUMNS[number]

export const GET = withErrorHandler('GET /api/blog/[id]', async (_request: NextRequest, context: RouteContext) => {
  const { id } = await context.params
  const result = await getDb().query('SELECT * FROM blog_posts WHERE id = $1', [id])
  if (!result.rows[0]) return notFoundJson('Post não encontrado')
  const row = result.rows[0]
  return NextResponse.json({ ...row, tags: parseBlogTags(row.tags) })
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

  for (const column of UPDATABLE_COLUMNS) {
    const value = updates[column as UpdatableColumn]
    if (value === undefined) continue
    fields.push(`${column} = $${idx++}`)
    values.push(column === 'tags' ? JSON.stringify(value) : value)
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
