import { imovelSlug } from '../../utils/imovelUtils'
import { SITE_URL, OG_DEFAULT_IMAGE } from '../config'
import { AGENT_ID } from './ids'
import type { Imovel } from '../../types'

export function buildPropertyProduct(imovel: Imovel): Record<string, unknown> {
  const slug = imovelSlug(imovel)
  const url = `${SITE_URL}/imoveis/${slug}`
  const image = imovel.imagens?.[0] || OG_DEFAULT_IMAGE
  const businessFunction = imovel.tipo === 'venda'
    ? 'https://schema.org/Sell'
    : 'https://schema.org/LeaseOut'

  const additionalProperty: Record<string, unknown>[] = []
  if (imovel.quartos   > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Dormitórios', value: imovel.quartos })
  if (imovel.banheiros > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Banheiros',   value: imovel.banheiros })
  if (imovel.vagas     > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Vagas',       value: imovel.vagas })
  if (imovel.area      > 0) additionalProperty.push({ '@type': 'PropertyValue', name: 'Área',        value: imovel.area, unitCode: 'MTK' })

  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: imovel.titulo,
    description: imovel.descricao_seo || imovel.descricao || imovel.titulo,
    image,
    url,
    category: 'Imóvel',
    brand: { '@id': AGENT_ID },
    offers: {
      '@type': 'Offer',
      price: imovel.preco,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      businessFunction,
      url,
      seller: { '@id': AGENT_ID },
    },
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  }
}
