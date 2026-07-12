'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, isAuthError } from '../../../lib/apiClient'
import { ADMIN_PROPERTIES_LIMIT } from '../../../lib/constants'
import { API_URL } from '../../../lib/config'
import { useApiResource } from '../../../hooks/useApiResource'
import AdminBairroAudit from '../../../components/admin/AdminBairroAudit'
import AdminPortalFeed from '../../../components/admin/AdminPortalFeed'
import AdminPropertyList from '../../../components/admin/AdminPropertyList'
import { useAdminContext } from '../admin-context'
import type { Imovel } from '../../../types'

export default function AdminImoveisPage() {
  const router = useRouter()
  const { authHeader, onAuthError, setMessage } = useAdminContext()

  const fetchProperties = useCallback(
    () => apiClient.get<{ imoveis?: Imovel[] }>(
      `${API_URL}/api/imoveis?limit=${ADMIN_PROPERTIES_LIMIT}&ordem=recente&todos=true`,
      { headers: authHeader() }
    ),
    [authHeader],
  )
  const { data, reload } = useApiResource(fetchProperties, { onAuthError })
  const properties = data?.imoveis ?? []

  const setActiveStatus = async (id: number, ativo: boolean, errorMessage: string) => {
    try {
      await apiClient.put(`${API_URL}/api/imoveis/${id}`, { ativo }, { headers: authHeader() })
      reload()
    } catch (err) {
      if (isAuthError(err)) onAuthError()
      else setMessage({ type: 'error', text: errorMessage })
    }
  }

  return (
    <>
      <AdminPortalFeed />
      <AdminBairroAudit authHeader={authHeader} onAuthError={onAuthError} />
      <AdminPropertyList
        properties={properties}
        onEdit={(id) => router.push(`/admin/imoveis/${id}`)}
        onDeactivate={(id) => setActiveStatus(id, false, 'Erro ao desativar.')}
        onReactivate={(id) => setActiveStatus(id, true, 'Erro ao reativar.')}
      />
    </>
  )
}
