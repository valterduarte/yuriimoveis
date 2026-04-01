export function cloudinaryUrl(url, { width, quality = 80, format = 'webp' } = {}) {
  if (!url || !url.includes('/upload/')) return url
  const transform = [
    width  ? `w_${width}`   : null,
    `q_${quality}`,
    `f_${format}`,
  ].filter(Boolean).join(',')
  return url.replace('/upload/', `/upload/${transform}/`)
}
