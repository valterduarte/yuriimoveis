'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import { optimizeCloudinaryVideo } from '../../../utils/imovelUtils'
import { card, sectionHeading } from '../ui/styles'

interface VideoSectionProps {
  videoUrl: string
  isUploading: boolean
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}

// Cloudinary returns the secure_url before the video finishes transcoding, so a
// freshly uploaded asset can briefly fail to load. We keep retrying the preview
// until it plays (or give up) instead of leaving a broken player on screen.
const MAX_PREVIEW_RETRIES = 8
const PREVIEW_RETRY_MS = 3000

type PreviewState = 'loading' | 'ready' | 'error'

export default function VideoSection({ videoUrl, isUploading, onUpload, onRemove }: VideoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewState, setPreviewState] = useState<PreviewState>('ready')
  const [reloadToken, setReloadToken] = useState(0)
  const retriesRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restart the processing watch whenever a different video is selected.
  useEffect(() => {
    retriesRef.current = 0
    setReloadToken(0)
    setPreviewState(videoUrl ? 'loading' : 'ready')
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [videoUrl])

  const handlePreviewError = () => {
    if (retriesRef.current >= MAX_PREVIEW_RETRIES) {
      setPreviewState('error')
      return
    }
    retriesRef.current += 1
    timerRef.current = setTimeout(() => setReloadToken(token => token + 1), PREVIEW_RETRY_MS)
  }

  // A new token forces the <video> to refetch the (now hopefully ready) asset.
  const previewSrc = videoUrl
    ? `${optimizeCloudinaryVideo(videoUrl)}${reloadToken ? `?r=${reloadToken}` : ''}`
    : ''

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
          <video
            key={reloadToken}
            src={previewSrc}
            controls
            preload="metadata"
            onLoadedMetadata={() => setPreviewState('ready')}
            onError={handlePreviewError}
            className="w-full max-h-48 object-cover rounded-md border border-gray-300 bg-black"
          />
          {previewState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 text-xs text-white">
              Processando vídeo…
            </div>
          )}
          {previewState === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 px-4 text-center text-xs text-white">
              Não foi possível carregar o vídeo. Tente reenviar.
            </div>
          )}
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
