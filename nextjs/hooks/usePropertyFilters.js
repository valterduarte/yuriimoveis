'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { DEBOUNCE_DELAY } from '../lib/constants'

export function usePropertyFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [page, setPage] = useState(1)
  const debounceRef = useRef(null)

  const tipo      = searchParams.get('tipo')      || ''
  const categoria = searchParams.get('categoria') || ''
  const cidade    = searchParams.get('cidade')    || ''
  const precoMin  = searchParams.get('precoMin')  || ''
  const precoMax  = searchParams.get('precoMax')  || ''
  const quartos   = searchParams.get('quartos')   || ''
  const ordem     = searchParams.get('ordem')     || 'recente'

  const [precoMinInput, setPrecoMinInput] = useState(precoMin)
  const [precoMaxInput, setPrecoMaxInput] = useState(precoMax)

  useEffect(() => { setPrecoMinInput(precoMin) }, [precoMin])
  useEffect(() => { setPrecoMaxInput(precoMax) }, [precoMax])

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    setPage(1)
  }

  const updatePriceFilter = (key, value, setter) => {
    setter(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateFilter(key, value), DEBOUNCE_DELAY)
  }

  const clearFilters = () => {
    router.replace(pathname, { scroll: false })
    setPage(1)
  }

  const activeFilterCount = [tipo, categoria, cidade, precoMin, precoMax, quartos].filter(Boolean).length

  return {
    tipo, categoria, cidade, precoMin, precoMax, quartos, ordem,
    precoMinInput, precoMaxInput,
    page, setPage,
    updateFilter,
    updatePriceFilter,
    setPrecoMinInput,
    setPrecoMaxInput,
    clearFilters,
    activeFilterCount,
  }
}
