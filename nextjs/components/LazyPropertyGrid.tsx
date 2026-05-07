'use client'

import { useEffect, useRef, useState } from 'react'
import PropertyCard from './PropertyCard'
import type { Imovel } from '../types'

interface LazyPropertyGridProps {
  items: Imovel[]
  rootMargin?: string
}

export default function LazyPropertyGrid({ items, rootMargin = '600px' }: LazyPropertyGridProps) {
  const [revealed, setRevealed] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (revealed || items.length === 0) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) setRevealed(true)
      },
      { rootMargin },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [revealed, items.length, rootMargin])

  if (items.length === 0) return null

  if (!revealed) {
    return <div ref={sentinelRef} aria-hidden className="h-1" />
  }

  return (
    <>
      {items.map(property => (
        <PropertyCard key={property.id} imovel={property} />
      ))}
    </>
  )
}
