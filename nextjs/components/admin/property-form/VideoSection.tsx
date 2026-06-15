'use client'

import { useRef, type ChangeEvent } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import { card, sectionHeading } from '../ui/styles'

interface VideoSectionProps {
  videoUrl: string
  isUploading: boolean
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}

export default function VideoSection({ videoUrl, isUploading, onUpload, onRemove }: VideoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={card}>
      <h2 className={`${sectionHeading} mb-1`}>Vídeo (opcional)</h2>
      <p className="text-xs text-gray-500 mb-4">Um vídeo de tour do imóvel. Se vazio, a seção não aparece na página.</p>
      <input ref={fileInputRef} type="file" accept="video/*" onChange={onUpload} className="hidden" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 w-full justify-center"
      >
        <FiUpload size={14} />
        {isUploading ? 'Enviando...' : videoUrl ? 'Trocar vídeo' : 'Selecionar vídeo'}
      </button>
      {videoUrl && (
        <div className="relative group mt-4">
          <video src={videoUrl} controls preload="none" className="w-full max-h-48 object-cover rounded-md border border-gray-300 bg-black" />
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remover vídeo"
            className="absolute top-1 right-1 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiX size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
