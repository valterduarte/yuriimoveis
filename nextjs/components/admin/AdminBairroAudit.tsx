'use client'

import { useState, useEffect } from 'react'
import { FiAlertTriangle, FiCheckCircle, FiXCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { apiClient, isAuthError } from '../../lib/apiClient'
import { API_URL } from '../../lib/config'

type AuditStatus = 'ok' | 'weak' | 'broken'

interface AuditRow {
  bairro: string
  cidade: string
  slug: string
  count: number
  configured: boolean
  status: AuditStatus
}

interface AuditSummary {
  total: number
  ok: number
  weak: number
  broken: number
}

interface Props {
  authHeader: () => Record<string, string>
  onAuthError: () => void
}

const STATUS_LABEL: Record<AuditStatus, string> = {
  broken: '404 — página não existe',
  weak: 'Sem conteúdo rico de SEO',
  ok: 'Configurado',
}

export default function AdminBairroAudit({ authHeader, onAuthError }: Props) {
  const [summary, setSummary] = useState<AuditSummary | null>(null)
  const [rows, setRows] = useState<AuditRow[]>([])
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get<{ summary: AuditSummary; rows: AuditRow[] }>(`${API_URL}/api/admin/bairros-audit`, { headers: authHeader() })
      .then(data => {
        setSummary(data.summary)
        setRows(data.rows)
      })
      .catch(err => {
        if (isAuthError(err)) onAuthError()
      })
      .finally(() => setLoading(false))
  }, [authHeader, onAuthError])

  if (loading || !summary) return null

  const problems = rows.filter(r => r.status !== 'ok')
  const hasIssues = problems.length > 0

  if (!hasIssues) {
    return (
      <div className="mb-6 px-4 py-3 text-sm border border-green-300 bg-green-50 text-green-700 flex items-center gap-2">
        <FiCheckCircle size={16} />
        <span>Todos os {summary.total} bairros com imóveis estão configurados e indexáveis.</span>
      </div>
    )
  }

  return (
    <div className={`mb-6 border ${summary.broken > 0 ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 text-sm flex items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2">
          <FiAlertTriangle size={16} className={summary.broken > 0 ? 'text-red-600' : 'text-amber-600'} />
          <strong className={summary.broken > 0 ? 'text-red-700' : 'text-amber-700'}>
            {summary.broken > 0 && `${summary.broken} bairro${summary.broken > 1 ? 's' : ''} em 404`}
            {summary.broken > 0 && summary.weak > 0 && ' • '}
            {summary.weak > 0 && `${summary.weak} sem SEO rico`}
          </strong>
        </span>
        {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="border-t border-inherit">
          <p className="px-4 pt-3 text-[11px] text-gray-600 leading-relaxed">
            Bairros no banco que não estão em <code className="bg-white px-1">data/bairros.ts</code>.
            Peça pro desenvolvedor adicionar cada um pra desbloquear a página do bairro e o conteúdo de SEO.
          </p>
          <ul className="px-4 py-3 space-y-2">
            {problems.map(r => (
              <li key={`${r.cidade}|${r.slug}`} className="flex items-center gap-3 text-xs">
                {r.status === 'broken' ? (
                  <FiXCircle size={14} className="text-red-600 shrink-0" />
                ) : (
                  <FiAlertTriangle size={14} className="text-amber-600 shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-dark">{r.bairro}</div>
                  <div className="text-gray-500">
                    {r.cidade} • {r.count} imóve{r.count !== 1 ? 'is' : 'l'} • {STATUS_LABEL[r.status]}
                  </div>
                </div>
                <code className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5">{r.slug}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
