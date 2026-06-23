'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient, ApiError } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'
import { fieldInput } from './ui/styles'
import AuthCard from './AuthCard'

const errorMessage = (err: unknown): string =>
  err instanceof ApiError && typeof err.data === 'object' && err.data !== null && 'error' in err.data
    ? String((err.data as { error: unknown }).error)
    : 'Não foi possível redefinir a senha. Tente novamente.'

export default function ResetPasswordForm() {
  const router = useRouter()
  const token = useSearchParams().get('token') ?? ''

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <AuthCard title="Link inválido">
        <p className="text-sm text-gray-600 leading-relaxed">
          Este link de redefinição é inválido ou está incompleto. Solicite um novo.
        </p>
        <Link href="/recuperar-senha" className="mt-6 block text-center text-xs text-gray-500 hover:text-primary transition-colors">
          Solicitar novo link
        </Link>
      </AuthCard>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (novaSenha !== confirmarSenha) {
      setError('A senha e a confirmação não conferem.')
      return
    }

    setLoading(true)
    try {
      await apiClient.post(`${API_URL}/api/auth/reset-password`, { token, novaSenha })
      setDone(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthCard title="Senha redefinida">
        <p className="text-sm text-gray-600 leading-relaxed">
          Sua senha foi alterada com sucesso. Você já pode entrar com a nova senha.
        </p>
        <button onClick={() => router.push('/admin')} className="mt-6 w-full btn-primary rounded-md py-3 text-xs">
          Ir para o login
        </button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Criar nova senha">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          autoComplete="new-password"
          required
          className={fieldInput}
        />
        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          autoComplete="new-password"
          required
          className={fieldInput}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="w-full btn-primary rounded-md py-3 text-xs disabled:opacity-50">
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
    </AuthCard>
  )
}
