'use client'

import { useState, useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import axios from 'axios'
import { ADMIN_PROPERTIES_LIMIT } from '../../lib/constants'
import { API_URL } from '../../lib/config'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import AdminLogin from '../../components/admin/AdminLogin'
import AdminPropertyList from '../../components/admin/AdminPropertyList'
import AdminPropertyForm from '../../components/admin/AdminPropertyForm'
import type { Imovel } from '../../types'

interface AdminMessage {
  type: 'success' | 'error'
  text: string
}

export default function AdminPage() {
  const {
    username, setUsername, password, setPassword,
    isAuthenticated, loading: authLoading, error: authError,
    authHeader, handleLogin, handleLogout,
  } = useAdminAuth()

  const [activeView, setActiveView] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [properties, setProperties] = useState<Imovel[]>([])
  const [message, setMessage] = useState<AdminMessage | null>(null)

  const loadProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/imoveis?limit=${ADMIN_PROPERTIES_LIMIT}&ordem=recente&todos=true`)
      setProperties(res.data.imoveis || [])
    } catch {
      setProperties([])
    }
  }

  useEffect(() => {
    if (isAuthenticated) loadProperties()
  }, [isAuthenticated])

  const openNewPropertyForm = () => {
    setEditingId(null)
    setMessage(null)
    setActiveView('form')
  }

  const openEditForm = (id: number) => {
    setEditingId(id)
    setMessage(null)
    setActiveView('form')
  }

  const handleFormSuccess = (successMessage: string) => {
    setMessage({ type: 'success', text: successMessage })
    loadProperties()
    if (!editingId) setEditingId(null)
  }

  const handleDeactivate = async (id: number) => {
    try {
      await axios.put(`${API_URL}/api/imoveis/${id}`, { ativo: false }, { headers: authHeader() })
      loadProperties()
    } catch (err) {
      const axiosError = err as import('axios').AxiosError
      if (axiosError.response?.status === 401) handleLogout()
      else setMessage({ type: 'error', text: 'Erro ao desativar.' })
    }
  }

  const handleReactivate = async (id: number) => {
    try {
      await axios.put(`${API_URL}/api/imoveis/${id}`, { ativo: true }, { headers: authHeader() })
      loadProperties()
    } catch (err) {
      const axiosError = err as import('axios').AxiosError
      if (axiosError.response?.status === 401) handleLogout()
      else setMessage({ type: 'error', text: 'Erro ao reativar.' })
    }
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        username={username}
        password={password}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        loading={authLoading}
        error={authError}
      />
    )
  }

  const isFormView = activeView === 'form'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-10">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div>
            <span className="section-label">Admin</span>
            <h1 className="text-3xl font-black uppercase text-white">
              {!isFormView ? 'Imóveis Cadastrados' : editingId ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {!isFormView ? (
              <button onClick={openNewPropertyForm} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
                <FiPlus size={14} /> Novo Imóvel
              </button>
            ) : (
              <button onClick={() => { setActiveView('list'); setMessage(null) }}
                className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
                ← Voltar
              </button>
            )}
            <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {message && (
          <div
            role="alert"
            aria-live="polite"
            className={`mb-6 px-4 py-3 text-sm border ${
              message.type === 'success'
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-red-300 bg-red-50 text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        {!isFormView && (
          <AdminPropertyList
            properties={properties}
            onEdit={openEditForm}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
          />
        )}

        {isFormView && (
          <AdminPropertyForm
            editingId={editingId}
            authHeader={authHeader}
            onSuccess={handleFormSuccess}
            onAuthError={handleLogout}
          />
        )}
      </div>
    </div>
  )
}
