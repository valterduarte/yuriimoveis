/// <reference types="google.maps" />
import type { Cluster, Renderer } from '@googlemaps/markerclusterer'

const PRIMARY = '#af1e23'

function diameterForCount(count: number): number {
  if (count < 10) return 36
  if (count < 30) return 44
  return 52
}

export const clusterRenderer: Renderer = {
  render({ count, position }: Cluster) {
    const size = diameterForCount(count)
    const svg = window.btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${PRIMARY}" stroke="white" stroke-width="2" />
      </svg>
    `)
    return new google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;base64,${svg}`,
        scaledSize: new google.maps.Size(size, size),
      },
      label: {
        text: String(count),
        color: 'white',
        fontSize: '13px',
        fontWeight: '700',
      },
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    })
  },
}
