'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import { FiShare2, FiLink, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { PLACEHOLDER_IMAGE, PROPERTY_STATUSES } from '../../lib/constants'
import { SITE_URL } from '../../lib/config'
import { imovelSlug, optimizeCloudinaryUrl, formatPrice } from '../../utils/imovelUtils'
import type { Swiper as SwiperType } from 'swiper'
import type { Imovel } from '../../types'

// Below-the-fold thumbnail strip. Loading it lazily keeps the Thumbs Swiper
// chunk out of the critical bundle; the placeholder reserves its height so
// hydration adds zero CLS.
const PropertyHeroThumbs = dynamic(() => import('./PropertyHeroThumbs'), {
  loading: () => <div className="bg-[#111] border-t border-white/10 py-4 h-[86px]" />,
})

const HERO_HEIGHT = '70vh'
const HERO_MIN_HEIGHT = 420

interface PropertyHeroProps {
  imovel: Imovel
  images: string[]
  shareUrl: string
}

export default function PropertyHero({ imovel, images, shareUrl }: PropertyHeroProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const pageUrl = `${SITE_URL}/imoveis/${imovelSlug(imovel)}`
  const imovelDescription = imovel.descricao
    ? imovel.descricao.slice(0, 155).replace(/\n/g, ' ')
    : `${imovel.titulo} em ${imovel.cidade || 'Osasco'}, SP.`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: imovel.titulo, text: imovelDescription, url: shareUrl })
    } else {
      setShareOpen(prev => !prev)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false); setShareOpen(false) }, 2000)
    })
  }

  const statusBadge = imovel.status
    ? PROPERTY_STATUSES.find(s => s.value === imovel.status)
    : null

  return (
    <>
      <div className="relative bg-dark" style={{ height: HERO_HEIGHT, minHeight: HERO_MIN_HEIGHT }}>
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          speed={600}
          className="hero-swiper w-full h-full"
        >
          {images.map((img, i) => {
            const optimized = optimizeCloudinaryUrl(img, i === 0 ? 1920 : 1200)
            return (
              <SwiperSlide key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element -- deliberate responsive Cloudinary pipeline (f_auto,q_auto + srcSet/sizes + per-slide fetchPriority/decoding for LCP); next/image would only add an extra optimizer hop */}
                <img
                  src={optimized}
                  alt={`${imovel.titulo} — ${imovel.categoria} em ${imovel.bairro || imovel.cidade}`}
                  width={1920}
                  height={1080}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding={i === 0 ? 'sync' : 'async'}
                  sizes="100vw"
                  srcSet={img.includes('res.cloudinary.com') ? `${optimizeCloudinaryUrl(img, 640)} 640w, ${optimizeCloudinaryUrl(img, 1024)} 1024w, ${optimizeCloudinaryUrl(img, 1920)} 1920w` : undefined}
                  className="w-full h-full object-cover opacity-75"
                  onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-20" />

        <div className="absolute top-8 left-8 z-30">
          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 text-white ${
            imovel.tipo === 'venda' ? 'bg-primary' : 'bg-dark'
          }`}>
            {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
        </div>

        <div className="absolute top-8 right-8 z-30">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
          >
            <FiShare2 size={13} /> Compartilhar
          </button>
          {shareOpen && (
            <div className="absolute right-0 top-full mt-2 bg-dark border border-white/10 min-w-[180px] shadow-xl">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${imovel.titulo}\n${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShareOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-[11px] uppercase tracking-widest font-bold text-white hover:bg-white/10 transition-colors border-b border-white/10"
              >
                <FaWhatsapp size={14} className="text-green-400" /> WhatsApp
              </a>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 px-5 py-3.5 text-[11px] uppercase tracking-widest font-bold text-white hover:bg-white/10 transition-colors w-full text-left"
              >
                {copied ? <FiCheck size={14} className="text-green-400" /> : <FiLink size={14} />}
                {copied ? 'Copiado!' : 'Copiar link'}
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 md:px-14 z-30 pointer-events-none">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              {statusBadge && (
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 text-white ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-3">
              {imovel.titulo}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <p className="flex items-center gap-2 text-gray-300 text-sm">
                <span className="text-primary">▸</span>
                {imovel.bairro}, {imovel.cidade} — SP
              </p>
              {imovel.preco > 0 && (
                <div className="sm:text-right">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-300 leading-none mb-1">
                    {imovel.tipo === 'aluguel' ? 'Aluguel' : 'A partir de'}
                  </span>
                  <span className="text-2xl md:text-4xl font-black text-primary-light leading-none">
                    {formatPrice(imovel.preco, imovel.tipo)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <PropertyHeroThumbs images={images} titulo={imovel.titulo} onReady={setThumbsSwiper} />
      )}
    </>
  )
}
