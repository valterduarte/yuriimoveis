'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { PLACEHOLDER_IMAGE } from '../../lib/constants'
import type { Imovel } from '../../types'

const GALLERY_IMAGE_HEIGHT = 420

interface PropertyGalleryProps {
  imovel: Imovel
  images: string[]
  onImageClick: (index: number) => void
}

export default function PropertyGallery({ imovel, images, onImageClick }: PropertyGalleryProps) {
  return (
    <section id="galeria" className="py-14 bg-dark">
      <div className="max-w-6xl mx-auto px-4 md:px-8 mb-8">
        <span className="section-label">Galeria</span>
        <h2 className="section-title text-white">Fotos do Imóvel</h2>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1.15}
        spaceBetween={4}
        breakpoints={{
          640:  { slidesPerView: 2.1  },
          768:  { slidesPerView: 2.5  },
          1024: { slidesPerView: 3, spaceBetween: 4 },
        }}
        className="gallery-swiper px-4 md:px-10"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="overflow-hidden cursor-pointer" onClick={() => onImageClick(i)}>
              <img
                src={img}
                alt={`${imovel.titulo} em ${imovel.cidade || 'Osasco'} – foto ${i + 1} de ${images.length}`}
                width={800}
                height={GALLERY_IMAGE_HEIGHT}
                loading="lazy"
                decoding="async"
                className="perspectivas-img w-full object-cover block transition-opacity duration-300 hover:opacity-70"
                style={{ height: GALLERY_IMAGE_HEIGHT }}
                onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
