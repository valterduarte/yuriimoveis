'use client'

import { useState } from 'react'
import axios from 'axios'

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
  const [error, setError] = useState(null)

  const authHeader = () => ({ Authorization: `Bearer ${token}` })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post('/api/auth/login', { usuario: username, senha: password })
      const newToken = res.data.token
      sessionStorage.setItem('admin_token', newToken)
      setToken(newToken)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao autenticar.')
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
