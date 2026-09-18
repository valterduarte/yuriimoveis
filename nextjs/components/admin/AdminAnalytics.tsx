'use client'

import { useCallback, useMemo, useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'
import { useApiResource } from '../../hooks/useApiResource'
import { useAdminContext } from '../../app/admin/admin-context'

interface PropertyAnalytics {
  id: number
  titulo: string
  updated_at: string
  requestPath: string
  visitors: number
  pageviews: number
  clicks: number
}

interface AnalyticsResponse {
  since: string
  until: string
  data: PropertyAnalytics[]
}

type SortKey = 'titulo' | 'pageviews' | 'visitors' | 'clicks' | 'ctr'

function getSince(days: number): string {
  return new Date(
    Date.now() - days * 24 * 60 * 60 * 1000,
  ).toISOString()
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

function formatCtr(clicks: number, pageviews: number): string {
  if (pageviews === 0) return '—'

  return `${((clicks / pageviews) * 100).toFixed(1)}%`
}

export default function AdminAnalytics() {
  const { authHeader, onAuthError } = useAdminContext()

  const [days, setDays] = useState(31)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('pageviews')
  const [sortDescending, setSortDescending] = useState(true)

  const fetchAnalytics = useCallback(async (): Promise<AnalyticsResponse> => {
    const since = getSince(days)
    const until = new Date().toISOString()

    const params = new URLSearchParams({
      since,
      until,
    })

    return apiClient.get<AnalyticsResponse>(
      `${API_URL}/api/admin/analytics/properties?${params.toString()}`,
      {
        headers: authHeader(),
      },
    )
  }, [authHeader, days])

  const {
    data,
    loading,
    error,
    reload,
  } = useApiResource(fetchAnalytics, {
    onAuthError,
    fallbackError: 'Erro ao carregar as métricas de Analytics.',
  })

  const filteredProperties = useMemo(() => {
    if (!data) return []

    const normalizedSearch = search.trim().toLowerCase()

    const filtered = data.data.filter((property) => {
      if (!normalizedSearch) return true

      return (
        property.titulo.toLowerCase().includes(normalizedSearch) ||
        property.requestPath.toLowerCase().includes(normalizedSearch) ||
        String(property.id).includes(normalizedSearch)
      )
    })

    return [...filtered].sort((a, b) => {
      let comparison = 0

      if (sortKey === 'titulo') {
        comparison = a.titulo.localeCompare(b.titulo, 'pt-BR')
      } else if (sortKey === 'ctr') {
        const ctrA = a.pageviews > 0 ? a.clicks / a.pageviews : 0
        const ctrB = b.pageviews > 0 ? b.clicks / b.pageviews : 0
        comparison = ctrA - ctrB
      } else {
        comparison = a[sortKey] - b[sortKey]
      }

      return sortDescending ? -comparison : comparison
    })
  }, [data, search, sortKey, sortDescending])

  const totals = useMemo(() => {
    if (!data) {
      return {
        pageviews: 0,
        visitors: 0,
        clicks: 0,
        ctr: 0,
      }
    }

    const pageviews = data.data.reduce(
      (total, property) => total + property.pageviews,
      0,
    )

    const visitors = data.data.reduce(
      (total, property) => total + property.visitors,
      0,
    )

    const clicks = data.data.reduce(
      (total, property) => total + property.clicks,
      0,
    )

    return {
      pageviews,
      visitors,
      clicks,
      ctr: pageviews > 0 ? (clicks / pageviews) * 100 : 0,
    }
  }, [data])

  function handleSort(nextSortKey: SortKey) {
    if (sortKey === nextSortKey) {
      setSortDescending((current) => !current)
      return
    }

    setSortKey(nextSortKey)
    setSortDescending(true)
  }

  function sortIndicator(column: SortKey): string {
    if (sortKey !== column) return ''

    return sortDescending ? ' ↓' : ' ↑'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Dados de Web Analytics + cliques de WhatsApp
          </p>
          <p className="mt-1 text-xs text-gray-400">
            O Vercel Analytics no plano Hobby permite consultar os últimos 31 dias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="analytics-period"
            className="text-sm font-medium text-gray-600"
          >
            Período
          </label>

          <select
            id="analytics-period"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
          >
            <option value={7}>7 dias</option>
            <option value={14}>14 dias</option>
            <option value={31}>31 dias</option>
          </select>

          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !data && (
        <p className="text-sm text-gray-500">
          Carregando métricas...
        </p>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Visualizações
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(totals.pageviews)}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Visitantes
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(totals.visitors)}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cliques WhatsApp
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(totals.clicks)}
              </p>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                CTR WhatsApp
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totals.ctr.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                    Desempenho por imóvel
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {filteredProperties.length} de {data.data.length} imóveis
                  </p>
                </div>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar imóvel..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:w-80"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleSort('titulo')}
                        className="hover:text-gray-900"
                      >
                        Imóvel{sortIndicator('titulo')}
                      </button>
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleSort('pageviews')}
                        className="hover:text-gray-900"
                      >
                        Visualizações{sortIndicator('pageviews')}
                      </button>
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleSort('visitors')}
                        className="hover:text-gray-900"
                      >
                        Visitantes{sortIndicator('visitors')}
                      </button>
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleSort('clicks')}
                        className="hover:text-gray-900"
                      >
                        WhatsApp{sortIndicator('clicks')}
                      </button>
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleSort('ctr')}
                        className="hover:text-gray-900"
                      >
                        CTR{sortIndicator('ctr')}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="max-w-md px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {property.titulo}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          ID {property.id}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {formatNumber(property.pageviews)}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatNumber(property.visitors)}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatNumber(property.clicks)}
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {formatCtr(property.clicks, property.pageviews)}
                      </td>
                    </tr>
                  ))}

                  {filteredProperties.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-gray-500"
                      >
                        Nenhum imóvel encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
