import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import PropertyVideoSection from './PropertyVideoSection'
import type { Imovel } from '../../types'

function makeImovel(over: Partial<Imovel> = {}): Imovel {
  return {
    id: 7,
    titulo: 'Apartamento na Vila Yara',
    cidade: 'Osasco',
    video_url: 'https://res.cloudinary.com/x/video/upload/v1/tour.mp4',
    ...over,
  } as Imovel
}

describe('PropertyVideoSection', () => {
  it('renders a video section with a poster and an accessible play control', () => {
    const html = renderToString(<PropertyVideoSection imovel={makeImovel()} />)
    expect(html).toContain('id="video"')
    expect(html).toContain('https://res.cloudinary.com/x/video/upload/v1/tour.jpg')
    expect(html).toContain('Reproduzir vídeo')
  })

  it('renders nothing when the property has no video', () => {
    const html = renderToString(<PropertyVideoSection imovel={makeImovel({ video_url: null })} />)
    expect(html).toBe('')
  })

  it('renders nothing when the video URL has no derivable poster', () => {
    const html = renderToString(
      <PropertyVideoSection imovel={makeImovel({ video_url: 'https://example.com/tour.mp4' })} />,
    )
    expect(html).toBe('')
  })
})
