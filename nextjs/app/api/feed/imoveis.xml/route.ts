import { NextResponse } from 'next/server'
import { fetchSyndicatableProperties } from '../../../../lib/properties'
import { buildVrsyncFeed } from '../../../../lib/portalFeed/vrsyncFeed'
import { publicCacheHeaders } from '../../../../lib/cacheHeaders'
import { withErrorHandler } from '../../../../lib/apiHandler'

/**
 * Feed VRSync (Grupo OLX — ZAP / Viva Real / OLX) com os imóveis ativos e
 * marcados para sindicação. Registre esta URL no Canal Pro do portal; ele varre
 * o feed periodicamente e cria/atualiza/remove os anúncios.
 *
 * Frescor dos dados vem de `fetchSyndicatableProperties`, cacheado com a tag
 * `CACHE_TAG_IMOVEIS` — logo, criar/editar/excluir imóvel já invalida o feed via
 * o `revalidateTag(CACHE_TAG_IMOVEIS)` que as rotas de escrita disparam.
 */
export const GET = withErrorHandler('GET /api/feed/imoveis.xml', async () => {
  const imoveis = await fetchSyndicatableProperties()
  const xml = buildVrsyncFeed(imoveis)

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      ...publicCacheHeaders({ browserMaxAge: 300, cdnMaxAge: 300, swr: 600 }),
    },
  })
})
