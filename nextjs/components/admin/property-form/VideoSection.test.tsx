import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import VideoSection from './VideoSection'

const noop = () => {}

describe('VideoSection', () => {
  it('routes the preview through the optimized Cloudinary video delivery', () => {
    const html = renderToString(
      <VideoSection
        videoUrl="https://res.cloudinary.com/demo/video/upload/v1/tour.mp4"
        isUploading={false}
        onUpload={noop}
        onRemove={noop}
      />,
    )
    expect(html).toContain('https://res.cloudinary.com/demo/video/upload/f_auto:video,q_auto/v1/tour.mp4')
    expect(html).toContain('Trocar vídeo')
  })

  it('shows the upload affordance and no preview when there is no video', () => {
    const html = renderToString(
      <VideoSection videoUrl="" isUploading={false} onUpload={noop} onRemove={noop} />,
    )
    expect(html).toContain('Selecionar vídeo')
    expect(html).not.toContain('<video')
  })

  it('reflects the uploading state on the button', () => {
    const html = renderToString(
      <VideoSection videoUrl="" isUploading={true} onUpload={noop} onRemove={noop} />,
    )
    expect(html).toContain('Enviando...')
  })
})
