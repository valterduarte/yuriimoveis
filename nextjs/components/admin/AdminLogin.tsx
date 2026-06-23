'use client'

import Link from 'next/link'
import { fieldInput } from './ui/styles'

interface AdminLoginProps {
  username: string
  password: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.SyntheticEvent) => void
  loading: boolean
  error: string | null
}

export default function AdminLogin({ username, password, onUsernameChange, onPasswordChange, onSubmit, loading, error }: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-md border border-gray-300 p-8 w-full max-w-sm">
        <h1 className="text-sm font-bold uppercase tracking-widest text-dark mb-6">Acesso Admin</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={e => onUsernameChange(e.target.value)}
            autoComplete="username"
            required
            className={fieldInput}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            autoComplete="current-password"
            required
            className={fieldInput}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full btn-primary rounded-md py-3 text-xs disabled:opacity-50">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <Link
          href="/recuperar-senha"
          className="mt-4 block text-center text-xs text-gray-500 hover:text-primary transition-colors"
        >
          Esqueci minha senha
        </Link>
      </div>
    </div>
  )
}
