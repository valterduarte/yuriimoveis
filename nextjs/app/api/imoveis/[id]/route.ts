import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../../lib/db'
import { requireAuth } from '../../../../lib/requireAuth'
import { imovelUpdateSchema } from '../../../../lib/schemas'
import { parseImovel, CACHE_TAG_IMOVEIS } from '../../../../lib/api'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  try {
    const result = await getDb().query(
      'SELECT * FROM imoveis WHERE id = $1 AND ativo = true',
      [id]
    )
    if (!result.rows[0]) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }
    return NextResponse.json(parseImovel(result.rows[0]), {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  } catch (err) {
    console.error('GET /api/imoveis/[id] error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const parsed = imovelUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const d = parsed.data

  try {
    const existing = await getDb().query('SELECT id FROM imoveis WHERE id = $1', [id])
    if (!existing.rows[0]) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }

    await getDb().query(`
      UPDATE imoveis SET
        titulo          = COALESCE($1,  titulo),
        descricao       = COALESCE($2,  descricao),
        descricao_seo   = COALESCE($3,  descricao_seo),
        tipo            = COALESCE($4,  tipo),
        categoria       = COALESCE($5,  categoria),
        preco           = COALESCE($6,  preco),
        area            = COALESCE($7,  area),
        quartos         = COALESCE($8,  quartos),
        banheiros       = COALESCE($9,  banheiros),
        vagas           = COALESCE($10, vagas),
        endereco        = COALESCE($11, endereco),
        bairro          = COALESCE($12, bairro),
        cidade          = COALESCE($13, cidade),
        cep             = COALESCE($14, cep),
        destaque        = COALESCE($15, destaque),
        imagens         = COALESCE($16, imagens),
        diferenciais    = COALESCE($17, diferenciais),
        ativo           = COALESCE($18, ativo),
        status          = COALESCE($19, status),
        area_display    = COALESCE($20, area_display),
        vagas_display   = COALESCE($21, vagas_display),
        parcela_display = COALESCE($22, parcela_display),
        parcela_label   = COALESCE($23, parcela_label),
        updated_at      = NOW()
      WHERE id = $24
    `, [
      d.titulo        ?? null,
      d.descricao     ?? null,
      d.descricao_seo ?? null,
      d.tipo          ?? null,
      d.categoria     ?? null,
      d.preco         ?? null,
      d.area          ?? null,
      d.quartos       ?? null,
      d.banheiros     ?? null,
      d.vagas         ?? null,
      d.endereco      ?? null,
      d.bairro        ?? null,
      d.cidade        ?? null,
      d.cep           ?? null,
      d.destaque      ?? null,
      d.imagens      ? JSON.stringify(d.imagens)      : null,
      d.diferenciais ? JSON.stringify(d.diferenciais) : null,
      d.ativo         ?? null,
      d.status        ?? null,
      d.area_display    ?? null,
      d.vagas_display   ?? null,
      d.parcela_display ?? null,
      d.parcela_label   ?? null,
      id,
    ])

    revalidateTag(CACHE_TAG_IMOVEIS)
    return NextResponse.json({ message: 'Imóvel atualizado com sucesso' })
  } catch (err) {
    console.error('PUT /api/imoveis/[id] error:', err)
    return NextResponse.json({ error: 'Erro ao atualizar imóvel' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  try {
    const result = await getDb().query(
      'UPDATE imoveis SET ativo = false, updated_at = NOW() WHERE id = $1',
      [id]
    )
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 })
    }
    revalidateTag(CACHE_TAG_IMOVEIS)
    return NextResponse.json({ message: 'Imóvel removido com sucesso' })
  } catch (err) {
    console.error('DELETE /api/imoveis/[id] error:', err)
    return NextResponse.json({ error: 'Erro ao remover imóvel' }, { status: 500 })
  }
}
