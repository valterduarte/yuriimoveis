import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../../lib/db'
import { imovelUpdateSchema } from '../../../../lib/schemas'
import { parseImovel, CACHE_TAG_IMOVEIS } from '../../../../lib/api'
import { notFoundJson, parseSchema, requireUser, withErrorHandler } from '../../../../lib/apiHandler'
import { requireAuth } from '../../../../lib/requireAuth'
import { publicCacheHeaders, PRIVATE_NO_STORE } from '../../../../lib/cacheHeaders'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withErrorHandler('GET /api/imoveis/[id]', async (request: NextRequest, { params }: RouteContext) => {
  const { id } = await params
  const result = await getDb().query(
    'SELECT * FROM imoveis WHERE id = $1 AND ativo = true',
    [id]
  )
  const row = result.rows[0]
  if (!row) return notFoundJson('Imóvel não encontrado')

  const imovel = parseImovel(row)

  // The authenticated admin (edit form) gets the sensitive unit fields back so
  // they can be edited; public callers never receive them. parseImovel already
  // strips them, so re-attach from the raw row here. Keep the admin copy uncached.
  if (requireAuth(request)) {
    return NextResponse.json(
      {
        ...imovel,
        torre: row.torre ?? '',
        numero_apartamento: row.numero_apartamento ?? '',
        observacoes: row.observacoes ?? '',
      },
      { headers: PRIVATE_NO_STORE },
    )
  }

  return NextResponse.json(imovel, {
    headers: publicCacheHeaders({ browserMaxAge: 300, cdnMaxAge: 300, swr: 600 }),
  })
})

export const PUT = withErrorHandler('PUT /api/imoveis/[id]', async (request: NextRequest, { params }: RouteContext) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const { id } = await params
  const data = parseSchema(imovelUpdateSchema, await request.json())
  if (data instanceof NextResponse) return data

  const existing = await getDb().query('SELECT id FROM imoveis WHERE id = $1', [id])
  if (!existing.rows[0]) return notFoundJson('Imóvel não encontrado')

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
      lat             = COALESCE($24, lat),
      lng             = COALESCE($25, lng),
      empreendimento  = COALESCE($26, empreendimento),
      video_url       = COALESCE($27, video_url),
      torre              = COALESCE($28, torre),
      numero_apartamento = COALESCE($29, numero_apartamento),
      observacoes        = COALESCE($30, observacoes),
      updated_at      = NOW()
    WHERE id = $31
  `, [
    data.titulo        ?? null,
    data.descricao     ?? null,
    data.descricao_seo ?? null,
    data.tipo          ?? null,
    data.categoria     ?? null,
    data.preco         ?? null,
    data.area          ?? null,
    data.quartos       ?? null,
    data.banheiros     ?? null,
    data.vagas         ?? null,
    data.endereco      ?? null,
    data.bairro        ?? null,
    data.cidade        ?? null,
    data.cep           ?? null,
    data.destaque      ?? null,
    data.imagens      ? JSON.stringify(data.imagens)      : null,
    data.diferenciais ? JSON.stringify(data.diferenciais) : null,
    data.ativo         ?? null,
    data.status        ?? null,
    data.area_display    ?? null,
    data.vagas_display   ?? null,
    data.parcela_display ?? null,
    data.parcela_label   ?? null,
    data.lat ?? null,
    data.lng ?? null,
    data.empreendimento === undefined ? null : data.empreendimento,
    data.video_url === undefined ? null : data.video_url,
    data.torre === undefined ? null : data.torre,
    data.numero_apartamento === undefined ? null : data.numero_apartamento,
    data.observacoes === undefined ? null : data.observacoes,
    id,
  ])

  revalidateTag(CACHE_TAG_IMOVEIS)
  return NextResponse.json({ message: 'Imóvel atualizado com sucesso' })
})

export const DELETE = withErrorHandler('DELETE /api/imoveis/[id]', async (request: NextRequest, { params }: RouteContext) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const { id } = await params
  const result = await getDb().query(
    'UPDATE imoveis SET ativo = false, updated_at = NOW() WHERE id = $1',
    [id]
  )
  if (result.rowCount === 0) return notFoundJson('Imóvel não encontrado')
  revalidateTag(CACHE_TAG_IMOVEIS)
  return NextResponse.json({ message: 'Imóvel removido com sucesso' })
})
