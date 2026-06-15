'use client'

import { useCallback, useEffect, useState } from 'react'
import { ApiError, apiClient } from '../lib/apiClient'
import { API_URL } from '../lib/config'

const TOKEN_KEY = 'admin_token'
const USER_KEY  = 'admin_user'

export function useAdminAuth() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY)
    const storedUser  = sessionStorage.getItem(USER_KEY)
    if (storedToken) {
      setToken(storedToken)
      setAuthenticatedUser(storedUser)
    }
    setHydrated(true)
  }, [])

  // Stable identities so children can safely list these in effect deps
  // without retriggering fetches on every parent render.
  const authHeader = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token])

  const handleLogin = useCallback(async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { token: newToken } = await apiClient.post<{ token: string }>(
        `${API_URL}/api/auth/login`,
        { usuario: username, senha: password },
      )
      sessionStorage.setItem(TOKEN_KEY, newToken)
      sessionStorage.setItem(USER_KEY, username)
      setToken(newToken)
      setAuthenticatedUser(username)
    } catch (err) {
      if (err instanceof ApiError && typeof err.data === 'object' && err.data !== null && 'error' in err.data) {
        setError(String((err.data as { error: unknown }).error) || 'Erro ao autenticar.')
      } else {
        setError('Erro ao autenticar.')
      }
    } finally {
      setLoading(false)
    }
  }, [username, password])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    setToken('')
    setAuthenticatedUser(null)
    setUsername('')
    setPassword('')
  }, [])

  return {
    username, setUsername,
    password, setPassword,
    isAuthenticated: !!token,
    authenticatedUser,
    hydrated,
    loading, error,
    authHeader,
    handleLogin,
    handleLogout,
  }
}
