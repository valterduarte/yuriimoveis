import { describe, it, expect } from 'vitest'
import { boundsAreaDelta, idsInsideBounds, type LatLngBoundsLiteral } from '../viewportBounds'
import type { LatLng } from '../../../../lib/bairroCoords'

const OSASCO_AREA: LatLngBoundsLiteral = {
  north: -23.50, south: -23.60, east: -46.75, west: -46.85,
}

describe('boundsAreaDelta', () => {
  it('returns 0 for identical bounds', () => {
    expect(boundsAreaDelta(OSASCO_AREA, OSASCO_AREA)).toBe(0)
  })

  it('returns >= 0.5 when one bounds is half the area of the other', () => {
    const half: LatLngBoundsLiteral = {
      north: -23.525, south: -23.575, east: -46.775, west: -46.825,
    }
    expect(boundsAreaDelta(OSASCO_AREA, half)).toBeGreaterThanOrEqual(0.5)
  })
})

describe('idsInsideBounds', () => {
  const inside: { id: number; coords: LatLng } = { id: 1, coords: { lat: -23.55, lng: -46.80 } }
  const outside: { id: number; coords: LatLng } = { id: 2, coords: { lat: -23.40, lng: -46.80 } }

  it('returns only ids whose coords fall inside the bounds', () => {
    const result = idsInsideBounds([inside, outside], OSASCO_AREA)
    expect(result).toEqual(new Set([1]))
  })
})
