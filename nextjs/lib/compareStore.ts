'use client'

import { useSyncExternalStore } from 'react'
import type { Imovel } from '../types'

export interface CompareItem {
  id: number
  slug: string
  titulo: string
  tipo: Imovel['tipo']
  categoria: Imovel['categoria']
  status: Imovel['status']
  preco: number
  area: number
  quartos: number
  banheiros: number
  vagas: number
  bairro: string
  cidade: string
  imagem: string
}

export const COMPARE_MAX_ITEMS = 4
const STORAGE_KEY = 'corretoryuri:compare'

let items: CompareItem[] = []
const listeners = new Set<() => void>()

function readStorage(): CompareItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, COMPARE_MAX_ITEMS)
  } catch {
    return []
  }
}

function writeStorage(next: CompareItem[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // quota exceeded or storage disabled — silent fallback
  }
}

function notify(): void {
  for (const listener of listeners) listener()
}

function setItems(next: CompareItem[]): void {
  items = next
  writeStorage(items)
  notify()
}

function ensureHydrated(): void {
  if (typeof window === 'undefined') return
  if (items.length === 0) {
    const stored = readStorage()
    if (stored.length > 0) items = stored
  }
}

function subscribe(listener: () => void): () => void {
  ensureHydrated()
  listeners.add(listener)

  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    items = readStorage()
    notify()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function getSnapshot(): CompareItem[] {
  return items
}

function getServerSnapshot(): CompareItem[] {
  return []
}

export function useCompareItems(): CompareItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function isInCompare(id: number): boolean {
  return items.some((item) => item.id === id)
}

export function toggleCompareItem(item: CompareItem): boolean {
  ensureHydrated()
  const exists = items.some((existing) => existing.id === item.id)
  if (exists) {
    setItems(items.filter((existing) => existing.id !== item.id))
    return false
  }
  if (items.length >= COMPARE_MAX_ITEMS) {
    return false
  }
  setItems([...items, item])
  return true
}

export function removeCompareItem(id: number): void {
  ensureHydrated()
  setItems(items.filter((item) => item.id !== id))
}

export function clearCompare(): void {
  setItems([])
}

export function buildCompareItem(imovel: Imovel, slug: string): CompareItem {
  return {
    id: imovel.id,
    slug,
    titulo: imovel.titulo,
    tipo: imovel.tipo,
    categoria: imovel.categoria,
    status: imovel.status,
    preco: imovel.preco,
    area: imovel.area,
    quartos: imovel.quartos,
    banheiros: imovel.banheiros,
    vagas: imovel.vagas,
    bairro: imovel.bairro,
    cidade: imovel.cidade,
    imagem: imovel.imagens?.[0]?.trim() || '',
  }
}
