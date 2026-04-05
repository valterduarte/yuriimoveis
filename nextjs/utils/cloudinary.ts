interface CloudinaryOptions {
  width?: number
  quality?: number
  format?: string
}

export function cloudinaryUrl(url: string, { width, quality = 80, format = 'webp' }: CloudinaryOptions = {}): string {
  if (!url || !url.includes('/upload/')) return url
  const transform = [
    width  ? `w_${width}`   : null,
    `q_${quality}`,
    `f_${format}`,
  ].filter(Boolean).join(',')
  return url.replace('/upload/', `/upload/${transform}/`)
}
