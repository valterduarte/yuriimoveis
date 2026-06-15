'use client'

import { useParams, useRouter } from 'next/navigation'
import AdminPropertyForm from '../../../../components/admin/AdminPropertyForm'
import { useAdminContext } from '../../admin-context'

export default function EditImovelPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { authHeader, onAuthError, setMessage } = useAdminContext()

  const editingId = Number(params.id)

  return (
    <AdminPropertyForm
      editingId={Number.isFinite(editingId) ? editingId : null}
      authHeader={authHeader}
      onAuthError={onAuthError}
      onSuccess={(message) => {
        setMessage({ type: 'success', text: message })
        router.push('/admin/imoveis')
      }}
    />
  )
}
