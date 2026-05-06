import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../../../lib/requireAuth'
import { fetchDistinctBairros, fetchDistinctCidades } from '../../../../lib/api'

export async function GET(request: NextRequest) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const [bairros, cidades] = await Promise.all([
      fetchDistinctBairros(),
      fetchDistinctCidades(),
    ])
    return NextResponse.json({ bairros, cidades }, {
      headers: { 'Cache-Control': 'private, max-age=60' },
    })
  } catch (err) {
    console.error('GET /api/admin/bairros error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
