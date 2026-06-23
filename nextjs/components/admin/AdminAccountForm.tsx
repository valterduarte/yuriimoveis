'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { apiClient, ApiError, isAuthError } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'
import { useAdminContext } from '../../app/admin/admin-context'
import { card, fieldInput, fieldLabel, fieldHint, sectionHeading } from './ui/styles'

interface AccountInfo {
  username: string
  recoveryEmail: string | null
}

const errorMessage = (err: unknown): string =>
  err instanceof ApiError && typeof err.data === 'object' && err.data !== null && 'error' in err.data
    ? String((err.data as { error: unknown }).error)
    : 'Erro inesperado. Tente novamente.'

export default function AdminAccountForm() {
  const { authHeader, onAuthError, setMessage } = useAdminContext()

  const [novoUsuario, setNovoUsuario] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [savingCredentials, setSavingCredentials] = useState(false)
  const [savingEmail, setSavingEmail] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get<AccountInfo>(`${API_URL}/api/auth/account`, { headers: authHeader() })
      .then((info) => {
        setNovoUsuario(info.username)
        setRecoveryEmail(info.recoveryEmail ?? '')
      })
      .catch((err) => {
        if (isAuthError(err)) onAuthError()
      })
  }, [authHeader, onAuthError])

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (novaSenha && novaSenha !== confirmarSenha) {
      setFormError('A nova senha e a confirmação não conferem.')
      return
    }

    setSavingCredentials(true)
    try {
      await apiClient.post(
        `${API_URL}/api/auth/change-credentials`,
        {
          senhaAtual,
          ...(novoUsuario ? { novoUsuario } : {}),
          ...(novaSenha ? { novaSenha } : {}),
        },
        { headers: authHeader() },
      )
      setMessage({ type: 'success', text: 'Credenciais atualizadas com sucesso.' })
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
    } catch (err) {
      // A wrong current password legitimately returns 401 here — that is a form
      // error, not an expired session, so only log out on a read/GET 401.
      setFormError(errorMessage(err))
    } finally {
      setSavingCredentials(false)
    }
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSavingEmail(true)
    try {
      await apiClient.put(
        `${API_URL}/api/auth/account`,
        { email: recoveryEmail },
        { headers: authHeader() },
      )
      setMessage({ type: 'success', text: 'E-mail de recuperação atualizado.' })
    } catch (err) {
      if (isAuthError(err)) onAuthError()
      else setFormError(errorMessage(err))
    } finally {
      setSavingEmail(false)
    }
  }

  return (
    <div className="space-y-6">
      {formError && (
        <div role="alert" className="px-4 py-3 text-sm rounded-md border border-red-300 bg-red-50 text-red-600">
          {formError}
        </div>
      )}

      <form onSubmit={handleCredentialsSubmit} className={`${card} space-y-4`}>
        <h2 className={sectionHeading}>Credenciais de acesso</h2>

        <div>
          <label htmlFor="novoUsuario" className={fieldLabel}>Usuário</label>
          <input
            id="novoUsuario"
            type="text"
            value={novoUsuario}
            onChange={(e) => setNovoUsuario(e.target.value)}
            autoComplete="username"
            className={fieldInput}
          />
        </div>

        <div>
          <label htmlFor="novaSenha" className={fieldLabel}>Nova senha</label>
          <input
            id="novaSenha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            autoComplete="new-password"
            placeholder="Deixe em branco para manter a atual"
            className={fieldInput}
          />
          <p className={fieldHint}>Mínimo de 8 caracteres.</p>
        </div>

        <div>
          <label htmlFor="confirmarSenha" className={fieldLabel}>Confirmar nova senha</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            autoComplete="new-password"
            className={fieldInput}
          />
        </div>

        <div>
          <label htmlFor="senhaAtual" className={fieldLabel}>Senha atual</label>
          <input
            id="senhaAtual"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            autoComplete="current-password"
            required
            className={fieldInput}
          />
          <p className={fieldHint}>Necessária para confirmar qualquer alteração.</p>
        </div>

        <button type="submit" disabled={savingCredentials} className="btn-primary rounded-md py-2.5 px-6 text-xs disabled:opacity-50">
          {savingCredentials ? 'Salvando...' : 'Salvar credenciais'}
        </button>
      </form>

      <form onSubmit={handleEmailSubmit} className={`${card} space-y-4`}>
        <h2 className={sectionHeading}>Recuperação de senha</h2>
        <div>
          <label htmlFor="recoveryEmail" className={fieldLabel}>E-mail de recuperação</label>
          <input
            id="recoveryEmail"
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            autoComplete="email"
            className={fieldInput}
          />
          <p className={fieldHint}>É para este e-mail que enviaremos o link caso você esqueça a senha.</p>
        </div>
        <button type="submit" disabled={savingEmail} className="btn-primary rounded-md py-2.5 px-6 text-xs disabled:opacity-50">
          {savingEmail ? 'Salvando...' : 'Salvar e-mail'}
        </button>
      </form>
    </div>
  )
}
