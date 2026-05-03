'use client'

import { useRef, type ChangeEvent } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'

interface PhotosSectionProps {
  imageUrls: string[]
  isUploading: boolean
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void
  onRemove: (url: string) => void
}

export default function PhotosSection({ imageUrls, isUploading, onUpload, onRemove }: PhotosSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark mb-1">Imagens</h2>
      <p className="text-[10px] text-gray-400 mb-4">Selecione uma ou mais fotos do seu computador.</p>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onUpload} className="hidden" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 w-full justify-center"
      >
        <FiUpload size={14} />
        {isUploading ? 'Enviando...' : 'Selecionar fotos'}
      </button>
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt="" className="w-full h-24 object-cover border border-gray-200" />
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
