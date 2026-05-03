import { describe, it, expect } from 'vitest'
import {
  imovelCreateSchema,
  imovelUpdateSchema,
  blogPostCreateSchema,
  blogPostUpdateSchema,
  contatoSchema,
} from './schemas'

const validImovelPayload = {
  titulo: 'Apartamento Tamboré 2 dorms',
  tipo: 'venda',
  categoria: 'apartamento',
  preco: 450000,
}

describe('imovelCreateSchema', () => {
  it('accepts a minimal payload with only the required fields', () => {
    const result = imovelCreateSchema.safeParse(validImovelPayload)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cidade).toBe('Osasco')          // default
      expect(result.data.status).toBe('pronto')           // default
      expect(result.data.destaque).toBe(false)            // default
      expect(result.data.imagens).toEqual([])             // default
    }
  })

  it('rejects a missing required field (titulo)', () => {
    const { titulo: _, ...rest } = validImovelPayload
    const result = imovelCreateSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects an unknown tipo value', () => {
    const result = imovelCreateSchema.safeParse({ ...validImovelPayload, tipo: 'permuta' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown categoria value', () => {
    const result = imovelCreateSchema.safeParse({ ...validImovelPayload, categoria: 'iate' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-positive preco', () => {
    expect(imovelCreateSchema.safeParse({ ...validImovelPayload, preco: 0 }).success).toBe(false)
    expect(imovelCreateSchema.safeParse({ ...validImovelPayload, preco: -1 }).success).toBe(false)
  })

  it('rejects a titulo shorter than 3 characters', () => {
    expect(imovelCreateSchema.safeParse({ ...validImovelPayload, titulo: 'X' }).success).toBe(false)
  })

  it('coerces numeric strings into numbers', () => {
    const result = imovelCreateSchema.safeParse({ ...validImovelPayload, preco: '450000', area: '54.5' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.preco).toBe(450000)
      expect(result.data.area).toBe(54.5)
    }
  })

  it('accepts lat/lng within valid ranges', () => {
    const result = imovelCreateSchema.safeParse({ ...validImovelPayload, lat: -23.5329, lng: -46.7917 })
    expect(result.success).toBe(true)
  })

  it('rejects lat outside [-90, 90]', () => {
    expect(imovelCreateSchema.safeParse({ ...validImovelPayload, lat: 91 }).success).toBe(false)
    expect(imovelCreateSchema.safeParse({ ...validImovelPayload, lat: -91 }).success).toBe(false)
  })

  it('rejects lng outside [-180, 180]', () => {
    expect(imovelCreateSchema.safeParse({ ...validImovelPayload, lng: 181 }).success).toBe(false)
  })

  it('rejects an invalid image URL', () => {
    const result = imovelCreateSchema.safeParse({ ...validImovelPayload, imagens: ['not-a-url'] })
    expect(result.success).toBe(false)
  })
})

describe('imovelUpdateSchema', () => {
  it('accepts an empty object (every field optional)', () => {
    expect(imovelUpdateSchema.safeParse({}).success).toBe(true)
  })

  it('accepts partial updates', () => {
    const result = imovelUpdateSchema.safeParse({ preco: 500000 })
    expect(result.success).toBe(true)
  })

  it('still rejects out-of-range coordinates', () => {
    expect(imovelUpdateSchema.safeParse({ lat: 200 }).success).toBe(false)
  })

  it('accepts ativo (the soft-delete flag)', () => {
    const result = imovelUpdateSchema.safeParse({ ativo: false })
    expect(result.success).toBe(true)
  })
})

describe('blogPostCreateSchema', () => {
  const valid = {
    titulo: 'Como morar em Osasco',
    slug: 'como-morar-em-osasco',
  }

  it('accepts a minimal payload', () => {
    expect(blogPostCreateSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects slugs with uppercase letters', () => {
    expect(blogPostCreateSchema.safeParse({ ...valid, slug: 'Como-Morar' }).success).toBe(false)
  })

  it('rejects slugs with spaces', () => {
    expect(blogPostCreateSchema.safeParse({ ...valid, slug: 'como morar' }).success).toBe(false)
  })

  it('rejects slugs with diacritics', () => {
    expect(blogPostCreateSchema.safeParse({ ...valid, slug: 'morar-osasco-é-bom' }).success).toBe(false)
  })

  it('accepts a slug with hyphens, digits and lowercase letters', () => {
    expect(blogPostCreateSchema.safeParse({ ...valid, slug: 'guia-itbi-2026' }).success).toBe(true)
  })
})

describe('blogPostUpdateSchema', () => {
  it('accepts an empty object', () => {
    expect(blogPostUpdateSchema.safeParse({}).success).toBe(true)
  })

  it('still validates slug format when provided', () => {
    expect(blogPostUpdateSchema.safeParse({ slug: 'Bad Slug' }).success).toBe(false)
  })
})

describe('contatoSchema', () => {
  const valid = {
    nome: 'João Silva',
    email: 'joao@example.com',
    mensagem: 'Tenho interesse em saber mais sobre o imóvel anunciado.',
  }

  it('accepts a minimal valid payload', () => {
    expect(contatoSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(contatoSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects a too-short message', () => {
    expect(contatoSchema.safeParse({ ...valid, mensagem: 'oi' }).success).toBe(false)
  })

  it('rejects a too-short name', () => {
    expect(contatoSchema.safeParse({ ...valid, nome: 'A' }).success).toBe(false)
  })

  it('coerces imovel_id to a number', () => {
    const result = contatoSchema.safeParse({ ...valid, imovel_id: '42' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.imovel_id).toBe(42)
  })

  it('accepts null imovel_id', () => {
    expect(contatoSchema.safeParse({ ...valid, imovel_id: null }).success).toBe(true)
  })

  it('rejects a negative imovel_id', () => {
    expect(contatoSchema.safeParse({ ...valid, imovel_id: -1 }).success).toBe(false)
  })
})
