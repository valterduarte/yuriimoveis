import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../../../lib/requireAuth'
import { fetchNavigationMatrix } from '../../../../lib/api'
import { BAIRROS } from '../../../../data/bairros'
import { bairroDbNameToSlug } from '../../../../lib/navigation'

type AuditStatus = 'ok' | 'weak' | 'broken'

interface AuditRow {
  bairro: string
  cidade: string
  slug: string
  count: number
  configured: boolean
  status: AuditStatus
}

const THRESHOLD_MIN_COUNT = 3

export async function GET(request: NextRequest) {
  const user = requireAuth(request)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const matrix = await fetchNavigationMatrix()

    const configuredSlugs = new Set(Object.values(BAIRROS).map(b => b.slug))

    const aggregated = new Map<string, AuditRow>()
    for (const row of matrix) {
      const slug = bairroDbNameToSlug(row.bairro)
      const key = `${row.cidade}|${slug}`
      const existing = aggregated.get(key)
      const count = (existing?.count ?? 0) + row.count
      aggregated.set(key, {
        bairro: row.bairro,
        cidade: row.cidade,
        slug,
        count,
        configured: configuredSlugs.has(slug),
        status: 'ok',
      })
    }

    const rows = Array.from(aggregated.values()).map<AuditRow>(r => {
      let status: AuditStatus = 'ok'
      if (!r.configured && r.count >= THRESHOLD_MIN_COUNT) status = 'weak'
      else if (!r.configured && r.count < THRESHOLD_MIN_COUNT) status = 'broken'
      return { ...r, status }
    })

    rows.sort((a, b) => {
      const order = { broken: 0, weak: 1, ok: 2 } as const
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
      return b.count - a.count
    })

    const summary = {
      total: rows.length,
      ok: rows.filter(r => r.status === 'ok').length,
      weak: rows.filter(r => r.status === 'weak').length,
      broken: rows.filter(r => r.status === 'broken').length,
    }

    return NextResponse.json({ summary, rows }, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (err) {
    console.error('GET /api/admin/bairros-audit error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
