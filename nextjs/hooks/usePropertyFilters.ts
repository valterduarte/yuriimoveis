'use client'

import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { DEBOUNCE_DELAY } from '../lib/constants'

export function usePropertyFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const tipo      = searchParams.get('tipo')      || ''
  const categoria = searchParams.get('categoria') || ''
  const cidade    = searchParams.get('cidade')    || ''
  const bairro    = searchParams.get('bairro')    || ''
  const precoMin  = searchParams.get('precoMin')  || ''
  const precoMax  = searchParams.get('precoMax')  || ''
  const quartos   = searchParams.get('quartos')   || ''
  const codigo    = searchParams.get('codigo')    || ''
  const ordem     = searchParams.get('ordem')     || 'recente'

  const [precoMinInput, setPrecoMinInput] = useState(precoMin)
  const [precoMaxInput, setPrecoMaxInput] = useState(precoMax)

  useEffect(() => { setPrecoMinInput(precoMin) }, [precoMin])
  useEffect(() => { setPrecoMaxInput(precoMax) }, [precoMax])

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }

  const navigatePage = (page: number) => {
    const next = new URLSearchParams(searchParams.toString())
    if (page > 1) next.set('page', String(page))
    else next.delete('page')
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }

  const updatePriceFilter = (key: string, value: string, setter: Dispatch<SetStateAction<string>>) => {
    setter(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateFilter(key, value), DEBOUNCE_DELAY)
  }

  const clearFilters = () => {
    router.replace(pathname, { scroll: false })
  }

  const activeFilterCount = [tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, codigo].filter(Boolean).length

  return {
    tipo, categoria, cidade, bairro, precoMin, precoMax, quartos, codigo, ordem,
    precoMinInput, precoMaxInput,
    updateFilter,
    navigatePage,
    updatePriceFilter,
    setPrecoMinInput,
    setPrecoMaxInput,
    clearFilters,
    activeFilterCount,
  }
}
