/**
 * Renderiza o feed XML no padrão VRSync (Grupo OLX — ZAP / Viva Real / OLX) a
 * partir dos imóveis. Função pura: recebe imóveis já carregados e devolve a
 * string XML. Não acessa banco, rede nem os campos sensíveis (torre,
 * numero_apartamento, observacoes) — só lê campos públicos de `Imovel`.
 *
 * Estrutura de referência:
 * https://developers.grupozap.com/feeds/vrsync/examples.html
 */
import { BROKER_NAME, BROKER_EMAIL, PHONE_STRUCTURED, SITE_URL } from '../config'
import { mapCategoria, mapTransactionType, mapFeatures } from './vrsyncMapping'
import type { Imovel } from '../../types'

const VRSYNC_NS = 'http://www.vivareal.com/schemas/1.0/VRSync'
const VRSYNC_XSD = 'http://xml.vivareal.com/vrsync.xsd'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Envolve em CDATA, neutralizando qualquer `]]>` interno. */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

/** PublishDate no formato do VRSync: 2018-05-29T17:47:57 (sem milissegundos/timezone). */
function formatPublishDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, '')
}

function clampTitle(imovel: Imovel): string {
  let title = imovel.titulo.trim()
  if (title.length < 10) title = `${title} em ${imovel.bairro}, ${imovel.cidade}`.trim()
  if (title.length < 10) title = title.padEnd(10, '.')
  return title.slice(0, 100)
}

function clampDescription(imovel: Imovel): string {
  let text = stripHtml(imovel.descricao || imovel.descricao_seo || imovel.titulo)
  if (text.length < 50) {
    text = `${text} — ${imovel.titulo} em ${imovel.bairro}, ${imovel.cidade}. Fale com o corretor.`.trim()
  }
  if (text.length < 50) text = text.padEnd(50, '.')
  return text.slice(0, 3000)
}

function priceElement(imovel: Imovel): string {
  const value = Math.round(imovel.preco)
  return imovel.tipo === 'aluguel'
    ? `<RentalPrice currency="BRL" period="Monthly">${value}</RentalPrice>`
    : `<ListPrice currency="BRL">${value}</ListPrice>`
}

function detailsBlock(imovel: Imovel): string {
  const { propertyType, usageType, areaField } = mapCategoria(imovel.categoria)
  const area = Math.round(imovel.area)
  const parts: string[] = [
    `<Description>${cdata(clampDescription(imovel))}</Description>`,
    priceElement(imovel),
    `<PropertyType>${escapeXml(propertyType)}</PropertyType>`,
    `<UsageType>${usageType}</UsageType>`,
  ]
  if (area > 0) parts.push(`<${areaField} unit="square metres">${area}</${areaField}>`)
  if (imovel.quartos > 0) parts.push(`<Bedrooms>${imovel.quartos}</Bedrooms>`)
  if (imovel.banheiros > 0) parts.push(`<Bathrooms>${imovel.banheiros}</Bathrooms>`)
  if (imovel.vagas > 0) parts.push(`<Garage>${imovel.vagas}</Garage>`)

  const features = mapFeatures(imovel.diferenciais)
  if (features.length > 0) {
    const items = features.map((f) => `<Feature>${escapeXml(f)}</Feature>`).join('')
    parts.push(`<Features>${items}</Features>`)
  }
  return `<Details>${parts.join('')}</Details>`
}

function locationBlock(imovel: Imovel): string {
  const estado = (imovel.estado || 'SP').trim()
  const parts: string[] = [
    `<Country abbreviation="BR">Brasil</Country>`,
    `<State abbreviation="${escapeXml(estado)}">${escapeXml(estado)}</State>`,
    `<City>${escapeXml(imovel.cidade)}</City>`,
    `<Neighborhood>${escapeXml(imovel.bairro)}</Neighborhood>`,
    `<Address>${escapeXml(imovel.endereco)}</Address>`,
  ]
  if (imovel.cep) parts.push(`<PostalCode>${escapeXml(imovel.cep)}</PostalCode>`)
  if (imovel.lat != null) parts.push(`<Latitude>${imovel.lat}</Latitude>`)
  if (imovel.lng != null) parts.push(`<Longitude>${imovel.lng}</Longitude>`)
  return `<Location displayAddress="Street">${parts.join('')}</Location>`
}

function contactBlock(): string {
  return (
    `<ContactInfo>` +
    `<Name>${escapeXml(BROKER_NAME)}</Name>` +
    `<Email>${escapeXml(BROKER_EMAIL)}</Email>` +
    `<Website>${escapeXml(SITE_URL)}</Website>` +
    `<Telephone>${escapeXml(PHONE_STRUCTURED)}</Telephone>` +
    `</ContactInfo>`
  )
}

function mediaBlock(imovel: Imovel): string {
  const items: string[] = imovel.imagens.map((url, i) =>
    i === 0
      ? `<Item medium="image" primary="true">${escapeXml(url)}</Item>`
      : `<Item medium="image">${escapeXml(url)}</Item>`,
  )
  if (imovel.video_url) items.push(`<Item medium="video">${escapeXml(imovel.video_url)}</Item>`)
  return `<Media>${items.join('')}</Media>`
}

function listingBlock(imovel: Imovel): string {
  return (
    `<Listing>` +
    `<ListingID>${escapeXml(String(imovel.id)).slice(0, 50)}</ListingID>` +
    `<Title>${escapeXml(clampTitle(imovel))}</Title>` +
    `<TransactionType>${mapTransactionType(imovel.tipo)}</TransactionType>` +
    detailsBlock(imovel) +
    locationBlock(imovel) +
    contactBlock() +
    mediaBlock(imovel) +
    `</Listing>`
  )
}

export function buildVrsyncFeed(imoveis: Imovel[], publishedAt: Date = new Date()): string {
  const header =
    `<Header>` +
    `<Provider>corretoryuri.com.br</Provider>` +
    `<Email>${escapeXml(BROKER_EMAIL)}</Email>` +
    `<ContactName>${escapeXml(BROKER_NAME)}</ContactName>` +
    `<PublishDate>${formatPublishDate(publishedAt)}</PublishDate>` +
    `<Telephone>${escapeXml(PHONE_STRUCTURED)}</Telephone>` +
    `</Header>`

  const listings = imoveis.map(listingBlock).join('')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<ListingDataFeed xmlns="${VRSYNC_NS}" ` +
    `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ` +
    `xsi:schemaLocation="${VRSYNC_NS} ${VRSYNC_XSD}">` +
    header +
    `<Listings>${listings}</Listings>` +
    `</ListingDataFeed>`
  )
}
