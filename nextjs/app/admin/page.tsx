'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiBarChart2, FiFileText } from 'react-icons/fi'
import { apiClient, isAuthError } from '../../lib/apiClient'
import { ADMIN_PROPERTIES_LIMIT } from '../../lib/constants'
import { API_URL } from '../../lib/config'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import AdminLogin from '../../components/admin/AdminLogin'
import AdminPropertyList from '../../components/admin/AdminPropertyList'
import AdminPropertyForm from '../../components/admin/AdminPropertyForm'
import AdminClickStats from '../../components/admin/AdminClickStats'
import AdminBlogPostList from '../../components/admin/AdminBlogPostList'
import AdminBlogPostForm from '../../components/admin/AdminBlogPostForm'
import AdminBairroAudit from '../../components/admin/AdminBairroAudit'
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

  const [activeView, setActiveView] = useState<'list' | 'form' | 'stats' | 'blog' | 'blog-form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null)
  const [properties, setProperties] = useState<Imovel[]>([])
  const [message, setMessage] = useState<AdminMessage | null>(null)

  const loadProperties = async () => {
    try {
      const data = await apiClient.get<{ imoveis?: Imovel[] }>(
        `${API_URL}/api/imoveis?limit=${ADMIN_PROPERTIES_LIMIT}&ordem=recente&todos=true`
      )
      setProperties(data.imoveis || [])
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
    setEditingId(null)
    setActiveView('list')
  }

  const setActiveStatus = async (id: number, ativo: boolean, errorMessage: string) => {
    try {
      await apiClient.put(`${API_URL}/api/imoveis/${id}`, { ativo }, { headers: authHeader() })
      loadProperties()
    } catch (err) {
      if (isAuthError(err)) handleLogout()
      else setMessage({ type: 'error', text: errorMessage })
    }
  }

  const handleDeactivate = (id: number) => setActiveStatus(id, false, 'Erro ao desativar.')
  const handleReactivate = (id: number) => setActiveStatus(id, true,  'Erro ao reativar.')

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

  const viewTitle = activeView === 'list'
    ? 'Imóveis Cadastrados'
    : activeView === 'stats'
      ? 'Clicks WhatsApp'
      : activeView === 'blog'
        ? 'Blog — Posts'
        : activeView === 'blog-form'
          ? editingBlogId ? 'Editar Post' : 'Novo Post'
          : editingId ? 'Editar Imóvel' : 'Novo Imóvel'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-10">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div>
            <span className="section-label">Admin</span>
            <h1 className="text-3xl font-black uppercase text-white">{viewTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            {activeView === 'list' ? (
              <>
                <button onClick={() => setActiveView('blog')}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
                  <FiFileText size={14} /> Blog
                </button>
                <button onClick={() => setActiveView('stats')}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
                  <FiBarChart2 size={14} /> Clicks
                </button>
                <button onClick={openNewPropertyForm} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
                  <FiPlus size={14} /> Novo Imóvel
                </button>
              </>
            ) : activeView === 'blog' ? (
              <>
                <button onClick={() => { setActiveView('list'); setMessage(null) }}
                  className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
                  ← Imóveis
                </button>
                <button onClick={() => { setEditingBlogId(null); setMessage(null); setActiveView('blog-form') }}
                  className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
                  <FiPlus size={14} /> Novo Post
                </button>
              </>
            ) : (
              <button onClick={() => { setActiveView(activeView === 'blog-form' ? 'blog' : 'list'); setMessage(null) }}
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

        {activeView === 'list' && (
          <>
            <AdminBairroAudit authHeader={authHeader} onAuthError={handleLogout} />
            <AdminPropertyList
              properties={properties}
              onEdit={openEditForm}
              onDeactivate={handleDeactivate}
              onReactivate={handleReactivate}
            />
          </>
        )}

        {activeView === 'form' && (
          <AdminPropertyForm
            editingId={editingId}
            authHeader={authHeader}
            onSuccess={handleFormSuccess}
            onAuthError={handleLogout}
          />
        )}

        {activeView === 'stats' && (
          <AdminClickStats
            authHeader={authHeader}
            onAuthError={handleLogout}
          />
        )}

        {activeView === 'blog' && (
          <AdminBlogPostList
            authHeader={authHeader}
            onEdit={(id) => { setEditingBlogId(id); setMessage(null); setActiveView('blog-form') }}
            onAuthError={handleLogout}
          />
        )}

        {activeView === 'blog-form' && (
          <AdminBlogPostForm
            editingId={editingBlogId}
            authHeader={authHeader}
            onSuccess={(msg) => { setMessage({ type: 'success', text: msg }); setActiveView('blog') }}
            onAuthError={handleLogout}
          />
        )}
      </div>
    </div>
  )
}
