import { describe, it, expect } from 'vitest'
import { buildVrsyncFeed } from './vrsyncFeed'
import type { Imovel } from '../../types'

const base: Imovel = {
  id: 42,
  titulo: 'Apartamento com 2 quartos no Centro',
  descricao: 'a'.repeat(60),
  descricao_seo: '',
  tipo: 'venda',
  categoria: 'apartamento',
  preco: 350000,
  area: 68,
  quartos: 2,
  banheiros: 1,
  vagas: 1,
  endereco: 'Rua das Flores',
  bairro: 'Centro',
  cidade: 'Osasco',
  cep: '06010-000',
  status: 'pronto',
  destaque: false,
  ativo: true,
  imagens: ['https://img/1.jpg', 'https://img/2.jpg'],
  diferenciais: ['Piscina'],
  parcela_display: '',
  parcela_label: '',
  created_at: '',
  updated_at: '',
  estado: 'SP',
  lat: -23.5,
  lng: -46.7,
  video_url: null,
}

describe('buildVrsyncFeed', () => {
  it('wraps listings in a namespaced ListingDataFeed with a Header', () => {
    const xml = buildVrsyncFeed([base], new Date('2026-07-02T10:00:00Z'))
    expect(xml).toContain('<ListingDataFeed')
    expect(xml).toContain('http://www.vivareal.com/schemas/1.0/VRSync')
    expect(xml).toContain('<Email>valter.rduarte@gmail.com</Email>')
    expect(xml).toContain('<PublishDate>2026-07-02T10:00:00</PublishDate>')
  })

  it('renders a For Sale listing with ListPrice and PropertyType', () => {
    const xml = buildVrsyncFeed([base])
    expect(xml).toContain('<ListingID>42</ListingID>')
    expect(xml).toContain('<TransactionType>For Sale</TransactionType>')
    expect(xml).toContain('<ListPrice currency="BRL">350000</ListPrice>')
    expect(xml).toContain('<PropertyType>Residential / Apartment</PropertyType>')
    expect(xml).toContain('<LivingArea unit="square metres">68</LivingArea>')
    expect(xml).toContain('<Bedrooms>2</Bedrooms>')
    expect(xml).toContain('<Feature>Pool</Feature>')
  })

  it('uses RentalPrice for rentals', () => {
    const xml = buildVrsyncFeed([{ ...base, tipo: 'aluguel' }])
    expect(xml).toContain('<TransactionType>For Rent</TransactionType>')
    expect(xml).toContain('<RentalPrice currency="BRL" period="Monthly">350000</RentalPrice>')
    expect(xml).not.toContain('<ListPrice')
  })

  it('uses LotArea for land and farm categories', () => {
    const xml = buildVrsyncFeed([{ ...base, categoria: 'terreno' }])
    expect(xml).toContain('<LotArea unit="square metres">68</LotArea>')
    expect(xml).not.toContain('<LivingArea')
  })

  it('marks the first image primary and appends video items', () => {
    const xml = buildVrsyncFeed([{ ...base, video_url: 'https://youtu.be/x' }])
    expect(xml).toContain('<Item medium="image" primary="true">https://img/1.jpg</Item>')
    expect(xml).toContain('<Item medium="image">https://img/2.jpg</Item>')
    expect(xml).toContain('<Item medium="video">https://youtu.be/x</Item>')
  })

  it('escapes XML-special characters in text', () => {
    const xml = buildVrsyncFeed([{ ...base, bairro: 'Vila A & B' }])
    expect(xml).toContain('<Neighborhood>Vila A &amp; B</Neighborhood>')
  })

  it('omits Bedrooms/Bathrooms/Garage when zero', () => {
    const xml = buildVrsyncFeed([{ ...base, quartos: 0, banheiros: 0, vagas: 0 }])
    expect(xml).not.toContain('<Bedrooms>')
    expect(xml).not.toContain('<Bathrooms>')
    expect(xml).not.toContain('<Garage>')
  })

  it('clamps a too-short title to at least 10 chars', () => {
    const xml = buildVrsyncFeed([{ ...base, titulo: 'Casa' }])
    expect(xml).toMatch(/<Title>[\s\S]{10,100}<\/Title>/)
  })

  it('pads a too-short description to the 50-char minimum', () => {
    const xml = buildVrsyncFeed([{ ...base, descricao: 'Casa boa' }])
    const match = xml.match(/<Description><!\[CDATA\[([\s\S]*?)\]\]><\/Description>/)
    expect(match).not.toBeNull()
    expect((match as RegExpMatchArray)[1].length).toBeGreaterThanOrEqual(50)
  })

  it('never leaks sensitive fields even if present on the row', () => {
    const withSensitive = {
      ...base,
      torre: 'Torre A',
      numero_apartamento: '142',
      observacoes: 'chave na portaria',
    } as Imovel
    const xml = buildVrsyncFeed([withSensitive])
    expect(xml).not.toContain('Torre A')
    expect(xml).not.toContain('142')
    expect(xml).not.toContain('chave na portaria')
  })
})
