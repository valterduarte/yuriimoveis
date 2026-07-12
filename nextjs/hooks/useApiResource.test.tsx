// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor, cleanup } from '@testing-library/react'
import { useApiResource } from './useApiResource'
import { ApiError } from '../lib/apiClient'

afterEach(cleanup)

describe('useApiResource', () => {
  it('loads data on mount and clears the loading flag', async () => {
    const fetcher = vi.fn(async () => ({ value: 42 }))
    const { result } = renderHook(() => useApiResource(fetcher))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ value: 42 })
    expect(result.current.error).toBeNull()
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('routes a 401 to onAuthError instead of surfacing an error string', async () => {
    const onAuthError = vi.fn()
    const fetcher = vi.fn(async () => { throw new ApiError(401, null) })
    const { result } = renderHook(() => useApiResource(fetcher, { onAuthError }))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(onAuthError).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBeNull()
  })

  it('surfaces a fallback error on a non-auth failure', async () => {
    const fetcher = vi.fn(async () => { throw new ApiError(500, null) })
    const { result } = renderHook(() =>
      useApiResource(fetcher, { fallbackError: 'boom' }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('boom')
  })

  it('refetches when reload is called', async () => {
    const fetcher = vi.fn(async () => ({ n: fetcher.mock.calls.length }))
    const { result } = renderHook(() => useApiResource(fetcher))

    await waitFor(() => expect(result.current.loading).toBe(false))
    await result.current.reload()
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
