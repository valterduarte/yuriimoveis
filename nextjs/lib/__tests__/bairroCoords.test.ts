import { describe, it, expect } from 'vitest'
import { jitterCoords, coordsForImovelJittered } from '../bairroCoords'

const BASE = { lat: -23.5329, lng: -46.7917 } // Osasco centro

describe('jitterCoords', () => {
  it('returns the same offset for the same id', () => {
    const a = jitterCoords(42, BASE)
    const b = jitterCoords(42, BASE)
    expect(a).toEqual(b)
  })

  it('returns different offsets for different ids', () => {
    const a = jitterCoords(1, BASE)
    const b = jitterCoords(2, BASE)
    expect(a).not.toEqual(b)
  })

  it('keeps the jittered point within ~0.001 degrees of the base', () => {
    for (let id = 1; id <= 50; id++) {
      const p = jitterCoords(id, BASE)
      expect(Math.abs(p.lat - BASE.lat)).toBeLessThan(0.001)
      expect(Math.abs(p.lng - BASE.lng)).toBeLessThan(0.001)
    }
  })
})

describe('coordsForImovelJittered', () => {
  it('returns null when the bairro has no centroid', () => {
    expect(coordsForImovelJittered(1, 'bairro-inexistente-foo', 'osasco')).toBeNull()
  })

  it('returns a jittered coord when the bairro is known', () => {
    const result = coordsForImovelJittered(7, 'centro', 'osasco')
    expect(result).not.toBeNull()
    expect(result!.lat).not.toEqual(BASE.lat)
  })
})
