import { NextResponse } from 'next/server'
import { fetchPropertiesForMap } from '../../../lib/api'
import { listEmpreendimentos } from '../../../lib/empreendimento'
import { imovelSlug } from '../../../utils/imovelUtils'
import { buildSearchTerms, type SearchItem } from '../../../lib/search'
import { withErrorHandler } from '../../../lib/apiHandler'
import { publicCacheHeaders } from '../../../lib/cacheHeaders'

/**
 * Lightweight search index for the site-wide menu search. Returns every active
 * empreendimento and listing as a flat list of {@link SearchItem}; the client
 * filters it in memory with the shared matcher, so there is no per-keystroke
 * request. Empreendimentos come first so a building name resolves to its hub.
 */
export const GET = withErrorHandler('GET /api/search', async () => {
  const [imoveis, empreendimentos] = await Promise.all([
    fetchPropertiesForMap(),
    listEmpreendimentos(),
  ])

  const items: SearchItem[] = [
    ...empreendimentos.map(emp => ({
      type: 'empreendimento' as const,
      label: emp.nome,
      sublabel: `Empreendimento · ${emp.bairro}, ${emp.cidade}`,
      url: `/empreendimentos/${emp.slug}`,
      terms: buildSearchTerms([emp.nome, emp.bairro, emp.cidade, emp.endereco]),
    })),
    ...imoveis.map(imovel => ({
      type: 'imovel' as const,
      label: imovel.titulo,
      sublabel: `${imovel.bairro}, ${imovel.cidade} · #${imovel.id}`,
      url: `/imoveis/${imovelSlug(imovel)}`,
      terms: buildSearchTerms([imovel.id, imovel.titulo, imovel.bairro, imovel.cidade, imovel.categoria]),
    })),
  ]

  return NextResponse.json(items, {
    headers: publicCacheHeaders({ browserMaxAge: 300, cdnMaxAge: 600, swr: 3600 }),
  })
})
