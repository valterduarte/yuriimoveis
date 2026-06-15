'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, isAuthError } from '../../../lib/apiClient'
import { ADMIN_PROPERTIES_LIMIT } from '../../../lib/constants'
import { API_URL } from '../../../lib/config'
import AdminBairroAudit from '../../../components/admin/AdminBairroAudit'
import AdminPropertyList from '../../../components/admin/AdminPropertyList'
import { useAdminContext } from '../admin-context'
import type { Imovel } from '../../../types'

export default function AdminImoveisPage() {
  const router = useRouter()
  const { authHeader, onAuthError, setMessage } = useAdminContext()
  const [properties, setProperties] = useState<Imovel[]>([])

  const loadProperties = useCallback(async () => {
    try {
      const data = await apiClient.get<{ imoveis?: Imovel[] }>(
        `${API_URL}/api/imoveis?limit=${ADMIN_PROPERTIES_LIMIT}&ordem=recente&todos=true`,
        { headers: authHeader() }
      )
      setProperties(data.imoveis || [])
    } catch (err) {
      if (isAuthError(err)) onAuthError()
      setProperties([])
    }
  }, [authHeader, onAuthError])

  useEffect(() => { loadProperties() }, [loadProperties])

  const setActiveStatus = async (id: number, ativo: boolean, errorMessage: string) => {
    try {
      await apiClient.put(`${API_URL}/api/imoveis/${id}`, { ativo }, { headers: authHeader() })
      loadProperties()
    } catch (err) {
      if (isAuthError(err)) onAuthError()
      else setMessage({ type: 'error', text: errorMessage })
    }
  }

  return (
    <>
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
