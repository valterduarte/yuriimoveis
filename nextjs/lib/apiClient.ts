/**
 * Thin fetch wrapper with axios-like ergonomics.
 *
 * - Auto-serialises and parses JSON.
 * - Throws ApiError on non-2xx responses, preserving the status code so
 *   callers can branch on it (e.g. `if (err.status === 401) onAuthError()`).
 * - Forwards headers from the caller as-is, but injects Content-Type for
 *   write requests when a body is present.
 *
 * Replaces axios across the admin surfaces. Keeping it small on purpose:
 * if a request needs streaming, multipart, or interceptors, use fetch
 * directly rather than extending this module.
 */

export interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly data: unknown

  constructor(status: number, data: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request<T>(url: string, method: string, init: ApiRequestInit = {}): Promise<T> {
  const { body, headers, ...rest } = init
  const finalHeaders = new Headers(headers)
  let serialisedBody: BodyInit | undefined

  if (body !== undefined) {
    if (body instanceof FormData) {
      // Let the browser set Content-Type with the multipart boundary.
      serialisedBody = body
    } else {
      serialisedBody = JSON.stringify(body)
      if (!finalHeaders.has('Content-Type')) {
        finalHeaders.set('Content-Type', 'application/json')
      }
    }
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: serialisedBody,
    ...rest,
  })

  const text = await response.text()
  const data: unknown = text ? safeJsonParse(text) : null

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data as T
}

function safeJsonParse(text: string): unknown {
  try { return JSON.parse(text) } catch { return text }
}

export const apiClient = {
  get:    <T = unknown>(url: string, init?: ApiRequestInit) => request<T>(url, 'GET',    init),
  post:   <T = unknown>(url: string, body?: unknown, init?: ApiRequestInit) => request<T>(url, 'POST',   { ...init, body }),
  put:    <T = unknown>(url: string, body?: unknown, init?: ApiRequestInit) => request<T>(url, 'PUT',    { ...init, body }),
  patch:  <T = unknown>(url: string, body?: unknown, init?: ApiRequestInit) => request<T>(url, 'PATCH',  { ...init, body }),
  delete: <T = unknown>(url: string, init?: ApiRequestInit) => request<T>(url, 'DELETE', init),
}

export function isAuthError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 401
}
