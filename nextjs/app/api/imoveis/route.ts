import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../lib/db'
import { imovelCreateSchema } from '../../../lib/schemas'
import { fetchProperties, CACHE_TAG_IMOVEIS } from '../../../lib/api'
import { parseSchema, requireUser, withErrorHandler } from '../../../lib/apiHandler'
import { publicCacheHeaders, PRIVATE_NO_STORE } from '../../../lib/cacheHeaders'

export const GET = withErrorHandler('GET /api/imoveis', async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const filters = Object.fromEntries(searchParams)

  if (filters.todos === 'true') {
    const user = requireUser(request)
    if (user instanceof NextResponse) return user
  }

  const result = await fetchProperties(filters)
  const isAdmin = filters.todos === 'true'
  const headers = isAdmin
    ? PRIVATE_NO_STORE
    : publicCacheHeaders({ browserMaxAge: 60, cdnMaxAge: 60, swr: 300 })

  return NextResponse.json(result, { headers })
})

export const POST = withErrorHandler('POST /api/imoveis', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const data = parseSchema(imovelCreateSchema, await request.json())
  if (data instanceof NextResponse) return data

  const result = await getDb().query(`
    INSERT INTO imoveis (titulo, descricao, descricao_seo, tipo, categoria, preco, area, quartos, banheiros, vagas, endereco, bairro, cidade, cep, destaque, imagens, diferenciais, status, area_display, vagas_display, parcela_display, parcela_label, lat, lng, empreendimento)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
    RETURNING id
  `, [
    data.titulo, data.descricao, data.descricao_seo, data.tipo, data.categoria, data.preco,
    data.area, data.quartos, data.banheiros, data.vagas,
    data.endereco, data.bairro, data.cidade, data.cep,
    data.destaque,
    JSON.stringify(data.imagens),
    JSON.stringify(data.diferenciais),
    data.status, data.area_display, data.vagas_display, data.parcela_display, data.parcela_label,
    data.lat ?? null, data.lng ?? null,
    data.empreendimento || null,
  ])
  revalidateTag(CACHE_TAG_IMOVEIS)
  return NextResponse.json({ id: result.rows[0].id, message: 'Imóvel criado com sucesso' }, { status: 201 })
})
