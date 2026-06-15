'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

type AdminView = 'list' | 'form' | 'stats' | 'blog' | 'blog-form'
const ADMIN_VIEWS: readonly AdminView[] = ['list', 'form', 'stats', 'blog', 'blog-form']

interface ViewParams {
  id?: number | null
  blogId?: number | null
}

/** Encode a view (and its target id) into a shareable, refresh-safe /admin URL. */
function buildAdminUrl(view: AdminView, params: ViewParams = {}): string {
  const search = new URLSearchParams()
  if (view !== 'list') search.set('view', view)
  if (params.id != null) search.set('id', String(params.id))
  if (params.blogId != null) search.set('blogId', String(params.blogId))
  const query = search.toString()
  return query ? `/admin?${query}` : '/admin'
}

function AdminPanel() {
  const {
    username, setUsername, password, setPassword,
    isAuthenticated, authenticatedUser, hydrated,
    loading: authLoading, error: authError,
    authHeader, handleLogin, handleLogout,
  } = useAdminAuth()

  const router = useRouter()
  const searchParams = useSearchParams()

  const viewParam = searchParams.get('view') as AdminView | null
  const activeView: AdminView = viewParam && ADMIN_VIEWS.includes(viewParam) ? viewParam : 'list'
  const editingId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const editingBlogId = searchParams.get('blogId') ? Number(searchParams.get('blogId')) : null

  const [properties, setProperties] = useState<Imovel[]>([])
  const [message, setMessage] = useState<AdminMessage | null>(null)

  const loadProperties = useCallback(async () => {
    try {
      const data = await apiClient.get<{ imoveis?: Imovel[] }>(
        `${API_URL}/api/imoveis?limit=${ADMIN_PROPERTIES_LIMIT}&ordem=recente&todos=true`,
        { headers: authHeader() }
      )
      setProperties(data.imoveis || [])
    } catch (err) {
      if (isAuthError(err)) handleLogout()
      setProperties([])
    }
  }, [authHeader, handleLogout])

  useEffect(() => {
    if (isAuthenticated) loadProperties()
  }, [isAuthenticated, loadProperties])

  // Navigate to a view: clears any banner and pushes the URL so the back
  // button and a refresh both land on the same screen.
  const goTo = useCallback((view: AdminView, params?: ViewParams) => {
    setMessage(null)
    router.push(buildAdminUrl(view, params))
  }, [router])

  const handleFormSuccess = (successMessage: string) => {
    setMessage({ type: 'success', text: successMessage })
    loadProperties()
    router.push(buildAdminUrl('list'))
  }

  const handleBlogFormSuccess = (successMessage: string) => {
    setMessage({ type: 'success', text: successMessage })
    router.push(buildAdminUrl('blog'))
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

  if (!hydrated) {
    return <div className="min-h-screen bg-gray-50" aria-hidden="true" />
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

  const viewTitle = activeView === 'list'
    ? 'Imóveis Cadastrados'
    : activeView === 'stats'
      ? 'Clicks WhatsApp'
      : activeView === 'blog'
        ? 'Blog — Posts'
        : activeView === 'blog-form'
          ? editingBlogId ? 'Editar Post' : 'Novo Post'
          : editingId ? 'Editar Imóvel' : 'Novo Imóvel'

  const activeCount = properties.filter(p => p.ativo).length
  const inactiveCount = properties.length - activeCount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark text-white py-10">
        <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="section-label">Admin{authenticatedUser ? ` · ${authenticatedUser}` : ''}</span>
            <h1 className="text-3xl font-black uppercase text-white">{viewTitle}</h1>
            {activeView === 'list' && properties.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {activeCount} {activeCount === 1 ? 'ativo' : 'ativos'} · {inactiveCount} {inactiveCount === 1 ? 'inativo' : 'inativos'} · {properties.length} total
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {activeView === 'list' ? (
              <>
                <button onClick={() => goTo('blog')}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
                  <FiFileText size={14} /> Blog
                </button>
                <button onClick={() => goTo('stats')}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
                  <FiBarChart2 size={14} /> Clicks
                </button>
                <button onClick={() => goTo('form')} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
                  <FiPlus size={14} /> Novo Imóvel
                </button>
              </>
            ) : activeView === 'blog' ? (
              <>
                <button onClick={() => goTo('list')}
                  className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
                  ← Imóveis
                </button>
                <button onClick={() => goTo('blog-form')}
                  className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
                  <FiPlus size={14} /> Novo Post
                </button>
              </>
            ) : (
              <button onClick={() => goTo(activeView === 'blog-form' ? 'blog' : 'list')}
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
            className={`mb-6 px-4 py-3 text-sm rounded-md border ${
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
              onEdit={(id) => goTo('form', { id })}
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
            onEdit={(id) => goTo('blog-form', { blogId: id })}
            onAuthError={handleLogout}
          />
        )}

        {activeView === 'blog-form' && (
          <AdminBlogPostForm
            editingId={editingBlogId}
            authHeader={authHeader}
            onSuccess={handleBlogFormSuccess}
            onAuthError={handleLogout}
          />
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" aria-hidden="true" />}>
      <AdminPanel />
    </Suspense>
  )
}
