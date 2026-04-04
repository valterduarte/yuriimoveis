import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'
import { requireAuth } from '../../../lib/requireAuth'
import { imovelCreateSchema } from '../../../lib/schemas'
import { parseImovel } from '../../../lib/api'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const {
      tipo, categoria, cidade, bairro,
      precoMin, precoMax, quartos, destaque, todos,
      ordem = 'recente', page = '1', limit = '9',
    } = Object.fromEntries(searchParams)

    const conditions = todos === 'true' ? [] : ['ativo = true']
    const params = []
    let idx = 1

    if (tipo)     { conditions.push(`tipo = $${idx++}`);          params.push(tipo) }
    if (categoria){ conditions.push(`categoria = $${idx++}`);     params.push(categoria) }
    if (cidade)   { conditions.push(`cidade = $${idx++}`);        params.push(cidade) }
    if (bairro)   { conditions.push(`bairro ILIKE $${idx++}`);    params.push(`%${bairro}%`) }
    if (precoMin) { conditions.push(`preco >= $${idx++}`);        params.push(Number(precoMin)) }
    if (precoMax) { conditions.push(`preco <= $${idx++}`);        params.push(Number(precoMax)) }
    if (destaque) { conditions.push('destaque = true') }
    if (quartos) {
      if (quartos === '4+') {
        conditions.push('quartos >= 4')
      } else {
        conditions.push(`quartos >= $${idx++}`)
        params.push(Number(quartos))
      }
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderMap = {
      recente:     'created_at DESC',
      menor_preco: 'preco ASC',
      maior_preco: 'preco DESC',
      maior_area:  'area DESC',
    }
    const orderClause = `ORDER BY destaque DESC, ${orderMap[ordem] || orderMap.recente}`

    const pageNum  = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const offset   = (pageNum - 1) * limitNum

    const dataResult = await getDb().query(
      `SELECT *, COUNT(*) OVER() as total FROM imoveis ${whereClause} ${orderClause} LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limitNum, offset]
    )

    const total = dataResult.rows.length > 0 ? parseInt(dataResult.rows[0].total) : 0
    const imoveis = dataResult.rows.map(row => {
      const { total: _total, ...rest } = row
      return parseImovel(rest)
    })

    return NextResponse.json(
      { imoveis, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
      { headers: { 'Cache-Control': 'public, max-age=60' } }
    )
  } catch (err) {
    console.error('GET /api/imoveis error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request) {
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
      INSERT INTO imoveis (titulo, descricao, descricao_seo, tipo, categoria, preco, area, quartos, banheiros, vagas, endereco, bairro, cidade, cep, destaque, imagens, diferenciais, status, parcela_display, parcela_label)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING id
    `, [
      d.titulo, d.descricao, d.descricao_seo, d.tipo, d.categoria, d.preco,
      d.area, d.quartos, d.banheiros, d.vagas,
      d.endereco, d.bairro, d.cidade, d.cep,
      d.destaque,
      JSON.stringify(d.imagens),
      JSON.stringify(d.diferenciais),
      d.status, d.parcela_display, d.parcela_label,
    ])
    return NextResponse.json({ id: result.rows[0].id, message: 'Imóvel criado com sucesso' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/imoveis error:', err)
    return NextResponse.json({ error: 'Erro ao criar imóvel' }, { status: 500 })
  }
}
