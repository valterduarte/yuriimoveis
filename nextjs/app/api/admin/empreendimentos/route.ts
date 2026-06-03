import { NextRequest, NextResponse } from 'next/server'
import { listEmpreendimentos } from '../../../../lib/empreendimento'
import { requireUser, withErrorHandler } from '../../../../lib/apiHandler'

/**
 * Distinct development names for the admin form autocomplete. Sourced from the
 * grouping output so it reflects exactly the buildings the site shows — letting
 * the admin pick an existing name instead of retyping it (and risking a variant).
 */
export const GET = withErrorHandler('GET /api/admin/empreendimentos', async (request: NextRequest) => {
  const user = requireUser(request)
  if (user instanceof NextResponse) return user

  const empreendimentos = await listEmpreendimentos()
  const nomes = [...new Set(empreendimentos.map(e => e.nome))].sort((a, b) => a.localeCompare(b, 'pt-BR'))

  return NextResponse.json({ nomes }, {
    headers: { 'Cache-Control': 'private, max-age=60' },
  })
})
