import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../lib/db'
import { blogPostCreateSchema } from '../../../lib/schemas'
import { CACHE_TAG_BLOG } from '../../../lib/api'
import { badRequest, parseSchema, requireUser, withErrorHandler } from '../../../lib/apiHandler'

export const GET = withErrorHandler('GET /api/blog', async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const all = searchParams.get('todos') === 'true'
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)))
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const offset = (page - 1) * limit

  const where = all ? '' : 'WHERE publicado = true'
  const result = await getDb().query(
    `SELECT *, COUNT(*) OVER() as total FROM blog_posts ${where} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  )

  const total = result.rows.length > 0 ? parseInt(result.rows[0].total) : 0
  const posts = result.rows.map((row: Record<string, unknown> & { total: string; tags: string }) => {
    const { total: _total, ...rest } = row
    return { ...rest, tags: JSON.parse(rest.tags || '[]') }
  })

  return NextResponse.json({ posts, total, page, limit, pages: Math.ceil(total / limit) }, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  })
})

export const POST = withErrorHandler('POST /api/blog', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const data = parseSchema(blogPostCreateSchema, await request.json())
  if (data instanceof NextResponse) return data

  const existing = await getDb().query('SELECT id FROM blog_posts WHERE slug = $1', [data.slug])
  if (existing.rows.length > 0) {
    return badRequest('Slug já existe. Escolha outro.')
  }

  const result = await getDb().query(`
    INSERT INTO blog_posts (titulo, slug, resumo, conteudo, imagem_capa, meta_titulo, meta_descricao, tags, publicado)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id
  `, [data.titulo, data.slug, data.resumo, data.conteudo, data.imagem_capa, data.meta_titulo, data.meta_descricao, JSON.stringify(data.tags), data.publicado])

  revalidateTag(CACHE_TAG_BLOG)
  return NextResponse.json({ id: result.rows[0].id, message: 'Post criado com sucesso' }, { status: 201 })
})
