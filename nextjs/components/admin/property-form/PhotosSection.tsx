'use client'

import { useRef, type ChangeEvent } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import { card, sectionHeading } from '../ui/styles'

interface PhotosSectionProps {
  imageUrls: string[]
  isUploading: boolean
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void
  onRemove: (url: string) => void
}

export default function PhotosSection({ imageUrls, isUploading, onUpload, onRemove }: PhotosSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-1`}>Imagens</h2>
      <p className="text-xs text-gray-500 mb-4">Selecione uma ou mais fotos do seu computador.</p>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onUpload} className="hidden" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 w-full justify-center"
      >
        <FiUpload size={14} />
        {isUploading ? 'Enviando...' : 'Selecionar fotos'}
      </button>
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-only upload preview (behind auth, noindex); next/image adds an optimizer hop with no LCP/SEO value here */}
              <img src={url} alt={`Foto ${i + 1} do imóvel`} className="w-full h-24 object-cover rounded-md border border-gray-300" />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-1 right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
