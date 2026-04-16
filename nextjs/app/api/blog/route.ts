import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../lib/db'
import { requireAuth } from '../../../lib/requireAuth'
import { blogPostCreateSchema } from '../../../lib/schemas'
import { CACHE_TAG_BLOG } from '../../../lib/api'

export async function GET(request: NextRequest) {
  try {
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
  } catch (err) {
    console.error('GET /api/blog error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = blogPostCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const d = parsed.data

  try {
    const existing = await getDb().query('SELECT id FROM blog_posts WHERE slug = $1', [d.slug])
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Slug já existe. Escolha outro.' }, { status: 409 })
    }

    const result = await getDb().query(`
      INSERT INTO blog_posts (titulo, slug, resumo, conteudo, imagem_capa, meta_titulo, meta_descricao, tags, publicado)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `, [d.titulo, d.slug, d.resumo, d.conteudo, d.imagem_capa, d.meta_titulo, d.meta_descricao, JSON.stringify(d.tags), d.publicado])

    revalidateTag(CACHE_TAG_BLOG)
    return NextResponse.json({ id: result.rows[0].id, message: 'Post criado com sucesso' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/blog error:', err)
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
  }
}
