import type { LatLng } from '../../../lib/bairroCoords'

export interface LatLngBoundsLiteral {
  north: number
  south: number
  east: number
  west: number
}

function area(b: LatLngBoundsLiteral): number {
  return Math.abs(b.north - b.south) * Math.abs(b.east - b.west)
}

// Symmetric relative delta. 0 means identical area; values toward 1 mean a
// large change. Used to decide whether to surface "Search in this area".
export function boundsAreaDelta(a: LatLngBoundsLiteral, b: LatLngBoundsLiteral): number {
  const aa = area(a)
  const bb = area(b)
  if (aa === 0 && bb === 0) return 0
  return Math.abs(aa - bb) / Math.max(aa, bb)
}

export function idsInsideBounds(
  points: Array<{ id: number; coords: LatLng }>,
  bounds: LatLngBoundsLiteral,
): Set<number> {
  const ids = new Set<number>()
  for (const { id, coords } of points) {
    if (
      coords.lat <= bounds.north &&
      coords.lat >= bounds.south &&
      coords.lng <= bounds.east &&
      coords.lng >= bounds.west
    ) {
      ids.add(id)
    }
  }
  return ids
}
