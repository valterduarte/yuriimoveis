'use client'

import { useEffect, useRef } from 'react'
import PropertyCard from '../../PropertyCard'
import { useListingMapStore } from './ListingMapStoreProvider'
import type { Imovel } from '../../../types'

interface HoverSyncCardProps {
  imovel: Imovel
  priority?: boolean
}

export default function HoverSyncCard({ imovel, priority }: HoverSyncCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useListingMapStore((s) => s.activeImovelId === imovel.id)
  const setActive = useListingMapStore((s) => s.setActive)

  useEffect(() => {
    if (active && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [active])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(imovel.id)}
      onMouseLeave={() => setActive(null)}
      className={`transition-shadow duration-150 ${active ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <PropertyCard imovel={imovel} priority={priority} />
    </div>
  )
}
