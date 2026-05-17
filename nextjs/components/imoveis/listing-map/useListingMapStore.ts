import { createStore } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface ListingMapState {
  activeImovelId: number | null
  filteredIds: Set<number> | null
  mobileMapOpen: boolean
  setActive: (id: number | null) => void
  setFilteredIds: (ids: Set<number> | null) => void
  toggleMobileMap: () => void
}

export function createListingMapStore() {
  return createStore<ListingMapState>()(
    subscribeWithSelector((set) => ({
      activeImovelId: null,
      filteredIds: null,
      mobileMapOpen: false,
      setActive: (id) => set({ activeImovelId: id }),
      setFilteredIds: (ids) => set({ filteredIds: ids }),
      toggleMobileMap: () => set((s) => ({ mobileMapOpen: !s.mobileMapOpen })),
    })),
  )
}

export type ListingMapStoreApi = ReturnType<typeof createListingMapStore>
