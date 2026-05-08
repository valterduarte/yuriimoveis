import { useCallback, useState } from 'react'
import { ApiError, isAuthError } from '../lib/apiClient'

interface UseApiSubmitOptions {
  onAuthError: () => void
  fallbackError?: string
}

function extractServerError(err: unknown): string | null {
  if (err instanceof ApiError && typeof err.data === 'object' && err.data !== null && 'error' in err.data) {
    const value = (err.data as { error: unknown }).error
    return value ? String(value) : null
  }
  return null
}

export function useApiSubmit({ onAuthError, fallbackError = 'Erro ao salvar.' }: UseApiSubmitOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async (run: () => Promise<unknown>): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await run()
      return true
    } catch (err) {
      if (isAuthError(err)) {
        onAuthError()
      } else {
        setError(extractServerError(err) ?? fallbackError)
      }
      return false
    } finally {
      setLoading(false)
    }
  }, [onAuthError, fallbackError])

  return { loading, error, setError, submit }
}
