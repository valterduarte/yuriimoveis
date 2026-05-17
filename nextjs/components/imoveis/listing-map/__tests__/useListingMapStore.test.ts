import { describe, it, expect } from 'vitest'
import { createListingMapStore } from '../useListingMapStore'

describe('createListingMapStore', () => {
  it('starts with no active id and no filter', () => {
    const store = createListingMapStore()
    const state = store.getState()
    expect(state.activeImovelId).toBeNull()
    expect(state.filteredIds).toBeNull()
    expect(state.mobileMapOpen).toBe(false)
  })

  it('setActive updates the active id', () => {
    const store = createListingMapStore()
    store.getState().setActive(42)
    expect(store.getState().activeImovelId).toBe(42)
    store.getState().setActive(null)
    expect(store.getState().activeImovelId).toBeNull()
  })

  it('setFilteredIds accepts a Set or null', () => {
    const store = createListingMapStore()
    store.getState().setFilteredIds(new Set([1, 2, 3]))
    expect(store.getState().filteredIds).toEqual(new Set([1, 2, 3]))
    store.getState().setFilteredIds(null)
    expect(store.getState().filteredIds).toBeNull()
  })

  it('toggleMobileMap flips the boolean', () => {
    const store = createListingMapStore()
    store.getState().toggleMobileMap()
    expect(store.getState().mobileMapOpen).toBe(true)
    store.getState().toggleMobileMap()
    expect(store.getState().mobileMapOpen).toBe(false)
  })

  it('two instances are independent', () => {
    const a = createListingMapStore()
    const b = createListingMapStore()
    a.getState().setActive(1)
    expect(b.getState().activeImovelId).toBeNull()
  })
})
