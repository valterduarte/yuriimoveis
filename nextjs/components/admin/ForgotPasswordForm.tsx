'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { apiClient } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'
import { fieldInput } from './ui/styles'
import AuthCard from './AuthCard'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // The endpoint always answers generically (no account enumeration), so we
      // show the same confirmation regardless of the outcome.
      await apiClient.post(`${API_URL}/api/auth/forgot-password`, { email })
    } catch {
      // Swallow: a network/server error must not reveal whether the email exists.
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <AuthCard title="Verifique seu e-mail">
        <p className="text-sm text-gray-600 leading-relaxed">
          Se o e-mail estiver cadastrado, enviamos um link para redefinir sua senha. O link expira em 1 hora.
        </p>
        <Link href="/admin" className="mt-6 block text-center text-xs text-gray-500 hover:text-primary transition-colors">
          Voltar ao login
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Recuperar senha">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Informe o e-mail de recuperação cadastrado. Enviaremos um link para você criar uma nova senha.
        </p>
        <input
          type="email"
          placeholder="E-mail de recuperação"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className={fieldInput}
        />
        <button type="submit" disabled={loading} className="w-full btn-primary rounded-md py-3 text-xs disabled:opacity-50">
          {loading ? 'Enviando...' : 'Enviar link'}
        </button>
      </form>
      <Link href="/admin" className="mt-4 block text-center text-xs text-gray-500 hover:text-primary transition-colors">
        Voltar ao login
      </Link>
    </AuthCard>
  )
}
