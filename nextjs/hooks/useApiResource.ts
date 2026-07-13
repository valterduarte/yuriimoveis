import { useCallback, useEffect, useRef, useState } from 'react'
import { isAuthError } from '../lib/apiClient'

interface UseApiResourceOptions {
  onAuthError?: () => void
  fallbackError?: string
}

/**
 * Loads a resource on mount (and whenever the memoised `fetcher` changes),
 * tracking loading/error state and routing 401s to `onAuthError`. Returns
 * `reload` so callers can refetch after a mutation.
 *
 * Replaces the fetch-on-mount block that used to be copy-pasted across the
 * admin screens (list, stats, audit). Pass a `useCallback`-memoised fetcher so
 * the effect only re-runs when its real inputs change; the auth handler is kept
 * in a ref so an inline `onAuthError` never triggers a refetch loop.
 */
export function useApiResource<T>(
  fetcher: () => Promise<T>,
  { onAuthError, fallbackError = 'Erro ao carregar.' }: UseApiResourceOptions = {},
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const authErrorRef = useRef(onAuthError)
  authErrorRef.current = onAuthError

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setData(await fetcher())
      setError(null)
    } catch (err) {
      if (isAuthError(err)) authErrorRef.current?.()
      else setError(fallbackError)
    } finally {
      setLoading(false)
    }
  }, [fetcher, fallbackError])

  useEffect(() => { reload() }, [reload])

  return { data, loading, error, reload, setData }
}
