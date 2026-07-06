import { describe, it, expect } from 'vitest'
import { buildBlogUpdateAssignments } from './blogUpdate'

describe('buildBlogUpdateAssignments', () => {
  it('skips omitted fields and numbers placeholders 1-based', () => {
    const { fields, values } = buildBlogUpdateAssignments({ titulo: 'Novo', publicado: true })
    expect(fields).toEqual(['titulo = $1', 'publicado = $2'])
    expect(values).toEqual(['Novo', true])
  })

  it('does NOT wipe the cover when imagem_capa is an empty string', () => {
    const { fields, values } = buildBlogUpdateAssignments({ titulo: 'X', imagem_capa: '' })
    expect(fields).toEqual(['titulo = $1'])
    expect(values).toEqual(['X'])
  })

  it('skips a whitespace-only imagem_capa too', () => {
    const { fields, values } = buildBlogUpdateAssignments({ imagem_capa: '   ' })
    expect(fields).toEqual([])
    expect(values).toEqual([])
  })

  it('updates the cover when a real URL is provided', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/x.png'
    const { fields, values } = buildBlogUpdateAssignments({ imagem_capa: url })
    expect(fields).toEqual(['imagem_capa = $1'])
    expect(values).toEqual([url])
  })

  it('serializes tags as JSON and keeps placeholder order after a skipped cover', () => {
    const { fields, values } = buildBlogUpdateAssignments({
      imagem_capa: '',
      tags: ['osasco', 'financiamento'],
      slug: 'meu-post',
    })
    expect(fields).toEqual(['slug = $1', 'tags = $2'])
    expect(values).toEqual(['meu-post', JSON.stringify(['osasco', 'financiamento'])])
  })

  it('returns empty assignments when nothing updatable is provided', () => {
    const { fields, values } = buildBlogUpdateAssignments({ imagem_capa: '' })
    expect(fields).toEqual([])
    expect(values).toEqual([])
  })
})
