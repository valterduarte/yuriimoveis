'use client'

import { useState, useEffect } from 'react'
import { apiClient, isAuthError } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'

interface ClickStats {
  days: number
  total: number
  bySource: { source: string; clicks: string }[]
  byDevice: { device: string; clicks: string }[]
  byPage: { page: string; clicks: string }[]
  byDay: { date: string; clicks: string }[]
}

const SOURCE_LABELS: Record<string, string> = {
  'header-icon': 'Header (ícone)',
  'header-cta': 'Header (Fale Conosco)',
  'header-mobile': 'Header (menu mobile)',
  'footer-social': 'Footer (ícone social)',
  'footer-contato': 'Footer (link contato)',
  'footer-cta': 'Footer (Encontre seu imóvel)',
  'home-cta': 'Home (CTA)',
  'floating-bar': 'Barra flutuante (mobile)',
  'contato-info': 'Contato (botão info)',
  'contato-cta': 'Contato (botão principal)',
  'imovel-contato': 'Imóvel (seção contato)',
  'imovel-simulacao': 'Imóvel (simulação)',
  'imovel-barra-mobile': 'Imóvel (barra mobile)',
  'lista-sem-resultado': 'Lista (sem resultados)',
  'bairro-sem-resultado': 'Bairro (sem imóveis)',
}

interface AdminClickStatsProps {
  authHeader: () => { Authorization: string }
  onAuthError: () => void
}

export default function AdminClickStats({ authHeader, onAuthError }: AdminClickStatsProps) {
  const [stats, setStats] = useState<ClickStats | null>(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiClient
      .get<ClickStats>(`${API_URL}/api/track-click?days=${days}`, { headers: authHeader() })
      .then(setStats)
      .catch(err => {
        if (isAuthError(err)) onAuthError()
      })
      .finally(() => setLoading(false))
  }, [days, authHeader, onAuthError])

  if (loading) {
    return <p className="text-sm text-gray-500 py-10 text-center">Carregando estatísticas...</p>
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="text-center py-16 bg-white border border-gray-200">
        <p className="text-4xl mb-3" aria-hidden="true">📊</p>
        <p className="text-sm text-gray-500">Nenhum click registrado nos últimos {days} dias.</p>
      </div>
    )
  }

  const maxBySource = Math.max(...stats.bySource.map(s => Number(s.clicks)))
  const maxByDay = Math.max(...stats.byDay.map(d => Number(d.clicks)))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="text-2xl font-black text-dark">{stats.total}</span> clicks nos últimos
        </p>
        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="border border-gray-300 text-xs px-3 py-2 bg-white"
        >
          <option value={7}>7 dias</option>
          <option value={14}>14 dias</option>
          <option value={30}>30 dias</option>
          <option value={60}>60 dias</option>
          <option value={90}>90 dias</option>
        </select>
      </div>

      {/* Device split */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Dispositivo</h3>
        <div className="flex gap-4">
          {stats.byDevice.map(d => {
            const pct = Math.round((Number(d.clicks) / stats.total) * 100)
            return (
              <div key={d.device} className="flex-1 text-center p-4 bg-gray-50 border border-gray-100">
                <p className="text-2xl font-black text-dark">{pct}%</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                  {d.device === 'mobile' ? 'Mobile' : 'Desktop'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{d.clicks} clicks</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* By source */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Por origem</h3>
        <div className="space-y-3">
          {stats.bySource.map(s => {
            const pct = (Number(s.clicks) / maxBySource) * 100
            return (
              <div key={s.source}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-700">{SOURCE_LABELS[s.source] || s.source}</span>
                  <span className="font-bold text-dark">{s.clicks}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* By page */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Por página</h3>
        <div className="space-y-2">
          {stats.byPage.map(p => (
            <div key={p.page} className="flex items-center justify-between text-xs py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-600 truncate max-w-[70%]">{p.page}</span>
              <span className="font-bold text-dark">{p.clicks}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By day */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Por dia</h3>
        <div className="flex items-end gap-1 h-32">
          {stats.byDay.slice().reverse().map(d => {
            const pct = maxByDay > 0 ? (Number(d.clicks) / maxByDay) * 100 : 0
            const dateLabel = new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all min-h-[2px]"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
                <span className="text-[8px] text-gray-400 mt-1 hidden group-hover:block absolute -top-5 bg-dark text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                  {dateLabel}: {d.clicks}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between text-[8px] text-gray-400 mt-1">
          <span>{stats.byDay.length > 0 && new Date(stats.byDay[stats.byDay.length - 1].date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
          <span>{stats.byDay.length > 0 && new Date(stats.byDay[0].date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
