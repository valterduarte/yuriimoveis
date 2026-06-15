'use client'

import { createContext, useContext } from 'react'

export interface AdminMessage {
  type: 'success' | 'error'
  text: string
}

interface AdminContextValue {
  /** Authorization header for authenticated admin API calls. */
  authHeader: () => { Authorization: string }
  /** Called when an API call returns 401 — logs the admin out. */
  onAuthError: () => void
  /** Show a banner above the page content (e.g. "Imóvel salvo"). */
  setMessage: (message: AdminMessage | null) => void
}

export const AdminContext = createContext<AdminContextValue | null>(null)

export function useAdminContext(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdminContext must be used within the admin layout')
  return ctx
}
