import { describe, it, expect } from 'vitest'
import { SITE_URL } from '../config'
import { buildRealEstateListingSchema } from './realEstateListing'
import { AGENT_ID } from './ids'
import type { Imovel } from '../../types'

function makeImovel(over: Partial<Imovel> = {}): Imovel {
  return {
    id: 42,
    titulo: 'Casa na Vila Yara',
    descricao: 'descricao',
    descricao_seo: 'seo',
    tipo: 'venda',
    categoria: 'casa',
    preco: 850_000,
    area: 120,
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    endereco: 'Rua Exemplo, 100',
    bairro: 'Vila Yara',
    cidade: 'Osasco',
    cep: '06026-000',
    destaque: false,
    imagens: ['https://res.cloudinary.com/x/upload/img.jpg'],
    diferenciais: ['Piscina', 'Churrasqueira'],
    ativo: true,
    status: 'pronto',
    area_display: '',
    vagas_display: '',
    parcela_display: '',
    parcela_label: '',
    lat: -23.5,
    lng: -46.8,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-20T12:30:00Z',
    ...over,
  } as Imovel
}

describe('buildRealEstateListingSchema', () => {
  it('emits Schema.org context and type', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel(),
      description: 'd',
      images: ['x'],
    })
    expect(s['@context']).toBe('https://schema.org')
    expect(s['@type']).toBe('RealEstateListing')
  })

  it('builds url from SITE_URL + imovelSlug', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ id: 42, titulo: 'Casa na Vila Yara' }),
      description: 'd',
      images: ['x'],
    })
    expect(s.url).toBe(`${SITE_URL}/imoveis/casa-na-vila-yara-42`)
  })

  it('uses plain id as sku without empreendimento, prefixes with slug otherwise', () => {
    const base = { imovel: makeImovel({ id: 42 }), description: 'd', images: ['x'] }
    expect(buildRealEstateListingSchema(base).sku).toBe('42')
    expect(
      buildRealEstateListingSchema({ ...base, empreendimento: { nome: 'Edif Sol', totalUnidades: 12 } }).sku,
    ).toBe('edif-sol-42')
  })

  it('switches offers.businessFunction by tipo', () => {
    const sell = buildRealEstateListingSchema({ imovel: makeImovel({ tipo: 'venda' }), description: '', images: [] })
    const rent = buildRealEstateListingSchema({ imovel: makeImovel({ tipo: 'aluguel' }), description: '', images: [] })
    expect((sell.offers as Record<string, unknown>).businessFunction).toContain('Sell')
    expect((rent.offers as Record<string, unknown>).businessFunction).toContain('LeaseOut')
  })

  it('includes geo when lat and lng are set', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ lat: -23.5, lng: -46.8 }),
      description: '', images: [],
    })
    expect(s.geo).toEqual({ '@type': 'GeoCoordinates', latitude: -23.5, longitude: -46.8 })
  })

  it('omits geo when coords are missing', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ lat: undefined, lng: undefined }),
      description: '', images: [],
    })
    expect(s.geo).toBeUndefined()
  })

  it('includes isPartOf only with empreendimento', () => {
    const base = { imovel: makeImovel(), description: '', images: [] }
    expect(buildRealEstateListingSchema(base).isPartOf).toBeUndefined()
    const withE = buildRealEstateListingSchema({
      ...base,
      empreendimento: { nome: 'Edif Sol', totalUnidades: 12 },
    })
    expect((withE.isPartOf as Record<string, unknown>)['@type']).toBe('ApartmentComplex')
    expect((withE.isPartOf as Record<string, unknown>).numberOfAccommodationUnits).toBe(12)
  })

  it('emits additionalProperty for diferenciais', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ diferenciais: ['Piscina', 'Churrasqueira'] }),
      description: '', images: [],
    })
    expect(s.additionalProperty).toEqual([
      { '@type': 'PropertyValue', name: 'Piscina' },
      { '@type': 'PropertyValue', name: 'Churrasqueira' },
    ])
  })

  it('omits additionalProperty when diferenciais is empty', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ diferenciais: [] }),
      description: '', images: [],
    })
    expect(s.additionalProperty).toBeUndefined()
  })

  it('attaches seller via AGENT_ID', () => {
    const s = buildRealEstateListingSchema({ imovel: makeImovel(), description: '', images: [] })
    expect((s.offers as Record<string, unknown>).seller).toEqual({ '@id': AGENT_ID })
  })

  it('emits a VideoObject when the property has a video', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({
        video_url: 'https://res.cloudinary.com/x/video/upload/v1/tour.mp4',
        created_at: '2026-01-15T10:00:00Z',
      }),
      description: 'A lovely tour',
      images: ['x'],
    })
    const video = s.video as Record<string, unknown>
    expect(video['@type']).toBe('VideoObject')
    expect(video.contentUrl).toBe('https://res.cloudinary.com/x/video/upload/v1/tour.mp4')
    expect(video.thumbnailUrl).toBe('https://res.cloudinary.com/x/video/upload/v1/tour.jpg')
    expect(video.uploadDate).toBe('2026-01-15')
    expect(video.name).toBe(makeImovel().titulo)
  })

  it('omits video when the property has no video_url', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ video_url: null }),
      description: '', images: [],
    })
    expect(s.video).toBeUndefined()
  })

  it('omits video when the video_url is not a Cloudinary asset (no derivable poster)', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ video_url: 'https://example.com/tour.mp4' }),
      description: '', images: [],
    })
    expect(s.video).toBeUndefined()
  })

  it('formats dates as YYYY-MM-DD', () => {
    const s = buildRealEstateListingSchema({
      imovel: makeImovel({ created_at: '2026-01-15T10:00:00Z', updated_at: '2026-02-20T12:30:00Z' }),
      description: '', images: [],
    })
    expect(s.datePosted).toBe('2026-01-15')
    expect(s.dateModified).toBe('2026-02-20')
  })
})
