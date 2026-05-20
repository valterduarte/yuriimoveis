'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch, FiX } from 'react-icons/fi'
import { slugify } from '../utils/imovelUtils'

export default function CodeSearch() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = value.replace(/\D/g, '')
    if (!code) return

    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/imoveis/${code}`)
      if (res.ok) {
        const imovel = await res.json()
        const slug = `${slugify(imovel.titulo)}-${imovel.id}`
        setValue('')
        setOpen(false)
        router.push(`/imoveis/${slug}`)
      } else {
        setError('Imóvel não encontrado')
      }
    } catch {
      setError('Erro ao buscar')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setValue('')
    setError('')
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar imóvel por código"
        aria-expanded={false}
        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        <FiSearch size={15} aria-hidden="true" />
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        placeholder="Código #"
        value={value}
        onChange={e => {
          setValue(e.target.value.replace(/\D/g, ''))
          setError('')
        }}
        aria-label="Código do imóvel"
        aria-invalid={!!error || undefined}
        className="w-24 bg-gray-800 border border-gray-600 text-white text-xs px-2.5 py-2.5 focus:outline-none focus:border-primary placeholder:text-gray-500"
      />
      <button
        type="submit"
        disabled={loading || !value}
        aria-label="Buscar"
        className="bg-primary text-white px-3 py-2.5 text-xs disabled:opacity-50"
      >
        <FiSearch size={13} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={handleClose}
        aria-label="Fechar busca"
        className="text-gray-400 hover:text-white ml-1 p-2 -m-2"
      >
        <FiX size={14} aria-hidden="true" />
      </button>
      {error && (
        <span className="absolute top-full left-0 mt-1 text-[10px] text-red-400 whitespace-nowrap bg-dark/95 px-2 py-1">
          {error}
        </span>
      )}
    </form>
  )
}
