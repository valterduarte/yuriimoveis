'use client'

import { useState } from 'react'
import { ApiError, apiClient } from '../lib/apiClient'
import { API_URL } from '../lib/config'

export function useAdminAuth() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('admin_token') || '' : ''
  )
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    typeof window !== 'undefined' ? !!sessionStorage.getItem('admin_token') : false
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authHeader = () => ({ Authorization: `Bearer ${token}` })

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { token: newToken } = await apiClient.post<{ token: string }>(
        `${API_URL}/api/auth/login`,
        { usuario: username, senha: password },
      )
      sessionStorage.setItem('admin_token', newToken)
      setToken(newToken)
      setIsAuthenticated(true)
    } catch (err) {
      if (err instanceof ApiError && typeof err.data === 'object' && err.data !== null && 'error' in err.data) {
        setError(String((err.data as { error: unknown }).error) || 'Erro ao autenticar.')
      } else {
        setError('Erro ao autenticar.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setToken('')
    setIsAuthenticated(false)
    setUsername('')
    setPassword('')
  }

  return {
    username, setUsername,
    password, setPassword,
    isAuthenticated,
    loading, error,
    authHeader,
    handleLogin,
    handleLogout,
  }
}
