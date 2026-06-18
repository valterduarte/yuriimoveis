'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch, FiX } from 'react-icons/fi'
import { filterSearchItems, type SearchItem } from '../lib/search'

const LISTBOX_ID = 'site-search-results'

export default function SiteSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<SearchItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(
    () => (items ? filterSearchItems(items, query) : []),
    [items, query],
  )

  // Load the index lazily the first time the search opens, then reuse it.
  useEffect(() => {
    if (!open || items) return
    let active = true
    setLoading(true)
    fetch('/api/search')
      .then(res => (res.ok ? res.json() : []))
      .then((data: SearchItem[]) => { if (active) setItems(data) })
      .catch(() => { if (active) setItems([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [open, items])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => { setActiveIndex(0) }, [query])

  // Close when clicking outside the search.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) handleClose()
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const handleClose = () => {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }

  const goTo = (item: SearchItem) => {
    handleClose()
    router.push(item.url)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = results[activeIndex]
      if (item) goTo(item)
    } else if (event.key === 'Escape') {
      handleClose()
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar imóvel ou empreendimento"
        aria-expanded={false}
        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        <FiSearch size={15} aria-hidden="true" />
      </button>
    )
  }

  const showDropdown = query.trim().length > 0

  return (
    <div ref={containerRef} className="relative">
      <div
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={LISTBOX_ID}
        aria-owns={LISTBOX_ID}
        aria-haspopup="listbox"
        className="relative flex items-center"
      >
        <FiSearch size={14} aria-hidden="true" className="absolute left-2.5 text-gray-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nome, código, bairro, cidade…"
          aria-label="Buscar imóvel ou empreendimento"
          aria-controls={LISTBOX_ID}
          aria-activedescendant={showDropdown && results[activeIndex] ? `ss-opt-${activeIndex}` : undefined}
          autoComplete="off"
          className="w-60 bg-gray-800 border border-gray-600 text-white text-xs pl-8 pr-2.5 py-2.5 focus:outline-none focus:border-primary placeholder:text-gray-500"
        />
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar busca"
          className="text-gray-400 hover:text-white ml-1 p-2 -m-2"
        >
          <FiX size={14} aria-hidden="true" />
        </button>
      </div>

      {showDropdown && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Resultados da busca"
          className="absolute right-0 top-full mt-1 w-80 max-w-[85vw] bg-dark border border-white/10 shadow-xl z-50 max-h-96 overflow-auto"
        >
          {loading && !items ? (
            <li className="px-4 py-3 text-xs text-gray-400">Carregando…</li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-xs text-gray-400">
              Nada encontrado para “{query.trim()}”.
            </li>
          ) : (
            results.map((item, index) => (
              <li key={item.url} id={`ss-opt-${index}`} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goTo(item)}
                  className={`w-full text-left px-4 py-2.5 border-b border-white/5 last:border-b-0 transition-colors ${
                    index === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="block text-xs font-bold text-white truncate">{item.label}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-gray-400 mt-0.5 truncate">
                    {item.sublabel}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
