import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEBOUNCE_DELAY } from '../constants'

export function usePropertyFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
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
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
    setPage(1)
  }

  const updatePriceFilter = (key, value, setter) => {
    setter(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => updateFilter(key, value), DEBOUNCE_DELAY)
  }

  const clearFilters = () => {
    setSearchParams({})
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
