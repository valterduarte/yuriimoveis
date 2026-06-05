import { SITE_URL } from '../config'
import { imovelSlug, slugify, deriveVideoPoster } from '../../utils/imovelUtils'
import { AGENT_ID } from './ids'
import type { Imovel } from '../../types'

interface Empreendimento {
  nome: string
  totalUnidades: number
}

export interface RealEstateListingInput {
  imovel: Imovel
  description: string
  images: string[]
  empreendimento?: Empreendimento | null
}

export function buildRealEstateListingSchema({
  imovel,
  description,
  images,
  empreendimento,
}: RealEstateListingInput): Record<string, unknown> {
  const url = `${SITE_URL}/imoveis/${imovelSlug(imovel)}`
  const businessFunction = imovel.tipo === 'aluguel'
    ? 'http://purl.org/goodrelations/v1#LeaseOut'
    : 'http://purl.org/goodrelations/v1#Sell'

  const poster = imovel.video_url ? deriveVideoPoster(imovel.video_url) : ''
  const video = imovel.video_url && poster
    ? {
        video: {
          '@type': 'VideoObject',
          name: imovel.titulo,
          description,
          thumbnailUrl: poster,
          contentUrl: imovel.video_url,
          uploadDate: imovel.created_at
            ? new Date(imovel.created_at).toISOString().split('T')[0]
            : undefined,
        },
      }
    : {}

  const isPartOf = empreendimento
    ? {
        isPartOf: {
          '@type': 'ApartmentComplex',
          '@id': `${SITE_URL}/empreendimentos/${slugify(empreendimento.nome)}#complex`,
          name: empreendimento.nome,
          numberOfAccommodationUnits: empreendimento.totalUnidades,
          address: {
            '@type': 'PostalAddress',
            streetAddress: imovel.endereco || undefined,
            addressLocality: imovel.cidade || 'Osasco',
            addressRegion: 'SP',
            addressCountry: 'BR',
          },
        },
      }
    : {}

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    name: imovel.titulo,
    description,
    image: images,
    url,
    sku: empreendimento ? `${slugify(empreendimento.nome)}-${imovel.id}` : String(imovel.id),
    ...video,
    ...isPartOf,
    datePosted:   imovel.created_at ? new Date(imovel.created_at).toISOString().split('T')[0] : undefined,
    dateModified: imovel.updated_at ? new Date(imovel.updated_at).toISOString().split('T')[0] : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: imovel.endereco || undefined,
      addressLocality: imovel.cidade || 'Osasco',
      addressRegion: 'SP',
      postalCode: imovel.cep || undefined,
      addressCountry: 'BR',
    },
    ...(imovel.lat && imovel.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: imovel.lat, longitude: imovel.lng } }
      : {}),
    numberOfBedrooms:       imovel.quartos   || undefined,
    numberOfBathroomsTotal: imovel.banheiros || undefined,
    numberOfRooms:          imovel.quartos   || undefined,
    floorSize: imovel.area
      ? { '@type': 'QuantitativeValue', value: imovel.area, unitCode: 'MTK' }
      : undefined,
    ...(imovel.vagas
      ? {
          amenityFeature: {
            '@type': 'LocationFeatureSpecification',
            name: 'Vagas de garagem',
            value: imovel.vagas,
          },
        }
      : {}),
    ...(imovel.diferenciais?.length
      ? {
          additionalProperty: imovel.diferenciais.map(d => ({
            '@type': 'PropertyValue',
            name: d,
          })),
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: imovel.preco,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      businessFunction,
      seller: { '@id': AGENT_ID },
    },
  }
}
