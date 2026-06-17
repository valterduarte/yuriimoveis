'use client'

import { useState } from 'react'
import { FiPlay } from 'react-icons/fi'
import { deriveVideoPoster, optimizeCloudinaryVideo } from '../../utils/imovelUtils'
import type { Imovel } from '../../types'

interface PropertyVideoSectionProps {
  imovel: Pick<Imovel, 'titulo' | 'cidade' | 'video_url'>
}

const VIDEO_HEIGHT_PX = 420

export default function PropertyVideoSection({ imovel }: PropertyVideoSectionProps) {
  const [playing, setPlaying] = useState(false)

  const videoUrl = imovel.video_url || ''
  const poster = deriveVideoPoster(videoUrl)
  // No poster means we can't build a lightweight facade, so skip the section.
  if (!videoUrl || !poster) return null

  return (
    <section id="video">
      <span className="section-label">Vídeo</span>
      <h2 className="section-title mb-8">Tour em vídeo</h2>

      <div className="relative overflow-hidden bg-dark border border-gray-200" style={{ height: VIDEO_HEIGHT_PX }}>
        {playing ? (
          <video
            src={optimizeCloudinaryVideo(videoUrl)}
            poster={poster}
            controls
            autoPlay
            preload="none"
            className="w-full h-full object-cover bg-black"
          >
            <track kind="captions" />
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Reproduzir vídeo"
            className="group absolute inset-0 w-full h-full"
          >
            <img
              src={poster}
              alt={`Tour em vídeo — ${imovel.titulo} em ${imovel.cidade || 'Osasco'}`}
              width={800}
              height={VIDEO_HEIGHT_PX}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/90 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <FiPlay size={32} className="ml-1" />
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
