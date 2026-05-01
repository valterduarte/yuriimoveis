'use client'

import { useEffect, useRef } from 'react'
import { PLACEHOLDER_IMAGE } from '../../lib/constants'

const SWIPE_THRESHOLD = 50

interface PropertyLightboxProps {
  images: string[]
  activeIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function PropertyLightbox({ images, activeIndex, onClose, onNext, onPrev }: PropertyLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  let touchStartX = 0

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'Tab') {
        const focusableButtons = document.querySelectorAll('[data-lightbox] button')
        if (!focusableButtons.length) return
        const firstButton = focusableButtons[0] as HTMLElement
        const lastButton = focusableButtons[focusableButtons.length - 1] as HTMLElement
        if (e.shiftKey ? document.activeElement === firstButton : document.activeElement === lastButton) {
          e.preventDefault()
          ;(e.shiftKey ? lastButton : firstButton).focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) onNext()
      else onPrev()
    }
  }

  return (
    <div
      data-lightbox
      className="fixed inset-0 bg-black/95 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de fotos"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Fechar galeria"
        className="absolute top-4 right-5 z-10 text-white text-4xl font-light w-12 h-12 flex items-center justify-center hover:text-primary transition-colors"
      >
        ×
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-black/60 border border-white/20 text-white text-2xl hover:bg-primary transition-colors"
          >
            ‹
          </button>
          <button
            onClick={onNext}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-black/60 border border-white/20 text-white text-2xl hover:bg-primary transition-colors"
          >
            ›
          </button>
        </>
      )}

      <div className="w-full h-full flex items-center justify-center">
        <div className="relative border-2 border-white/30 shadow-[0_0_120px_20px_rgba(0,0,0,0.95),0_0_40px_rgba(175,30,35,0.15)]">
          <img
            src={images[activeIndex]}
            alt={`Foto ${activeIndex + 1} de ${images.length}`}
            className="max-h-[82vh] max-w-[88vw] object-contain block"
            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
          <p className="absolute bottom-3 right-4 text-white/50 text-[10px] uppercase tracking-widest">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      </div>
    </div>
  )
}
