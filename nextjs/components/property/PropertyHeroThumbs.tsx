'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'
import { PLACEHOLDER_IMAGE } from '../../lib/constants'
import type { Swiper as SwiperType } from 'swiper'

interface PropertyHeroThumbsProps {
  images: string[]
  titulo: string
  onReady: (swiper: SwiperType) => void
}

/**
 * Below-the-fold thumbnail strip for the property hero. Split into its own
 * dynamic chunk so the Swiper "Thumbs" wiring and its CSS stay out of the
 * detail page's critical bundle — the strip is never above the fold.
 */
export default function PropertyHeroThumbs({ images, titulo, onReady }: PropertyHeroThumbsProps) {
  return (
    <div className="bg-[#111] border-t border-white/10 py-4">
      <div className="max-w-6xl mx-auto px-8">
        <Swiper
          modules={[Thumbs]}
          onSwiper={onReady}
          slidesPerView="auto"
          spaceBetween={10}
          watchSlidesProgress
          className="thumbs-swiper"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} style={{ width: 80, height: 54 }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed 80x54 thumbnail served through the Cloudinary loader; next/image adds no benefit here */}
              <img
                src={img}
                alt={`${titulo} – foto ${i + 1} de ${images.length}`}
                width={80}
                height={54}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
