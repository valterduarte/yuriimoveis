'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import {
  createListingMapStore,
  type ListingMapState,
  type ListingMapStoreApi,
} from './useListingMapStore'

const ListingMapStoreContext = createContext<ListingMapStoreApi | null>(null)

// Fallback keeps the hook usable when consumers render outside a provider
// (e.g. PropertyCard on the home page wrapped by HoverSyncCard). Reads
// return the static initial state; writes are silently dropped since no
// other subscriber is watching this instance.
const FALLBACK_STORE = createListingMapStore()

export function ListingMapStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ListingMapStoreApi | null>(null)
  if (!storeRef.current) storeRef.current = createListingMapStore()
  return (
    <ListingMapStoreContext.Provider value={storeRef.current}>
      {children}
    </ListingMapStoreContext.Provider>
  )
}

export function useListingMapStore<T>(selector: (state: ListingMapState) => T): T {
  const store = useContext(ListingMapStoreContext)
  return useStore(store ?? FALLBACK_STORE, selector)
}
