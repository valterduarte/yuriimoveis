import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getDb } from '../../../lib/db'
import { requireAuth } from '../../../lib/requireAuth'
import { imovelCreateSchema } from '../../../lib/schemas'
import { fetchProperties, CACHE_TAG_IMOVEIS } from '../../../lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = Object.fromEntries(searchParams)
    const result = await fetchProperties(filters)

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    })
  } catch (err) {
    console.error('GET /api/imoveis error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = imovelCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const d = parsed.data

  try {
    const result = await getDb().query(`
      INSERT INTO imoveis (titulo, descricao, descricao_seo, tipo, categoria, preco, area, quartos, banheiros, vagas, endereco, bairro, cidade, cep, destaque, imagens, diferenciais, status, area_display, vagas_display, parcela_display, parcela_label, lat, lng)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
      RETURNING id
    `, [
      d.titulo, d.descricao, d.descricao_seo, d.tipo, d.categoria, d.preco,
      d.area, d.quartos, d.banheiros, d.vagas,
      d.endereco, d.bairro, d.cidade, d.cep,
      d.destaque,
      JSON.stringify(d.imagens),
      JSON.stringify(d.diferenciais),
      d.status, d.area_display, d.vagas_display, d.parcela_display, d.parcela_label,
      d.lat ?? null, d.lng ?? null,
    ])
    revalidateTag(CACHE_TAG_IMOVEIS)
    return NextResponse.json({ id: result.rows[0].id, message: 'Imóvel criado com sucesso' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/imoveis error:', err)
    return NextResponse.json({ error: 'Erro ao criar imóvel' }, { status: 500 })
  }
}
