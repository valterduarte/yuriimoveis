import { describe, it, expect } from 'vitest'
import { buildPageMetadata, buildListingMetadata, SITE_NAME } from './seo'
import { OG_DEFAULT_IMAGE } from './config'

describe('buildPageMetadata', () => {
  it('builds website metadata with sensible defaults', () => {
    const meta = buildPageMetadata({
      title: 'Imóveis em Osasco',
      description: 'Encontre seu imóvel',
      url: 'https://corretoryuri.com.br/imoveis',
    })

    expect(meta.title).toBe('Imóveis em Osasco')
    expect(meta.description).toBe('Encontre seu imóvel')
    expect(meta.alternates).toEqual({ canonical: 'https://corretoryuri.com.br/imoveis' })
    expect(meta.robots).toBeUndefined()
    expect(meta.openGraph).toMatchObject({
      title: 'Imóveis em Osasco',
      description: 'Encontre seu imóvel',
      url: 'https://corretoryuri.com.br/imoveis',
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
    })
    expect(meta.openGraph?.images).toEqual([
      { url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Imóveis em Osasco' },
    ])
    expect(meta.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Imóveis em Osasco',
      description: 'Encontre seu imóvel',
      images: [OG_DEFAULT_IMAGE],
    })
  })

  it('accepts an absolute title and derives OG alt from its text', () => {
    const meta = buildPageMetadata({
      title: { absolute: 'Título Cru' },
      description: 'desc',
      url: 'https://corretoryuri.com.br/x',
    })

    expect(meta.title).toEqual({ absolute: 'Título Cru' })
    expect(meta.openGraph?.title).toBe('Título Cru')
    expect(meta.openGraph?.images).toEqual([
      { url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Título Cru' },
    ])
  })

  it('emits article OG fields with publish/modify timestamps', () => {
    const meta = buildPageMetadata({
      title: 'Post',
      description: 'desc',
      url: 'https://corretoryuri.com.br/blog/post',
      type: 'article',
      publishedTime: '2026-01-01T00:00:00Z',
      modifiedTime: '2026-02-01T00:00:00Z',
    })

    const og = meta.openGraph as Record<string, unknown>
    expect(og.type).toBe('article')
    expect(og.publishedTime).toBe('2026-01-01T00:00:00Z')
    expect(og.modifiedTime).toBe('2026-02-01T00:00:00Z')
  })

  it('omits article timestamps when not provided', () => {
    const meta = buildPageMetadata({
      title: 'Post',
      description: 'desc',
      url: 'https://corretoryuri.com.br/blog/post',
      type: 'article',
    })

    const og = meta.openGraph as Record<string, unknown>
    expect(og.type).toBe('article')
    expect(og).not.toHaveProperty('publishedTime')
    expect(og).not.toHaveProperty('modifiedTime')
  })

  it('prefers social overrides for OG and Twitter, leaving page title/description intact', () => {
    const meta = buildPageMetadata({
      title: 'Page Title',
      description: 'Page description',
      url: 'https://corretoryuri.com.br/x',
      socialTitle: 'Social Title',
      socialDescription: 'Social description',
    })

    expect(meta.title).toBe('Page Title')
    expect(meta.description).toBe('Page description')
    expect(meta.openGraph?.title).toBe('Social Title')
    expect(meta.openGraph?.description).toBe('Social description')
    expect(meta.twitter).toMatchObject({
      title: 'Social Title',
      description: 'Social description',
    })
  })

  it('honours custom image, dimensions, alt and keywords', () => {
    const meta = buildPageMetadata({
      title: 'T',
      description: 'd',
      url: 'https://corretoryuri.com.br/x',
      ogImage: 'https://example.com/img.jpg',
      ogImageAlt: 'Alt text',
      ogImageWidth: 800,
      ogImageHeight: 800,
      keywords: 'imóveis, osasco',
    })

    expect(meta.keywords).toBe('imóveis, osasco')
    expect(meta.openGraph?.images).toEqual([
      { url: 'https://example.com/img.jpg', width: 800, height: 800, alt: 'Alt text' },
    ])
    expect(meta.twitter).toMatchObject({ images: ['https://example.com/img.jpg'] })
  })

  it('sets a noindex robots directive that still allows following links', () => {
    const meta = buildPageMetadata({
      title: 'T',
      description: 'd',
      url: 'https://corretoryuri.com.br/x',
      noindex: true,
    })

    expect(meta.robots).toEqual({ index: false, follow: true })
  })
})

describe('buildListingMetadata', () => {
  it('delegates to buildPageMetadata producing website metadata', () => {
    const meta = buildListingMetadata({
      title: 'Apartamentos à venda',
      description: 'Lista de imóveis',
      url: 'https://corretoryuri.com.br/comprar/osasco',
    })

    expect((meta.openGraph as Record<string, unknown>).type).toBe('website')
    expect(meta.alternates).toEqual({ canonical: 'https://corretoryuri.com.br/comprar/osasco' })
    expect(meta.openGraph?.images).toEqual([
      { url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Apartamentos à venda' },
    ])
  })
})
