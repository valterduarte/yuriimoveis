'use client'

import { useState } from 'react'
import { FiPlay } from 'react-icons/fi'
import { deriveVideoPoster, optimizeCloudinaryVideo } from '../../utils/imovelUtils'
import type { Imovel } from '../../types'

interface PropertyVideoSectionProps {
  imovel: Pick<Imovel, 'titulo' | 'cidade' | 'video_url'>
}

// Cap how tall a portrait tour can get so a 9:16 clip doesn't dominate the page,
// while letting each video keep its own aspect ratio instead of being cropped.
const VIDEO_MAX_HEIGHT_PX = 600

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

      {/* The media sizes to its own intrinsic ratio (capped in height and width),
          so a vertical video stays vertical and a horizontal one stays horizontal
          instead of being cropped into a fixed landscape box. */}
      <div className="flex justify-center bg-dark border border-gray-200">
        {playing ? (
          <video
            src={optimizeCloudinaryVideo(videoUrl)}
            poster={poster}
            controls
            autoPlay
            preload="none"
            className="block h-auto w-auto max-w-full object-contain bg-black"
            style={{ maxHeight: VIDEO_MAX_HEIGHT_PX }}
          >
            <track kind="captions" />
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Reproduzir vídeo"
            className="group relative block"
          >
            <img
              src={poster}
              alt={`Tour em vídeo — ${imovel.titulo} em ${imovel.cidade || 'Osasco'}`}
              loading="lazy"
              decoding="async"
              className="block h-auto w-auto max-w-full object-contain transition-opacity duration-300 group-hover:opacity-80"
              style={{ maxHeight: VIDEO_MAX_HEIGHT_PX }}
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
