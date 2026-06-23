'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiPlus, FiBarChart2, FiFileText, FiSettings } from 'react-icons/fi'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import AdminLogin from '../../components/admin/AdminLogin'
import { AdminContext, type AdminMessage } from './admin-context'

const navLink = 'flex items-center gap-2 text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors'

function titleFor(pathname: string): string {
  if (pathname === '/admin/imoveis') return 'Imóveis Cadastrados'
  if (pathname === '/admin/imoveis/novo') return 'Novo Imóvel'
  if (pathname.startsWith('/admin/imoveis/')) return 'Editar Imóvel'
  if (pathname === '/admin/blog') return 'Blog — Posts'
  if (pathname === '/admin/blog/novo') return 'Novo Post'
  if (pathname.startsWith('/admin/blog/')) return 'Editar Post'
  if (pathname === '/admin/clicks') return 'Clicks WhatsApp'
  if (pathname === '/admin/conta') return 'Conta'
  return 'Admin'
}

function HeaderActions({ pathname }: { pathname: string }) {
  if (pathname === '/admin/imoveis') {
    return (
      <>
        <Link href="/admin/blog" className={navLink}><FiFileText size={14} /> Blog</Link>
        <Link href="/admin/clicks" className={navLink}><FiBarChart2 size={14} /> Clicks</Link>
        <Link href="/admin/imoveis/novo" className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
          <FiPlus size={14} /> Novo Imóvel
        </Link>
      </>
    )
  }
  if (pathname === '/admin/blog') {
    return (
      <>
        <Link href="/admin/imoveis" className={navLink}>← Imóveis</Link>
        <Link href="/admin/blog/novo" className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs">
          <FiPlus size={14} /> Novo Post
        </Link>
      </>
    )
  }
  const back = pathname.startsWith('/admin/blog/') ? '/admin/blog' : '/admin/imoveis'
  return <Link href={back} className={navLink}>← Voltar</Link>
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const {
    username, setUsername, password, setPassword,
    isAuthenticated, authenticatedUser, hydrated,
    loading: authLoading, error: authError,
    authHeader, handleLogin, handleLogout,
  } = useAdminAuth()

  const pathname = usePathname()
  const [message, setMessage] = useState<AdminMessage | null>(null)

  // Keep a banner visible on the list screens (the destinations after a
  // save); clear it on any other screen so stale messages don't linger.
  useEffect(() => {
    const isListScreen = pathname === '/admin/imoveis' || pathname === '/admin/blog'
    if (!isListScreen) setMessage(null)
  }, [pathname])

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

  return (
    <AdminContext.Provider value={{ authHeader, onAuthError: handleLogout, setMessage }}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-dark text-white py-10">
          <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="section-label">Admin{authenticatedUser ? ` · ${authenticatedUser}` : ''}</span>
              <h1 className="text-3xl font-black uppercase text-white">{titleFor(pathname)}</h1>
            </div>
            <div className="flex items-center gap-4">
              <HeaderActions pathname={pathname} />
              <Link href="/admin/conta" className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors" title="Conta">
                <FiSettings size={14} /> Conta
              </Link>
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
          {children}
        </div>
      </div>
    </AdminContext.Provider>
  )
}
